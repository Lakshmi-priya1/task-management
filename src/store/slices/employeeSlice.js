// store/slices/employeeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  softDeleteEmployee,
} from "../../services/employeeService";
import { getTasks } from "../../services/taskService";

// ── THUNKS ─────────────────────────────────────────────

export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async ({ keyword = "", department = "", page = 0, size = 5 } = {}, { rejectWithValue }) => {
    try {
      const res = await getEmployees({ keyword, department, page, size });
      return res; // { content: [], totalPages: N }
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

// ── NEW: fetch every employee (unpaginated) for department dropdown ──
export const fetchAllEmployees = createAsyncThunk(
  "employees/fetchAllUnpaginated",
  async (_, { rejectWithValue }) => {
    try {
      // request a large page so we get every employee in one shot
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
    list:         [],
    allEmployees: [], // ← full unfiltered list for department dropdown
    totalPages:   1,
    loading:      false,
    error:        null,
    // filters
    keyword:      "",
    department:   "",
    page:         0,
    // for view drawer
    selectedEmployee: null,
    taskLoading:      false,
  },
  reducers: {
    setKeyword:    (state, action) => { state.keyword    = action.payload; state.page = 0; },
    setDepartment: (state, action) => { state.department = action.payload; state.page = 0; },
    setPage:       (state, action) => { state.page       = action.payload; },
    clearSelected: (state)         => { state.selectedEmployee = null; },
  },
  extraReducers: (builder) => {
    builder

      // ── fetchEmployees (paginated) ──
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading    = false;
        state.list       = action.payload?.content || [];
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── fetchAllEmployees (unpaginated, for dropdown) ──
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.allEmployees = action.payload;
      })

      // ── addEmployee ──
      .addCase(addEmployeeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addEmployeeThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addEmployeeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── updateEmployee ──
      .addCase(updateEmployeeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmployeeThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateEmployeeThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── deleteEmployee ──
      .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (emp) => emp.employeeId !== action.payload
        );
      })
      .addCase(deleteEmployeeThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(softDeleteEmployeeThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (emp) => emp.employeeId !== action.payload
        );
      })
      .addCase(softDeleteEmployeeThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── fetchEmployeeTasks ──
      .addCase(fetchEmployeeTasks.pending, (state) => {
        state.taskLoading = true;
      })
      .addCase(fetchEmployeeTasks.fulfilled, (state, action) => {
        state.taskLoading = false;
        const emp = state.list.find(
          (e) => Number(e.employeeId) === Number(action.payload.employeeId)
        );
        if (emp) {
          state.selectedEmployee = { ...emp, tasks: action.payload.tasks };
        }
      })
      .addCase(fetchEmployeeTasks.rejected, (state, action) => {
        state.taskLoading = false;
        state.error       = action.payload;
      });
  },
});

export const { setKeyword, setDepartment, setPage, clearSelected } = employeeSlice.actions;
export default employeeSlice.reducer;