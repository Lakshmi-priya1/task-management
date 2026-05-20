import axiosInstance from "../api/axiosInstance";
import { BASE_URL, ENDPOINTS } from "../api/apiConfig";

const handleError = (error, fallbackMessage) => {
  if (error.response) throw error;
  throw new Error(error.message || fallbackMessage);
};

export const getEmployees = async ({
  keyword = "",
  department = "",
  page = 0,
  size = 5,
} = {}) => {
  let url = `${BASE_URL}/employees?page=${page}&size=${size}`;
  if (keyword)    url += `&keyword=${encodeURIComponent(keyword)}`;
  if (department) url += `&department=${encodeURIComponent(department)}`;
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch employees");
  }
};

export const getEmployeeById = async (id) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.getEmployeeById(id));
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch employee");
  }
};

export const addEmployee = async (data) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.addEmployee, data);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to add employee");
  }
};

export const updateEmployee = async (id, data) => {
  try {
    const response = await axiosInstance.put(ENDPOINTS.updateEmployee(id), data);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update employee");
  }
};

export const deleteEmployee = async (id) => {
  try {
    await axiosInstance.delete(ENDPOINTS.deleteEmployee(id));
    return true;
  } catch (error) {
    handleError(error, "Failed to delete employee");
  }
};

export const softDeleteEmployee = async (id) => {
  try {
    await axiosInstance.delete(ENDPOINTS.softDeleteEmployee(id));
    return true;
  } catch (error) {
    handleError(error, "Failed to soft delete employee");
  }
};

export const bulkImportEmployees = async (data) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.bulkImportEmployees, data);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to bulk import employees");
  }
};

// ================= IMPORT EXCEL — faster with timeout =================
export const importEmployeesExcel = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post(
      ENDPOINTS.importEmployeesExcel,
      formData,
      {
        timeout: 60000, // 60s for large files
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to import employees from Excel");
  }
};

// ================= EXPORT EXCEL — faster with responseType stream =================
export const exportEmployeesExcel = async (onProgress) => {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.exportEmployeesExcel,
      {
        responseType: "blob",
        timeout: 60000,
        onDownloadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      }
    );

    // ✅ Use streamed blob directly — faster than creating object URL repeatedly
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url  = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href  = url;
    link.setAttribute("download", `employees_${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    // ✅ Delay revoke so browser finishes download
    setTimeout(() => window.URL.revokeObjectURL(url), 3000);
  } catch (error) {
    handleError(error, "Failed to export employees");
  }
};