import React, { useState, createContext } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import PageContent from "./dashboard/PageContent";
import Dashboard from "./dashboard/Dashboard";
import Users from "./pages/Users";
import Task  from "./pages/Task";
import Employee from "./pages/Employee";
import Organization from "./pages/Organization";
import Project from "./pages/Project";
import MileStone from "./pages/MileStone";
import Hierarchy from "./pages/Hierarchy";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import Unauthorized from "./pages/Unauthorised";


// eslint-disable-next-line react-refresh/only-export-components
export const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: "light" });

const ROLES = {
  ADMIN: "ADMIN",
  PM:    "PROJECT_MANAGER",
  LEAD:  "TEAM_LEAD",
  EMP:   "EMPLOYEE",
};

export default function App() {
  const [mode, setMode] = useState("light");

  const theme = createTheme({
    palette: { mode },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: "16px",
            background: theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.75)",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.mode === "dark" ? "#6366f1" : "#8b5cf6",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6366f1",
            },
          }),
          notchedOutline: ({ theme }) => ({
            borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
          }),
          input: ({ theme }) => ({
            color: theme.palette.mode === "dark" ? "#e2e8f0" : "#1e293b",
            "&::placeholder": {
              color: theme.palette.mode === "dark" ? "#64748b" : "#94a3b8",
              opacity: 1,
            },
          }),
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.mode === "dark" ? "#6366f1" : "#8b5cf6",
          }),
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: ({ theme }) => ({
            color: theme.palette.mode === "dark" ? "#6366f1" : "#8b5cf6",
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: "none",
            backgroundColor: theme.palette.mode === "dark" ? "#1a1a2e" : undefined,
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderColor: theme.palette.mode === "dark" ? "#2d2d4e" : undefined,
          }),
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundImage: "none",
            backgroundColor: theme.palette.mode === "dark" ? "#1a1a2e" : undefined,
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundImage: "none",
            backgroundColor: theme.palette.mode === "dark" ? "#13131f" : undefined,
          }),
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundImage: "none",
            backgroundColor: theme.palette.mode === "dark" ? "#1a1a2e" : undefined,
          }),
        },
      },
    },
  });

  const toggleColorMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"));
  

  return (
    <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <HashRouter>
          <Routes>
            {/* Public */}
            <Route path="/"               element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/unauthorized"     element={<Unauthorized />} />

            {/* ADMIN — full access */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index                  element={<PageContent />} />
              <Route path="dashboard"       element={<PageContent />} />
              <Route path="users"           element={<Users />} />
              <Route path="organization"    element={<Organization />} />
              <Route path="employee"        element={<Employee />} />
              <Route path="project"         element={<Project />} />
              <Route path="milestone"       element={<MileStone />} />
              <Route path="task"            element={<Task />} />
              <Route path="hierarchy"       element={<Hierarchy />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>

            {/* PROJECT_MANAGER — no users, no delete project (handled in UI) */}
            <Route
              path="/pm"
              element={
                <ProtectedRoute allowedRoles={[ROLES.PM]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index                  element={<PageContent />} />
              <Route path="dashboard"       element={<PageContent />} />
              <Route path="employee"        element={<Employee />} />
              <Route path="project"         element={<Project />} />
              <Route path="milestone"       element={<MileStone />} />
              <Route path="task"            element={<Task />} />
              <Route path="hierarchy"       element={<Hierarchy />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>

            {/* TEAM_LEAD — view projects, manage milestones */}
            <Route
              path="/lead"
              element={
                <ProtectedRoute allowedRoles={[ROLES.LEAD]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index                  element={<PageContent />} />
              <Route path="dashboard"       element={<PageContent />} />
              <Route path="project"         element={<Project />} />
              <Route path="milestone"       element={<MileStone />} />
              <Route path="task"            element={<Task />} />
              <Route path="hierarchy"       element={<Hierarchy />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>

            {/* EMPLOYEE — view projects, update task status only */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute allowedRoles={[ROLES.EMP]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index                  element={<PageContent />} />
              <Route path="dashboard"       element={<PageContent />} />
              <Route path="project"         element={<Project />} />
              <Route path="task"            element={<Task />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/unauthorized" replace />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
