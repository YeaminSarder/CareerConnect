import { useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCv } from '../api/cv'
import { Error } from '../components/error'
import AppForm from '../components/app-form'
import { useState } from 'react'
import { useUpdateCv } from '../hooks/use-cv'
import { Button } from 'react-bootstrap'
export const CvEdit = () => {
    const { cvId } = useParams()
    const queryClient = useQueryClient();
    const { data: cv, isPending, isError, error } = useQuery({
        queryKey: ["myCvs", cvId],
        queryFn: () => getCv(cvId).then(r => r.data),
        staleTime: 1000 * 60 * 5, // 5 minutes
        initialData: () => {
            const cached = queryClient.getQueryData(["myCvs"]);
            return cached?.data?.find((cv) => cv._id === cvId);
        }
    });
    const [title, setTitle] = useState(cv?.title)
    const [description, setDescription] = useState(cv?.description)
    const [myerror, setMyerror] = useState("")
    const {updateCv} = useUpdateCv(setMyerror)

    if (isPending) return 'Loading...'
    if (isError) return <Error message={error}></Error>
    return (
        <div className="m-3">
            <Error message={myerror}/>
            <AppForm.Form onSubmit={handleSubmit}>
                <AppForm.Header> Edit CV </AppForm.Header>

                <AppForm.Group>
                    <AppForm.InputGroup
                        aria-label="title"
                        type="text"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value) }}
                        placeholder={cv.title}
                    />
                    <AppForm.InputGroup
                        aria-label="description"
                        type="textarea"
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                        placeholder="Description"
                    />
                </AppForm.Group>
                <Button variant="primary" type="submit">Update</Button>
            </AppForm.Form>
        </div>
    )
    async function handleSubmit(e) {
        setMyerror("") 
        e.preventDefault()
        const r = await updateCv({id: cvId, data: {title, description}})
        console.log(r,cvId,title,description)
    }
}