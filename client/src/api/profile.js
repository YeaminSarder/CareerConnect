import axios from './axios'

export const fetchMyProfile = async () => {
    const res = await axios.get('/myprofile')
    return res.data
}

export const fetchProfileById = async (id) => {
    const res = await axios.get(`/profile/${id}`)
    return res.data
}

export const updateProfileBio = async (profileId, data) => {
    const res = await axios.patch(`/profile/${profileId}`, data)
    return res.data
}

export const addProject = async (projectData) => {
    const res = await axios.post('/profile/projects', projectData)
    return res.data
}

export const updateProject = async (projectId, projectData) => {
    const res = await axios.put(`/profile/projects/${projectId}`, projectData)
    return res.data
}

export const deleteProject = async (projectId) => {
    const res = await axios.delete(`/profile/projects/${projectId}`)
    return res.data
}
