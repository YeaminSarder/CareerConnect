import express from 'express'
const router = express.Router()
import profileController from '../controllers/profile.js'
import requireAuth from '../middleware/require-auth.js'

router.use(requireAuth)

router.get('/', profileController.getProfiles)
router.get('/:id', profileController.getProfile)
router.patch('/:id', profileController.updateProfile)
router.delete('/:id', profileController.deleteProfile)
router.post('/', profileController.createProfile)

export default router