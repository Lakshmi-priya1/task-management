
export const BASE_URL = "http://localhost:8080";

export const ENDPOINTS = {
  login: `/admin/login`,

  // TASKS
  addTask: `/tasks/add`,
  getAllTasks: `/tasks/all`,
  getTaskById: (id) => `/tasks/${id}`,
  updateTask: (id) => `/tasks/update/${id}`,
  deleteTask: (id) => `/tasks/delete/${id}`,

  // EMPLOYEES
  addEmployee: `/employees/add`,
  getAllEmployees: `/employees/all`,
  getEmployeeById: (id) => `/employees/${id}`,
  updateEmployee: (id) => `/employees/update/${id}`,
  deleteEmployee: (id) => `/employees/delete/${id}`,

  // PROJECTS
  addProject: `/projects/add`,
  getAllProjects: `/projects/all`,
  getProjectById: (id) => `/projects/${id}`,
  updateProject: (id) => `/projects/update/${id}`,
  deleteProject: (id) => `/projects/delete/${id}`,

  assignEmployeeToProject: (projectId, employeeId) =>
    `/projects/${projectId}/employees/${employeeId}`,

  removeEmployeeFromProject: (projectId, employeeId) =>
    `/projects/${projectId}/employees/${employeeId}`,

  // MILESTONES
  addMilestone: `/milestones/add`,
  getAllMilestones: `/milestones/all`,
  getMilestoneById: (id) => `/milestones/${id}`,
  getMilestonesByProject: (projectId) =>
    `/milestones/project/${projectId}`,
  updateMilestone: (id) => `/milestones/update/${id}`,
  deleteMilestone: (id) => `/milestones/delete/${id}`,

  // TASKS
assignTaskToEmployee: (taskId, employeeId) =>
  `/tasks/${taskId}/assign/${employeeId}`,

unassignTaskFromEmployee: (taskId, employeeId) =>
  `/tasks/${taskId}/unassign/${employeeId}`,   // added employeeId

getTasksByMilestone: (milestoneId) =>
  `/tasks/milestone/${milestoneId}`,
};