import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { fetchProfileById } from '../api/profile'
import PortfolioShowcase from '../components/portfolio/PortfolioShowcase'
import { Loading } from '../components/loading'

const PublicPortfolioPage = () => {
	const { id } = useParams()
	const [profile, setProfile] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const loadProfile = async () => {
			if (!id) return
			setLoading(true)
			try {
				const data = await fetchProfileById(id)
				setProfile(data)
			} catch (err) {
				setError(err.response?.data?.error || err.message || 'Profile not found')
			} finally {
				setLoading(false)
			}
		}
		loadProfile()
	}, [id])

	if (loading) return <Loading />

	if (error || !profile) {
		return (
			<div className="container py-5 text-center" style={{ maxWidth: '600px' }}>
				<div className="card shadow-sm border-0 rounded-4 p-5">
					<i className="bi bi-exclamation-triangle display-3 text-warning mb-3"></i>
					<h4 className="fw-bold">Portfolio Not Found</h4>
					<p className="text-muted">{error || 'The requested student portfolio could not be retrieved.'}</p>
					<Link to="/" className="btn btn-primary rounded-pill px-4 fw-bold">
						Back to Home
					</Link>
				</div>
			</div>
		)
	}

	const handleCopyShareLink = () => {
		navigator.clipboard.writeText(window.location.href)
		alert('Portfolio link copied to clipboard!')
	}

	return (
		<div className="container py-4" style={{ maxWidth: '1000px' }}>
			{/* Public Student Banner Header */}
			<div className="card shadow-sm border-0 mb-4 p-4 rounded-4 bg-gradient bg-dark text-white">
				<div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
					<div className="d-flex align-items-center gap-3">
						<div
							className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-2 shadow"
							style={{ width: '75px', height: '75px' }}
						>
							{profile.department ? profile.department.charAt(0) : 'S'}
						</div>
						<div>
							<div className="d-flex align-items-center gap-2">
								<h2 className="fw-bold mb-0">Student Professional Portfolio</h2>
								<span className="badge bg-success rounded-pill px-3 py-1">Public Portfolio</span>
							</div>
							{profile.department && (
								<p className="mb-0 text-white-50 mt-1">
									<i className="bi bi-mortarboard-fill me-1"></i>
									{profile.department}
								</p>
							)}
						</div>
					</div>

					<div className="d-flex gap-2">
						<button
							type="button"
							className="btn btn-outline-light rounded-pill px-4 fw-semibold"
							onClick={handleCopyShareLink}
						>
							<i className="bi bi-share-fill me-2"></i>Share Portfolio
						</button>
					</div>
				</div>
			</div>

			{/* Bio Card */}
			{profile.description && profile.description.trim().length > 0 && (
				<div className="card shadow-sm border-0 p-4 rounded-4 mb-4">
					<h5 className="fw-bold mb-2 text-dark">
						<i className="bi bi-person-lines-fill me-2 text-primary"></i>About Student
					</h5>
					<p className="text-secondary mb-0 leading-relaxed">{profile.description}</p>
				</div>
			)}

			{/* Portfolio Showcase Grid */}
			<PortfolioShowcase projects={profile.projects || []} isOwner={false} />
		</div>
	)
}

export default PublicPortfolioPage
