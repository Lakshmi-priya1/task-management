import { BASE_URL, ENDPOINTS } from "../api/apiConfig";

// ================= HEADERS =================
const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ================= GET ALL TASKS =================
export const getAllTasks = async () => {
  const res = await fetch(ENDPOINTS.getAllTasks, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch tasks");

  return await res.json();
};

// ================= GET TASK BY ID =================
export const getTaskById = async (id) => {
  const res = await fetch(ENDPOINTS.getTaskById(id), {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch task");

  return await res.json();
};

// ================= PAGINATION + FILTER =================
export const getTasks = async ({
  keyword = "",
  status = "",
  page = 0,
  size = 5,
} = {}) => {
  const url = `${BASE_URL}/tasks?page=${page}&size=${size}&keyword=${encodeURIComponent(
    keyword || ""
  )}&status=${status || ""}`;

  const res = await fetch(url, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch paginated tasks");

  return await res.json();
};


// ================= ADD TASK =================
export const addTask = async (taskData) => {
  const res = await fetch(ENDPOINTS.addTask, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(taskData),
  });

  if (!res.ok) throw new Error("Failed to add task");

  return await res.json();
};

// ================= UPDATE TASK =================
export const updateTask = async (id, taskData) => {
  const res = await fetch(ENDPOINTS.updateTask(id), {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(taskData),
  });

  if (!res.ok) throw new Error("Failed to update task");

  return await res.json();
};

// ================= DELETE TASK =================
export const deleteTask = async (id) => {
  const res = await fetch(ENDPOINTS.deleteTask(id), {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete task");

  return true;
};