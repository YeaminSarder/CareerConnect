import express from 'express'
import { getReminders } from '../controllers/reminder.js'
import requireAuth from '../middleware/require-auth.js'

const router = express.Router()

router.use(requireAuth)
router.get('/', getReminders)

export default router
