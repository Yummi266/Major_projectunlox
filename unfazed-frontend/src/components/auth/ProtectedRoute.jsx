import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";

function ProtectedRoute({ children, allowedRole }) {
  const location = useLocation();
  const authenticated = authService.isAuthenticated();
  const role = authService.getRole();

  // If unauthenticated or token is expired, redirect to login with return path
  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role does not match the route requirement, redirect to the user's appropriate portal
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
