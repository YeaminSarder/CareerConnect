import { useEffect } from 'react'
import useProfileContext from '../hooks/profile'
import ProfileDetails from '../components/profile_details'
import ProfileForm from '../components/profile_form'
import Stack from 'react-bootstrap/Stack'
import { useAuthContext } from '../hooks/use-auth-context'
import ProfileCompletionBar from '../components/rakibul/ProfileCompletionBar'

const Home = () => {
    const { state, dispatch } = useProfileContext()
    const { user } = useAuthContext()
    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch(`${process.env.REACT_APP_URI}/api/myprofile`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (response.ok) {
                dispatch({ type: 'SET_PROFILE', payload: json })
            } else {
                console.error('Failed to fetch profile:', json.error)
            }
        }
        if (user) {
        fetchProfile()
        }
    }, [user, dispatch])
    return (
        <div className="container py-4">
            <div className="mb-4">
                <h1 className="fw-bold">{user ? user.name : 'Guest'}</h1>
                <p className="text-muted">Email: {user ? user.email : 'Not available'}</p>
                <p>{state.profile && state.profile.description ? state.profile.description : (<span className="text-muted">Edit your profile to add description</span>)}</p>
            </div>

            {/* FR-2: Profile Completion Percentage & Missing Fields */}
            <ProfileCompletionBar
                completionScore={state.profile?.completionPercentage || 25}
                missingFields={state.profile?.missingFields || ['Bio / Description', 'Education', 'Projects', 'Career Interests']}
            />
        </div>
    )
}

export default Home
