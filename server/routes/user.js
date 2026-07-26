import express from 'express'
const router = express.Router()
import userController from '../controllers/user.js'

router.post('/login', userController.loginUser)
router.post('/register', userController.registerUser)

export default router