import React from 'react'

const ProfileCompletionBar = ({ completionScore = 0, breakdown = [], suggestions = [], onSelectSection }) => {
	const score = Math.min(Math.max(completionScore, 0), 100)

	let barColor = 'bg-danger'
	if (score >= 80) barColor = 'bg-success'
	else if (score >= 50) barColor = 'bg-warning'

	// Map section names to editor tab keys
	const getTabKey = (sectionName) => {
		if (sectionName.includes('Basic')) return 'basic'
		if (sectionName.includes('Education')) return 'education'
		if (sectionName.includes('Skills')) return 'skills'
		if (sectionName.includes('Experience')) return 'experience'
		if (sectionName.includes('Project')) return 'projects'
		if (sectionName.includes('Certifications')) return 'certs'
		if (sectionName.includes('Interests')) return 'certs'
		return 'basic'
	}

	// Default fallback suggestions if not provided
	const displaySuggestions = (suggestions && suggestions.length > 0)
		? suggestions
		: (score < 100 ? [
				'Add at least one project (+20%) to increase your profile completion score.',
				'Add your education history (degree, university) (+15%).',
				'Add your key technical or soft skills (+15%).',
				'Add work or volunteer experience (+15%).'
		  ] : [])

	// Default breakdown fallback if empty
	const displayBreakdown = (breakdown && breakdown.length > 0)
		? breakdown
		: [
				{ section: 'Basic Information', weight: 15, earned: score > 0 ? 15 : 0, complete: score > 0 },
				{ section: 'Education History', weight: 15, earned: 0, complete: false },
				{ section: 'Skills Management', weight: 15, earned: 0, complete: false },
				{ section: 'Experience', weight: 15, earned: 0, complete: false },
				{ section: 'Project Portfolio', weight: 20, earned: 0, complete: false },
				{ section: 'Certifications', weight: 10, earned: 0, complete: false },
				{ section: 'Career Interests', weight: 10, earned: 0, complete: false }
		  ]

	return (
		<div className="card shadow-sm border-0 mb-4 p-4 rounded-3 bg-white">
			<div className="d-flex justify-content-between align-items-center mb-2">
				<div>
					<h6 className="fw-bold mb-0 text-dark fs-5">
						<i className="bi bi-shield-check text-primary me-2"></i>Profile Completion Score
					</h6>
					<small className="text-muted">Calculated based on filled profile sections (Click any pill to edit)</small>
				</div>
				<span className={`badge ${score >= 80 ? 'bg-success' : score >= 50 ? 'bg-warning text-dark' : 'bg-danger'} fs-6 px-3 py-2 rounded-pill`}>
					{score}% Complete
				</span>
			</div>

			<div className="progress mb-3" style={{ height: '14px', borderRadius: '8px' }}>
				<div
					className={`progress-bar progress-bar-striped progress-bar-animated ${barColor}`}
					role="progressbar"
					style={{ width: `${score}%` }}
					aria-valuenow={score}
					aria-valuemin="0"
					aria-valuemax="100"
				></div>
			</div>

			{/* Section Score Breakdown Pills (Hover Green & Clickable) */}
			<div className="mb-3">
				<small className="text-muted fw-bold d-block mb-2">
					Completion Weight Breakdown (100% Total) — <span className="text-primary fs-7">Hover/Click to edit section:</span>
				</small>
				<div className="d-flex flex-wrap gap-2">
					{displayBreakdown.map((item, idx) => {
						const isComplete = item.complete || item.earned > 0
						return (
							<button
								key={idx}
								type="button"
								className={`btn btn-sm ${
									isComplete
										? 'btn-success text-white border-success'
										: 'btn-outline-success text-dark border-secondary-subtle hover-green'
								} rounded-pill px-3 py-1 d-flex align-items-center gap-1 shadow-xs`}
								style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
								onClick={() => onSelectSection && onSelectSection(getTabKey(item.section))}
								title={`Click to edit ${item.section}`}
							>
								<i className={`bi ${isComplete ? 'bi-check-circle-fill' : 'bi-plus-circle-dotted'}`}></i>
								<span className="fw-semibold">{item.section}</span>
								<small className={`badge ${isComplete ? 'bg-white text-success' : 'bg-secondary-subtle text-secondary'} rounded-pill ms-1`}>
									{item.earned || 0}/{item.weight}%
								</small>
							</button>
						)
					})}
				</div>
			</div>

			{/* Actionable Missing Information Suggestions */}
			{score < 100 ? (
				<div className="bg-light p-3 rounded-3 border-start border-4 border-warning">
					<strong className="text-warning-emphasis d-block mb-1 small">
						<i className="bi bi-lightbulb-fill me-1 text-warning"></i>Missing Information Suggestions:
					</strong>
					<ul className="mb-0 ps-3 small text-secondary">
						{displaySuggestions.map((sug, idx) => (
							<li key={idx} className="mb-1">{sug}</li>
						))}
					</ul>
				</div>
			) : (
				<div className="bg-success-subtle p-3 rounded-3 border-start border-4 border-success">
					<small className="text-success fw-bold">
						<i className="bi bi-check-circle-fill me-1"></i>Your profile is 100% complete! High profile completion attracts 3x more recruiters.
					</small>
				</div>
			)}
		</div>
	)
}

export default ProfileCompletionBar
