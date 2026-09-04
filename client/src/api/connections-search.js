import api from './axios'

// used only by the Endorsements page to find someone to endorse
export const searchUsers = (search) =>
	api.get('/connections/search-users', { params: { search } })

export default { searchUsers }
