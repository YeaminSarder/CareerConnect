import React, { useState } from 'react'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import ProjectDetailsModal from './ProjectDetailsModal'
import ProjectFilter from './ProjectFilter'
import PortfolioStats from './PortfolioStats'
import { addProject, updateProject, deleteProject } from '../../api/profile'

const PortfolioShowcase = ({ projects = [], isOwner = false, onProfileUpdated }) => {
	const [activeCategory, setActiveCategory] = useState('ALL')
	const [searchQuery, setSearchQuery] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [projectToEdit, setProjectToEdit] = useState(null)
	const [selectedProject, setSelectedProject] = useState(null)

	// Filter Logic
	const filteredProjects = projects.filter((project) => {
		const matchesCategory =
			activeCategory === 'ALL' || (project.projectType || 'Academic Project') === activeCategory

		const q = searchQuery.toLowerCase().trim()
		const matchesTitle = project.title ? project.title.toLowerCase().includes(q) : false
		const matchesDesc = project.description ? project.description.toLowerCase().includes(q) : false
		const matchesTools = Array.isArray(project.toolsUsed)
			? project.toolsUsed.some((t) => t.toLowerCase().includes(q))
			: false

		const matchesSearch = !q || matchesTitle || matchesDesc || matchesTools
		return matchesCategory && matchesSearch
	})

	const handleOpenAddModal = () => {
		setProjectToEdit(null)
		setIsModalOpen(true)
	}

	const handleOpenEditModal = (project) => {
		setProjectToEdit(project)
		setIsModalOpen(true)
	}

	const handleSaveProject = async (payload, existingId) => {
		let updatedProfile
		if (existingId) {
			updatedProfile = await updateProject(existingId, payload)
		} else {
			updatedProfile = await addProject(payload)
		}
		if (onProfileUpdated) {
			onProfileUpdated(updatedProfile)
		}
	}

	const handleDeleteProject = async (projectId) => {
		if (!window.confirm('Are you sure you want to remove this project from your portfolio?')) {
			return
		}
		try {
			const updatedProfile = await deleteProject(projectId)
			if (onProfileUpdated) {
				onProfileUpdated(updatedProfile)
			}
		} catch (err) {
			alert('Failed to delete project: ' + (err.response?.data?.error || err.message))
		}
	}

	return (
		<div className="portfolio-showcase py-2">
			{/* Section Header */}
			<div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
				<div>
					<h4 className="fw-bold text-dark mb-1">
						<i className="bi bi-briefcase-fill me-2 text-primary"></i>
						Academic & Thesis Project Portfolio
					</h4>
					<p className="text-secondary small mb-0">
						Showcasing coursework projects, undergraduate thesis research, software tools, and GitHub repositories.
					</p>
				</div>

				{isOwner && (
					<button
						type="button"
						className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
						onClick={handleOpenAddModal}
					>
						<i className="bi bi-plus-lg me-2"></i>Add Project / Thesis
					</button>
				)}
			</div>

			{/* Portfolio Quick Metrics Bar */}
			<PortfolioStats projects={projects} />

			{/* Filter & Search Controls */}
			<ProjectFilter
				activeCategory={activeCategory}
				onSelectCategory={setActiveCategory}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
			/>

			{/* Projects Cards Grid */}
			{filteredProjects.length > 0 ? (
				<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
					{filteredProjects.map((project) => (
						<div className="col" key={project._id || project.title}>
							<ProjectCard
								project={project}
								isOwner={isOwner}
								onEdit={handleOpenEditModal}
								onDelete={handleDeleteProject}
								onViewDetails={setSelectedProject}
							/>
						</div>
					))}
				</div>
			) : (
				<div className="card border-0 shadow-sm rounded-4 text-center py-5 px-4 mb-4 bg-light">
					<div className="py-4">
						<i className="bi bi-folder2-open display-3 text-muted mb-3 d-block"></i>
						<h5 className="fw-bold text-dark">No projects match your current filter</h5>
						<p className="text-muted small max-w-md mx-auto mb-3">
							{projects.length === 0
								? 'No projects added to portfolio yet. Click "Add Project / Thesis" above to build your showcase!'
								: 'Try broadening your search term or switching project categories.'}
						</p>
						{isOwner && projects.length === 0 && (
							<button
								type="button"
								className="btn btn-primary rounded-pill px-4 fw-bold"
								onClick={handleOpenAddModal}
							>
								<i className="bi bi-plus-circle me-2"></i>Add First Portfolio Item
							</button>
						)}
					</div>
				</div>
			)}

			{/* Add/Edit Project Modal */}
			<ProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSaveProject}
				projectToEdit={projectToEdit}
			/>

			{/* Project Details Modal */}
			<ProjectDetailsModal
				project={selectedProject}
				onClose={() => setSelectedProject(null)}
			/>
		</div>
	)
}

export default PortfolioShowcase
