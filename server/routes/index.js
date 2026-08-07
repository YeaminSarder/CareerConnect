import express from 'express'
const router = express.Router()

import profileRoute from './profile.js'
import myProfileRoute from './myprofile.js'
import userRoute from './user.js'
import cvRoute from './cv.js'
import connectionRoute from './connection.js'
import postRoute from './post.js'
import internshipRoute from './internship.js'
import analyticsRoute from './analytics.js'

router.use('/profile', profileRoute)
router.use('/myprofile', myProfileRoute)
router.use('/user', userRoute)
router.use('/cv', cvRoute)
router.use('/connections', connectionRoute)
router.use('/posts', postRoute)
router.use('/internships', internshipRoute)
router.use('/analytics', analyticsRoute)

export default router

