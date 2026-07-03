import { useEffect, useState } from 'react'
const Home = () => {
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch('/api/profile')
            const json = await response.json()
            if (response.ok) {
                setProfile(json)
            }
        }
        fetchProfile()
    }, [])
    return (
        <div className="home">
            {profile && profile.map((profile) => (
                <div key={profile._id}>
                    <h2>{profile.name}</h2>
                    <p>{profile.age}</p>
                </div>
            ))}
        </div>
    )
}

export default Home
