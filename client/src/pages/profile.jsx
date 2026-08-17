import React, { useState, useEffect } from 'react'
import useProfileContext from '../hooks/profile'
import { useAuthContext } from '../hooks/use-auth-context'
import axios from '../api/axios'
import ProfileCompletionBar from '../components/rakibul/ProfileCompletionBar'
import ProfileEditorModal from '../components/rakibul/ProfileEditorModal'
import ProfilePreviewModal from '../components/rakibul/ProfilePreviewModal'

const ProfilePage = () => {
	const { state, dispatch } = useProfileContext()
	const { user } = useAuthContext()
	const [showEditModal, setShowEditModal] = useState(false)
	const [showPreviewModal, setShowPreviewModal] = useState(false)
	const [initialTab, setInitialTab] = useState('basic')

	const openEditor = (tabName = 'basic') => {
		setInitialTab(tabName)
		setShowEditModal(true)
	}

	useEffect(() => {
		const fetchProfile = async () => {
			if (!user) return
			try {
				const res = await axios.get('/myprofile')
				dispatch({ type: 'SET_PROFILE', payload: res.data })
			} catch (err) {
				console.error('Failed to fetch profile:', err)
			}
		}

		fetchProfile()
	}, [user, dispatch])

	const profile = state.profile || {}
	const visibility = profile.visibility || {}

	const handleProfileUpdated = (updatedData) => {
		dispatch({ type: 'SET_PROFILE', payload: updatedData })
	}

	return (
		<div className="container py-4" style={{ maxWidth: '1000px' }}>
			{/* Profile Header Card */}
			<div className="card shadow-sm border-0 mb-4 p-4 rounded-3 bg-gradient bg-primary text-white">
				<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
					<div className="d-flex align-items-center gap-3">
						<div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-2 shadow" style={{ width: '75px', height: '75px' }}>
							{user?.name ? user.name.charAt(0) : 'S'}
						</div>
						<div>
							<h2 className="fw-bold mb-1">{user ? user.name : 'Student Developer'}</h2>
							<p className="mb-1 text-white-50 small">
								<i className="bi bi-geo-alt-fill me-1"></i>{profile.location || 'Dhaka, Bangladesh'} • {profile.department || 'Computer Science & Engineering'}
							</p>
							<small className="badge bg-white text-primary fs-6">
								<i className="bi bi-building me-1"></i>{profile.university || 'BRAC University'}
							</small>
						</div>
					</div>

					<div className="d-flex gap-2">
						<button className="btn btn-outline-light fw-bold px-3 py-2 rounded-pill shadow-sm" onClick={() => setShowPreviewModal(true)}>
							<i className="bi bi-eye-fill me-1"></i>Preview Profile
						</button>
						<button className="btn btn-light text-primary fw-bold px-3 py-2 rounded-pill shadow-sm" onClick={() => openEditor('basic')}>
							<i className="bi bi-pencil-square me-1"></i>Edit Profile
						</button>
					</div>
				</div>

				{/* Last Update Tracking Bar */}
				<div className="mt-3 pt-3 border-top border-white-50 d-flex justify-content-between align-items-center text-white-50 small">
					<span>
						<i className="bi bi-clock-history me-1"></i>Last Updated: {profile.lastUpdated ? new Date(profile.lastUpdated).toLocaleDateString() : 'Recently'}
					</span>
					<span>
						<i className="bi bi-tag-fill me-1"></i>Last modified: {profile.lastModifiedSection || 'Basic Info'}
					</span>
				</div>
			</div>

			{/* FR-2 & Expanded: Profile Completion Score Bar (100% Weighted + Missing Suggestions) */}
			<ProfileCompletionBar
				completionScore={profile.completionPercentage !== undefined ? profile.completionPercentage : 25}
				breakdown={profile.breakdown || []}
				suggestions={profile.suggestions || []}
				onSelectSection={openEditor}
			/>

			{/* Bio & About Me Card (Clickable to Edit) */}
			<div
				className="card shadow-sm border-0 p-4 rounded-3 mb-4 bg-white hover-shadow transition-all"
				style={{ cursor: 'pointer' }}
				onClick={() => openEditor('basic')}
			>
				<div className="d-flex justify-content-between align-items-center mb-2">
					<h5 className="fw-bold mb-0 text-dark">
						<i className="bi bi-card-text me-2 text-primary"></i>About Me / Bio
					</h5>
					<div className="d-flex align-items-center gap-2">
						<span className="badge bg-light text-secondary border">Visibility: {visibility.basic || 'Public'}</span>
						<i className="bi bi-pencil-square text-primary fs-5 ms-1" title="Click to edit"></i>
					</div>
				</div>
				<p className="text-secondary mb-0">
					{profile.bio || profile.description || (
						<span className="text-primary italic">
							<i className="bi bi-plus-circle me-1"></i>No bio added yet. Click anywhere in this card to add your bio!
						</span>
					)}
				</p>
			</div>

			{/* Categorized Skills & Career Interests */}
			<div className="row g-4 mb-4">
				{/* Skills Management (Clickable to Edit) */}
				<div className="col-md-6">
					<div
						className="card shadow-sm border-0 p-4 rounded-3 h-100 bg-white hover-shadow transition-all"
						style={{ cursor: 'pointer' }}
						onClick={() => openEditor('skills')}
					>
						<div className="d-flex justify-content-between align-items-center mb-3">
							<h5 className="fw-bold mb-0 text-dark">
								<i className="bi bi-tools me-2 text-primary"></i>Skills Management
							</h5>
							<i className="bi bi-pencil-square text-primary fs-5" title="Click to edit skills"></i>
						</div>

						{profile.skills && profile.skills.length > 0 ? (
							<div className="d-flex flex-wrap gap-2">
								{profile.skills.map((sk, idx) => {
									const isObj = typeof sk === 'object'
									return (
										<span key={idx} className="badge bg-primary fs-6 px-3 py-2 rounded-pill shadow-sm">
											{isObj ? `${sk.name} (${sk.category})` : sk}
										</span>
									)
								})}
							</div>
						) : (
							<div className="text-primary small py-2">
								<i className="bi bi-plus-circle me-1"></i>No skills added yet. Click here to add programming, framework, or soft skills!
							</div>
						)}
					</div>
				</div>

				{/* Career Interests (Clickable to Edit) */}
				<div className="col-md-6">
					<div
						className="card shadow-sm border-0 p-4 rounded-3 h-100 bg-white hover-shadow transition-all"
						style={{ cursor: 'pointer' }}
						onClick={() => openEditor('certs')}
					>
						<div className="d-flex justify-content-between align-items-center mb-3">
							<h5 className="fw-bold mb-0 text-dark">
								<i className="bi bi-compass-fill me-2 text-primary"></i>Career Interests
							</h5>
							<i className="bi bi-pencil-square text-primary fs-5" title="Click to edit career interests"></i>
						</div>

						{profile.careerInterests && (profile.careerInterests.jobRoles?.length > 0 || profile.careerInterests.industries?.length > 0) ? (
							<div>
								{profile.careerInterests.jobRoles && profile.careerInterests.jobRoles.length > 0 && (
									<div className="mb-2">
										<small className="text-muted fw-bold d-block mb-1">Target Roles:</small>
										<div className="d-flex flex-wrap gap-1">
											{profile.careerInterests.jobRoles.map((role, idx) => (
												<span key={idx} className="badge bg-info text-dark fs-6 px-2 py-1">{role}</span>
											))}
										</div>
									</div>
								)}
								{profile.careerInterests.industries && profile.careerInterests.industries.length > 0 && (
									<div>
										<small className="text-muted fw-bold d-block mb-1">Target Industries:</small>
										<div className="d-flex flex-wrap gap-1">
											{profile.careerInterests.industries.map((ind, idx) => (
												<span key={idx} className="badge bg-secondary fs-6 px-2 py-1">{ind}</span>
											))}
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="text-primary small py-2">
								<i className="bi bi-plus-circle me-1"></i>No career interests specified yet. Click here to select target job roles & industries!
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Education & Experience Section */}
			<div className="row g-4 mb-4">
				{/* Education History (Clickable to Edit) */}
				<div className="col-md-6">
					<div
						className="card shadow-sm border-0 p-4 rounded-3 h-100 bg-white hover-shadow transition-all"
						style={{ cursor: 'pointer' }}
						onClick={() => openEditor('education')}
					>
						<div className="d-flex justify-content-between align-items-center mb-3">
							<h5 className="fw-bold mb-0 text-dark">
								<i className="bi bi-mortarboard-fill me-2 text-primary"></i>Education History
							</h5>
							<div className="d-flex align-items-center gap-2">
								<span className="badge bg-light text-secondary border">Visibility: {visibility.education || 'Public'}</span>
								<i className="bi bi-pencil-square text-primary fs-5" title="Click to edit education"></i>
							</div>
						</div>

						{profile.education && profile.education.length > 0 ? (
							<div className="d-flex flex-column gap-3">
								{profile.education.map((edu, idx) => (
									<div key={idx} className="border-start border-3 border-primary ps-3">
										<strong className="d-block fs-6">{edu.degree} {edu.major ? `in ${edu.major}` : ''}</strong>
										<span className="text-secondary small">{edu.university || edu.institution}</span>
										{edu.cgpa && <div className="small text-success fw-semibold">CGPA: {edu.cgpa}</div>}
									</div>
								))}
							</div>
						) : (
							<div className="text-primary small py-2">
								<i className="bi bi-plus-circle me-1"></i>No education records added. Click here to add your degree & university!
							</div>
						)}
					</div>
				</div>

				{/* Experience Section (Clickable to Edit) */}
				<div className="col-md-6">
					<div
						className="card shadow-sm border-0 p-4 rounded-3 h-100 bg-white hover-shadow transition-all"
						style={{ cursor: 'pointer' }}
						onClick={() => openEditor('experience')}
					>
						<div className="d-flex justify-content-between align-items-center mb-3">
							<h5 className="fw-bold mb-0 text-dark">
								<i className="bi bi-briefcase-fill me-2 text-primary"></i>Experience (Jobs & Volunteer)
							</h5>
							<div className="d-flex align-items-center gap-2">
								<span className="badge bg-light text-secondary border">Visibility: {visibility.experience || 'Public'}</span>
								<i className="bi bi-pencil-square text-primary fs-5" title="Click to edit experience"></i>
							</div>
						</div>

						{profile.experience && profile.experience.length > 0 ? (
							<div className="d-flex flex-column gap-3">
								{profile.experience.map((exp, idx) => (
									<div key={idx} className="bg-light p-3 rounded-3 border">
										<div className="d-flex justify-content-between align-items-start mb-1">
											<strong className="text-dark">{exp.title}</strong>
											<span className="badge bg-info text-dark">{exp.type || 'Internship'}</span>
										</div>
										<span className="text-secondary small d-block mb-1">{exp.companyOrOrg || exp.company}</span>
										<p className="small text-muted mb-0">{exp.description}</p>
									</div>
								))}
							</div>
						) : (
							<div className="text-primary small py-2">
								<i className="bi bi-plus-circle me-1"></i>No internships or work experience added yet. Click here to add experience!
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Project Portfolio & Certifications */}
			<div className="row g-4 mb-4">
				{/* Project Portfolio Showcase (Clickable to Edit) */}
				<div className="col-md-8">
					<div
						className="card shadow-sm border-0 p-4 rounded-3 h-100 bg-white hover-shadow transition-all"
						style={{ cursor: 'pointer' }}
						onClick={() => openEditor('projects')}
					>
						<div className="d-flex justify-content-between align-items-center mb-3">
							<h5 className="fw-bold mb-0 text-dark">
								<i className="bi bi-folder-check me-2 text-primary"></i>Project Portfolio
							</h5>
							<div className="d-flex align-items-center gap-2">
								<span className="badge bg-light text-secondary border">Visibility: {visibility.projects || 'Public'}</span>
								<i className="bi bi-pencil-square text-primary fs-5" title="Click to edit projects"></i>
							</div>
						</div>

						{profile.projects && profile.projects.length > 0 ? (
							<div className="row g-3">
								{profile.projects.map((proj, idx) => (
									<div key={idx} className="col-md-6">
										<div className="bg-light p-3 rounded-3 border h-100">
											<div className="d-flex justify-content-between align-items-center mb-1">
												<strong className="text-dark">{proj.title}</strong>
												{proj.githubLink && (
													<a href={proj.githubLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-dark py-0 px-2" onClick={(e) => e.stopPropagation()}>
														<i className="bi bi-github me-1"></i>Code
													</a>
												)}
											</div>
											<p className="small text-secondary mb-2">{proj.description}</p>
											{proj.technologies && proj.technologies.length > 0 && (
												<div className="d-flex flex-wrap gap-1">
													{proj.technologies.map((tech, i) => (
														<span key={i} className="badge bg-secondary-subtle text-secondary small">{tech}</span>
													))}
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-primary small py-2">
								<i className="bi bi-plus-circle me-1"></i>No portfolio projects showcased yet. Click here to add your academic & personal projects (+20%)!
							</div>
						)}
					</div>
				</div>

				{/* Certifications (Clickable to Edit) */}
				<div className="col-md-4">
					<div
						className="card shadow-sm border-0 p-4 rounded-3 h-100 bg-white hover-shadow transition-all"
						style={{ cursor: 'pointer' }}
						onClick={() => openEditor('certs')}
					>
						<div className="d-flex justify-content-between align-items-center mb-3">
							<h5 className="fw-bold mb-0 text-dark">
								<i className="bi bi-patch-check-fill me-2 text-success"></i>Certifications
							</h5>
							<i className="bi bi-pencil-square text-primary fs-5" title="Click to edit certifications"></i>
						</div>

						{profile.certifications && profile.certifications.length > 0 ? (
							<ul className="list-group list-group-flush">
								{profile.certifications.map((ct, idx) => (
									<li key={idx} className="list-group-item bg-transparent px-0 py-2">
										<strong className="d-block text-dark small">{ct.name}</strong>
										<small className="text-muted">{ct.issuingOrganization}</small>
									</li>
								))}
							</ul>
						) : (
							<div className="text-primary small py-2">
								<i className="bi bi-plus-circle me-1"></i>No certifications added yet. Click here to add credentials!
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Profile Editor Modal Component */}
			<ProfileEditorModal
				show={showEditModal}
				onHide={() => setShowEditModal(false)}
				profile={profile}
				initialTab={initialTab}
				onProfileUpdated={handleProfileUpdated}
			/>

			{/* Profile Preview Modal Component */}
			<ProfilePreviewModal
				show={showPreviewModal}
				onHide={() => setShowPreviewModal(false)}
				user={user}
				profile={profile}
			/>
		</div>
	)
}

export default ProfilePage
