import express from 'express'
import {
	createInterview,
	getMyInterviews,
	updateInterview,
	deleteInterview,
	addChecklistItem,
	toggleChecklistItem
} from '../controllers/interview.js'
import requireAuth from '../middleware/require-auth.js'

const router = express.Router()

router.use(requireAuth)
router.post('/', createInterview)
router.get('/', getMyInterviews)
router.patch('/:id', updateInterview)
router.delete('/:id', deleteInterview)
router.post('/:id/checklist', addChecklistItem)
router.patch('/:id/checklist/:itemId', toggleChecklistItem)

export default router
