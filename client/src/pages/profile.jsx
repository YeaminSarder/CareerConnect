import { useEffect } from 'react'
import useProfileContext from '../hooks/profile'
import ProfileDetails from '../components/profile_details'
import ProfileForm from '../components/profile_form'
import Stack from 'react-bootstrap/Stack'
import { useAuthContext } from '../hooks/use-auth-context'
const Home = () => {
    const { state, dispatch } = useProfileContext()
    const { user } = useAuthContext()
    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (response.ok) {
                dispatch({ type: 'SET_PROFILE', payload: json })
            }
        }
        if (user) {
        fetchProfile()
        }
    }, [user, dispatch])
    return (
        <div className="home">
            <Stack direction="horizontal" gap={3} className="mb-3 align-items-start">
            <div>
            {state.profile && state.profile.map((profile) => (
                <ProfileDetails key={profile._id} profile={profile} />
            ))}
            </div>
            <div className="m-2">
            <ProfileForm className="ms-auto" style={{ maxWidth: '400px' }} />
            </div>
            </Stack>
        </div>
    )
}

export default Home
