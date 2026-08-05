import express from 'express'
import {
	searchAndFilterInternships,
	createInternship
} from '../controllers/internship.js'

const router = express.Router()

router.get('/', searchAndFilterInternships)
router.post('/', createInternship)

export default router
