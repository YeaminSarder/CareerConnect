import { useRef } from 'react'
import { Error } from '../components/error'
import { useNavigate } from 'react-router'

import {
    useCv,
    useDeleteCv,
    useCreateCv,
    useSetPrimaryCv
} from '../hooks/use-cv'
import { CvHeader } from '../components/cv/header'
import { CvGrid } from '../components/cv/grid'
import { EmptyCv } from '../components/cv/empty'


const Cv = () => {
    const { cv, error: cvError } = useCv()
    const { deleteCv, error: deleteError } = useDeleteCv()
    const { createCv, error: createError } = useCreateCv()
    const { setPrimaryCv, error: setPrimaryError } = useSetPrimaryCv()
    const fileInputRef = useRef(null)

    const navigate = useNavigate()

    return (
        <div className="m-3">
            <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileSelected}
            />
            <div className="m-2 max-w-sm">
                <Error message={
                    cvError || deleteError || createError || setPrimaryError
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
                    onSetPrimary={handleSetPrimary}
                />
            )}
        </div>
    )


    function handleCreateCv() {
        fileInputRef.current?.click()
    }
    
    function handleFileSelected(event) {
        const file = event.target.files?.[0]

        if (!file) return

        createCv(file)

        // Allow selecting the same file again later
        event.target.value = ''
    }

    function handleViewCv(cvId) {
        // Implement the logic to view a CV
    }

    function handleEditCv(cv) {
        navigate(`/cv/edit/${cv._id}`)
    }

    function handleDeleteCv(cv) {
        deleteCv(cv._id)
    }

    function handleSetPrimary(cv) {
        setPrimaryCv({ id: cv._id })
    }
}
export default Cv

