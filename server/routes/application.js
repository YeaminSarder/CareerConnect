import express from 'express'
import {
	applyForInternship,
	getMyApplications,
	updateApplicationStatus,
	withdrawApplication
} from '../controllers/application.js'
import requireAuth from '../middleware/require-auth.js'

const router = express.Router()

router.use(requireAuth)

router.post('/', applyForInternship)
router.get('/my', getMyApplications)
router.patch('/:id/status', updateApplicationStatus)
router.delete('/:id', withdrawApplication)

export default router
