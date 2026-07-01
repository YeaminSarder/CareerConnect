const express = require('express')
const router = express.Router()
const Profile = require('../models/profile')
const controller = require('../controllers')

router.get('/', controller.profile.getProfiles)
router.get('/:id', controller.profile.getProfile)
router.patch('/:id', controller.profile.updateProfile)
router.delete('/:id', controller.profile.deleteProfile)
router.post('/', controller.profile.createProfile)

module.exports = router
