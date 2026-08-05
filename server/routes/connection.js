import express from 'express'
import {
	sendConnectionRequest,
	updateConnectionStatus,
	getMyConnections,
	getPendingRequests,
	searchUsersByName,
	getFeaturedUsers
} from '../controllers/connection.js'
import requireAuth from '../middleware/require-auth.js'

const router = express.Router()

router.use(requireAuth)

router.post('/request', sendConnectionRequest)
router.patch('/:id/status', updateConnectionStatus)
router.get('/my-connections', getMyConnections)
router.get('/pending', getPendingRequests)
router.get('/search-users', searchUsersByName)
router.get('/featured-users', getFeaturedUsers)

export default router
