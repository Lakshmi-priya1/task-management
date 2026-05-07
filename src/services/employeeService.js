import axiosInstance from "../api/axiosInstance";
import { BASE_URL, ENDPOINTS } from "../api/apiConfig";

const handleError = (error, fallbackMessage) => {
  const message =
    error.response?.data?.message ||
    error.message ||
    fallbackMessage;
  throw new Error(message);
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

  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch employees");
  }
};
// ================= GET BY ID =================
export const getEmployeeById = async (id) => {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.getEmployeeById(id)
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch employee");
  }
};

// ================= ADD =================
export const addEmployee = async (data) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.addEmployee, data);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to add employee");
  }
};

// ================= UPDATE =================
export const updateEmployee = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      ENDPOINTS.updateEmployee(id),
      data
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update employee");
  }
};

// ================= DELETE =================
export const deleteEmployee = async (id) => {
  try {
    await axiosInstance.delete(ENDPOINTS.deleteEmployee(id));
    return true;
  } catch (error) {
    handleError(error, "Failed to delete employee");
  }
};