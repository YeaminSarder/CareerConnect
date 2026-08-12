import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import useProfileContext from '../hooks/profile'
import { useAuthContext } from '../hooks/use-auth-context'
import axios from '../api/axios'
import ProfileCompletionBar from '../components/rakibul/ProfileCompletionBar'
import PortfolioShowcase from '../components/portfolio/PortfolioShowcase'
import { updateProfileBio } from '../api/profile'

const ProfilePage = () => {
	const { state, dispatch } = useProfileContext()
	const { user } = useAuthContext()
	const [isEditingBio, setIsEditingBio] = useState(false)
	const [bioText, setBioText] = useState('')
	const [departmentText, setDepartmentText] = useState('')
	const [savingBio, setSavingBio] = useState(false)

	useEffect(() => {
		const fetchProfile = async () => {
			if (!user) return
			try {
				const res = await axios.get('/myprofile')
				dispatch({ type: 'SET_PROFILE', payload: res.data })
				setBioText(res.data.description || '')
				setDepartmentText(res.data.department || '')
			} catch (err) {
				console.error('Failed to fetch profile:', err)
			}
		}

		fetchProfile()
	}, [user, dispatch])

	const profile = state.profile || {}

	const handleSaveBio = async (e) => {
		e.preventDefault()
		if (!profile._id) return
		setSavingBio(true)
		try {
			const updated = await updateProfileBio(profile._id, {
				description: bioText,
				department: departmentText
			})
			dispatch({ type: 'SET_PROFILE', payload: updated })
			setIsEditingBio(false)
		} catch (err) {
			alert('Failed to update bio: ' + (err.response?.data?.error || err.message))
		} finally {
			setSavingBio(false)
		}
	}

	return (
		<div className="container py-4" style={{ maxWidth: '1000px' }}>
			{/* User Profile Header Card */}
			<div className="card shadow-sm border-0 mb-4 p-4 rounded-4 bg-gradient bg-primary text-white position-relative overflow-hidden">
				<div className="d-flex align-items-center justify-content-between flex-wrap gap-3 position-relative z-1">
					<div className="d-flex align-items-center gap-3">
						<div
							className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-2 shadow"
							style={{ width: '75px', height: '75px' }}
						>
							{user?.name ? user.name.charAt(0) : 'U'}
						</div>
						<div>
							<h2 className="fw-bold mb-1">{user ? user.name : 'Guest User'}</h2>
							<p className="mb-1 text-white-50">
								<i className="bi bi-envelope-fill me-1"></i>
								{user ? user.email : 'No email available'}
							</p>
							{profile.department && (
								<small className="badge bg-white text-primary fw-semibold">
									<i className="bi bi-mortarboard-fill me-1"></i>
									{profile.department}
								</small>
							)}
						</div>
					</div>

					<div className="d-flex gap-2">
						{profile._id && (
							<Link
								to={`/portfolio/${profile._id}`}
								className="btn btn-light text-primary fw-bold rounded-pill px-4 shadow-sm"
							>
								<i className="bi bi-eye-fill me-2"></i>View Public Portfolio
							</Link>
						)}
					</div>
				</div>
			</div>

			{/* FR-2: Profile Completion Score Bar */}
			<ProfileCompletionBar
				completionScore={profile.completionPercentage !== undefined ? profile.completionPercentage : 25}
				missingFields={
					profile.missingFields || ['Bio / Description', 'Education', 'Projects', 'Career Interests']
				}
			/>

			{/* Profile Bio / Summary Card */}
			<div className="card shadow-sm border-0 p-4 rounded-4 mb-4">
				<div className="d-flex align-items-center justify-content-between mb-3">
					<h5 className="fw-bold mb-0 text-dark">
						<i className="bi bi-card-text me-2 text-primary"></i>About Me / Professional Bio
					</h5>
					{!isEditingBio && (
						<button
							type="button"
							className="btn btn-sm btn-outline-primary rounded-pill px-3"
							onClick={() => setIsEditingBio(true)}
						>
							<i className="bi bi-pencil me-1"></i>Edit Bio
						</button>
					)}
				</div>

				{isEditingBio ? (
					<form onSubmit={handleSaveBio}>
						<div className="mb-3">
							<label className="form-label fw-semibold small">Department / Field of Study</label>
							<input
								type="text"
								className="form-control mb-2"
								placeholder="e.g. Computer Science & Engineering"
								value={departmentText}
								onChange={(e) => setDepartmentText(e.target.value)}
							/>
							<label className="form-label fw-semibold small">Bio Summary</label>
							<textarea
								className="form-control"
								rows="3"
								placeholder="Describe your technical skills, research interests, and career aspirations..."
								value={bioText}
								onChange={(e) => setBioText(e.target.value)}
							></textarea>
						</div>
						<div className="d-flex justify-content-end gap-2">
							<button
								type="button"
								className="btn btn-sm btn-secondary rounded-pill px-3"
								onClick={() => setIsEditingBio(false)}
								disabled={savingBio}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-sm btn-primary rounded-pill px-4 fw-bold"
								disabled={savingBio}
							>
								{savingBio ? 'Saving...' : 'Save Changes'}
							</button>
						</div>
					</form>
				) : (
					<p className="text-secondary mb-0 leading-relaxed">
						{profile.description && profile.description.trim().length > 0 ? (
							profile.description
						) : (
							<span className="text-muted italic">
								No bio added yet. Click "Edit Bio" to add your professional summary and research goals.
							</span>
						)}
					</p>
				)}
			</div>

			{/* Dynamic Portfolio and Project Showcase */}
			<PortfolioShowcase
				projects={profile.projects || []}
				isOwner={true}
				onProfileUpdated={(updated) => dispatch({ type: 'SET_PROFILE', payload: updated })}
			/>
		</div>
	)
}

export default ProfilePage
