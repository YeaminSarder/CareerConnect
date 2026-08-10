import Endorsement from '../models/endorsement.js'
import User from '../models/user.js'

// POST /api/endorsements
export const endorseSkill = async (req, res) => {
	try {
		const { toUser, skill } = req.body
		const fromUser = req.user._id

		if (!toUser || !skill) {
			return res.status(400).json({ error: 'toUser and skill are required' })
		}

		if (toUser.toString() === fromUser.toString()) {
			return res.status(400).json({ error: 'You cannot endorse yourself' })
		}

		
		const targetUser = await User.findById(toUser).populate('profile')
		const theirSkills = targetUser && targetUser.profile ? targetUser.profile.skills || [] : []

		if (!theirSkills.includes(skill)) {
			return res.status(400).json({ error: 'This user does not list that skill' })
		}

		const endorsement = await Endorsement.create({ fromUser, toUser, skill })
		res.status(201).json(endorsement)
	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).json({ error: 'You already endorsed this skill for this user' })
		}
		res.status(500).json({ error: err.message })
	}
}


export const getEndorsementsForUser = async (req, res) => {
	try {
		const endorsements = await Endorsement.find({ toUser: req.params.userId }).populate(
			'fromUser',
			'name'
		)

		// group by skill so the frontend can show React - 3 endorsements
		const grouped = {}
		endorsements.forEach((e) => {
			if (!grouped[e.skill]) {
				grouped[e.skill] = { skill: e.skill, count: 0, endorsers: [] }
			}
			grouped[e.skill].count += 1
			grouped[e.skill].endorsers.push(e.fromUser.name)
		})

		res.status(200).json(Object.values(grouped))
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}


export const removeEndorsement = async (req, res) => {
	try {
		const endorsement = await Endorsement.findById(req.params.id)

		if (!endorsement) {
			return res.status(404).json({ error: 'Endorsement not found' })
		}

		if (endorsement.fromUser.toString() !== req.user._id.toString()) {
			return res.status(403).json({ error: 'Not allowed' })
		}

		await endorsement.deleteOne()
		res.status(200).json({ message: 'Endorsement removed' })
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

export default { endorseSkill, getEndorsementsForUser, removeEndorsement }
