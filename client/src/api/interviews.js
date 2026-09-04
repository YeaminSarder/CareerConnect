import api from './axios'

export const getMyInterviews = () =>
	api.get('/interviews')

export const createInterview = (data) =>
	api.post('/interviews', data)

export const updateInterview = (id, data) =>
	api.patch(`/interviews/${id}`, data)

export const deleteInterview = (id) =>
	api.delete(`/interviews/${id}`)

export const addChecklistItem = (interviewId, task) =>
	api.post(`/interviews/${interviewId}/checklist`, { task })

export const toggleChecklistItem = (interviewId, itemId) =>
	api.patch(`/interviews/${interviewId}/checklist/${itemId}`)

export default {
	getMyInterviews,
	createInterview,
	updateInterview,
	deleteInterview,
	addChecklistItem,
	toggleChecklistItem
}
