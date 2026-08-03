import api from "./axios";

export const getMyCvs = () => api.get("/cv");

export const getCv = (id) => api.get(`/cv/${id}`);

export const createCv = (data) => api.post("/cv", data);

export const updateCv = (id, data) =>
  api.patch(`/cv/${id}`, data);

export const deleteCv = (id) =>
  api.delete(`/cv/${id}`);