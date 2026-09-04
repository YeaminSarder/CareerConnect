import { useState, useEffect, useRef } from 'react'
import { useCv } from '../../hooks/use-cv'
import { applyForInternship } from '../../api/application'
import { useCreateCv } from '../../hooks/use-cv'

const ApplyModal = ({ isOpen, onClose, internship, onApplicationSubmitted }) => {
	const [selectedCvId, setSelectedCvId] = useState('')
	const [loadingCvs, setLoadingCvs] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [creatingCv, setCreatingCv] = useState(false)
	const [error, setError] = useState(null)
    const { cv, error: cvError } = useCv()
	const { createCv, error: createError } = useCreateCv()
    const fileInputRef = useRef(null)

    if (cv?.length > 0 && !selectedCvId) {
		setSelectedCvId(cv[0]._id)
	}

    function handleFileSelected(event) {
        const file = event.target.files?.[0]

        if (!file) return

        createCv(file).then((data) => {
			console.log('CV created successfully:', data)
			setSelectedCvId(data.data._id)
		}).catch((err) => {
			console.error('Error creating CV:', err)
			setError(err.response?.data?.error || 'Failed to create CV.')
		}).finally(() => {
			setCreatingCv(false)
		})

        // Allow selecting the same file again later
        event.target.value = ''
    }
	const handleCreateQuickCv = async () => {
		setCreatingCv(true)
		setError(null)
		fileInputRef.current?.click()
	}

	const handleSubmitApplication = async (e) => {
		e.preventDefault()
		if (!selectedCvId) {
			setError('Please select or create a CV version before submitting.')
			return
		}

		setSubmitting(true)
		setError(null)
		try {
			const res = await applyForInternship(internship._id, selectedCvId)
			if (onApplicationSubmitted) {
				onApplicationSubmitted(res.data)
			}
			onClose()
		} catch (err) {
			console.error('Error applying for internship:', err)
			setError(err.response?.data?.error || 'Failed to submit application.')
		} finally {
			setSubmitting(false)
		}
	}

	if (!isOpen || !internship) return null

	return (
		<div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" role="dialog">
			<input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileSelected}
            />
			<div className="modal-dialog modal-dialog-centered" role="document">
				<div className="modal-content shadow-lg border-0 rounded-4">
					<div className="modal-header bg-primary text-white rounded-top-4">
						<h5 className="modal-title fw-bold">
							<i className="bi bi-send-check-fill me-2"></i>1-Click Internship Application
						</h5>
						<button
							type="button"
							className="btn-close btn-close-white"
							onClick={onClose}
							disabled={submitting}
						></button>
					</div>

					<form onSubmit={handleSubmitApplication}>
						<div className="modal-body p-4">
							{error && (
								<div className="alert alert-danger py-2 small" role="alert">
									<i className="bi bi-exclamation-triangle-fill me-2"></i>
									{error}
								</div>
							)}

							{/* Job Info Banner */}
							<div className="bg-light p-3 rounded-3 mb-3 border border-primary-subtle">
								<h6 className="fw-bold text-dark mb-1">{internship.title}</h6>
								<p className="text-primary mb-1 small fw-semibold">
									<i className="bi bi-building me-1"></i>{internship.company}
								</p>
								<div className="d-flex gap-3 small text-muted">
									<span><i className="bi bi-geo-alt me-1"></i>{internship.location}</span>
									<span><i className="bi bi-laptop me-1"></i>{internship.workMode}</span>
								</div>
							</div>

							{/* Select CV Version */}
							<div className="mb-3">
								<label className="form-label fw-bold small text-secondary">
									Select Your CV Version *
								</label>

								{loadingCvs ? (
									<div className="py-2 text-center text-muted">
										<div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
										Loading your saved CV versions...
									</div>
								) : cv.length > 0 ? (
									<select
										className="form-select"
										value={selectedCvId}
										onChange={(e) => setSelectedCvId(e.target.value)}
										required
									>
										{cv.map((cvItem) => (
											<option key={cvItem._id} value={cvItem._id}>
												{cvItem.title || 'Untitled CV'} (ID: {cvItem._id.slice(-6)}) {cvItem.isPrimary ? '- Primary' : ''}
											</option>
										))}
									</select>
								) : (
									<div className="alert alert-warning p-3 mb-0 text-center rounded-3">
										<i className="bi bi-file-earmark-text text-warning fs-3 mb-2 d-block"></i>
										<h6 className="fw-bold mb-1">No CV versions found</h6>
										<p className="small text-muted mb-2">
											You need at least one CV version stored in your profile to submit applications.
										</p>
										<button
											type="button"
											className="btn btn-sm btn-outline-primary"
											onClick={handleCreateQuickCv}
											disabled={creatingCv}
										>
											{creatingCv ? (
												<>
													<span className="spinner-border spinner-border-sm me-1" role="status"></span>
													Creating...
												</>
											) : (
												<>
													<i className="bi bi-plus-lg me-1"></i>Create Default CV Now
												</>
											)}
										</button>
									</div>
								)}
							</div>
						</div>

						<div className="modal-footer bg-light rounded-bottom-4">
							<button
								type="button"
								className="btn btn-outline-secondary"
								onClick={onClose}
								disabled={submitting}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-primary px-4 fw-bold"
								disabled={submitting || cv.length === 0}
							>
								{submitting ? (
									<>
										<span className="spinner-border spinner-border-sm me-2" role="status"></span>
										Submitting Application...
									</>
								) : (
									<>
										<i className="bi bi-rocket-takeoff-fill me-2"></i>Confirm 1-Click Apply
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default ApplyModal
