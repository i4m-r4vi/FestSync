// src/utils/axiosInstance.js
import axios from "axios";

// Create instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND, // ✅ Change this to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add token to every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("festsync_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
