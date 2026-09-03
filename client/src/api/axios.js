import axios from "axios";
const api = axios.create({
    baseURL: `${process.env.REACT_APP_URI}/api`,
});

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.token : null;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
	response => response,

	error => {
		if (error.response?.data?.error) {
			error.message = error.response.data.error
		}

		return Promise.reject(error)
	}
)

export default api;