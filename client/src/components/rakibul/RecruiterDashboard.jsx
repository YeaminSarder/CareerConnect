import React, { useState, useEffect } from 'react'
import { getRecruiterApplications, updateApplicationStatus } from '../../api/application'
import SubmittedCvModal from './SubmittedCvModal'

const RecruiterDashboard = ({ internships = [] }) => {
	const [applications, setApplications] = useState([])
	const [loading, setLoading] = useState(true)
	const [selectedInternshipId, setSelectedInternshipId] = useState('ALL')
	const [statusFilter, setStatusFilter] = useState('ALL')

	// CV Inspection Modal state
	const [inspectCvModal, setInspectCvModal] = useState({
		isOpen: false,
		cvId: null,
		candidateName: '',
		applicationDate: null
	})

	const fetchApplications = async () => {
		setLoading(true)
		try {
			const res = await getRecruiterApplications()
			setApplications(res.data || [])
		} catch (err) {
			console.error('Error fetching applications for recruiter:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchApplications()
	}, [])

	return (
		<div className="card shadow-sm border-0 rounded-4 p-4 bg-light">
			{/* Dashboard Header */}
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
				<div>
					<h4 className="fw-bold text-primary mb-1">
						<i className="bi bi-person-workspace me-2"></i>Recruiter Application Review Dashboard
					</h4>
					<p className="text-muted small mb-0">
						Review candidate applications per internship post, inspect submitted CV versions, shortlist top talent, or update status.
					</p>
				</div>

				{/* Filter by Internship Post */}
				<div className="d-flex align-items-center gap-2">
					<label className="form-label mb-0 fw-semibold small text-secondary">
						<i className="bi bi-briefcase me-1"></i>Filter Post:
					</label>
					<select
						className="form-select form-select-sm bg-white shadow-sm"
						style={{ minWidth: '220px' }}
						value={selectedInternshipId}
						onChange={(e) => setSelectedInternshipId(e.target.value)}
					>
						<option value="ALL">All Internship Listings</option>
						{internships.map((job) => (
							<option key={job._id} value={job._id}>
								{job.title} - {job.company}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	)
}

export default RecruiterDashboard
