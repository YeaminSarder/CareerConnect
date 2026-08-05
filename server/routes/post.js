import express from 'express'
import {
	createPost,
	getPosts,
	toggleLike,
	addComment,
	toggleSave
} from '../controllers/post.js'
import requireAuth from '../middleware/require-auth.js'

const router = express.Router()

router.get('/', getPosts)

router.use(requireAuth)
router.post('/', createPost)
router.patch('/:id/like', toggleLike)
router.post('/:id/comment', addComment)
router.patch('/:id/save', toggleSave)

export default router
