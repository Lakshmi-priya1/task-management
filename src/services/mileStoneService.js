// ======================================================
// FILE: services/milestoneService.js
// ======================================================

import axiosInstance from "../api/axiosInstance";
import { BASE_URL, ENDPOINTS } from "../api/apiConfig";

const handleError = (error, fallbackMessage) => {
  const message =
    error.response?.data?.message ||
    error.message ||
    fallbackMessage;
  throw new Error(message);
};

// GET ALL WITH FILTER
export const getMilestones = async ({
  keyword = "",
  projectId = "",
  page = 0,
  size = 5,
} = {}) => {
  let url = `${BASE_URL}/milestones?page=${page}&size=${size}`;

  if (keyword)
    url += `&keyword=${encodeURIComponent(keyword)}`;

  if (projectId)
    url += `&projectId=${projectId}`;

  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch milestones");
  }
};

// GET BY ID
export const getMilestoneById = async (id) => {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.getMilestoneById(id)
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed");
  }
};

// ADD
export const addMilestone = async (data) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.addMilestone, data);
    return response.data;
  } catch (error) {
    handleError(error, "Failed");
  }
};

// UPDATE
export const updateMilestone = async (
  id,
  data
) => {
  try {
    const response = await axiosInstance.put(
      ENDPOINTS.updateMilestone(id),
      data
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed");
  }
};

// DELETE
export const deleteMilestone = async (
  id
) => {
  try {
    await axiosInstance.delete(ENDPOINTS.deleteMilestone(id));
    return true;
  } catch (error) {
    handleError(error, "Failed");
  }
};
export const assignTaskToMilestone = async (milestoneId, taskId) => {
  try {
    await axiosInstance.post(
      `${BASE_URL}/milestones/${milestoneId}/tasks/${taskId}`
    );
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to assign task";
    throw new Error(message);
  }
};