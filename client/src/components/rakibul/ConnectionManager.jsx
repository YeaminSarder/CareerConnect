import React, { useState, useEffect } from 'react'
import axios from '../../api/axios.js'
import { useAuthContext } from '../../hooks/use-auth-context.jsx'

const ConnectionManager = () => {
	const { user } = useAuthContext()
	const [connections, setConnections] = useState([])
	const [pending, setPending] = useState({ incoming: [], outgoing: [] })
	const [recipientId, setRecipientId] = useState('')
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState(null)

	const fetchConnectionData = async () => {
		if (!user) return
		try {
			const [connRes, pendRes] = await Promise.all([
				axios.get('/api/connections/my-connections', {
					headers: { Authorization: `Bearer ${user.token}` }
				}),
				axios.get('/api/connections/pending', {
					headers: { Authorization: `Bearer ${user.token}` }
				})
			])
			setConnections(connRes.data || [])
			setPending(pendRes.data || { incoming: [], outgoing: [] })
		} catch (err) {
			console.error('Error fetching connections:', err)
		}
	}

	useEffect(() => {
		fetchConnectionData()
	}, [user])

	const handleSendRequest = async (e) => {
		e.preventDefault()
		if (!recipientId.trim()) return
		setLoading(true)
		setMessage(null)
		try {
			await axios.post(
				'/api/connections/request',
				{ recipientId },
				{ headers: { Authorization: `Bearer ${user.token}` } }
			)
			setMessage({ type: 'success', text: 'Connection request sent successfully!' })
			setRecipientId('')
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
				`/api/connections/${id}/status`,
				{ status },
				{ headers: { Authorization: `Bearer ${user.token}` } }
			)
			fetchConnectionData()
		} catch (err) {
			console.error('Failed to update status:', err)
		}
	}

	return (
		<div className="container py-4">
			<h4 className="fw-bold mb-3 text-primary">
				<i className="bi bi-people-fill me-2"></i>Networking & Connection Management
			</h4>

			{message && (
				<div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
					{message.text}
					<button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
				</div>
			)}

			{/* Send Request Form */}
			<div className="card shadow-sm border-0 p-3 mb-4 rounded-3">
				<h6 className="fw-bold mb-2">Send Connection Request</h6>
				<form onSubmit={handleSendRequest} className="d-flex gap-2">
					<input
						type="text"
						className="form-control"
						placeholder="Enter User ID or User Object ID to connect"
						value={recipientId}
						onChange={(e) => setRecipientId(e.target.value)}
						required
					/>
					<button type="submit" className="btn btn-primary text-nowrap" disabled={loading}>
						{loading ? 'Sending...' : 'Send Request'}
					</button>
				</form>
			</div>

			<div className="row g-4">
				{/* Incoming Pending Requests */}
				<div className="col-md-6">
					<div className="card shadow-sm border-0 p-3 h-100 rounded-3">
						<h6 className="fw-bold text-warning mb-3">
							Pending Incoming Requests ({pending.incoming ? pending.incoming.length : 0})
						</h6>
						{pending.incoming && pending.incoming.length > 0 ? (
							<ul className="list-group list-group-flush">
								{pending.incoming.map((req) => (
									<li key={req._id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
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
							<p className="text-muted small mb-0">No pending incoming connection requests.</p>
						)}
					</div>
				</div>

				{/* Active Connections List */}
				<div className="col-md-6">
					<div className="card shadow-sm border-0 p-3 h-100 rounded-3">
						<h6 className="fw-bold text-success mb-3">
							Accepted Connections ({connections ? connections.length : 0})
						</h6>
						{connections && connections.length > 0 ? (
							<ul className="list-group list-group-flush">
								{connections.map((conn) => {
									const partner = conn.requester?._id === user?._id ? conn.recipient : conn.requester
									return (
										<li key={conn._id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent">
											<div>
												<strong>{partner?.name || 'Connected Student'}</strong>
												<div className="small text-muted">{partner?.email}</div>
											</div>
											<span className="badge bg-success">Accepted</span>
										</li>
									)
								})}
							</ul>
						) : (
							<p className="text-muted small mb-0">No active connections yet. Send requests to network!</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ConnectionManager
