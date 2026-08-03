import { useEffect } from 'react'
import { useState } from 'react'
import { Error } from '../components/error'
import { useAuthContext } from '../hooks/use-auth-context'
import { useCv } from '../hooks/use-cv'

const Cv = () => {
    const [error, setError] = useState(null)
    const { cv, setCv, getMyCvs, error: cvError } = useCv()
    const { user } = useAuthContext()
    useEffect( ()=> {
    
    if (user) {
        getMyCvs()
    }
    },[user, setCv, setError, getMyCvs])

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
                <Error message={cv.error || error || cvError} />
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