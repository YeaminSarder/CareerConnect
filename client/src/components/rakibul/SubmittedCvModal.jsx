import React, { useState, useEffect } from 'react'
import { getSubmittedCvDetail } from '../../api/application'

const SubmittedCvModal = ({ isOpen, onClose, cvId, candidateName, applicationDate }) => {
	const [cvDetail, setCvDetail] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const effectiveCvId = typeof cvId === 'object' && cvId !== null ? cvId._id : cvId

	useEffect(() => {
		if (isOpen && effectiveCvId) {
			fetchCvDetail()
		}
	}, [isOpen, effectiveCvId])

	const fetchCvDetail = async () => {
		if (!effectiveCvId) {
			setError('No valid CV ID associated with this application.')
			return
		}
		setLoading(true)
		setError(null)
		try {
			const res = await getSubmittedCvDetail(effectiveCvId)
			setCvDetail(res.data)
		} catch (err) {
			console.error('Error fetching CV details:', err)
			setError('Could not fetch CV details.')
		} finally {
			setLoading(false)
		}
	}

	if (!isOpen) return null

	const studentUser = cvDetail?.user
	const profile = studentUser?.profile

	return (
		<div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" role="dialog">
			<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
				<div className="modal-content shadow-lg border-0 rounded-4">
					<div className="modal-header bg-dark text-white rounded-top-4">
						<h5 className="modal-title fw-bold">
							<i className="bi bi-file-earmark-person-fill me-2 text-primary"></i>
							Candidate CV Review: {candidateName || studentUser?.name || 'Applicant'}
						</h5>
						<button
							type="button"
							className="btn-close btn-close-white"
							onClick={onClose}
						></button>
					</div>

					<div className="modal-body p-4">
						{loading ? (
							<div className="text-center py-5">
								<div className="spinner-border text-primary" role="status">
									<span className="visually-hidden">Loading CV details...</span>
								</div>
								<p className="text-muted small mt-2">Fetching submitted candidate CV...</p>
							</div>
						) : error ? (
							<div className="alert alert-danger py-3" role="alert">
								<i className="bi bi-exclamation-triangle-fill me-2"></i>
								{error}
							</div>
						) : cvDetail ? (
							<div className="d-flex flex-column gap-3">
								{/* Header Card */}
								<div className="bg-light p-3 rounded-3 border d-flex justify-content-between align-items-center">
									<div>
										<h5 className="fw-bold mb-1 text-primary">
											{cvDetail.title || 'Submitted CV Version'}
										</h5>
										<div className="text-secondary small">
											<i className="bi bi-person-fill me-1"></i>
											<strong>{studentUser?.name || candidateName}</strong> ({studentUser?.email || 'N/A'})
										</div>
									</div>
									{applicationDate && (
										<span className="badge bg-secondary-subtle text-secondary border px-3 py-2">
											Applied: {new Date(applicationDate).toLocaleDateString()}
										</span>
									)}
								</div>

								{/* Candidate Profile Summary */}
								{profile && (
									<div className="card border-0 bg-white p-3 shadow-sm rounded-3">
										<h6 className="fw-bold text-dark mb-2">
											<i className="bi bi-person-badge-fill me-2 text-primary"></i>
											Profile Summary
										</h6>

										{profile.department && (
											<p className="small text-muted mb-1">
												<strong>Department / Field:</strong> {profile.department}
											</p>
										)}

										{profile.description && (
											<p className="small text-secondary mb-2 bg-light p-2 rounded">
												{profile.description}
											</p>
										)}

										{/* Skills */}
										{profile.skills && profile.skills.length > 0 && (
											<div className="mb-2">
												<strong className="small text-secondary d-block mb-1">Declared Skills:</strong>
												<div className="d-flex flex-wrap gap-1">
													{profile.skills.map((s, i) => (
														<span key={i} className="badge bg-primary-subtle text-primary border">
															{s}
														</span>
													))}
												</div>
											</div>
										)}
									</div>
								)}

								{/* CV Version Details */}
								<div className="card border p-3 rounded-3 bg-white">
									<h6 className="fw-bold text-dark mb-2">
										<i className="bi bi-file-text-fill me-2 text-success"></i>
										Submitted Version Details
									</h6>
									<div className="row g-2 small text-muted">
										<div className="col-md-6">
											<strong>CV Version Title:</strong> {cvDetail.title}
										</div>
										<div className="col-md-6">
											<strong>CV Record ID:</strong> {cvDetail._id}
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="text-center py-4 text-muted">No CV information available.</div>
						)}
					</div>

					<div className="modal-footer bg-light rounded-bottom-4">
						<button type="button" className="btn btn-secondary px-4 fw-bold" onClick={onClose}>
							Close Preview
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SubmittedCvModal
