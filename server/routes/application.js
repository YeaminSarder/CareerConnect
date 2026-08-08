import express from 'express'
import {
	applyForInternship,
	getMyApplications,
	updateApplicationStatus,
	withdrawApplication,
	getApplicantsByInternship,
	getRecruiterApplications,
	getSubmittedCvDetail
} from '../controllers/application.js'
import requireAuth from '../middleware/require-auth.js'

const router = express.Router()

router.use(requireAuth)

router.post('/', applyForInternship)
router.get('/my', getMyApplications)
router.get('/recruiter', getRecruiterApplications)
router.get('/internship/:internshipId', getApplicantsByInternship)
router.get('/cv-detail/:cvId', getSubmittedCvDetail)
router.patch('/:id/status', updateApplicationStatus)
router.delete('/:id', withdrawApplication)

export default router
