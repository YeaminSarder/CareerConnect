import express from 'express'
import {
	searchAndFilterInternships,
	createInternship,
	deleteInternship
} from '../controllers/internship.js'
import requireAuth from '../middleware/require-auth.js'

const router = express.Router()

router.get('/', searchAndFilterInternships)
router.post('/', requireAuth, createInternship)
router.delete('/:id', requireAuth, deleteInternship)

export default router
