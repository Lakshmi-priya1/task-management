import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/apiConfig";

// LOGIN
export const loginUser = async (loginData) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.login, loginData);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Login Failed";
    throw new Error(message);
  }
};