import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 🔓 Always allow public routes
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return children;
  }

  if (loading) return <p className="p-6">Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
