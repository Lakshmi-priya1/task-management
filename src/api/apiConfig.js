
export const BASE_URL = "http://localhost:8080";

export const ENDPOINTS = {
  register: `/users/create`,
  getUser: `/users`,
  getUserById: (id) => `/users/${id}`,
  updateUser:(id)=>`/users/${id}`,
  deleteUser: (id) => `/users/${id}`,
  login: `/auth/login`,

  //organization
  addOrganization: `/organizations/add`,
  getAllOrganizations: `/organizations`,
  getOrganizationById: (id) => `/organizations/${id}`,
  updateOrganization: (id) => `/organizations/update/${id}`,
  deleteOrganization: (id) => `/organizations/delete/${id}`,
  softDeleteOrganization: (id) => `/organizations/soft-delete/${id}`,


  // TASKS
  addTask: `/tasks/add`,
  getAllTasks: `/tasks/all`,
  getTaskById: (id) => `/tasks/${id}`,
  updateTask: (id) => `/tasks/update/${id}`,
  deleteTask: (id) => `/tasks/delete/${id}`,
  softDeleteTask: (id) => `/tasks/soft-delete/${id}`,

  // EMPLOYEES
  addEmployee: `/employees/add`,
  getAllEmployees: `/employees/all`,
  getEmployeeById: (id) => `/employees/${id}`,
  updateEmployee: (id) => `/employees/update/${id}`,
  deleteEmployee: (id) => `/employees/delete/${id}`,
  softDeleteEmployee: (id) => `/employees/soft-delete/${id}`,
  bulkImportEmployees: `/employees/bulk`,
  importEmployeesExcel: `/employees/import`,
  exportEmployeesExcel: `/employees/export`,

  // PROJECTS
  addProject: `/projects/add`,
  getAllProjects: `/projects/all`,
  getProjectById: (id) => `/projects/${id}`,
  updateProject: (id) => `/projects/update/${id}`,
  deleteProject: (id) => `/projects/delete/${id}`,
  softDeleteProject: (id) => `/projects/soft-delete/${id}`,

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
  softDeleteMilestone: (id) => `/milestones/soft-delete/${id}`,

  // MY TASKS (for logged-in employee)
  getMyTasks: `/tasks/my-tasks`,

  // TASKS
assignTaskToEmployee: (taskId, employeeId) =>
  `/tasks/${taskId}/assign/${employeeId}`,

unassignTaskFromEmployee: (taskId, employeeId) =>
  `/tasks/${taskId}/unassign/${employeeId}`,   // added employeeId

getTasksByMilestone: (milestoneId) =>
  `/tasks/milestone/${milestoneId}`,

assignEmployeeToMilestone: (milestoneId, employeeId) =>
  `/milestones/${milestoneId}/assign/${employeeId}`,

unassignEmployeeFromMilestone: (milestoneId, employeeId) =>
  `/milestones/${milestoneId}/unassign/${employeeId}`,
};