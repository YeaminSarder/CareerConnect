import Post from '../models/post.js'

// POST /api/posts
export const createPost = async (req, res) => {
		try {
			const { title, content, postType } = req.body
			if (!content) {
				return res.status(400).json({ error: 'Content is required' })
			}

			const post = await Post.create({
				author: req.user._id,
				authorName: req.user.name || 'Anonymous',
				title: title || '',
				content,
				postType: postType || 'General Update'
			})

		res.status(201).json(post)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// GET /api/posts
export const getPosts = async (req, res) => {
	try {
		const posts = await Post.find({}).sort({ createdAt: -1 })
		const formattedPosts = posts.map((post) => ({
			...post.toObject(),
			engagement: post.getEngagementCounts()
		}))

		res.status(200).json(formattedPosts)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// PATCH /api/posts/:id/like
export const toggleLike = async (req, res) => {
	try {
		const { id } = req.params
		const userId = req.user._id

		const post = await Post.findById(id)
		if (!post) {
			return res.status(404).json({ error: 'Post not found' })
		}

		const index = post.likes.indexOf(userId)
		if (index === -1) {
			post.likes.push(userId)
		} else {
			post.likes.splice(index, 1)
		}

		await post.save()
		res.status(200).json({
			...post.toObject(),
			engagement: post.getEngagementCounts()
		})
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// POST /api/posts/:id/comment
export const addComment = async (req, res) => {
	try {
		const { id } = req.params
		const { text } = req.body

		if (!text || text.trim().length === 0) {
			return res.status(400).json({ error: 'Comment text is required' })
		}

		const post = await Post.findById(id)
		if (!post) {
			return res.status(404).json({ error: 'Post not found' })
		}

		post.comments.push({
			user: req.user._id,
			userName: req.user.name || 'Student',
			text: text.trim(),
			createdAt: new Date()
		})

		await post.save()
		res.status(200).json({
			...post.toObject(),
			engagement: post.getEngagementCounts()
		})
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// PATCH /api/posts/:id/save
export const toggleSave = async (req, res) => {
	try {
		const { id } = req.params
		const userId = req.user._id

		const post = await Post.findById(id)
		if (!post) {
			return res.status(404).json({ error: 'Post not found' })
		}

		const index = post.saves.indexOf(userId)
		if (index === -1) {
			post.saves.push(userId)
		} else {
			post.saves.splice(index, 1)
		}

		await post.save()
		res.status(200).json({
			...post.toObject(),
			engagement: post.getEngagementCounts()
		})
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

export default {
	createPost,
	getPosts,
	toggleLike,
	addComment,
	toggleSave
}
