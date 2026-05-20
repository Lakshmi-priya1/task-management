import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/apiConfig";

const handleError = (error, fallbackMessage) => {
  if (error.response) throw error;
  throw new Error(error.message || fallbackMessage);
};

export const getOrganizations = async ({ keyword = "", page = 0, size = 5 } = {}) => {
  try {
    let url = `${ENDPOINTS.getAllOrganizations}?page=${page}&size=${size}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    handleError(error, "Failed to fetch organizations");
  }
};

export const addOrganization = async (data) => {
  try {
    const res = await axiosInstance.post(ENDPOINTS.addOrganization, data);
    return res.data;
  } catch (error) {
    handleError(error, "Failed to add organization");
  }
};

export const updateOrganization = async (id, data) => {
  try {
    const res = await axiosInstance.put(ENDPOINTS.updateOrganization(id), data);
    return res.data;
  } catch (error) {
    handleError(error, "Failed to update organization");
  }
};

export const softDeleteOrganization = async (id) => {
  try {
    await axiosInstance.delete(ENDPOINTS.softDeleteOrganization(id));
    return true;
  } catch (error) {
    handleError(error, "Failed to delete organization");
  }
};
