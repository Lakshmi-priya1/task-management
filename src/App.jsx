import { HashRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import PageContent from "./dashboard/PageContent";
import Dashboard from "./dashboard/Dashboard";
import Users from "./task/Users";
import Employee from "./employee/Employee";
import EmployeeDetails from "./employee/EmployeeDetails";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./routes/ProtectedRoutes";

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <HashRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
       
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 🔒 PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            //<ProtectedRoute>
              <Dashboard />
            //</ProtectedRoute>
          }
        >
          {/* ✅ CHILD ROUTES MUST BE INSIDE */}
          <Route index element={<PageContent />} />
          <Route path="users" element={<Users />} />
          <Route path="employee" element={<Employee />} />
          <Route path="employee/:id" element={<EmployeeDetails />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

      </Routes>
    </HashRouter>
  );
}

export default App;
