import api from './axios'

export const getReminders = () => api.get('/reminders')

const reminderApi = {
	getReminders
}

export default reminderApi
