// store/slices/taskSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  softDeleteTask,
  assignEmployeeToTask,
  unassignEmployeeFromTask,
} from "../../services/taskService";
import { getProjects }   from "../../services/projectService";
import { getMilestones } from "../../services/mileStoneService";
import { getEmployees }  from "../../services/employeeService";

// ── THUNKS ─────────────────────────────────────────────

export const fetchTasks = createAsyncThunk(
  "tasks/fetchAll",
  async ({ keyword = "", status = "", page = 0, size = 5 } = {}, { rejectWithValue }) => {
    try {
      const res = await getTasks({ keyword, status, page, size });
      return res; // { content: [], totalPages: N }
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const fetchProjectsForTask = createAsyncThunk(
  "tasks/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProjects({ page: 0, size: 100 });
      return res?.content || [];
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const fetchMilestonesForTask = createAsyncThunk(
  "tasks/fetchMilestones",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMilestones({ page: 0, size: 100 });
      return res?.content || [];
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const fetchEmployeesForTask = createAsyncThunk(
  "tasks/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getEmployees({ page: 0, size: 100 });
      return res?.content || [];
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const addTaskThunk = createAsyncThunk(
  "tasks/add",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await addTask(payload);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const updateTaskThunk = createAsyncThunk(
  "tasks/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateTask(id, data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const deleteTaskThunk = createAsyncThunk(
  "tasks/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTask(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const softDeleteTaskThunk = createAsyncThunk(
  "tasks/softDelete",
  async (id, { rejectWithValue }) => {
    try {
      await softDeleteTask(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const assignEmployeeToTaskThunk = createAsyncThunk(
  "tasks/assignEmployee",
  async ({ taskId, employeeId }, { rejectWithValue }) => {
    try {
      await assignEmployeeToTask(taskId, employeeId);
      return { taskId, employeeId: Number(employeeId) };
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const unassignEmployeeFromTaskThunk = createAsyncThunk(
  "tasks/unassignEmployee",
  async ({ taskId, employeeId }, { rejectWithValue }) => {
    try {
      await unassignEmployeeFromTask(taskId, employeeId);
      return { taskId, employeeId: Number(employeeId) };
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

// ── SLICE ──────────────────────────────────────────────

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    list:        [],
    projects:    [],
    milestones:  [],
    employees:   [],
    totalPages:  1,
    loading:     false,
    error:       null,
    // filters
    keyword:     "",
    status:      "",
    page:        0,
  },
  reducers: {
    setKeyword: (state, action) => { state.keyword = action.payload; state.page = 0; },
    setStatus:  (state, action) => { state.status  = action.payload; state.page = 0; },
    setPage:    (state, action) => { state.page    = action.payload; },
  },
  extraReducers: (builder) => {
    builder

      // ── fetchTasks ──
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading    = false;
        state.list       = action.payload?.content || [];
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── fetchProjects ──
      .addCase(fetchProjectsForTask.fulfilled, (state, action) => {
        state.projects = action.payload;
      })

      // ── fetchMilestones ──
      .addCase(fetchMilestonesForTask.fulfilled, (state, action) => {
        state.milestones = action.payload;
      })

      // ── fetchEmployees ──
      .addCase(fetchEmployeesForTask.fulfilled, (state, action) => {
        state.employees = action.payload;
      })

      // ── addTask ──
      .addCase(addTaskThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTaskThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── updateTask ──
      .addCase(updateTaskThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTaskThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── deleteTask ──
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(deleteTaskThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(softDeleteTaskThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(softDeleteTaskThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── assignEmployee ──
      .addCase(assignEmployeeToTaskThunk.fulfilled, (state, action) => {
        const { taskId, employeeId } = action.payload;
        const task = state.list.find(
          (t) => Number(t.id) === Number(taskId)
        );
        if (task && !task.employeeIds?.includes(employeeId)) {
          task.employeeIds = [...(task.employeeIds || []), employeeId];
        }
      })
      .addCase(assignEmployeeToTaskThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── unassignEmployee ──
      .addCase(unassignEmployeeFromTaskThunk.fulfilled, (state, action) => {
        const { taskId, employeeId } = action.payload;
        const task = state.list.find(
          (t) => Number(t.id) === Number(taskId)
        );
        if (task) {
          task.employeeIds = task.employeeIds?.filter(
            (id) => id !== employeeId
          );
        }
      })
      .addCase(unassignEmployeeFromTaskThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setKeyword, setStatus, setPage } = taskSlice.actions;
export default taskSlice.reducer;