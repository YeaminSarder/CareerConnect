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

	// Filter applications based on selected internship and status tab
	const filteredApplications = applications.filter((app) => {
		const matchesJob = selectedInternshipId === 'ALL' || app.internship?._id === selectedInternshipId || app.internship === selectedInternshipId
		const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter
		return matchesJob && matchesStatus
	})

	// Summary stats calculation
	const totalApps = applications.length
	const countApplied = applications.filter(a => a.status === 'Applied').length
	const countReview = applications.filter(a => a.status === 'Under Review').length
	const countShortlisted = applications.filter(a => a.status === 'Shortlisted').length
	const countInterview = applications.filter(a => a.status === 'Interviewing').length
	const countAccepted = applications.filter(a => a.status === 'Accepted').length
	const countRejected = applications.filter(a => a.status === 'Rejected').length

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

			{/* Metrics Summary Cards */}
			<div className="row g-2 mb-4">
				<div className="col-6 col-md-2">
					<div className="card border-0 bg-white shadow-sm p-3 text-center rounded-3">
						<span className="text-muted small fw-bold">Total Applicants</span>
						<h4 className="fw-bold text-primary mb-0">{totalApps}</h4>
					</div>
				</div>
				<div className="col-6 col-md-2">
					<div className="card border-0 bg-white shadow-sm p-3 text-center rounded-3">
						<span className="text-warning small fw-bold">Under Review</span>
						<h4 className="fw-bold text-warning mb-0">{countReview}</h4>
					</div>
				</div>
				<div className="col-6 col-md-2">
					<div className="card border-0 bg-white shadow-sm p-3 text-center rounded-3">
						<span className="text-info small fw-bold">Shortlisted</span>
						<h4 className="fw-bold text-info mb-0">{countShortlisted}</h4>
					</div>
				</div>
				<div className="col-6 col-md-2">
					<div className="card border-0 bg-white shadow-sm p-3 text-center rounded-3">
						<span className="text-secondary small fw-bold">Interviewing</span>
						<h4 className="fw-bold text-secondary mb-0">{countInterview}</h4>
					</div>
				</div>
				<div className="col-6 col-md-2">
					<div className="card border-0 bg-white shadow-sm p-3 text-center rounded-3">
						<span className="text-success small fw-bold">Accepted</span>
						<h4 className="fw-bold text-success mb-0">{countAccepted}</h4>
					</div>
				</div>
				<div className="col-6 col-md-2">
					<div className="card border-0 bg-white shadow-sm p-3 text-center rounded-3">
						<span className="text-danger small fw-bold">Rejected</span>
						<h4 className="fw-bold text-danger mb-0">{countRejected}</h4>
					</div>
				</div>
			</div>

			{/* Status Filter Tabs */}
			<ul className="nav nav-tabs border-bottom-0 mb-3">
				{['ALL', 'Applied', 'Under Review', 'Shortlisted', 'Interviewing', 'Accepted', 'Rejected'].map((status) => (
					<li key={status} className="nav-item">
						<button
							className={`nav-link border-0 fw-semibold ${statusFilter === status ? 'active bg-white border-bottom border-3 border-primary text-primary' : 'text-secondary'}`}
							onClick={() => setStatusFilter(status)}
						>
							{status === 'ALL' ? 'All Applicants' : status}
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default RecruiterDashboard
