import React from 'react'

const ProfileCompletionBar = ({ completionScore = 0, missingFields = [] }) => {
	const score = Math.min(Math.max(completionScore, 0), 100)

	let barColor = 'bg-danger'
	if (score >= 80) barColor = 'bg-success'
	else if (score >= 50) barColor = 'bg-warning'

	return (
		<div className="card shadow-sm border-0 mb-4 p-3 rounded-3">
			<div className="d-flex justify-content-between align-items-center mb-2">
				<h6 className="fw-bold mb-0 text-primary">
					<i className="bi bi-person-check-fill me-2"></i>Profile Completion Score
				</h6>
				<span className={`badge ${score >= 80 ? 'bg-success' : score >= 50 ? 'bg-warning text-dark' : 'bg-danger'} fs-6`}>
					{score}% Complete
				</span>
			</div>
			<div className="progress mb-3" style={{ height: '12px', borderRadius: '6px' }}>
				<div
					className={`progress-bar progress-bar-striped progress-bar-animated ${barColor}`}
					role="progressbar"
					style={{ width: `${score}%` }}
					aria-valuenow={score}
					aria-valuemin="0"
					aria-valuemax="100"
				></div>
			</div>
			{missingFields && missingFields.length > 0 ? (
				<div>
					<small className="text-muted fw-bold d-block mb-1">
						<i className="bi bi-info-circle me-1"></i>Complete missing sections to reach 100%:
					</small>
					<div className="d-flex flex-wrap gap-1">
						{missingFields.map((field, idx) => (
							<span key={idx} className="badge bg-light text-dark border">
								+ Add {field}
							</span>
						))}
					</div>
				</div>
			) : (
				<small className="text-success fw-bold">
					<i className="bi bi-check-circle-fill me-1"></i>Your profile is 100% complete and stands out to recruiters!
				</small>
			)}
		</div>
	)
}

export default ProfileCompletionBar
