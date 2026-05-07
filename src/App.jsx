import React, { useState, createContext } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import PageContent from "./dashboard/PageContent";
import Dashboard from "./dashboard/Dashboard";
import Users from "./pages/Users";
import Employee from "./pages/Employee";
import Project from "./pages/Project";
import MileStone from "./pages/MileStone";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";

// eslint-disable-next-line react-refresh/only-export-components
export const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: "light" });

export default function App() {
  const [mode, setMode] = useState("light");

  const theme = createTheme({ palette: { mode } });

  const toggleColorMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<PageContent />} />
              <Route path="users" element={<Users />} />
              <Route path="employee" element={<Employee />} />
              <Route path="project" element={<Project />} />
              <Route path="milestone" element={<MileStone />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
