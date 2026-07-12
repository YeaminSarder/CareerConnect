import { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/use-auth-context'
const Home = () => {
    const { user } = useAuthContext()
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            if (response.ok) {
                setProfile(json)
            }
        }
        if (user) {
            fetchProfile()
        }
    }, [user])
    return (
        <div className="home">
            <p>Welcome to CareerConnect!</p>
        </div>
    )
}

export default Home
