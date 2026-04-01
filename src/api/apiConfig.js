export const BASE_URL = "https://cq11cmqs-8082.inc1.devtunnels.ms";

export const ENDPOINTS = {
  login: `${BASE_URL}/api/auth/login`,
  register: `${BASE_URL}/api/auth/register`,
  
  addTask: `${BASE_URL}/api/task/add`,
  getTasks: `${BASE_URL}/api/task/get`,
  getTaskById: `${BASE_URL}/api/task/get`,
  getTasksByStatus: `${BASE_URL}/api/task/get/view`,
  updateTask: `${BASE_URL}/api/task/update`,
  deleteTask: `${BASE_URL}/api/task/delete`, 

  addEmployee:`${BASE_URL}/api/employee/add`,
  getEmployees: `${BASE_URL}/api/employee/get`,
  updateEmployee: `${BASE_URL}/api/employee/update`,
  deleteEmployee: `${BASE_URL}/api/employee/hard-delete`,

  
};