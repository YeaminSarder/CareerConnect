import express from 'express'
import {
	endorseSkill,
	getEndorsementsForUser,
	removeEndorsement
} from '../controllers/endorsement.js'
import requireAuth from '../middleware/require-auth.js'

const router = express.Router()

router.get('/:userId', getEndorsementsForUser)

router.use(requireAuth)
router.post('/', endorseSkill)
router.delete('/:id', removeEndorsement)

export default router
