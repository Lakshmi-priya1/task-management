import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/apiConfig";

const handleError = (error, fallbackMessage) => {
  if (error.response) throw error;
  throw new Error(error.message || fallbackMessage);
};

export const getUsers = async () => {
  try {
    const res = await axiosInstance.get(ENDPOINTS.getUser);
    // Backend returns paginated: { content: [...], totalPages, ... }
    return res.data.content ?? res.data;
  } catch (error) {
    handleError(error, "Failed to fetch users");
  }
};

export const getUserById = async (id) => {
  try {
    const res = await axiosInstance.get(ENDPOINTS.getUserById(id));
    return res.data;
  } catch (error) {
    handleError(error, "Failed to fetch user");
  }
};

export const createUser = async (data) => {
  try {
    const res = await axiosInstance.post(ENDPOINTS.register, data);
    return res.data;
  } catch (error) {
    handleError(error, "Failed to create user");
  }
};

// ✅ NEW — PUT /users/:id
export const updateUser = async (id, data) => {
  try {
    const res = await axiosInstance.put(ENDPOINTS.updateUser(id), data);
    return res.data;
  } catch (error) {
    handleError(error, "Failed to update user");
  }
};

export const deleteUser = async (id) => {
  try {
    await axiosInstance.delete(ENDPOINTS.deleteUser(id));
    return true;
  } catch (error) {
    handleError(error, "Failed to delete user");
  }
};