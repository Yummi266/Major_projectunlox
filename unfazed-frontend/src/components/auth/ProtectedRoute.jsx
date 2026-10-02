import { Navigate } from "react-router-dom";
import { authService } from "../../services/authService";

function ProtectedRoute({ children, allowedRole }) {
  const token = authService.getToken();
  const role = authService.getRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    if (role === "client") {
      return <Navigate to="/client/dashboard" replace />;
    }
    if (role === "therapist") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
