const express = require('express')
const router = express.Router()

router.use('/profile', require('./profile'))
router.use('/user', require('./user'))
router.use('/myprofile', require('./myprofile'))
module.exports = router
