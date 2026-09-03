import api from "./axios";

export const getMyCvs = () => api.get("/cv");

export const getCv = (id) => api.get(`/cv/${id}`);

export const createCv = (file) => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post('/cv', formData)
}
export const updateCv = (id, data) =>
  api.patch(`/cv/${id}`, data);

export const setPrimaryCv = (id) =>
  api.patch(`/cv/${id}/set-primary`);

export const deleteCv = (id) =>
  api.delete(`/cv/${id}`);