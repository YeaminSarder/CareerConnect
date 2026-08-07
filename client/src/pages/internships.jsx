import React, { useState, useEffect } from 'react'
import axios from '../api/axios.js'
import InternshipFilter from '../components/rakibul/InternshipFilter.jsx'
import InternshipPostModal from '../components/rakibul/InternshipPostModal.jsx'
import ApplyModal from '../components/rakibul/ApplyModal.jsx'
import ApplicationTracker from '../components/rakibul/ApplicationTracker.jsx'
import { getMyApplications, withdrawApplication } from '../api/application.js'
import { useAuthContext } from '../hooks/use-auth-context.jsx'

const InternshipsPage = () => {
	const { user } = useAuthContext()
	const [internships, setInternships] = useState([])
	const [loading, setLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [testRecruiterMode, setTestRecruiterMode] = useState(false)

	// Tab and Application Tracker state
	const [activeTab, setActiveTab] = useState('discover') // 'discover' | 'tracker'
	const [myApplications, setMyApplications] = useState([])
	const [loadingTracker, setLoadingTracker] = useState(false)
	const [applyTargetJob, setApplyTargetJob] = useState(null)

	const isRecruiterOrAdmin = user?.role === 'recruiter' || user?.role === 'admin' || testRecruiterMode

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

	const fetchMyApplicationsList = async () => {
		if (!user) return
		setLoadingTracker(true)
		try {
			const res = await getMyApplications()
			setMyApplications(res.data || [])
		} catch (err) {
			console.error('Error fetching my applications:', err)
		} finally {
			setLoadingTracker(false)
		}
	}

	useEffect(() => {
		fetchInternships()
		if (user) {
			fetchMyApplicationsList()
		}
	}, [user])

	const handlePostCreated = (newJob) => {
		setInternships((prev) => [newJob, ...prev])
	}

	const handleDeleteInternship = async (id) => {
		if (!window.confirm('Are you sure you want to delete this internship post?')) return
		try {
			await axios.delete(`/internships/${id}`, {
				headers: {
					Authorization: `Bearer ${user?.token}`
				}
			})
			setInternships((prev) => prev.filter((j) => j._id !== id))
		} catch (err) {
			console.error('Error deleting internship:', err)
			alert(err.response?.data?.error || 'Failed to delete internship post.')
		}
	}

	const handleOpenApplyModal = (job) => {
		setApplyTargetJob(job)
	}

	const handleApplicationSubmitted = (newApp) => {
		setMyApplications((prev) => [newApp, ...prev])
	}

	const handleWithdrawApplication = async (appId) => {
		if (!window.confirm('Are you sure you want to withdraw this application?')) return
		try {
			await withdrawApplication(appId)
			setMyApplications((prev) => prev.filter((a) => a._id !== appId))
		} catch (err) {
			console.error('Error withdrawing application:', err)
			alert(err.response?.data?.error || 'Failed to withdraw application.')
		}
	}

	// Set of internship IDs the user has applied to
	const appliedJobIds = new Set(
		myApplications.map((app) => app.internship?._id || app.internship)
	)

	return (
		<div className="container py-4">
			<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
				<div>
					<h3 className="fw-bold text-primary mb-1">
						<i className="bi bi-briefcase-fill me-2"></i>Internship Discovery & Matching
					</h3>
					<p className="text-muted small mb-0">
						Explore active listings or manage internship postings as a recruiter/admin.
					</p>
				</div>

				<div className="d-flex align-items-center gap-2">
					{/* Toggle Recruiter Posting Permission for Demo */}
					{!user?.role || (user.role !== 'recruiter' && user.role !== 'admin') ? (
						<button
							className={`btn btn-sm ${testRecruiterMode ? 'btn-outline-success' : 'btn-outline-secondary'}`}
							onClick={() => setTestRecruiterMode(!testRecruiterMode)}
							title="Toggle posting mode for demonstration"
						>
							<i className="bi bi-person-badge me-1"></i>
							{testRecruiterMode ? 'Recruiter Mode: ON' : 'Enable Recruiter Mode'}
						</button>
					) : null}

					{isRecruiterOrAdmin && (
						<button className="btn btn-primary shadow-sm" onClick={() => setIsModalOpen(true)}>
							<i className="bi bi-plus-lg me-1"></i>Post New Internship
						</button>
					)}
				</div>
			</div>

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
							<div className="card shadow-sm border-0 h-100 p-3 rounded-3 position-relative">
								<div className="d-flex justify-content-between align-items-start mb-2">
									<div>
										<h5 className="fw-bold mb-1 text-dark">{job.title}</h5>
										<h6 className="text-primary mb-0 fw-semibold">
											<i className="bi bi-building me-1"></i>{job.company}
										</h6>
									</div>
									<div className="d-flex align-items-center gap-2">
										<span className={`badge ${job.workMode === 'Remote' ? 'bg-info text-dark' : job.workMode === 'Hybrid' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
											{job.workMode}
										</span>
										{isRecruiterOrAdmin && (
											<button
												className="btn btn-sm btn-outline-danger border-0 p-1"
												onClick={() => handleDeleteInternship(job._id)}
												title="Delete internship post"
											>
												<i className="bi bi-trash-fill"></i>
											</button>
										)}
									</div>
								</div>

								{job.description && (
									<p className="text-muted small mb-2">{job.description}</p>
								)}

								{/* Eligibility Criteria */}
								{job.eligibilityCriteria && (
									<div className="bg-light p-2 rounded-2 mb-2 border-start border-3 border-primary">
										<small className="fw-bold d-block text-secondary mb-1">
											<i className="bi bi-card-checklist me-1 text-primary"></i>Eligibility Criteria:
										</small>
										<small className="text-dark d-block">{job.eligibilityCriteria}</small>
									</div>
								)}

								{/* Required Skills */}
								{job.requiredSkills && job.requiredSkills.length > 0 && (
									<div className="d-flex flex-wrap gap-1 mb-3">
										{job.requiredSkills.map((s, i) => (
											<span key={i} className="badge bg-light text-dark border">
												{s}
											</span>
										))}
									</div>
								)}

								{/* Info Row: Salary & Deadline */}
								<div className="row g-2 small text-muted mb-3 bg-white p-1 rounded">
									{job.salaryRange && (
										<div className="col-6">
											<i className="bi bi-cash-stack me-1 text-success"></i>
											<span className="fw-medium text-dark">{job.salaryRange}</span>
										</div>
									)}
									{job.deadline && (
										<div className="col-6 text-end">
											<i className="bi bi-calendar-event me-1 text-danger"></i>
											<span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
										</div>
									)}
								</div>

								{/* Card Footer */}
								<div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
									<small className="text-muted">
										<i className="bi bi-geo-alt me-1"></i>{job.location}
										{job.postedBy?.name && (
											<span className="ms-2 badge bg-secondary-subtle text-secondary border">
												Recruiter: {job.postedBy.name}
											</span>
										)}
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

			{/* Modal for Recruiter / Admin Posting */}
			<InternshipPostModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onPostCreated={handlePostCreated}
				userToken={user?.token}
			/>
		</div>
	)
}

export default InternshipsPage
