import React, { useState, useEffect } from 'react'

const IMAGE_PRESETS = [
	{ label: 'Web Platform', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop' },
	{ label: 'Thesis / AI', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop' },
	{ label: 'Mobile App', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop' },
	{ label: 'Cloud & System', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop' }
]

const ProjectModal = ({ isOpen, onClose, onSave, projectToEdit }) => {
	const [title, setTitle] = useState('')
	const [projectType, setProjectType] = useState('Academic Project')
	const [description, setDescription] = useState('')
	const [githubLink, setGithubLink] = useState('')
	const [liveLink, setLiveLink] = useState('')
	const [toolsUsedStr, setToolsUsedStr] = useState('')
	const [imageUrl, setImageUrl] = useState('')
	const [featured, setFeatured] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (projectToEdit) {
			setTitle(projectToEdit.title || '')
			setProjectType(projectToEdit.projectType || 'Academic Project')
			setDescription(projectToEdit.description || '')
			setGithubLink(projectToEdit.githubLink || '')
			setLiveLink(projectToEdit.liveLink || '')
			setToolsUsedStr(Array.isArray(projectToEdit.toolsUsed) ? projectToEdit.toolsUsed.join(', ') : '')
			setImageUrl(projectToEdit.imageUrl || '')
			setFeatured(Boolean(projectToEdit.featured))
		} else {
			setTitle('')
			setProjectType('Academic Project')
			setDescription('')
			setGithubLink('')
			setLiveLink('')
			setToolsUsedStr('')
			setImageUrl('')
			setFeatured(false)
		}
		setError(null)
	}, [projectToEdit, isOpen])

	if (!isOpen) return null

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!title.trim()) {
			setError('Project title is required.')
			return
		}

		const toolsArray = toolsUsedStr
			.split(',')
			.map((t) => t.trim())
			.filter((t) => t.length > 0)

		const payload = {
			title: title.trim(),
			projectType,
			description,
			githubLink,
			liveLink,
			toolsUsed: toolsArray,
			imageUrl,
			featured
		}

		setLoading(true)
		setError(null)
		try {
			await onSave(payload, projectToEdit?._id)
			onClose()
		} catch (err) {
			setError(err.response?.data?.error || err.message || 'Failed to save project.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			className="modal fade show d-block"
			tabIndex="-1"
			style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}
		>
			<div className="modal-dialog modal-lg modal-dialog-centered">
				<div className="modal-content border-0 shadow-lg rounded-4">
					<div className="modal-header bg-gradient bg-primary text-white rounded-top-4 px-4 py-3">
						<h5 className="modal-title fw-bold">
							<i className={`bi ${projectToEdit ? 'bi-pencil-square' : 'bi-folder-plus'} me-2`}></i>
							{projectToEdit ? 'Edit Portfolio Project / Thesis' : 'Add Academic Project or Thesis'}
						</h5>
						<button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
					</div>

					<form onSubmit={handleSubmit}>
						<div className="modal-body p-4">
							{error && <div className="alert alert-danger py-2">{error}</div>}

							<div className="row g-3">
								<div className="col-md-8">
									<label className="form-label fw-semibold">
										Project Title <span className="text-danger">*</span>
									</label>
									<input
										type="text"
										className="form-control"
										placeholder="e.g. Neural Code Inspection & Security Analysis"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										required
									/>
								</div>

								<div className="col-md-4">
									<label className="form-label fw-semibold">Project Category</label>
									<select
										className="form-select"
										value={projectType}
										onChange={(e) => setProjectType(e.target.value)}
									>
										<option value="Academic Project">Academic Project</option>
										<option value="Thesis Work">Thesis Work</option>
										<option value="Personal Project">Personal Project</option>
										<option value="Capstone Project">Capstone Project</option>
										<option value="Other">Other</option>
									</select>
								</div>

								<div className="col-12">
									<label className="form-label fw-semibold">Description / Abstract</label>
									<textarea
										className="form-control"
										rows="3"
										placeholder="Describe the problem, approach, key achievements, or research findings..."
										value={description}
										onChange={(e) => setDescription(e.target.value)}
									></textarea>
								</div>

								<div className="col-md-6">
									<label className="form-label fw-semibold">
										<i className="bi bi-github me-1"></i>GitHub Link
									</label>
									<input
										type="url"
										className="form-control"
										placeholder="https://github.com/username/repository"
										value={githubLink}
										onChange={(e) => setGithubLink(e.target.value)}
									/>
								</div>

								<div className="col-md-6">
									<label className="form-label fw-semibold">
										<i className="bi bi-link-45deg me-1"></i>Live Demo / Publication Link
									</label>
									<input
										type="url"
										className="form-control"
										placeholder="https://demo-app.com or https://doi.org/..."
										value={liveLink}
										onChange={(e) => setLiveLink(e.target.value)}
									/>
								</div>

								<div className="col-12">
									<label className="form-label fw-semibold">
										<i className="bi bi-tools me-1"></i>Tools & Technologies Used
									</label>
									<input
										type="text"
										className="form-control"
										placeholder="e.g. React, Node.js, Python, PyTorch, MongoDB (comma separated)"
										value={toolsUsedStr}
										onChange={(e) => setToolsUsedStr(e.target.value)}
									/>
									<small className="text-muted">Separate multiple tools with commas.</small>
								</div>

								<div className="col-12">
									<label className="form-label fw-semibold">
										<i className="bi bi-image me-1"></i>Project Image / Preview URL
									</label>
									<input
										type="url"
										className="form-control mb-2"
										placeholder="https://example.com/project-screenshot.jpg"
										value={imageUrl}
										onChange={(e) => setImageUrl(e.target.value)}
									/>
									<div className="d-flex align-items-center gap-2">
										<small className="text-muted fw-semibold">Presets:</small>
										{IMAGE_PRESETS.map((preset) => (
											<button
												key={preset.label}
												type="button"
												className="btn btn-xs btn-outline-secondary py-0 px-2"
												onClick={() => setImageUrl(preset.url)}
											>
												{preset.label}
											</button>
										))}
									</div>
								</div>

								<div className="col-12">
									<div className="form-check form-switch mt-2">
										<input
											className="form-check-input"
											type="checkbox"
											id="featuredSwitch"
											checked={featured}
											onChange={(e) => setFeatured(e.target.checked)}
										/>
										<label className="form-check-label fw-semibold" htmlFor="featuredSwitch">
											Highlight as Featured Showcase Item ⭐
										</label>
									</div>
								</div>
							</div>
						</div>

						<div className="modal-footer bg-light px-4 py-3 rounded-bottom-4">
							<button type="button" className="btn btn-secondary px-4" onClick={onClose} disabled={loading}>
								Cancel
							</button>
							<button type="submit" className="btn btn-primary px-4 fw-bold" disabled={loading}>
								{loading ? (
									<>
										<span className="spinner-border spinner-border-sm me-2" role="status"></span>
										Saving...
									</>
								) : (
									<>{projectToEdit ? 'Update Project' : 'Save to Portfolio'}</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default ProjectModal
