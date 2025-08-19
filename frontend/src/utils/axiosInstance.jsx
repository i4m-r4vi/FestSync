// src/utils/axiosInstance.js
import axios from "axios";

// Create instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ Change this to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
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
