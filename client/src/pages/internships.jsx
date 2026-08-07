import React, { useState, useEffect } from 'react'
import axios from '../api/axios.js'
import InternshipFilter from '../components/rakibul/InternshipFilter.jsx'

const InternshipsPage = () => {
	const [internships, setInternships] = useState([])
	const [loading, setLoading] = useState(true)

	const fetchInternships = async (filters = {}) => {
		setLoading(true)
		try {
			const queryParams = new URLSearchParams()
			if (filters.search) queryParams.append('search', filters.search)
			if (filters.workMode) queryParams.append('workMode', filters.workMode)
			if (filters.location) queryParams.append('location', filters.location)
			if (filters.skill) queryParams.append('skill', filters.skill)
			if (filters.status) queryParams.append('status', filters.status)

			const res = await axios.get(`/internships?${queryParams.toString()}`)
			setInternships(res.data || [])
		} catch (err) {
			console.error('Error fetching internships:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchInternships()
	}, [])

	return (
		<div className="container py-4">
			<h3 className="fw-bold mb-4 text-primary">
				<i className="bi bi-briefcase-fill me-2"></i>Internship Discovery & Matching
			</h3>

			{/* FR-18: Multi-filter Search Component */}
			<InternshipFilter onFilterChange={fetchInternships} />

			{loading ? (
				<div className="text-center py-4">
					<div className="spinner-border text-primary" role="status">
						<span className="visually-hidden">Loading internships...</span>
					</div>
				</div>
			) : internships.length > 0 ? (
				<div className="row g-3">
					{internships.map((job) => (
						<div key={job._id} className="col-md-6">
							<div className="card shadow-sm border-0 h-100 p-3 rounded-3">
								<div className="d-flex justify-content-between align-items-start mb-2">
									<div>
										<h5 className="fw-bold mb-1">{job.title}</h5>
										<h6 className="text-secondary mb-0">{job.company}</h6>
									</div>
									<span className={`badge ${job.workMode === 'Remote' ? 'bg-info' : job.workMode === 'Hybrid' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
										{job.workMode}
									</span>
								</div>

								<p className="text-muted small mb-2">{job.description}</p>

								<div className="d-flex flex-wrap gap-1 mb-3">
									{job.requiredSkills && job.requiredSkills.map((s, i) => (
										<span key={i} className="badge bg-light text-dark border">
											{s}
										</span>
									))}
								</div>

								<div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
									<small className="text-muted">
										<i className="bi bi-geo-alt me-1"></i>{job.location}
									</small>
									<button className="btn btn-sm btn-primary">Apply Now</button>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-5 bg-light rounded-3">
					<i className="bi bi-search text-muted fs-1 mb-2 d-block"></i>
					<h5>No internships found</h5>
					<p className="text-muted small">Try adjusting your filters or search keywords.</p>
				</div>
			)}
		</div>
	)
}

export default InternshipsPage
