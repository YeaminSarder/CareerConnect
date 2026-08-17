import React from 'react'

const getCategoryBadgeColor = (category) => {
	switch (category) {
		case 'Thesis Work':
			return 'bg-purple text-white'
		case 'Academic Project':
			return 'bg-primary text-white'
		case 'Capstone Project':
			return 'bg-dark text-white'
		case 'Personal Project':
			return 'bg-success text-white'
		default:
			return 'bg-secondary text-white'
	}
}

const ProjectCard = ({ project, isOwner, onEdit, onDelete, onViewDetails }) => {
	const { title, description, projectType, githubLink, liveLink, toolsUsed, imageUrl, featured } = project

	const categoryClass = getCategoryBadgeColor(projectType || 'Academic Project')

	return (
		<div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden position-relative hover-shadow transition-all">
			{/* Project Image Preview or Fallback Header */}
			<div
				className="ratio ratio-16x9 bg-secondary-subtle overflow-hidden border-bottom"
				style={{ maxHeight: '180px' }}
			>
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={title}
						className="object-fit-cover w-100 h-100"
						onError={(e) => {
							e.target.style.display = 'none'
						}}
					/>
				) : (
					<div className="d-flex align-items-center justify-content-center bg-gradient bg-dark text-white p-3">
						<i className="bi bi-code-slash fs-1 opacity-50"></i>
					</div>
				)}
			</div>

			{/* Badges Overlays */}
			<div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-1">
				<span className={`badge ${categoryClass} rounded-pill shadow-sm px-3 py-2 fw-semibold`}>
					<i className={`bi ${projectType === 'Thesis Work' ? 'bi-journal-bookmark-fill' : 'bi-award-fill'} me-1`}></i>
					{projectType || 'Academic Project'}
				</span>
			</div>

			{featured && (
				<div className="position-absolute top-0 end-0 m-3">
					<span className="badge bg-warning text-dark rounded-pill shadow-sm px-2 py-1 fw-bold">
						⭐ Featured
					</span>
				</div>
			)}

			<div className="card-body p-4 d-flex flex-column">
				<h5 className="fw-bold text-dark mb-2 text-truncate-2" title={title}>
					{title}
				</h5>

				<p className="text-muted small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
					{description || 'No description provided for this portfolio project.'}
				</p>

				{/* Tech Stack Pills */}
				{toolsUsed && toolsUsed.length > 0 && (
					<div className="d-flex flex-wrap gap-1 mb-3">
						{toolsUsed.map((tool, idx) => (
							<span key={idx} className="badge bg-light text-primary border border-primary-subtle rounded-2">
								{tool}
							</span>
						))}
					</div>
				)}

				{/* Action Buttons */}
				<div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
					<div className="d-flex gap-2">
						{githubLink && (
							<a
								href={githubLink}
								target="_blank"
								rel="noreferrer"
								className="btn btn-sm btn-outline-dark rounded-pill px-3"
								title="View GitHub Repository"
							>
								<i className="bi bi-github me-1"></i>Code
							</a>
						)}
						{liveLink && (
							<a
								href={liveLink}
								target="_blank"
								rel="noreferrer"
								className="btn btn-sm btn-outline-primary rounded-pill px-3"
								title="View Live Demo or Publication"
							>
								<i className="bi bi-box-arrow-up-right me-1"></i>Demo
							</a>
						)}
						<button
							type="button"
							className="btn btn-sm btn-light text-secondary rounded-pill px-3"
							onClick={() => onViewDetails(project)}
						>
							Details
						</button>
					</div>

					{isOwner && (
						<div className="d-flex gap-1">
							<button
								type="button"
								className="btn btn-sm btn-outline-secondary rounded-circle"
								onClick={() => onEdit(project)}
								title="Edit Project"
								style={{ width: '32px', height: '32px', padding: 0 }}
							>
								<i className="bi bi-pencil-fill small"></i>
							</button>
							<button
								type="button"
								className="btn btn-sm btn-outline-danger rounded-circle"
								onClick={() => onDelete(project._id)}
								title="Delete Project"
								style={{ width: '32px', height: '32px', padding: 0 }}
							>
								<i className="bi bi-trash-fill small"></i>
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProjectCard
