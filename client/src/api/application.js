import api from './axios'

export const applyForInternship = (internshipId, cvId) =>
	api.post('/applications', { internshipId, cvId })

export const getMyApplications = () =>
	api.get('/applications/my')

export const getApplicantsByInternship = (internshipId) =>
	api.get(`/applications/internship/${internshipId}`)

export const getRecruiterApplications = () =>
	api.get('/applications/recruiter')

export const updateApplicationStatus = (id, status) =>
	api.patch(`/applications/${id}/status`, { status })

export const getSubmittedCvDetail = (cvId) =>
	api.get(`/applications/cv-detail/${cvId}`)

export const withdrawApplication = (id) =>
	api.delete(`/applications/${id}`)

export default {
	applyForInternship,
	getMyApplications,
	getApplicantsByInternship,
	getRecruiterApplications,
	updateApplicationStatus,
	getSubmittedCvDetail,
	withdrawApplication
}
