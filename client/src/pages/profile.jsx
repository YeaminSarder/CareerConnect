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
        <>
        <div className="m-4">
            <h1 className="font-bold">{user ? user.name : 'Guest'}</h1>
            <p>Email: {user ? user.email : 'Not available'}</p>
            <p>{state.profile && state.profile.description ? state.profile.description : (<span className="text-gray-400">Edit your profile to add description</span>)}</p>
        </div>
        {/* <div className="home">
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
        </div> */}
        </>
    )
}

export default Home
