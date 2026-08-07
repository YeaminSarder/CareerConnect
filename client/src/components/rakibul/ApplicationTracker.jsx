import React from 'react'

const ApplicationTracker = ({ applications, loading, onWithdraw }) => {
	const getStatusBadge = (status) => {
		switch (status) {
			case 'Applied':
				return <span className="badge bg-primary"><i className="bi bi-clock-history me-1"></i>Applied</span>
			case 'Under Review':
				return <span className="badge bg-warning text-dark"><i className="bi bi-eye-fill me-1"></i>Under Review</span>
			case 'Interviewing':
				return <span className="badge bg-info text-dark"><i className="bi bi-person-video me-1"></i>Interviewing</span>
			case 'Accepted':
				return <span className="badge bg-success"><i className="bi bi-check-circle-fill me-1"></i>Accepted</span>
			case 'Rejected':
				return <span className="badge bg-danger"><i className="bi bi-x-circle-fill me-1"></i>Rejected</span>
			default:
				return <span className="badge bg-secondary">{status}</span>
		}
	}

	if (loading) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading applications...</span>
				</div>
				<p className="text-muted small mt-2">Loading your application tracker...</p>
			</div>
		)
	}

	if (!applications || applications.length === 0) {
		return (
			<div className="text-center py-5 bg-light rounded-4 border">
				<i className="bi bi-journal-x text-muted fs-1 mb-2 d-block"></i>
				<h5 className="fw-bold text-dark">No Submitted Applications</h5>
				<p className="text-muted small mb-0">
					You haven't applied for any internships yet. Explore listings above and submit with 1-click apply!
				</p>
			</div>
		)
	}

	return (
		<div className="card shadow-sm border-0 rounded-4 p-4 bg-light">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<div>
					<h5 className="fw-bold text-primary mb-1">
						<i className="bi bi-kanban-fill me-2"></i>Personal Application Tracker
					</h5>
					<p className="text-muted small mb-0">
						Track your submitted internship applications and selected CV versions in real-time.
					</p>
				</div>
				<span className="badge bg-primary-subtle text-primary border px-3 py-2 fs-6 rounded-pill">
					Total Applications: {applications.length}
				</span>
			</div>

			<div className="table-responsive bg-white rounded-3 border">
				<table className="table table-hover align-middle mb-0">
					<thead className="table-light">
						<tr>
							<th scope="col" className="py-3 ps-3">Internship & Company</th>
							<th scope="col" className="py-3">Attached CV Version</th>
							<th scope="col" className="py-3">Applied Date</th>
							<th scope="col" className="py-3">Status</th>
							<th scope="col" className="py-3 text-end pe-3">Action</th>
						</tr>
					</thead>
					<tbody>
						{applications.map((app) => (
							<tr key={app._id}>
								<td className="ps-3 py-3">
									<div className="fw-bold text-dark">{app.internship?.title || 'Unknown Internship'}</div>
									<div className="text-primary small fw-semibold">
										<i className="bi bi-building me-1"></i>{app.internship?.company || 'Company'}
									</div>
									<small className="text-muted">
										<i className="bi bi-geo-alt me-1"></i>{app.internship?.location || 'N/A'} ({app.internship?.workMode || 'N/A'})
									</small>
								</td>
								<td className="py-3">
									<span className="badge bg-light text-dark border p-2">
										<i className="bi bi-file-earmark-person-fill text-primary me-1"></i>
										{app.cv?.title || 'Selected CV'}
									</span>
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
									<button
										className="btn btn-sm btn-outline-danger"
										onClick={() => onWithdraw(app._id)}
										title="Withdraw Application"
									>
										<i className="bi bi-trash me-1"></i>Withdraw
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default ApplicationTracker
