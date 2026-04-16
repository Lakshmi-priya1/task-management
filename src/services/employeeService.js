import { BASE_URL,ENDPOINTS } from "../api/apiConfig";

// ================= COMMON HEADERS =================
const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getEmployees = async ({
  keyword = "",
  department = "",
  page = 0,
  size = 5,
} = {}) => {
  let url = `${BASE_URL}/employees?page=${page}&size=${size}`;

  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
  if (department) url += `&department=${encodeURIComponent(department)}`;

  const response = await fetch(url, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  return await response.json();
};
// ================= GET BY ID =================
export const getEmployeeById = async (id) => {
  const response = await fetch(ENDPOINTS.getEmployeeById(id), {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch employee");

  return await response.json();
};

// ================= ADD =================
export const addEmployee = async (data) => {
  const response = await fetch(ENDPOINTS.addEmployee, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to add employee");

  return await response.json();
};

// ================= UPDATE =================
export const updateEmployee = async (id, data) => {
  const response = await fetch(ENDPOINTS.updateEmployee(id), {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update employee");

  return await response.json();
};

// ================= DELETE =================
export const deleteEmployee = async (id) => {
  const response = await fetch(ENDPOINTS.deleteEmployee(id), {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error("Failed to delete employee");

  return true;
};