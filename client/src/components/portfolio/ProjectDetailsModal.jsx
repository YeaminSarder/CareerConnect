import React from 'react'

const ProjectDetailsModal = ({ project, onClose }) => {
	if (!project) return null

	const { title, description, projectType, githubLink, liveLink, toolsUsed, imageUrl, featured } = project

	return (
		<div
			className="modal fade show d-block"
			tabIndex="-1"
			style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}
		>
			<div className="modal-dialog modal-lg modal-dialog-centered">
				<div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
					<div className="modal-header bg-dark text-white py-3 px-4">
						<div className="d-flex align-items-center gap-2">
							<span className="badge bg-primary rounded-pill px-3 py-1">
								{projectType || 'Academic Project'}
							</span>
							{featured && <span className="badge bg-warning text-dark rounded-pill px-2 py-1">⭐ Featured</span>}
						</div>
						<button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
					</div>

					<div className="modal-body p-0">
						{imageUrl && (
							<div className="bg-dark text-center" style={{ maxHeight: '350px', overflow: 'hidden' }}>
								<img
									src={imageUrl}
									alt={title}
									className="img-fluid w-100 object-fit-contain"
									style={{ maxHeight: '350px' }}
								/>
							</div>
						)}

						<div className="p-4">
							<h3 className="fw-bold text-dark mb-3">{title}</h3>

							<div className="mb-4">
								<h6 className="fw-bold text-uppercase text-muted small">
									<i className="bi bi-file-earmark-text me-1"></i>Description & Abstract
								</h6>
								<p className="text-secondary leading-relaxed fs-6">
									{description || 'No detailed description provided for this portfolio project.'}
								</p>
							</div>

							{toolsUsed && toolsUsed.length > 0 && (
								<div className="mb-4">
									<h6 className="fw-bold text-uppercase text-muted small">
										<i className="bi bi-tools me-1"></i>Technologies & Frameworks
									</h6>
									<div className="d-flex flex-wrap gap-2">
										{toolsUsed.map((tool, idx) => (
											<span key={idx} className="badge bg-light text-dark border px-3 py-2 fs-6 rounded-3">
												<i className="bi bi-code-square me-1 text-primary"></i>{tool}
											</span>
										))}
									</div>
								</div>
							)}

							<div className="d-flex flex-wrap gap-3 pt-3 border-top">
								{githubLink && (
									<a
										href={githubLink}
										target="_blank"
										rel="noreferrer"
										className="btn btn-dark rounded-pill px-4 fw-semibold"
									>
										<i className="bi bi-github me-2"></i>Open GitHub Repository
									</a>
								)}
								{liveLink && (
									<a
										href={liveLink}
										target="_blank"
										rel="noreferrer"
										className="btn btn-primary rounded-pill px-4 fw-semibold"
									>
										<i className="bi bi-box-arrow-up-right me-2"></i>Visit Live Demo / Publication
									</a>
								)}
							</div>
						</div>
					</div>

					<div className="modal-footer bg-light px-4 py-3">
						<button type="button" className="btn btn-secondary px-4 rounded-pill" onClick={onClose}>
							Close Preview
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProjectDetailsModal
