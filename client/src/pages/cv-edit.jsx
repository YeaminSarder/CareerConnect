import { useParams } from 'react-router'
export const CvEdit = () => {
    const { cvId } = useParams()
    return (`edit cv: ${cvId}`)
}