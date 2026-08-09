import React, { useState, useEffect } from 'react'
import axios from '../api/axios.js'
import InternshipFilter from '../components/rakibul/InternshipFilter.jsx'
import InternshipPostModal from '../components/rakibul/InternshipPostModal.jsx'
import ApplyModal from '../components/rakibul/ApplyModal.jsx'
import ApplicationTracker from '../components/rakibul/ApplicationTracker.jsx'
import RecruiterDashboard from '../components/rakibul/RecruiterDashboard.jsx'
import { getMyApplications, withdrawApplication } from '../api/application.js'
import { useAuthContext } from '../hooks/use-auth-context.jsx'
import ApplicationBoard from '../components/applications/application-board.jsx'
import { useMyApplications, useInvalidateMyApplications } from '../hooks/use-applications.jsx'

const InternshipsPage = () => {
	const { user } = useAuthContext()
	const [internships, setInternships] = useState([])
	const [loading, setLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [testRecruiterMode, setTestRecruiterMode] = useState(false)

	// Tab and Application Tracker state
	const [activeTab, setActiveTab] = useState('discover') // 'discover' | 'tracker' | 'recruiter'
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

	const { data: myApplications = [] } = useMyApplications() // Fetches applications for the logged-in user
    const invalidateMyApplications = useInvalidateMyApplications() // Function to refresh the application list
	useEffect(() => {
		fetchInternships()
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
		invalidateMyApplications() // Refresh the application list after submission
	}

	const handleWithdrawApplication = async (appId) => {
		if (!window.confirm('Are you sure you want to withdraw this application?')) return
		try {
			await withdrawApplication(appId)
			invalidateMyApplications() // Refresh the application list after withdrawal
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
						<i className="bi bi-briefcase-fill me-2"></i>Internship Discovery & Recruiter Portal
					</h3>
					<p className="text-muted small mb-0">
						Explore listings, submit 1-click applications with selected CV versions, and manage candidate reviews.
					</p>
				</div>

				<div className="d-flex align-items-center gap-2">
					{/* Toggle Recruiter Posting Permission for Demo */}
					{!user?.role || (user.role !== 'recruiter' && user.role !== 'admin') ? (
						<button
							className={`btn btn-sm ${testRecruiterMode ? 'btn-outline-success' : 'btn-outline-secondary'}`}
							onClick={() => setTestRecruiterMode(!testRecruiterMode)}
							title="Toggle posting and recruiter review mode for demonstration"
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

			{/* Navigation Tabs: Discover Listings vs Application Tracker vs Recruiter Dashboard */}
			<ul className="nav nav-pills mb-4 bg-light p-2 rounded-3 border">
				<li className="nav-item">
					<button
						className={`nav-link fw-semibold ${activeTab === 'discover' ? 'active shadow-sm' : 'text-secondary'}`}
						onClick={() => setActiveTab('discover')}
					>
						<i className="bi bi-compass-fill me-2"></i>Explore Listings
					</button>
				</li>
				<li className="nav-item">
					<button
						className={`nav-link fw-semibold ${activeTab === 'tracker' ? 'active shadow-sm' : 'text-secondary'}`}
						onClick={() => setActiveTab('tracker')}
					>
						<i className="bi bi-journal-check me-2"></i>My Application Tracker
						{myApplications.length > 0 && (
							<span className="badge bg-danger ms-2 rounded-pill">{myApplications.length}</span>
						)}
					</button>
				</li>
				{isRecruiterOrAdmin && (
					<li className="nav-item">
						<button
							className={`nav-link fw-semibold ${activeTab === 'recruiter' ? 'active shadow-sm' : 'text-secondary'}`}
							onClick={() => setActiveTab('recruiter')}
						>
							<i className="bi bi-person-workspace me-2"></i>Recruiter Review Dashboard
						</button>
					</li>
				)}
			</ul>

			{/* TAB CONTENT 1: DISCOVER LISTINGS */}
			{activeTab === 'discover' && (
				<>
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
							{internships.map((job) => {
								const hasApplied = appliedJobIds.has(job._id)
								return (
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

												{hasApplied ? (
													<span className="badge bg-success-subtle text-success border border-success px-3 py-2">
														<i className="bi bi-check-circle-fill me-1"></i>Applied
													</span>
												) : (
													<button
														className="btn btn-sm btn-primary px-3 fw-bold"
														onClick={() => handleOpenApplyModal(job)}
													>
														<i className="bi bi-send me-1"></i>1-Click Apply
													</button>
												)}
											</div>
										</div>
									</div>
								)
							})}
						</div>
					) : (
						<div className="text-center py-5 bg-light rounded-3">
							<i className="bi bi-search text-muted fs-1 mb-2 d-block"></i>
							<h5>No internships found</h5>
							<p className="text-muted small">Try adjusting your filters or search keywords.</p>
						</div>
					)}
				</>
			)}

			{/* TAB CONTENT 2: PERSONAL APPLICATION TRACKER */}
			{activeTab === 'tracker' && (
				<ApplicationBoard
					applications={myApplications}
					loading={loadingTracker}
					onWithdraw={handleWithdrawApplication}
				/>
			)}

			{/* TAB CONTENT 3: RECRUITER APPLICATION REVIEW DASHBOARD */}
			{activeTab === 'recruiter' && (
				<RecruiterDashboard internships={internships} />
			)}

			{/* Modal for Recruiter / Admin Posting */}
			<InternshipPostModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onPostCreated={handlePostCreated}
				userToken={user?.token}
			/>

			{/* Modal for 1-Click Application Submission with Selected CV */}
			<ApplyModal
				isOpen={!!applyTargetJob}
				onClose={() => setApplyTargetJob(null)}
				internship={applyTargetJob}
				onApplicationSubmitted={handleApplicationSubmitted}
			/>
		</div>
	)
}

export default InternshipsPage
