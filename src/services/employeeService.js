import { ENDPOINTS } from "../api/apiConfig";

export const getEmployees = async () => {
  const res = await fetch(ENDPOINTS.users);
  if (!res.ok) throw new Error("Failed to fetch employees");
  return res.json();
};

export const getEmployeeById = async (id) => {
  const res = await fetch(`${ENDPOINTS.users}/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch employee with id ${id}`);
  return res.json();
};

export const addEmployee = async (employee) => {
  const res = await fetch(ENDPOINTS.users, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
  if (!res.ok) throw new Error("Failed to add employee");
  return res.json();
};

export const updateEmployee = async (id, employee) => {
  const res = await fetch(`${ENDPOINTS.users}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
  if (!res.ok) throw new Error("Failed to update employee");
  return res.json();
};

export const deleteEmployee = async (id) => {
  const res = await fetch(`${ENDPOINTS.users}/${id}`, {
     method: "DELETE" 
    });
  if (!res.ok) throw new Error("Failed to delete employee");
  return true;
};