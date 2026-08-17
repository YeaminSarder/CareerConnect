import React from 'react'

const CATEGORIES = [
	{ label: 'All Projects', value: 'ALL' },
	{ label: 'Academic Projects', value: 'Academic Project' },
	{ label: 'Thesis Work', value: 'Thesis Work' },
	{ label: 'Personal Projects', value: 'Personal Project' },
	{ label: 'Capstone Projects', value: 'Capstone Project' }
]

const ProjectFilter = ({ activeCategory, onSelectCategory, searchQuery, onSearchChange }) => {
	return (
		<div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
			<div className="row g-3 align-items-center">
				{/* Search Input */}
				<div className="col-lg-5">
					<div className="input-group">
						<span className="input-group-text bg-light border-end-0 rounded-start-pill text-muted">
							<i className="bi bi-search"></i>
						</span>
						<input
							type="text"
							className="form-control bg-light border-start-0 rounded-end-pill shadow-none"
							placeholder="Search by title, thesis topic, or tech tool (e.g. PyTorch, React)..."
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
						/>
					</div>
				</div>

				{/* Filter Pills */}
				<div className="col-lg-7">
					<div className="d-flex flex-wrap gap-2 justify-content-lg-end">
						{CATEGORIES.map((cat) => {
							const isActive = activeCategory === cat.value
							return (
								<button
									key={cat.value}
									type="button"
									className={`btn btn-sm rounded-pill px-3 transition-all ${
										isActive
											? 'btn-primary shadow-sm fw-bold'
											: 'btn-outline-secondary border-0 bg-light text-dark'
									}`}
									onClick={() => onSelectCategory(cat.value)}
								>
									{cat.label}
								</button>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProjectFilter
