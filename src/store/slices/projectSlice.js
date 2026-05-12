// store/slices/projectSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  softDeleteProject,
  assignEmployeeToProject,
  removeEmployeeFromProject,
} from "../../services/projectService";
import { getEmployees } from "../../services/employeeService";

// ── THUNKS ─────────────────────────────────────────────

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async ({ keyword = "", status = "", page = 0, size = 5 } = {}, { rejectWithValue }) => {
    try {
      const res = await getProjects({ keyword, status, page, size });
      return res; // { content: [], totalPages: N }
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const fetchAllEmployees = createAsyncThunk(
  "projects/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getEmployees({ page: 0, size: 100 });
      return res?.content || [];
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const addProjectThunk = createAsyncThunk(
  "projects/add",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await addProject(payload);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const updateProjectThunk = createAsyncThunk(
  "projects/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateProject(id, data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const deleteProjectThunk = createAsyncThunk(
  "projects/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProject(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const softDeleteProjectThunk = createAsyncThunk(
  "projects/softDelete",
  async (id, { rejectWithValue }) => {
    try {
      await softDeleteProject(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const assignEmployeeThunk = createAsyncThunk(
  "projects/assignEmployee",
  async ({ projectId, employeeId }, { rejectWithValue }) => {
    try {
      await assignEmployeeToProject(projectId, employeeId);
      return { projectId, employeeId: Number(employeeId) };
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const removeEmployeeThunk = createAsyncThunk(
  "projects/removeEmployee",
  async ({ projectId, employeeId }, { rejectWithValue }) => {
    try {
      await removeEmployeeFromProject(projectId, employeeId);
      return { projectId, employeeId: Number(employeeId) };
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

// ── SLICE ──────────────────────────────────────────────

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    list:        [],
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

      // ── fetchProjects ──
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading    = false;
        state.list       = action.payload?.content || [];
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── fetchAllEmployees ──
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
      })

      // ── addProject ──
      .addCase(addProjectThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProjectThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProjectThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── updateProject ──
      .addCase(updateProjectThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProjectThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProjectThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── deleteProject ──
      .addCase(deleteProjectThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (p) => p.projectId !== action.payload
        );
      })
      .addCase(deleteProjectThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(softDeleteProjectThunk.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (p) => p.projectId !== action.payload
        );
      })
      .addCase(softDeleteProjectThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── assignEmployee ──
      .addCase(assignEmployeeThunk.fulfilled, (state, action) => {
        const { projectId, employeeId } = action.payload;
        const project = state.list.find(
          (p) => Number(p.projectId) === Number(projectId)
        );
        if (project && !project.employeeIds?.includes(employeeId)) {
          project.employeeIds = [...(project.employeeIds || []), employeeId];
        }
      })
      .addCase(assignEmployeeThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── removeEmployee ──
      .addCase(removeEmployeeThunk.fulfilled, (state, action) => {
        const { projectId, employeeId } = action.payload;
        const project = state.list.find(
          (p) => Number(p.projectId) === Number(projectId)
        );
        if (project) {
          project.employeeIds = project.employeeIds?.filter(
            (id) => id !== employeeId
          );
        }
      })
      .addCase(removeEmployeeThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setKeyword, setStatus, setPage } = projectSlice.actions;
export default projectSlice.reducer;