import express from 'express'
const router = express.Router()

import profileRoute from './profile.js'
import myProfileRoute from './myprofile.js'
import userRoute from './user.js'

router.use('/profile', profileRoute)
router.use('/myprofile', myProfileRoute)
router.use('/user', userRoute)

export default router
