import User from '../models/user.js'

export const getRecommendations = async (req, res) => {
	try {
		const me = await User.findById(req.user._id).populate('profile')

		if (!me || !me.profile) {
			return res.status(404).json({ error: 'Profile not found' })
		}

		const mySkills = me.profile.skills || []
		const myInterests = me.profile.careerInterests || []
		const myDepartment = me.profile.department || ''
		const myProjectTools = (me.profile.projects || []).flatMap((p) => p.toolsUsed || [])

		const others = await User.find({ _id: { $ne: me._id } })
			.select('name email profile')
			.populate('profile')

		const recommendations = others
			.map((user) => {
				const p = user.profile || {}
				const theirSkills = p.skills || []
				const theirInterests = p.careerInterests || []
				const theirProjectTools = (p.projects || []).flatMap((proj) => proj.toolsUsed || [])

				const matchedSkills = theirSkills.filter((skill) => mySkills.includes(skill))
				const matchedInterests = theirInterests.filter((interest) => myInterests.includes(interest))
				const matchedProjectTools = theirProjectTools.filter((tool) => myProjectTools.includes(tool))
				const sameDepartment = Boolean(myDepartment) && p.department === myDepartment

				// simple weighted score - skills count the most, then interests,
				// then department match, then shared project tools
				const matchScore =
					matchedSkills.length * 3 +
					matchedInterests.length * 2 +
					(sameDepartment ? 2 : 0) +
					matchedProjectTools.length * 1

				return {
					_id: user._id,
					name: user.name,
					email: user.email,
					department: p.department || '',
					matchedSkills,
					matchedInterests,
					matchedProjectTools,
					sameDepartment,
					matchScore
				}
			})
			.filter((r) => r.matchScore > 0)
			.sort((a, b) => b.matchScore - a.matchScore)
			.slice(0, 10)

		res.status(200).json(recommendations)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

export default { getRecommendations }
