import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getOrganizations,
  addOrganization,
  updateOrganization,
  softDeleteOrganization,
} from "../../services/organizationService";

export const fetchOrganizations = createAsyncThunk(
  "organizations/fetchAll",
  async ({ keyword = "", page = 0, size = 5 } = {}, { rejectWithValue }) => {
    try {
      return await getOrganizations({ keyword, page, size });
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const addOrganizationThunk = createAsyncThunk(
  "organizations/add",
  async (data, { rejectWithValue }) => {
    try {
      return await addOrganization(data);
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const updateOrganizationThunk = createAsyncThunk(
  "organizations/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateOrganization(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const softDeleteOrganizationThunk = createAsyncThunk(
  "organizations/softDelete",
  async (id, { rejectWithValue }) => {
    try {
      await softDeleteOrganization(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

const organizationSlice = createSlice({
  name: "organizations",
  initialState: {
    list:       [],
    totalPages: 1,
    loading:    false,
    error:      null,
    keyword:    "",
    page:       0,
  },
  reducers: {
    setKeyword: (state, action) => { state.keyword = action.payload; state.page = 0; },
    setPage:    (state, action) => { state.page    = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading    = false;
        state.list       = action.payload?.content || [];
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addOrganizationThunk.pending,    (state) => { state.loading = true; })
      .addCase(addOrganizationThunk.fulfilled,  (state) => { state.loading = false; })
      .addCase(addOrganizationThunk.rejected,   (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateOrganizationThunk.pending,   (state) => { state.loading = true; })
      .addCase(updateOrganizationThunk.fulfilled, (state) => { state.loading = false; })
      .addCase(updateOrganizationThunk.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(softDeleteOrganizationThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((o) => o.orgId !== action.payload);
      })
      .addCase(softDeleteOrganizationThunk.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { setKeyword, setPage } = organizationSlice.actions;
export default organizationSlice.reducer;
