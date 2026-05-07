// ======================================================
// FILE: services/taskService.js
// ======================================================

import axiosInstance from "../api/axiosInstance";
import { BASE_URL, ENDPOINTS } from "../api/apiConfig";

const handleError = (error, fallbackMessage) => {
  const message =
    error.response?.data?.message || error.message || fallbackMessage;
  throw new Error(message);
};

export const getAllTasks = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.getAllTasks);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch tasks");
  }
};

export const getTaskById = async (id) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.getTaskById(id));
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch task");
  }
};

export const getTasks = async ({
  keyword = "",
  status = "",
  page = 0,
  size = 5,
} = {}) => {
  // fixed: only append params when they have values, don't send &keyword=&status=
  let url = `${BASE_URL}/tasks?page=${page}&size=${size}`;

  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
  if (status) url += `&status=${encodeURIComponent(status)}`;

  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch paginated tasks");
  }
};

export const addTask = async (taskData) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.addTask, taskData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to add task");
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await axiosInstance.put(ENDPOINTS.updateTask(id), taskData);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update task");
  }
};

export const deleteTask = async (id) => {
  try {
    await axiosInstance.delete(ENDPOINTS.deleteTask(id));
    return true;
  } catch (error) {
    handleError(error, "Failed to delete task");
  }
};

export const assignEmployeeToTask = async (taskId, employeeId) => {
  try {
    const response = await axiosInstance.put(ENDPOINTS.assignTaskToEmployee(taskId, employeeId));
    return response.data;
  } catch (error) {
    handleError(error, "Failed to assign employee to task");
  }
};

export const unassignEmployeeFromTask = async (taskId, employeeId) => {
  try {
    const response = await axiosInstance.delete(
      ENDPOINTS.unassignTaskFromEmployee(taskId, employeeId)
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to unassign employee from task");
  }
};