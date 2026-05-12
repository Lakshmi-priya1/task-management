// store/slices/milestoneSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMilestones,
  getMilestoneById,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  softDeleteMilestone,
  assignEmployeeToMilestone,
  unassignEmployeeFromMilestone,
} from "../../services/mileStoneService";
import { getProjects } from "../../services/projectService";
import { getEmployees } from "../../services/employeeService";
import { getTasks }     from "../../services/taskService";

// ── THUNKS ─────────────────────────────────────────────

export const fetchMilestones = createAsyncThunk(
  "milestones/fetchAll",
  async ({ keyword = "", projectId = "", page = 0, size = 5 } = {}, { rejectWithValue }) => {
    try {
      const res = await getMilestones({ keyword, projectId, page, size });
      return res; // { content: [], totalPages: N }
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const fetchMilestoneById = createAsyncThunk(
  "milestones/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getMilestoneById(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const fetchProjectsForMilestone = createAsyncThunk(
  "milestones/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProjects({ page: 0, size: 100 });
      return res?.content || [];
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const fetchEmployeesForMilestone = createAsyncThunk(
  "milestones/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getEmployees({ page: 0, size: 100 });
      return res?.content || [];
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const fetchTasksForMilestone = createAsyncThunk(
  "milestones/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getTasks({ page: 0, size: 100 });
      return res?.content || [];
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const addMilestoneThunk = createAsyncThunk(
  "milestones/add",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await addMilestone(payload);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const updateMilestoneThunk = createAsyncThunk(
  "milestones/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateMilestone(id, data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const deleteMilestoneThunk = createAsyncThunk(
  "milestones/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteMilestone(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const softDeleteMilestoneThunk = createAsyncThunk(
  "milestones/softDelete",
  async (id, { rejectWithValue }) => {
    try {
      await softDeleteMilestone(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const assignEmployeeToMilestoneThunk = createAsyncThunk(
  "milestones/assignEmployee",
  async ({ milestoneId, employeeId }, { rejectWithValue }) => {
    try {
      await assignEmployeeToMilestone(milestoneId, employeeId);
      return { milestoneId, employeeId: Number(employeeId) };
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const unassignEmployeeFromMilestoneThunk = createAsyncThunk(
  "milestones/unassignEmployee",
  async ({ milestoneId, employeeId }, { rejectWithValue }) => {
    try {
      await unassignEmployeeFromMilestone(milestoneId, employeeId);
      return { milestoneId, employeeId: Number(employeeId) };
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

// ── SLICE ──────────────────────────────────────────────

const milestoneSlice = createSlice({
  name: "milestones",
  initialState: {
    list:          [],
    projects:      [],
    employees:     [],
    tasks:         [],
    selected:      null,
    totalPages:    1,
    loading:       false,
    error:         null,
    // filters
    keyword:       "",
    projectFilter: "",
    page:          0,
  },
  reducers: {
    setKeyword:       (state, action) => { state.keyword       = action.payload; state.page = 0; },
    setProjectFilter: (state, action) => { state.projectFilter = action.payload; state.page = 0; },
    setPage:          (state, action) => { state.page          = action.payload; },
    clearSelected:    (state)         => { state.selected      = null; },
  },
  extraReducers: (builder) => {
    builder

      // ── fetchMilestones ──
      .addCase(fetchMilestones.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchMilestones.fulfilled, (state, action) => {
        state.loading    = false;
        state.list       = action.payload?.content || [];
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchMilestones.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── fetchMilestoneById ──
      .addCase(fetchMilestoneById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(fetchMilestoneById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── fetchProjects ──
      .addCase(fetchProjectsForMilestone.fulfilled, (state, action) => {
        state.projects = action.payload;
      })

      // ── fetchEmployees ──
      .addCase(fetchEmployeesForMilestone.fulfilled, (state, action) => {
        state.employees = action.payload;
      })

      // ── fetchTasks ──
      .addCase(fetchTasksForMilestone.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })

      // ── addMilestone ──
      .addCase(addMilestoneThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMilestoneThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addMilestoneThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── updateMilestone ──
      .addCase(updateMilestoneThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMilestoneThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateMilestoneThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── deleteMilestone ──
      .addCase(deleteMilestoneThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (m) => m.milestoneId !== action.payload
        );
      })
      .addCase(deleteMilestoneThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(softDeleteMilestoneThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (m) => m.milestoneId !== action.payload
        );
      })
      .addCase(softDeleteMilestoneThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── assignEmployee ──
      .addCase(assignEmployeeToMilestoneThunk.fulfilled, (state, action) => {
        const { milestoneId, employeeId } = action.payload;
        const milestone = state.list.find(
          (m) => Number(m.milestoneId) === Number(milestoneId)
        );
        if (milestone && !milestone.employeeIds?.includes(employeeId)) {
          milestone.employeeIds = [...(milestone.employeeIds || []), employeeId];
        }
      })
      .addCase(assignEmployeeToMilestoneThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── unassignEmployee ──
      .addCase(unassignEmployeeFromMilestoneThunk.fulfilled, (state, action) => {
        const { milestoneId, employeeId } = action.payload;
        const milestone = state.list.find(
          (m) => Number(m.milestoneId) === Number(milestoneId)
        );
        if (milestone) {
          milestone.employeeIds = milestone.employeeIds?.filter(
            (id) => id !== employeeId
          );
        }
      })
      .addCase(unassignEmployeeFromMilestoneThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },

});

export const {
  setKeyword,
  setProjectFilter,
  setPage,
  clearSelected,
} = milestoneSlice.actions;
export default milestoneSlice.reducer;