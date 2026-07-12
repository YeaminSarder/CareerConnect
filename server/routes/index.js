const express = require('express')
const router = express.Router()

router.use('/profile', require('./profile'))
router.use('/user', require('./user'))
module.exports = router
