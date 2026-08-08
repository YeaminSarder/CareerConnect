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

	const handleStatusChange = async (appId, newStatus) => {
		try {
			const res = await updateApplicationStatus(appId, newStatus)
			setApplications((prev) =>
				prev.map((app) => (app._id === appId ? res.data : app))
			)
		} catch (err) {
			console.error('Error updating application status:', err)
			alert(err.response?.data?.error || 'Failed to update application status.')
		}
	}

	const getStatusBadge = (status) => {
		switch (status) {
			case 'Applied':
				return <span className="badge bg-primary"><i className="bi bi-clock-history me-1"></i>Applied</span>
			case 'Under Review':
				return <span className="badge bg-warning text-dark"><i className="bi bi-eye-fill me-1"></i>Under Review</span>
			case 'Shortlisted':
				return <span className="badge bg-info text-dark"><i className="bi bi-star-fill me-1"></i>Shortlisted</span>
			case 'Interviewing':
				return <span className="badge bg-purple text-white bg-dark"><i className="bi bi-person-video me-1"></i>Interviewing</span>
			case 'Accepted':
				return <span className="badge bg-success"><i className="bi bi-check-circle-fill me-1"></i>Accepted</span>
			case 'Rejected':
				return <span className="badge bg-danger"><i className="bi bi-x-circle-fill me-1"></i>Rejected</span>
			default:
				return <span className="badge bg-secondary">{status}</span>
		}
	}

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

			{/* Applicants Table */}
			{loading ? (
				<div className="text-center py-5 bg-white rounded-3 border">
					<div className="spinner-border text-primary" role="status">
						<span className="visually-hidden">Loading candidate applications...</span>
					</div>
					<p className="text-muted small mt-2">Fetching applicants...</p>
				</div>
			) : filteredApplications.length === 0 ? (
				<div className="text-center py-5 bg-white rounded-3 border">
					<i className="bi bi-people text-muted fs-1 mb-2 d-block"></i>
					<h6 className="fw-bold text-secondary mb-1">No applications found</h6>
					<p className="text-muted small mb-0">No candidate submissions match your selected filter criteria.</p>
				</div>
			) : (
				<div className="table-responsive bg-white rounded-3 border">
					<table className="table table-hover align-middle mb-0">
						<thead className="table-light">
							<tr>
								<th scope="col" className="py-3 ps-3">Candidate Info</th>
								<th scope="col" className="py-3">Applied Position</th>
								<th scope="col" className="py-3">Submitted CV</th>
								<th scope="col" className="py-3">Applied Date</th>
								<th scope="col" className="py-3">Status</th>
								<th scope="col" className="py-3 text-end pe-3">Review & Quick Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredApplications.map((app) => {
								const student = app.student || {}
								const cv = app.cv || {}
								const job = app.internship || {}

								return (
									<tr key={app._id}>
										<td className="ps-3 py-3">
											<div className="fw-bold text-dark">{student.name || 'Candidate'}</div>
											<div className="text-muted small">
												<i className="bi bi-envelope me-1"></i>{student.email || 'N/A'}
											</div>
										</td>
										<td className="py-3">
											<div className="fw-semibold text-primary">{job.title || 'Internship'}</div>
											<small className="text-muted">{job.company || 'Company'}</small>
										</td>
										<td className="py-3">
											<button
												className="btn btn-sm btn-outline-primary shadow-sm"
												onClick={() =>
													setInspectCvModal({
														isOpen: true,
														cvId: cv._id || cv,
														candidateName: student.name,
														applicationDate: app.appliedAt || app.createdAt
													})
												}
											>
												<i className="bi bi-file-earmark-person-fill me-1"></i>
												{cv.title || 'View CV'}
											</button>
										</td>
										<td className="py-3 small text-muted">
											{new Date(app.appliedAt || app.createdAt).toLocaleDateString(undefined, {
												year: 'numeric',
												month: 'short',
												day: 'numeric'
											})}
										</td>
										<td className="py-3">
											{getStatusBadge(app.status)}
										</td>
										<td className="py-3 text-end pe-3">
											<div className="d-flex justify-content-end align-items-center gap-2">
												{/* Quick Shortlist Button */}
												<button
													className={`btn btn-sm ${app.status === 'Shortlisted' ? 'btn-info text-dark font-weight-bold disabled' : 'btn-outline-info'}`}
													onClick={() => handleStatusChange(app._id, 'Shortlisted')}
													title="Shortlist Candidate"
												>
													<i className="bi bi-star-fill me-1"></i>Shortlist
												</button>

												{/* Quick Reject Button */}
												<button
													className={`btn btn-sm ${app.status === 'Rejected' ? 'btn-danger disabled' : 'btn-outline-danger'}`}
													onClick={() => handleStatusChange(app._id, 'Rejected')}
													title="Reject Candidate"
												>
													<i className="bi bi-x-lg me-1"></i>Reject
												</button>

												{/* Select Status Dropdown */}
												<select
													className="form-select form-select-sm"
													style={{ width: '135px' }}
													value={app.status}
													onChange={(e) => handleStatusChange(app._id, e.target.value)}
												>
													<option value="Applied">Applied</option>
													<option value="Under Review">Under Review</option>
													<option value="Shortlisted">Shortlisted</option>
													<option value="Interviewing">Interviewing</option>
													<option value="Accepted">Accepted</option>
													<option value="Rejected">Rejected</option>
												</select>
											</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			)}

			{/* Submitted CV Detail Inspection Modal */}
			<SubmittedCvModal
				isOpen={inspectCvModal.isOpen}
				onClose={() => setInspectCvModal({ ...inspectCvModal, isOpen: false })}
				cvId={inspectCvModal.cvId}
				candidateName={inspectCvModal.candidateName}
				applicationDate={inspectCvModal.applicationDate}
			/>
		</div>
	)
}

export default RecruiterDashboard
