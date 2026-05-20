// store/slices/employeeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  softDeleteEmployee,
  importEmployeesExcel,
  exportEmployeesExcel,
} from "../../services/employeeService";
import { getTasks } from "../../services/taskService";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async ({ keyword = "", department = "", page = 0, size = 5 } = {}, { rejectWithValue }) => {
    try {
      const res = await getEmployees({ keyword, department, page, size });
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const fetchAllEmployees = createAsyncThunk(
  "employees/fetchAllUnpaginated",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getEmployees({ keyword: "", department: "", page: 0, size: 10000 });
      return res?.content || [];
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const addEmployeeThunk = createAsyncThunk(
  "employees/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await addEmployee(formData);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const updateEmployeeThunk = createAsyncThunk(
  "employees/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateEmployee(id, data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const deleteEmployeeThunk = createAsyncThunk(
  "employees/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteEmployee(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const softDeleteEmployeeThunk = createAsyncThunk(
  "employees/softDelete",
  async (id, { rejectWithValue }) => {
    try {
      await softDeleteEmployee(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

// ✅ accepts { file, onProgress }
export const importEmployeesExcelThunk = createAsyncThunk(
  "employees/importExcel",
  async ({ file, onProgress }, { rejectWithValue }) => {
    try {
      return await importEmployeesExcel(file, onProgress);
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

// ✅ accepts onProgress
export const exportEmployeesExcelThunk = createAsyncThunk(
  "employees/exportExcel",
  async (onProgress, { rejectWithValue }) => {
    try {
      await exportEmployeesExcel(onProgress);
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const fetchEmployeeTasks = createAsyncThunk(
  "employees/fetchTasks",
  async (employeeId, { rejectWithValue }) => {
    try {
      const res = await getTasks({ page: 0, size: 100 });
      const tasks = (res?.content || []).filter((task) => {
        if (task.employeeIds?.length > 0) {
          return task.employeeIds.map(Number).includes(Number(employeeId));
        }
        return Number(task.employeeId) === Number(employeeId);
      });
      return { employeeId, tasks };
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

// ── SLICE ──────────────────────────────────────────────

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    list:             [],
    allEmployees:     [],
    totalPages:       1,
    loading:          false,
    error:            null,
    keyword:          "",
    department:       "",
    page:             0,
    selectedEmployee: null,
    taskLoading:      false,
  },
  reducers: {
    setKeyword:          (state, action) => { state.keyword    = action.payload; state.page = 0; },
    setDepartment:       (state, action) => { state.department = action.payload; state.page = 0; },
    setPage:             (state, action) => { state.page       = action.payload; },
    clearSelected:       (state)         => { state.selectedEmployee = null; },
    // ✅ set employee immediately so drawer opens without waiting for tasks
    setSelectedEmployee: (state, action) => { state.selectedEmployee = action.payload; },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchEmployees.pending,   (state)         => { state.loading = true; state.error = null; })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading    = false;
        state.list       = action.payload?.content    || [];
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchEmployees.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchAllEmployees.fulfilled, (state, action) => { state.allEmployees = action.payload; })

      .addCase(addEmployeeThunk.pending,   (state)         => { state.loading = true; })
      .addCase(addEmployeeThunk.fulfilled, (state)         => { state.loading = false; })
      .addCase(addEmployeeThunk.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateEmployeeThunk.pending,   (state)         => { state.loading = true; })
      .addCase(updateEmployeeThunk.fulfilled, (state)         => { state.loading = false; })
      .addCase(updateEmployeeThunk.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((emp) => emp.employeeId !== action.payload);
      })
      .addCase(deleteEmployeeThunk.rejected, (state, action) => { state.error = action.payload; })

      .addCase(softDeleteEmployeeThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((emp) => emp.employeeId !== action.payload);
      })
      .addCase(softDeleteEmployeeThunk.rejected, (state, action) => { state.error = action.payload; })

      .addCase(fetchEmployeeTasks.pending, (state) => { state.taskLoading = true; })
      .addCase(fetchEmployeeTasks.fulfilled, (state, action) => {
        state.taskLoading = false;
        // ✅ append tasks to already-selected employee
        if (state.selectedEmployee) {
          state.selectedEmployee = {
            ...state.selectedEmployee,
            tasks: action.payload.tasks,
          };
        }
      })
      .addCase(fetchEmployeeTasks.rejected, (state, action) => {
        state.taskLoading = false;
        state.error       = action.payload;
      });
  },
});

export const {
  setKeyword,
  setDepartment,
  setPage,
  clearSelected,
  setSelectedEmployee,   // ✅ export
} = employeeSlice.actions;

export default employeeSlice.reducer;