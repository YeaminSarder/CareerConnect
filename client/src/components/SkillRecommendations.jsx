import { useEffect, useState } from 'react'
import axios from '../api/axios.js'

// Skill-Based Profile Recommendation System
const SkillRecommendations = () => {
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await axios.get('/recommendations')
                setRecommendations(res.data)
            } catch (err) {
                console.error('Error fetching recommendations:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchRecommendations()
    }, [])

    if (loading) return <p className="text-muted">Loading recommendations...</p>

    return (
        <div className="card shadow-sm border-0 p-3 rounded-3">
            <h6 className="fw-bold mb-3">
                <i className="bi bi-people-fill me-2 text-primary"></i>People You May Know
            </h6>

            {recommendations.length === 0 && (
                <p className="text-muted small">
                    No matches found yet. Add skills, career interests, and projects to your profile.
                </p>
            )}

            {recommendations.map((person) => (
                <div key={person._id} className="border-bottom py-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <strong>{person.name}</strong>
                        <span className="badge bg-primary rounded-pill">{person.matchScore}</span>
                    </div>
                    {person.department && <small className="text-muted d-block">{person.department}</small>}

                    {person.matchedSkills.length > 0 && (
                        <small className="d-block text-secondary">Skills: {person.matchedSkills.join(', ')}</small>
                    )}
                    {person.matchedInterests.length > 0 && (
                        <small className="d-block text-secondary">
                            Interests: {person.matchedInterests.join(', ')}
                        </small>
                    )}
                    {person.matchedProjectTools.length > 0 && (
                        <small className="d-block text-secondary">
                            Project tools: {person.matchedProjectTools.join(', ')}
                        </small>
                    )}
                    {person.sameDepartment && <small className="d-block text-secondary">Same department</small>}
                </div>
            ))}
        </div>
    )
}

export default SkillRecommendations
