import { ENDPOINTS } from "../api/apiConfig";

// Get all tasks
export const getAllTasks = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(ENDPOINTS.getTasks, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
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

export const getTaskById = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${ENDPOINTS.getTaskById}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch task");
    }

    return await response.json();
  } catch (error) {
    console.error("Get Task Error:", error);
    throw error;
  }
};

// Get tasks by status
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

    const loggedUser = JSON.parse(localStorage.getItem("user"));

    const taskToSend = {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,

      dueDate: taskData.dueDate
        ? new Date(taskData.dueDate).toISOString().slice(0, 23)
        : null,

      projectId: taskData.projectId,
      milestoneId: taskData.milestoneId,
      remarks: taskData.remarks || "New Task",

      // assignedTo (FROM FORM)
      assignedTo: {
        employeeId: taskData.assignedTo,
        username: "temp",
        isActive: true,
        designation: "Employee",
      },

      // assignedBy (FROM LOGIN)
      assignedBy: {
        employeeId: loggedUser?.employeeId || "EMP001",
        username: loggedUser?.username || "admin",
        isActive: true,
        designation: "Manager",
      },

      isDeleted: false,
    };

    const response = await fetch(ENDPOINTS.addTask, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(taskToSend),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(err);
      throw new Error("Failed");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await fetch(`/api/task/update/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Update Task API error:", error);
    throw error;
  }
};

//  DELETE TASK
export const deleteTask = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const response = await fetch(`${ENDPOINTS.deleteTask}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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