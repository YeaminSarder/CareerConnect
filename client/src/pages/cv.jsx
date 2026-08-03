import { useEffect } from 'react'
import { Error } from '../components/error'
import { useAuthContext } from '../hooks/use-auth-context'

import { 
    useCv,
    useDeleteCv,
    useCreateCv
} from '../hooks/use-cv'
import { CvHeader } from '../components/cv/header'
import { CvGrid } from '../components/cv/grid'
import { EmptyCv } from '../components/cv/empty'


const Cv = () => {
    const { cv, setCv, getMyCvs, error: cvError } = useCv()
    const { deleteCv, error: deleteError } = useDeleteCv()
    const { createCv, error: createError } = useCreateCv()
    const { user } = useAuthContext()
    useEffect(() => {

        if (user) {
            getMyCvs()
        }
    }, [user, setCv, getMyCvs])


    return (
        <div className="m-3">
            <div className="m-2 max-w-sm">
                <Error message={
                    cvError || deleteError || createError
                    } />
            </div>


            <CvHeader onCreate={handleCreateCv} />

            {!cv || cv.length === 0 ? (
                <EmptyCv onCreate={handleCreateCv} />
            ) : (
                <CvGrid
                    cvs={cv}
                    onView={handleViewCv}
                    onEdit={handleEditCv}
                    onDelete={handleDeleteCv}
                />
            )}
        </div>
    )


    function handleCreateCv() {
        createCv({ title: "Untitled CV" })
    }

    function handleViewCv(cvId) {
        // Implement the logic to view a CV
    }

    function handleEditCv(cvId) {
        // Implement the logic to edit a CV
    }

    function handleDeleteCv(cv) {
        deleteCv(cv._id)
    }
}
export default Cv

