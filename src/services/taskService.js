import { ENDPOINTS } from "../api/apiConfig";

// 📥 Get all tasks from backend
export const getAllTasks = async () => {
  try {
    const token = localStorage.getItem("token"); // optional

    const response = await fetch(ENDPOINTS.getTasks, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // only if exists
      },
    });

    console.log("GET Status:", response.status);

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

export const getTasksByStatus = async (status) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${ENDPOINTS.getTasksByStatus}/${status}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tasks by status");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch by Status Error:", error);
    throw error;
  }
};

export const addTask = async (taskData) => {
  try {
    const token = localStorage.getItem("token");

    // Convert dueDate to ISO string if backend expects LocalDateTime
    const taskToSend = {
      ...taskData,
      dueDate: taskData.dueDate
        ? new Date(taskData.dueDate).toISOString() // "2026-03-28T00:00:00.000Z"
        : null,
    };

    const response = await fetch(ENDPOINTS.addTask, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(taskToSend),
    });

    console.log("POST Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend Error:", errorText);
      throw new Error("Failed to add task");
    }

    return await response.json();
  } catch (error) {
    console.error("Add Task Error:", error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const token = localStorage.getItem("token"); // make sure token is stored on login
    if (!token) throw new Error("No auth token found");

    const response = await fetch(`${ENDPOINTS.deleteTask}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // 🔑 send token
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend Response:", text);
      throw new Error("Failed to delete task");
    }

    return true;
  } catch (error) {
    console.error("Delete Error:", error);
    throw error;
  }
};