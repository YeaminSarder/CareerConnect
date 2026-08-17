import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const ProfilePreviewModal = ({ show, onHide, user, profile }) => {
	if (!profile) return null

	return (
		<Modal show={show} onHide={onHide} size="lg" centered>
			<Modal.Header closeButton className="bg-dark text-white">
				<Modal.Title className="fw-bold fs-5">
					<i className="bi bi-eye-fill me-2 text-info"></i>Public Profile Preview (Recruiter & Student View)
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
				{/* Public Header Card */}
				<div className="card shadow-sm border-0 mb-4 p-4 rounded-3 bg-gradient bg-primary text-white">
					<div className="d-flex align-items-center gap-3">
						<div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-2 shadow" style={{ width: '64px', height: '64px' }}>
							{user?.name ? user.name.charAt(0) : 'S'}
						</div>
						<div>
							<h3 className="fw-bold mb-1">{user?.name || 'Student Developer'}</h3>
							<p className="mb-1 text-white-50 small">
								<i className="bi bi-geo-alt-fill me-1"></i>{profile.location || 'Dhaka, Bangladesh'} • {profile.department || 'Computer Science & Engineering'}
							</p>
							<small className="badge bg-white text-primary">
								<i className="bi bi-building me-1"></i>{profile.university || 'BRAC University'}
							</small>
						</div>
					</div>
				</div>

				{/* Bio Section */}
				<div className="mb-4">
					<h6 className="fw-bold text-dark border-bottom pb-1 mb-2">About</h6>
					<p className="text-secondary small mb-0">{profile.bio || profile.description || 'No bio provided.'}</p>
				</div>

				{/* Skills */}
				{profile.skills && profile.skills.length > 0 && (
					<div className="mb-4">
						<h6 className="fw-bold text-dark border-bottom pb-1 mb-2">Technical & Core Skills</h6>
						<div className="d-flex flex-wrap gap-2">
							{profile.skills.map((s, i) => (
								<span key={i} className="badge bg-primary fs-6 px-3 py-2 rounded-pill">
									{typeof s === 'object' ? `${s.name} (${s.category})` : s}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Education */}
				{profile.education && profile.education.length > 0 && (
					<div className="mb-4">
						<h6 className="fw-bold text-dark border-bottom pb-1 mb-2">Education</h6>
						<div className="d-flex flex-column gap-2">
							{profile.education.map((edu, i) => (
								<div key={i} className="border-start border-3 border-primary ps-3">
									<strong className="d-block text-dark">{edu.degree} {edu.major ? `in ${edu.major}` : ''}</strong>
									<span className="text-secondary small">{edu.university || edu.institution}</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Projects */}
				{profile.projects && profile.projects.length > 0 && (
					<div className="mb-4">
						<h6 className="fw-bold text-dark border-bottom pb-1 mb-2">Project Portfolio</h6>
						<div className="row g-2">
							{profile.projects.map((proj, i) => (
								<div key={i} className="col-md-6">
									<div className="border p-3 rounded-3 bg-light h-100">
										<strong className="d-block text-primary">{proj.title}</strong>
										<p className="small text-muted mb-2">{proj.description}</p>
										{proj.githubLink && (
											<a href={proj.githubLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-dark py-0 px-2">
												<i className="bi bi-github me-1"></i>GitHub Code
											</a>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Certifications */}
				{profile.certifications && profile.certifications.length > 0 && (
					<div className="mb-4">
						<h6 className="fw-bold text-dark border-bottom pb-1 mb-2">Certifications & Credentials</h6>
						<ul className="list-group list-group-flush">
							{profile.certifications.map((ct, i) => (
								<li key={i} className="list-group-item bg-transparent px-0 py-1">
									<i className="bi bi-patch-check-fill text-success me-2"></i>
									<strong>{ct.name}</strong> — {ct.issuingOrganization}
								</li>
							))}
						</ul>
					</div>
				)}
			</Modal.Body>
			<Modal.Footer className="bg-light">
				<Button variant="secondary" onClick={onHide}>Close Preview</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default ProfilePreviewModal
