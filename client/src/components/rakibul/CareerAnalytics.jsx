import React, { useState, useEffect } from 'react'
import axios from '../../api/axios.js'
import { useAuthContext } from '../../hooks/use-auth-context.jsx'

const CareerAnalytics = () => {
	const { user } = useAuthContext()
	const [analytics, setAnalytics] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchAnalytics = async () => {
			if (!user) return
			try {
				const res = await axios.get('/api/analytics/student', {
					headers: { Authorization: `Bearer ${user.token}` }
				})
				setAnalytics(res.data)
			} catch (err) {
				console.error('Error fetching analytics:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchAnalytics()
	}, [user])

	if (loading) {
		return (
			<div className="text-center py-4">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading Analytics...</span>
				</div>
			</div>
		)
	}

	if (!analytics) return null

	return (
		<div className="container py-4">
			<h4 className="fw-bold mb-3 text-primary">
				<i className="bi bi-graph-up-arrow me-2"></i>Student Career Analytics Report
			</h4>

			<div className="row g-3 mb-4">
				{/* Total Applications */}
				<div className="col-md-3">
					<div className="card shadow-sm border-0 p-3 bg-primary text-white text-center rounded-3">
						<h3 className="fw-bold mb-1">{analytics.totalApplications}</h3>
						<small className="text-uppercase fw-semibold opacity-75">Total Applications</small>
					</div>
				</div>

				{/* Shortlisted */}
				<div className="col-md-3">
					<div className="card shadow-sm border-0 p-3 bg-info text-white text-center rounded-3">
						<h3 className="fw-bold mb-1">{analytics.shortlisted}</h3>
						<small className="text-uppercase fw-semibold opacity-75">Shortlisted</small>
					</div>
				</div>

				{/* Accepted */}
				<div className="col-md-3">
					<div className="card shadow-sm border-0 p-3 bg-success text-white text-center rounded-3">
						<h3 className="fw-bold mb-1">{analytics.accepted}</h3>
						<small className="text-uppercase fw-semibold opacity-75">Accepted Offers</small>
					</div>
				</div>

				{/* Success Rate */}
				<div className="col-md-3">
					<div className="card shadow-sm border-0 p-3 bg-dark text-white text-center rounded-3">
						<h3 className="fw-bold mb-1 text-warning">{analytics.successRate}</h3>
						<small className="text-uppercase fw-semibold opacity-75">Success Rate</small>
					</div>
				</div>
			</div>

			<div className="row g-3">
				{/* Breakdown Card */}
				<div className="col-md-6">
					<div className="card shadow-sm border-0 p-3 rounded-3 h-100">
						<h6 className="fw-bold mb-3">Application Pipeline Breakdown</h6>
						<ul className="list-group list-group-flush">
							<li className="list-group-item d-flex justify-content-between align-items-center">
								<span>Shortlisted Applications</span>
								<span className="badge bg-info rounded-pill">{analytics.shortlisted}</span>
							</li>
							<li className="list-group-item d-flex justify-content-between align-items-center">
								<span>Rejected Applications</span>
								<span className="badge bg-danger rounded-pill">{analytics.rejected}</span>
							</li>
							<li className="list-group-item d-flex justify-content-between align-items-center">
								<span>Accepted Offers</span>
								<span className="badge bg-success rounded-pill">{analytics.accepted}</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Insights Card */}
				<div className="col-md-6">
					<div className="card shadow-sm border-0 p-3 rounded-3 h-100">
						<h6 className="fw-bold mb-3">Career Insights & Usage</h6>
						<div className="mb-3">
							<small className="text-muted d-block">Most Used CV Version</small>
							<strong className="text-primary">{analytics.mostUsedCv}</strong>
						</div>
						<div>
							<small className="text-muted d-block">Most Applied Job Field</small>
							<strong className="text-success">{analytics.mostAppliedField}</strong>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CareerAnalytics
