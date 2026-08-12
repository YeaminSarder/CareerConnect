import express from 'express'
import {
	createPost,
	getPosts,
	toggleLike,
	addComment,
	toggleSave,
	updatePost,
	deletePost
} from '../controllers/post.js'
import requireAuth from '../middleware/require-auth.js'

const router = express.Router()

router.get('/', getPosts)

router.use(requireAuth)
router.post('/', createPost)
router.patch('/:id/like', toggleLike)
router.post('/:id/comment', addComment)
router.patch('/:id/save', toggleSave)
router.patch('/:id', updatePost)
router.delete('/:id', deletePost)

// // PATCH /api/posts/:id
// export const updatePost = async (req, res) => {
// 	try {
// 		const { id } = req.params
// 		const { title, content } = req.body

// 		const post = await Post.findById(id)
// 		if (!post) {
// 			return res.status(404).json({ error: 'Post not found' })
// 		}

// 		if (post.author.toString() !== req.user._id.toString()) {
// 			return res.status(403).json({ error: 'Not allowed to edit this post' })
// 		}

// 		if (title !== undefined) post.title = title
// 		if (content !== undefined) post.content = content

// 		await post.save()
// 		res.status(200).json({
// 			...post.toObject(),
// 			engagement: post.getEngagementCounts()
// 		})
// 	} catch (err) {
// 		res.status(500).json({ error: err.message })
// 	}
// }

// DELETE /api/posts/:id
// export const deletePost = async (req, res) => {
// 	try {
// 		const { id } = req.params

// 		const post = await Post.findById(id)
// 		if (!post) {
// 			return res.status(404).json({ error: 'Post not found' })
// 		}

// 		if (post.author.toString() !== req.user._id.toString()) {
// 			return res.status(403).json({ error: 'Not allowed to delete this post' })
// 		}

// 		await post.deleteOne()
// 		res.status(200).json({ message: 'Post deleted' })
// 	} catch (err) {
// 		res.status(500).json({ error: err.message })
// 	}
// }

export default router
