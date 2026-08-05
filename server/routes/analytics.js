import express from 'express'
import { getStudentAnalytics } from '../controllers/analytics.js'
import requireAuth from '../middleware/require-auth.js'

const router = express.Router()

router.use(requireAuth)
router.get('/student', getStudentAnalytics)

export default router
