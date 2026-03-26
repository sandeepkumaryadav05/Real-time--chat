import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api",
  withCredentials: true
});

// Attach JWT token automatically
API.interceptors.request.use(config => {
  const data = JSON.parse(localStorage.getItem("user"));

  if (data?.token) {
    config.headers.Authorization = `Bearer ${data.token}`;
  }

  return config;
});

// Auto logout on token expiry
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location = "/";
    }
    return Promise.reject(error);
  }
);

export default API;
