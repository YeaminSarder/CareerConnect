import api from './axios'

export const getReminders = () => api.get('/reminders')

export default {
	getReminders
}
