import express from 'express'
import { getRecommendations } from '../controllers/recommendation.js'
import requireAuth from '../middleware/require-auth.js'

const router = express.Router()

router.use(requireAuth)
router.get('/', getRecommendations)

export default router
