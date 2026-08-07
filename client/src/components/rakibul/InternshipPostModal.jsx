import React, { useState } from 'react'
import axios from '../../api/axios'

const InternshipPostModal = ({ isOpen, onClose, onPostCreated, userToken }) => {
	const [company, setCompany] = useState('')
	const [title, setTitle] = useState('')
	const [location, setLocation] = useState('')
	const [workMode, setWorkMode] = useState('Onsite')
	const [salaryRange, setSalaryRange] = useState('')
	const [deadline, setDeadline] = useState('')
	const [requiredSkills, setRequiredSkills] = useState('')
	const [eligibilityCriteria, setEligibilityCriteria] = useState('')
	const [description, setDescription] = useState('')

	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState(null)

	if (!isOpen) return null

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError(null)
		if (!company.trim() || !title.trim() || !location.trim()) {
			setError('Company name, role title, and location are required fields.')
			return
		}

		setSubmitting(true)
		try {
			const res = await axios.post(
				'/internships',
				{
					company: company.trim(),
					title: title.trim(),
					location: location.trim(),
					workMode,
					salaryRange: salaryRange.trim() || 'Negotiable',
					deadline: deadline || undefined,
					requiredSkills,
					eligibilityCriteria: eligibilityCriteria.trim(),
					description: description.trim()
				},
				{
					headers: {
						Authorization: `Bearer ${userToken}`
					}
				}
			)

			// Reset form
			setCompany('')
			setTitle('')
			setLocation('')
			setWorkMode('Onsite')
			setSalaryRange('')
			setDeadline('')
			setRequiredSkills('')
			setEligibilityCriteria('')
			setDescription('')

			if (onPostCreated) {
				onPostCreated(res.data)
			}
			onClose()
		} catch (err) {
			console.error('Error creating internship:', err)
			setError(err.response?.data?.error || 'Failed to create internship post. Please try again.')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1" role="dialog">
			<div className="modal-dialog modal-lg modal-dialog-centered" role="document">
				<div className="modal-content shadow-lg border-0 rounded-4">
					<div className="modal-header bg-primary text-white rounded-top-4">
						<h5 className="modal-title fw-bold">
							<i className="bi bi-plus-circle me-2"></i>Post New Internship (Recruiter / Admin)
						</h5>
						<button
							type="button"
							className="btn-close btn-close-white"
							onClick={onClose}
							disabled={submitting}
						></button>
					</div>

					<form onSubmit={handleSubmit}>
						<div className="modal-body p-4">
							{error && (
								<div className="alert alert-danger py-2" role="alert">
									<i className="bi bi-exclamation-triangle-fill me-2"></i>
									{error}
								</div>
							)}

							<div className="row g-3">
								{/* Company Name */}
								<div className="col-md-6">
									<label className="form-label fw-semibold small text-secondary">Company Name *</label>
									<input
										type="text"
										className="form-control"
										placeholder="e.g. Google, Microsoft, Tech Corp"
										value={company}
										onChange={(e) => setCompany(e.target.value)}
										required
									/>
								</div>

								{/* Role / Title */}
								<div className="col-md-6">
									<label className="form-label fw-semibold small text-secondary">Role / Position Title *</label>
									<input
										type="text"
										className="form-control"
										placeholder="e.g. Full-Stack Developer Intern"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										required
									/>
								</div>

								{/* Location */}
								<div className="col-md-6">
									<label className="form-label fw-semibold small text-secondary">Location *</label>
									<input
										type="text"
										className="form-control"
										placeholder="e.g. Dhaka, Remote, New York"
										value={location}
										onChange={(e) => setLocation(e.target.value)}
										required
									/>
								</div>

								{/* Work Mode */}
								<div className="col-md-6">
									<label className="form-label fw-semibold small text-secondary">Work Mode</label>
									<select
										className="form-select"
										value={workMode}
										onChange={(e) => setWorkMode(e.target.value)}
									>
										<option value="Onsite">Onsite</option>
										<option value="Remote">Remote</option>
										<option value="Hybrid">Hybrid</option>
									</select>
								</div>

								{/* Salary Range */}
								<div className="col-md-6">
									<label className="form-label fw-semibold small text-secondary">Salary Range</label>
									<input
										type="text"
										className="form-control"
										placeholder="e.g. $800 - $1,200 / month, 25,000 BDT"
										value={salaryRange}
										onChange={(e) => setSalaryRange(e.target.value)}
									/>
								</div>

								{/* Application Deadline */}
								<div className="col-md-6">
									<label className="form-label fw-semibold small text-secondary">Application Deadline</label>
									<input
										type="date"
										className="form-control"
										value={deadline}
										onChange={(e) => setDeadline(e.target.value)}
									/>
								</div>

								{/* Required Skills */}
								<div className="col-12">
									<label className="form-label fw-semibold small text-secondary">Required Skills</label>
									<input
										type="text"
										className="form-control"
										placeholder="e.g. React, Node.js, MongoDB, Python (separated by comma)"
										value={requiredSkills}
										onChange={(e) => setRequiredSkills(e.target.value)}
									/>
								</div>

								{/* Eligibility Criteria */}
								<div className="col-12">
									<label className="form-label fw-semibold small text-secondary">Eligibility Criteria</label>
									<textarea
										className="form-control"
										rows="2"
										placeholder="e.g. Minimum CGPA 3.0, Final year CSE/EEE majors, strong problem-solving skills."
										value={eligibilityCriteria}
										onChange={(e) => setEligibilityCriteria(e.target.value)}
									></textarea>
								</div>

								{/* Description */}
								<div className="col-12">
									<label className="form-label fw-semibold small text-secondary">Job Description</label>
									<textarea
										className="form-control"
										rows="3"
										placeholder="Detailed description of responsibilities, requirements, and perks..."
										value={description}
										onChange={(e) => setDescription(e.target.value)}
									></textarea>
								</div>
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
							<button type="submit" className="btn btn-primary px-4" disabled={submitting}>
								{submitting ? (
									<>
										<span className="spinner-border spinner-border-sm me-2" role="status"></span>
										Publishing...
									</>
								) : (
									<>
										<i className="bi bi-send-fill me-2"></i>Publish Internship
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

export default InternshipPostModal
