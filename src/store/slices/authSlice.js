// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../services/authService";

// Decode JWT payload without a library
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded; // { sub: "email@...", role: "ADMIN", iat: ..., exp: ... }
  } catch {
    return {};
  }
}

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await loginUser(formData);   // { token: "..." }
      const { sub: email, role } = decodeJwt(res.token);
      return { token: res.token, email, role };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    email: localStorage.getItem("email") || null,
    role:  localStorage.getItem("role")  || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.role  = null;
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token   = payload.token;
        state.email   = payload.email;
        state.role    = payload.role;
        localStorage.setItem("token", payload.token);
        localStorage.setItem("email", payload.email);
        localStorage.setItem("role",  payload.role);
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;