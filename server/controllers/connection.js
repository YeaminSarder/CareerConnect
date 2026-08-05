import Connection from '../models/connection.js'
import User from '../models/user.js'

// POST /api/connections/request
export const sendConnectionRequest = async (req, res) => {
	try {
		const { recipientId } = req.body
		const requesterId = req.user._id

		if (!recipientId) {
			return res.status(400).json({ error: 'Recipient ID is required' })
		}

		if (requesterId.toString() === recipientId.toString()) {
			return res.status(400).json({ error: 'Cannot send connection request to yourself' })
		}

		// Check existing request
		const existing = await Connection.findOne({
			$or: [
				{ requester: requesterId, recipient: recipientId },
				{ requester: recipientId, recipient: requesterId }
			]
		})

		if (existing) {
			if (existing.status === 'Pending') {
				return res.status(400).json({ error: 'Connection request already pending' })
			}
			if (existing.status === 'Accepted') {
				return res.status(400).json({ error: 'Already connected' })
			}
			// If rejected or removed, update to pending
			existing.requester = requesterId
			existing.recipient = recipientId
			existing.status = 'Pending'
			await existing.save()
			return res.status(200).json(existing)
		}

		const newConnection = await Connection.create({
			requester: requesterId,
			recipient: recipientId,
			status: 'Pending'
		})

		res.status(201).json(newConnection)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// PATCH /api/connections/:id/status
export const updateConnectionStatus = async (req, res) => {
	try {
		const { id } = req.params
		const { status } = req.body

		if (!['Pending', 'Accepted', 'Rejected', 'Removed'].includes(status)) {
			return res.status(400).json({ error: 'Invalid status' })
		}

		const connection = await Connection.findById(id)
		if (!connection) {
			return res.status(404).json({ error: 'Connection request not found' })
		}

		connection.status = status
		await connection.save()

		res.status(200).json(connection)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// GET /api/connections
export const getMyConnections = async (req, res) => {
	try {
		const userId = req.user._id
		const connections = await Connection.find({
			$or: [{ requester: userId }, { recipient: userId }],
			status: 'Accepted'
		})
			.populate('requester', 'name email')
			.populate('recipient', 'name email')

		res.status(200).json(connections)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// GET /api/connections/pending
export const getPendingRequests = async (req, res) => {
	try {
		const userId = req.user._id
		const pendingIncoming = await Connection.find({
			recipient: userId,
			status: 'Pending'
		}).populate('requester', 'name email')

		const pendingOutgoing = await Connection.find({
			requester: userId,
			status: 'Pending'
		}).populate('recipient', 'name email')

		res.status(200).json({ incoming: pendingIncoming, outgoing: pendingOutgoing })
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// GET /api/connections/search-users?search=... (FR-4: Recommend / Search Users by Name)
export const searchUsersByName = async (req, res) => {
	try {
		const { search } = req.query
		const userId = req.user._id

		const query = { _id: { $ne: userId } }
		if (search && search.trim().length > 0) {
			query.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ email: { $regex: search, $options: 'i' } }
			]
		}

		const users = await User.find(query).select('name email profile').populate('profile').limit(10)
		res.status(200).json(users)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

// GET /api/connections/featured-users (FR-4: Recommended Featured Accounts)
export const getFeaturedUsers = async (req, res) => {
	try {
		const userId = req.user._id
		const users = await User.find({ _id: { $ne: userId } })
			.select('name email profile')
			.populate('profile')
			.limit(6)

		res.status(200).json(users)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
}

export default {
	sendConnectionRequest,
	updateConnectionStatus,
	getMyConnections,
	getPendingRequests,
	searchUsersByName,
	getFeaturedUsers
}

