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
import applicationRoute from './application.js'
//import recommendationRoute from './recommendation.js'
//import feedRoute from './feed.js'
import endorsementRoute from './endorsement.js'
import interviewRoute from './interview.js'
import reminderRoute from './reminder.js'

router.use('/profile', profileRoute)
router.use('/myprofile', myProfileRoute)
router.use('/user', userRoute)
router.use('/cv', cvRoute)
router.use('/connections', connectionRoute)
router.use('/posts', postRoute)
router.use('/internships', internshipRoute)
router.use('/analytics', analyticsRoute)
router.use('/applications', applicationRoute)
//router.use('/recommendations', recommendationRoute)
//router.use('/feed', feedRoute)
router.use('/endorsements', endorsementRoute)
router.use('/interviews', interviewRoute)
router.use('/reminders', reminderRoute)


export default router

