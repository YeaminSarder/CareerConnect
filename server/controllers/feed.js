import Connection from '../models/connection.js'
import Post from '../models/post.js'
import User from '../models/user.js'

// GET /api/feed
// Connection-Based News Feed Algorithm
// Ranks posts by three factors, as required:
//   1. posts from users the viewer is connected to
//   2. posts from users with similar skills (even if not connected)
//   3. internship/hiring posts that match the viewer's career interests
// plus a small boost for recency and engagement.
export const getFeed = async (req, res) => {
	try {
		const viewer = await User.findById(req.user._id).populate('profile')
		const viewerSkills = viewer.profile ? viewer.profile.skills || [] : []
		const viewerInterests = viewer.profile ? viewer.profile.careerInterests || [] : []

		const connections = await Connection.find({
			$or: [{ requester: req.user._id }, { recipient: req.user._id }],
			status: 'Accepted'
		})

		const connectedIds = connections.map((c) =>
			(c.requester.toString() === req.user._id.toString() ? c.recipient : c.requester).toString()
		)

		// pull every post and figure out its score - simplest way to check
		// all three ranking factors without a more complex query
		const posts = await Post.find({}).sort({ createdAt: -1 })
		const authorIds = [...new Set(posts.map((p) => p.author.toString()))]
		const authors = await User.find({ _id: { $in: authorIds } }).populate('profile')
		const authorMap = {}
		authors.forEach((a) => {
			authorMap[a._id.toString()] = a
		})

		const now = Date.now()

		const scoredPosts = posts.map((post) => {
			const authorId = post.author.toString()
			const author = authorMap[authorId]
			const authorSkills = author && author.profile ? author.profile.skills || [] : []

			const isConnection = connectedIds.includes(authorId)
			const isOwnPost = authorId === req.user._id.toString()

			const sharedSkills = authorSkills.filter((skill) => viewerSkills.includes(skill))

			const isInternshipPost = post.postType === 'Hiring Opportunity'
			const postText = `${post.title} ${post.content}`.toLowerCase()
			const matchesInterest = viewerInterests.some((interest) =>
				postText.includes(interest.toLowerCase())
			)

			const hoursOld = (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60)
			const engagement = post.likes.length + post.comments.length + post.saves.length

			let score = 0
			if (isConnection || isOwnPost) score += 5
			score += sharedSkills.length * 3
			if (isInternshipPost && matchesInterest) score += 6
			score += engagement * 1
			score -= hoursOld * 0.1

			return {
				...post.toObject(),
				engagement: post.getEngagementCounts(),
				isConnection,
				sharedSkills,
				score
			}
		})

		scoredPosts.sort((a, b) => b.score - a.score)

		res.status(200).json(scoredPosts)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

export default { getFeed }
