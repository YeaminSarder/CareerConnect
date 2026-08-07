import api from './axios'

export const applyForInternship = (internshipId, cvId) =>
	api.post('/applications', { internshipId, cvId })

export const getMyApplications = () =>
	api.get('/applications/my')

export const withdrawApplication = (id) =>
	api.delete(`/applications/${id}`)

export default {
	applyForInternship,
	getMyApplications,
	withdrawApplication
}
