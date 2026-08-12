import React from 'react'

const PortfolioStats = ({ projects = [] }) => {
	const totalProjects = projects.length
	const thesisCount = projects.filter((p) => p.projectType === 'Thesis Work').length
	const academicCount = projects.filter((p) => p.projectType === 'Academic Project' || p.projectType === 'Capstone Project').length

	const uniqueTools = new Set()
	projects.forEach((p) => {
		if (Array.isArray(p.toolsUsed)) {
			p.toolsUsed.forEach((t) => uniqueTools.add(t.trim().toLowerCase()))
		}
	})

	const repoCount = projects.filter((p) => p.githubLink && p.githubLink.trim().length > 0).length

	return (
		<div className="row g-3 mb-4">
			<div className="col-6 col-md-3">
				<div className="card border-0 shadow-sm rounded-4 p-3 bg-primary text-white h-100">
					<div className="d-flex align-items-center justify-content-between">
						<div>
							<h3 className="fw-bold mb-0">{totalProjects}</h3>
							<small className="text-white-50 fw-semibold">Total Projects</small>
						</div>
						<div className="bg-white bg-opacity-25 rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
							<i className="bi bi-folder-fill fs-5"></i>
						</div>
					</div>
				</div>
			</div>

			<div className="col-6 col-md-3">
				<div className="card border-0 shadow-sm rounded-4 p-3 bg-purple text-white h-100" style={{ backgroundColor: '#6f42c1' }}>
					<div className="d-flex align-items-center justify-content-between">
						<div>
							<h3 className="fw-bold mb-0">{thesisCount}</h3>
							<small className="text-white-50 fw-semibold">Thesis & Research</small>
						</div>
						<div className="bg-white bg-opacity-25 rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
							<i className="bi bi-journal-bookmark-fill fs-5"></i>
						</div>
					</div>
				</div>
			</div>

			<div className="col-6 col-md-3">
				<div className="card border-0 shadow-sm rounded-4 p-3 bg-dark text-white h-100">
					<div className="d-flex align-items-center justify-content-between">
						<div>
							<h3 className="fw-bold mb-0">{academicCount}</h3>
							<small className="text-white-50 fw-semibold">Academic Work</small>
						</div>
						<div className="bg-white bg-opacity-25 rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
							<i className="bi bi-mortarboard-fill fs-5"></i>
						</div>
					</div>
				</div>
			</div>

			<div className="col-6 col-md-3">
				<div className="card border-0 shadow-sm rounded-4 p-3 bg-success text-white h-100">
					<div className="d-flex align-items-center justify-content-between">
						<div>
							<h3 className="fw-bold mb-0">{uniqueTools.size}</h3>
							<small className="text-white-50 fw-semibold">Tech Tools Used</small>
						</div>
						<div className="bg-white bg-opacity-25 rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
							<i className="bi bi-tools fs-5"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PortfolioStats
