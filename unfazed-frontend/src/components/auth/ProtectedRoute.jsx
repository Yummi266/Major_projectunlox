import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";

function ProtectedRoute({ children, allowedRole }) {
  const location = useLocation();
  const authenticated = authService.isAuthenticated();
  const role = authService.getRole();

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    if (role === "therapist") {
      return <Navigate to="/dashboard" replace />;
    } else if (role === "client") {
      return <Navigate to="/client/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
