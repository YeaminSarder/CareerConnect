const express = require('express')
const router = express.Router()
const myprofileController = require('../controllers/myprofile')
const requireAuth = require('../middleware/require-auth')

router.use(requireAuth)

router.get('/', myprofileController.getProfile)

module.exports = router
