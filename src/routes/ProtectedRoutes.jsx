import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Unauthorized from "../pages/Unauthorised";


function ProtectedRoute({ children, allowedRoles = [] }) {
  const { token, role } = useSelector((state) => state.auth);

  // Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role for this route
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;