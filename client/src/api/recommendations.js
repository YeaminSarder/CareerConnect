import api from './axios'

export const getRecommendations = () =>
	api.get('/recommendations')

export default {
	getRecommendations
}
