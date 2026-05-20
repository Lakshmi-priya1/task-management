import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/userService";

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getUsers();
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const createUserThunk = createAsyncThunk(
  "users/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createUser(data);
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

// ✅ NEW
export const updateUserThunk = createAsyncThunk(
  "users/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateUser(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteUser(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { error: err.message });
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    list:       [],
    totalPages: 1,
    loading:    false,
    error:      null,
    keyword:    "",
    role:       "",
    page:       0,
  },
  reducers: {
    setKeyword: (state, { payload }) => { state.keyword = payload; state.page = 0; },
    setRole:    (state, { payload }) => { state.role    = payload; state.page = 0; },
    setPage:    (state, { payload }) => { state.page    = payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list    = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchUsers.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(createUserThunk.fulfilled, (state) => { state.loading = false; })

      // ✅ NEW — update the item in-place so UI stays in sync without re-fetch
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.list.findIndex((u) => u.userId === payload.userId);
        if (idx !== -1) state.list[idx] = payload;
      })

      .addCase(deleteUserThunk.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((u) => u.userId !== payload);
      });
  },
});

export const { setKeyword, setRole, setPage } = userSlice.actions;
export default userSlice.reducer;