import { ENDPOINTS } from "../api/apiConfig";

/* ================= COMMON HEADERS ================= */
const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/* ================= GET ALL (PAGINATION) ================= */
export const getEmployees = async (page, size) => {
  try {
    const response = await fetch(
      `${ENDPOINTS.getEmployees}?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) throw new Error(`Error: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

/* ================= ADD ================= */
export const addEmployee = async (employeeData) => {
  try {
    const response = await fetch(ENDPOINTS.addEmployee, {
      method: "POST",
      headers: getHeaders(), 
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Add Employee API error:", error);
    throw error;
  }
};

/* ================= UPDATE ================= */
export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const response = await fetch(
      `${ENDPOINTS.updateEmployee}/${employeeId}`,
      {
        method: "PUT",
        headers: getHeaders(), 
        body: JSON.stringify(employeeData),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Update Employee ${employeeId} error:`, error);
    throw error;
  }
};

/* ================= DELETE ================= */
export const deleteEmployee = async (employeeId) => {
  try {
    const response = await fetch(
      `${ENDPOINTS.deleteEmployee}/${employeeId}`,
      {
        method: "DELETE",
        headers: getHeaders(), 
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    return { success: true };
  } catch (error) {
    console.error(`Delete Employee ${employeeId} error:`, error);
    throw error;
  }
};