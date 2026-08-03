import { useEffect } from 'react'
import { useState } from 'react'
import { Error } from '../components/error'
import { useAuthContext } from '../hooks/use-auth-context'

const Cv = () => {
    const [error, setError] = useState(null)
    const [cv, setCv] = useState(null)
    const { user } = useAuthContext()
    useEffect( ()=> {
    async function fetchCv() {
        const response = await fetch(`${process.env.REACT_APP_URI}/api/cv`,
        {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        }
        )
        const cv = await response.json()
        if (cv) {
            setCv(cv)
        }
    }
    if (user) {
        fetchCv()
    }
    },[user, setCv])

    function tryRender() {
        try {
            return cv.map((item) => (
            <p key={item._id}>{item.title}</p>
        ))
        } catch (err) {
            !error && setError(err)
        }
    }

    return (
        <>
        {cv ? (
            <>
            <div className="m-2 max-w-sm">
                <Error message={cv.error || error} />
            </div>
            <div>
                {tryRender()}
            </div>
            <div>
                {JSON.stringify(cv)}
            </div>
            </>
        ) : (
            <p>Loading...</p>
        )}
        </>
    )
    
}
export default Cv