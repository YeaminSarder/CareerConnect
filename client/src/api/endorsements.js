import api from './axios'

export const getEndorsementsForUser = (userId) =>
	api.get(`/endorsements/${userId}`)

export const endorseSkill = (toUser, skill) =>
	api.post('/endorsements', { toUser, skill })

export const removeEndorsement = (id) =>
	api.delete(`/endorsements/${id}`)

export default {
	getEndorsementsForUser,
	endorseSkill,
	removeEndorsement
}
