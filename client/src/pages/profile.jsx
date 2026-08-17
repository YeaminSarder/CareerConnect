import { useEffect } from 'react'
import useProfileContext from '../hooks/profile'
import { useAuthContext } from '../hooks/use-auth-context'
import axios from '../api/axios'
import ProfileCompletionBar from '../components/rakibul/ProfileCompletionBar'
import SkillEndorsements from '../components/mypart/SkillEndorsements.jsx'

const ProfilePage = () => {
	const { state, dispatch } = useProfileContext()
	const { user } = useAuthContext()

	useEffect(() => {
		const fetchProfile = async () => {
			if (!user) return
			try {
				const res = await axios.get('/myprofile')
				dispatch({ type: 'SET_PROFILE', payload: res.data })
			} catch (err) {
				console.error('Failed to fetch profile:', err)
			}
		}

		fetchProfile()
	}, [user, dispatch])

	const profile = state.profile || {}

	return (
		<div className="container py-4" style={{ maxWidth: '900px' }}>
			{/* User Profile Header Card */}
			<div className="card shadow-sm border-0 mb-4 p-4 rounded-3 bg-gradient bg-primary text-white">
				<div className="d-flex align-items-center gap-3">
					<div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-2 shadow" style={{ width: '70px', height: '70px' }}>
						{user?.name ? user.name.charAt(0) : 'U'}
					</div>
					<div>
						<h2 className="fw-bold mb-1">{user ? user.name : 'Guest User'}</h2>
						<p className="mb-0 text-white-50">
							<i className="bi bi-envelope-fill me-1"></i>{user ? user.email : 'No email available'}
						</p>
						{profile.department && (
							<small className="badge bg-white text-primary mt-1">
								<i className="bi bi-mortarboard-fill me-1"></i>{profile.department}
							</small>
						)}
					</div>
				</div>
			</div>

			{/* FR-2: Profile Completion Score Bar */}
			<ProfileCompletionBar
				completionScore={profile.completionPercentage !== undefined ? profile.completionPercentage : 25}
				missingFields={profile.missingFields || ['Bio / Description', 'Education', 'Projects', 'Career Interests']}
			/>

			{/* Profile Bio / Summary Card */}
			<div className="card shadow-sm border-0 p-4 rounded-3 mb-4">
				<h5 className="fw-bold mb-2 text-dark">
					<i className="bi bi-card-text me-2 text-primary"></i>About Me / Bio
				</h5>
				<p className="text-secondary mb-0">
					{profile.description && profile.description.trim().length > 0 ? (
						profile.description
					) : (
						<span className="text-muted italic">No bio added yet. Edit your profile to describe your background and technical goals.</span>
					)}
				</p>
			</div>

			{/* Skill Endorsement System - shows endorsements this user has received */}
			<SkillEndorsements
				profileUserId={user?._id}
				profileSkills={profile.skills || []}
			/>
		</div>
	)
}

export default ProfilePage

