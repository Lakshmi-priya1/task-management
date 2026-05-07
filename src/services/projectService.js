// ======================================================
// FILE: services/projectService.js
// ======================================================

import axiosInstance from "../api/axiosInstance";
import { ENDPOINTS } from "../api/apiConfig";

const handleError = (error, fallbackMessage) => {
  const message =
    error.response?.data?.message || error.message || fallbackMessage;
  throw new Error(message);
};

// 🔹 PAGINATED + SEARCH
export const getProjects = async ({
  keyword = "",
  status = "",
  page = 0,
  size = 5,
  sortBy = "id",
  direction = "asc",
} = {}) => {
  let url =
    `/projects?page=${page}&size=${size}` +
    `&sortBy=${sortBy}&direction=${direction}`;

  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
  if (status) url += `&status=${encodeURIComponent(status)}`;

  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch projects");
  }
};

// 🔹 BASIC CRUD
export const getAllProjects = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.getAllProjects);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch projects");
  }
};

export const getProjectById = async (id) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.getProjectById(id));
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch project");
  }
};

export const addProject = async (data) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.addProject, data);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to add project");
  }
};

export const updateProject = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      ENDPOINTS.updateProject(id),
      data
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update project");
  }
};

export const deleteProject = async (id) => {
  try {
    await axiosInstance.delete(ENDPOINTS.deleteProject(id));
    return true;
  } catch (error) {
    handleError(error, "Failed to delete project");
  }
};

// 🔥 MAIN FIX (ASSIGN EMPLOYEE)
export const assignEmployeeToProject = async (projectId, employeeId) => {
  try {
    const response = await axiosInstance.post(
      ENDPOINTS.assignEmployeeToProject(projectId, employeeId),
      {} // ✅ IMPORTANT
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to assign employee");
  }
};

export const removeEmployeeFromProject = async (projectId, employeeId) => {
  try {
    const response = await axiosInstance.delete(
      ENDPOINTS.removeEmployeeFromProject(projectId, employeeId)
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to remove employee");
  }
};