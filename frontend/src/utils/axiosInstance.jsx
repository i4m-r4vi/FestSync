// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND, // Backend URL from .env
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ sends loginToken cookie automatically
});

// 🔑 Optional: handle expired sessions
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Session expired or invalid -> redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
