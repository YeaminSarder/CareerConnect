import express from 'express'
const router = express.Router()

import profileRoute from './profile.js'
import myProfileRoute from './myprofile.js'
import userRoute from './user.js'
import cvRoute from './cv.js'

router.use('/profile', profileRoute)
router.use('/myprofile', myProfileRoute)
router.use('/user', userRoute)
router.use('/cv', cvRoute)

export default router
