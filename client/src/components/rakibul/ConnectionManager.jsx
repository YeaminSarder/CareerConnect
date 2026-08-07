import React, { useState, useEffect } from 'react'
import axios from '../../api/axios.js'
import { useAuthContext } from '../../hooks/use-auth-context.jsx'

const ConnectionManager = () => {
	const { user } = useAuthContext()
	const [connections, setConnections] = useState([])
	const [pending, setPending] = useState({ incoming: [], outgoing: [] })
	const [searchQuery, setSearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState([])
	const [featuredUsers, setFeaturedUsers] = useState([])
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState(null)

	const fetchConnectionData = async () => {
		if (!user) return
		try {
			const [connRes, pendRes, featRes] = await Promise.all([
				axios.get('/connections/my-connections', {
					headers: { Authorization: `Bearer ${user.token}` }
				}),
				axios.get('/connections/pending', {
					headers: { Authorization: `Bearer ${user.token}` }
				}),
				axios.get('/connections/featured-users', {
					headers: { Authorization: `Bearer ${user.token}` }
				})
			])
			setConnections(connRes.data || [])
			setPending(pendRes.data || { incoming: [], outgoing: [] })
			setFeaturedUsers(featRes.data || [])
		} catch (err) {
			console.error('Error fetching connections:', err)
		}
	}

	useEffect(() => {
		fetchConnectionData()
	}, [user])

	// Live Name / Email Search
	useEffect(() => {
		const searchUsers = async () => {
			if (!searchQuery.trim() || !user) {
				setSearchResults([])
				return
			}
			try {
				const res = await axios.get(`/connections/search-users?search=${encodeURIComponent(searchQuery)}`, {
					headers: { Authorization: `Bearer ${user.token}` }
				})
				setSearchResults(res.data || [])
			} catch (err) {
				console.error('Search error:', err)
			}
		}

		const timer = setTimeout(searchUsers, 300)
		return () => clearTimeout(timer)
	}, [searchQuery, user])

	const handleSendRequestById = async (recipientId) => {
		if (!user) return
		setLoading(true)
		setMessage(null)
		try {
			await axios.post(
				'/connections/request',
				{ recipientId },
				{ headers: { Authorization: `Bearer ${user.token}` } }
			)
			setMessage({ type: 'success', text: 'Connection request sent successfully!' })
			fetchConnectionData()
		} catch (err) {
			setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to send request' })
		} finally {
			setLoading(false)
		}
	}

	const handleStatusUpdate = async (id, status) => {
		try {
			await axios.patch(
				`/connections/${id}/status`,
				{ status },
				{ headers: { Authorization: `Bearer ${user.token}` } }
			)
			fetchConnectionData()
		} catch (err) {
			console.error('Failed to update status:', err)
		}
	}

	// Helper to check connection state for a target user
	const getConnectionState = (targetUserId) => {
		if (connections.some((c) => (c.requester?._id === targetUserId || c.recipient?._id === targetUserId))) {
			return 'Connected'
		}
		if (pending.outgoing?.some((p) => p.recipient?._id === targetUserId)) {
			return 'Pending'
		}
		if (pending.incoming?.some((p) => p.requester?._id === targetUserId)) {
			return 'Incoming'
		}
		return 'None'
	}

	return (
		<div className="container py-4">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<div>
					<h3 className="fw-bold text-primary mb-1">
						<i className="bi bi-people-fill me-2"></i>Networking & Connections
					</h3>
					<p className="text-muted small mb-0">Connect with fellow students, discover recommended peers, and grow your network.</p>
				</div>
			</div>

			{message && (
				<div className={`alert alert-${message.type} alert-dismissible fade show shadow-sm rounded-3`} role="alert">
					<i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
					{message.text}
					<button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
				</div>
			)}

			{/* Search Users by Name */}
			<div className="card shadow-sm border-0 p-3 mb-4 rounded-3 bg-light">
				<h6 className="fw-bold text-dark mb-2">
					<i className="bi bi-search me-2 text-primary"></i>Search Students by Name or Email
				</h6>
				<input
					type="text"
					className="form-control"
					placeholder="Type a student name (e.g. Yeamin, Rakibul, Faisal, Sarah)..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>

				{/* Search Results */}
				{searchResults.length > 0 && (
					<div className="mt-3">
						<small className="text-muted fw-bold d-block mb-2">Search Results ({searchResults.length}):</small>
						<div className="row g-2">
							{searchResults.map((u) => {
								const state = getConnectionState(u._id)
								return (
									<div key={u._id} className="col-md-6">
										<div className="card p-2 border-0 shadow-sm d-flex flex-row justify-content-between align-items-center bg-white rounded-3">
											<div className="d-flex align-items-center gap-2">
												<div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '38px', height: '38px' }}>
													{u.name ? u.name.charAt(0) : 'S'}
												</div>
												<div>
													<strong className="d-block text-dark leading-tight">{u.name}</strong>
													<small className="text-muted">{u.email}</small>
												</div>
											</div>
											{state === 'Connected' ? (
												<span className="badge bg-success">Connected</span>
											) : state === 'Pending' ? (
												<span className="badge bg-warning text-dark">Request Sent</span>
											) : state === 'Incoming' ? (
												<span className="badge bg-info">Pending Response</span>
											) : (
												<button
													className="btn btn-sm btn-outline-primary"
													onClick={() => handleSendRequestById(u._id)}
													disabled={loading}
												>
													<i className="bi bi-person-plus-fill me-1"></i>Connect
												</button>
											)}
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)}
			</div>

			{/* Recommended / Featured Accounts */}
			{featuredUsers.length > 0 && (
				<div className="mb-4">
					<h5 className="fw-bold text-secondary mb-3">
						<i className="bi bi-star-fill me-2 text-warning"></i>Recommended Student Profiles
					</h5>
					<div className="row g-3">
						{featuredUsers.map((userCard) => {
							const state = getConnectionState(userCard._id)
							return (
								<div key={userCard._id} className="col-md-4">
									<div className="card shadow-sm border-0 h-100 p-3 rounded-3 bg-white">
										<div className="d-flex align-items-center gap-3 mb-2">
											<div className="bg-gradient bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5 shadow-sm" style={{ width: '48px', height: '48px' }}>
												{userCard.name ? userCard.name.charAt(0) : 'S'}
											</div>
											<div>
												<h6 className="fw-bold mb-0 text-dark">{userCard.name}</h6>
												<small className="text-muted d-block">{userCard.profile?.department || 'Student Developer'}</small>
											</div>
										</div>

										<p className="text-secondary small mb-3 flex-grow-1" style={{ minHeight: '40px' }}>
											{userCard.profile?.description || 'CSE Student passionate about full-stack web engineering & software design.'}
										</p>

										<div className="d-flex justify-content-between align-items-center border-top pt-2 mt-auto">
											<span className="small text-muted">{userCard.email}</span>
											{state === 'Connected' ? (
												<span className="badge bg-success">Connected</span>
											) : state === 'Pending' ? (
												<span className="badge bg-warning text-dark">Pending</span>
											) : (
												<button
													className="btn btn-sm btn-primary"
													onClick={() => handleSendRequestById(userCard._id)}
													disabled={loading}
												>
													<i className="bi bi-person-plus-fill me-1"></i>Connect
												</button>
											)}
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			)}

			<div className="row g-4">
				{/* Incoming Pending Requests */}
				<div className="col-md-6">
					<div className="card shadow-sm border-0 p-3 h-100 rounded-3">
						<h6 className="fw-bold text-warning mb-3">
							<i className="bi bi-clock-history me-2"></i>Pending Incoming Requests ({pending.incoming ? pending.incoming.length : 0})
						</h6>
						{pending.incoming && pending.incoming.length > 0 ? (
							<ul className="list-group list-group-flush">
								{pending.incoming.map((req) => (
									<li key={req._id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
										<div>
											<strong>{req.requester?.name || 'Student'}</strong>
											<div className="small text-muted">{req.requester?.email}</div>
										</div>
										<div className="btn-group btn-group-sm">
											<button className="btn btn-success" onClick={() => handleStatusUpdate(req._id, 'Accepted')}>
												Accept
											</button>
											<button className="btn btn-outline-danger" onClick={() => handleStatusUpdate(req._id, 'Rejected')}>
												Reject
											</button>
										</div>
									</li>
								))}
							</ul>
						) : (
							<p className="text-muted small mb-0">No pending incoming requests at the moment.</p>
						)}
					</div>
				</div>

				{/* Active Connections List */}
				<div className="col-md-6">
					<div className="card shadow-sm border-0 p-3 h-100 rounded-3">
						<h6 className="fw-bold text-success mb-3">
							<i className="bi bi-check-circle-fill me-2"></i>My Network ({connections ? connections.length : 0})
						</h6>
						{connections && connections.length > 0 ? (
							<ul className="list-group list-group-flush">
								{connections.map((conn) => {
									const partner = conn.requester?._id === user?._id ? conn.recipient : conn.requester
									return (
										<li key={conn._id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
											<div className="d-flex align-items-center gap-2">
												<div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '34px', height: '34px' }}>
													{partner?.name ? partner.name.charAt(0) : 'C'}
												</div>
												<div>
													<strong>{partner?.name || 'Connected Student'}</strong>
													<div className="small text-muted">{partner?.email}</div>
												</div>
											</div>
											<span className="badge bg-success">Connected</span>
										</li>
									)
								})}
							</ul>
						) : (
							<p className="text-muted small mb-0">No active connections yet. Click "Connect" on recommended student profiles above!</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ConnectionManager
