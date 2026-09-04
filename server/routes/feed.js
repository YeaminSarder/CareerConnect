import express from 'express'
import { getFeed } from '../controllers/feed.js'
import requireAuth from '../middleware/require-auth.js'

const router = express.Router()

router.use(requireAuth)
router.get('/', getFeed)

export default router

