import React from 'react'
import ConnectionManager from '../components/rakibul/ConnectionManager.jsx'
import SkillRecommendations from '../components/mypart/SkillRecommendations.jsx'

const ConnectionsPage = () => {
	return (
		<div className="container py-4" style={{ maxWidth: '900px' }}>
			<SkillRecommendations />
			<div className="mt-4">
				<ConnectionManager />
			</div>
		</div>
	)
}

export default ConnectionsPage
