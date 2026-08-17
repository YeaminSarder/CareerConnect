import express from 'express'
import myprofileController from '../controllers/myprofile.js'
import requireAuth  from '../middleware/require-auth.js'

const router = express.Router()
router.use(requireAuth)

router.get('/', myprofileController.getProfile)
router.patch('/', myprofileController.updateMyProfile)

export default router