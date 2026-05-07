import axios from "axios";
import { BASE_URL } from "./apiConfig";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const url = config.url || "";

  // Skip auth header for login requests
  if (token && !url.includes("/admin/login")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;