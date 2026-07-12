const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

router.post('/login', userController.loginUser)
router.post('/register', userController.registerUser)

module.exports = router
