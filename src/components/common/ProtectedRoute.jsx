import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("volunteer_token");
  const location = useLocation();

  if (!token) {
    // No token? Send to login but remember where they tried to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    // Check if the route requires specific roles (e.g., ADMIN only)
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // Role not authorized? Send back to their specific base dashboard
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  } catch (error) {
    // If token is malformed or expired, clear it and redirect
    localStorage.removeItem("volunteer_token");
    return <Navigate to="/login" replace />;
  }
}
