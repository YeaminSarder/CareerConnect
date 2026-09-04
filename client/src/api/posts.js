import api from './axios'

// only the functions I added (create/update/delete) - like/comment/save
// belong to the existing post system and already have their own calls
// inside PostInteractions.jsx, so they aren't duplicated here.

export const createPost = (data) =>
	api.post('/posts', data)

export const updatePost = (id, data) =>
	api.patch(`/posts/${id}`, data)

export const deletePost = (id) =>
	api.delete(`/posts/${id}`)

export default {
	createPost,
	updatePost,
	deletePost
}
