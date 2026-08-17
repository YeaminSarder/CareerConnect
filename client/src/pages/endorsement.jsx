import { useState } from 'react'
import axios from '../api/axios.js'
import SkillEndorsements from '../components/SkillEndorsements.jsx'

import { useState } from 'react'
import axios from '../api/axios.js'
import SkillEndorsements from '../components/mypart/SkillEndorsements.jsx'

// A standalone page to search for a connection and endorse their skills.
// This exists because the repo doesn't have a "view another student's
// profile" page yet - this covers the same need for now.
const EndorsementsPage = () => {
	const [search, setSearch] = useState('')
	const [results, setResults] = useState([])
	const [selectedUser, setSelectedUser] = useState(null)

	const handleSearch = async (e) => {
		e.preventDefault()
		try {
			const res = await axios.get('/connections/search-users', { params: { search } })
			setResults(res.data)
		} catch (err) {
			console.error('Error searching users:', err)
		}
	}

	return (
		<div className="container py-4" style={{ maxWidth: '700px' }}>
			<h4 className="fw-bold mb-4 text-primary">
				<i className="bi bi-hand-thumbs-up-fill me-2"></i>Skill Endorsements
			</h4>

			<form onSubmit={handleSearch} className="d-flex gap-2 mb-3">
				<input
					className="form-control form-control-sm"
					placeholder="Search a student by name or email"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<button className="btn btn-sm btn-primary" type="submit">
					Search
				</button>
			</form>

			{results.length > 0 && (
				<div className="card shadow-sm border-0 p-2 mb-4 rounded-3">
					{results.map((user) => (
						<button
							key={user._id}
							className="btn btn-sm btn-outline-secondary text-start mb-1"
							onClick={() => setSelectedUser(user)}
						>
							{user.name} — {user.profile?.skills?.join(', ') || 'No skills listed'}
						</button>
					))}
				</div>
			)}

			{selectedUser && (
				<SkillEndorsements
					profileUserId={selectedUser._id}
					profileSkills={selectedUser.profile?.skills || []}
				/>
			)}
		</div>
	)
}

export default EndorsementsPage

