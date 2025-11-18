import axios from "axios";

const api = axios.create({
  // use env var in production, fall back to localhost for dev
  baseURL:
    process.env.REACT_APP_API_BASE_URL ||
    "http://127.0.0.1:8081/api/v1"
});

// automatically attach token (if exists) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;