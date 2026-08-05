import React, { useState } from 'react'

const InternshipFilter = ({ onFilterChange }) => {
	const [search, setSearch] = useState('')
	const [workMode, setWorkMode] = useState('')
	const [location, setLocation] = useState('')
	const [skill, setSkill] = useState('')
	const [status, setStatus] = useState('Open')

	const handleSearchChange = (val) => {
		setSearch(val)
		onFilterChange({ search: val, workMode, location, skill, status })
	}

	const handleWorkModeChange = (val) => {
		setWorkMode(val)
		onFilterChange({ search, workMode: val, location, skill, status })
	}

	const handleLocationChange = (val) => {
		setLocation(val)
		onFilterChange({ search, workMode, location: val, skill, status })
	}

	const handleSkillChange = (val) => {
		setSkill(val)
		onFilterChange({ search, workMode, location, skill: val, status })
	}

	const handleStatusChange = (val) => {
		setStatus(val)
		onFilterChange({ search, workMode, location, skill, status: val })
	}

	const handleReset = () => {
		setSearch('')
		setWorkMode('')
		setLocation('')
		setSkill('')
		setStatus('')
		onFilterChange({})
	}

	return (
		<div className="card shadow-sm border-0 p-3 mb-4 rounded-3 bg-light">
			<h6 className="fw-bold mb-3 text-primary">
				<i className="bi bi-funnel-fill me-2"></i>Advanced Internship Search & Multi-Filter
			</h6>
			<div className="row g-3">
				{/* Keyword Search */}
				<div className="col-md-4">
					<label className="form-label small fw-bold mb-1">Search Keywords</label>
					<div className="input-group input-group-sm">
						<span className="input-group-text bg-white">
							<i className="bi bi-search"></i>
						</span>
						<input
							type="text"
							className="form-control"
							placeholder="Role, Company, Description..."
							value={search}
							onChange={(e) => handleSearchChange(e.target.value)}
						/>
					</div>
				</div>

				{/* Work Mode */}
				<div className="col-md-2">
					<label className="form-label small fw-bold mb-1">Work Mode</label>
					<select
						className="form-select form-select-sm"
						value={workMode}
						onChange={(e) => handleWorkModeChange(e.target.value)}
					>
						<option value="">All Work Modes</option>
						<option value="Onsite">Onsite</option>
						<option value="Remote">Remote</option>
						<option value="Hybrid">Hybrid</option>
					</select>
				</div>

				{/* Location */}
				<div className="col-md-2">
					<label className="form-label small fw-bold mb-1">Location</label>
					<input
						type="text"
						className="form-control form-control-sm"
						placeholder="City / Country"
						value={location}
						onChange={(e) => handleLocationChange(e.target.value)}
					/>
				</div>

				{/* Skill */}
				<div className="col-md-2">
					<label className="form-label small fw-bold mb-1">Required Skill</label>
					<input
						type="text"
						className="form-control form-control-sm"
						placeholder="React, Python..."
						value={skill}
						onChange={(e) => handleSkillChange(e.target.value)}
					/>
				</div>

				{/* Status */}
				<div className="col-md-2">
					<label className="form-label small fw-bold mb-1">Posting Status</label>
					<select
						className="form-select form-select-sm"
						value={status}
						onChange={(e) => handleStatusChange(e.target.value)}
					>
						<option value="">All Statuses</option>
						<option value="Open">Open</option>
						<option value="Closed">Closed</option>
					</select>
				</div>
			</div>

			<div className="d-flex justify-content-end mt-3">
				<button className="btn btn-sm btn-outline-secondary" onClick={handleReset}>
					<i className="bi bi-x-circle me-1"></i>Reset Filters
				</button>
			</div>
		</div>
	)
}

export default InternshipFilter
