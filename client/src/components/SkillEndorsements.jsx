import { useEffect, useState } from 'react'
import { getEndorsementsForUser, endorseSkill } from '../api/endorsements'
import { useAuthContext } from '../hooks/use-auth-context.jsx'

// Skill Endorsement System
// profileUserId = whose profile is being viewed
// profileSkills = that user's skills (pass in from Profile.skills)
const SkillEndorsements = ({ profileUserId, profileSkills = [] }) => {
	const { user } = useAuthContext()
	const [endorsements, setEndorsements] = useState([])
	const [selectedSkill, setSelectedSkill] = useState('')
	const [error, setError] = useState('')

	const fetchEndorsements = async () => {
		try {
			const res = await getEndorsementsForUser(profileUserId)
			setEndorsements(res.data)
		} catch (err) {
			console.error('Error fetching endorsements:', err)
		}
	}

	useEffect(() => {
		if (profileUserId) fetchEndorsements()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profileUserId])

	const handleEndorse = async () => {
		if (!selectedSkill) return
		setError('')
		try {
			await endorseSkill(profileUserId, selectedSkill)
			setSelectedSkill('')
			fetchEndorsements()
		} catch (err) {
			setError(err.response?.data?.error || 'Something went wrong')
		}
	}

	const isOwnProfile = user && user._id === profileUserId

	return (
		<div className="card shadow-sm border-0 p-3 rounded-3">
			<h6 className="fw-bold mb-3">
				<i className="bi bi-hand-thumbs-up-fill me-2 text-primary"></i>Skill Endorsements
			</h6>

			{!isOwnProfile && profileSkills.length > 0 && (
				<div className="d-flex gap-2 mb-3">
					<select
						className="form-select form-select-sm"
						value={selectedSkill}
						onChange={(e) => setSelectedSkill(e.target.value)}
					>
						<option value="">Select a skill to endorse</option>
						{profileSkills.map((skill) => (
							<option key={skill} value={skill}>
								{skill}
							</option>
						))}
					</select>
					<button className="btn btn-sm btn-primary" onClick={handleEndorse}>
						Endorse
					</button>
				</div>
			)}

			{error && <p className="text-danger small">{error}</p>}

			{endorsements.length === 0 && <p className="text-muted small">No endorsements yet.</p>}

			{endorsements.map((e) => (
				<div key={e.skill} className="border-bottom py-2">
					<strong>{e.skill}</strong> <span className="text-muted">— {e.count} endorsement(s)</span>
					<div className="small text-muted">By: {e.endorsers.join(', ')}</div>
				</div>
			))}
		</div>
	)
}

export default SkillEndorsements
