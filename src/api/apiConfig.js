export const BASE_URL = "http://localhost:8080";

export const ENDPOINTS = {
  login: `${BASE_URL}/admin/login`,
  
  addTask: `${BASE_URL}/tasks/add`,
  getAllTasks: `${BASE_URL}/tasks/all`,
  getTaskById: (id) => `${BASE_URL}/tasks/all/${id}`,
  updateTask: (id) => `${BASE_URL}/tasks/update/${id}`,
  deleteTask: (id) => `${BASE_URL}/tasks/delete/${id}`,

  addEmployee: `${BASE_URL}/employees/add`,
  getAllEmployees: `${BASE_URL}/employees/all`,
  getEmployeeById: (id) => `${BASE_URL}/employees/all/${id}`,
  updateEmployee: (id) => `${BASE_URL}/employees/update/${id}`,
  deleteEmployee: (id) => `${BASE_URL}/employees/delete/${id}`,
}

