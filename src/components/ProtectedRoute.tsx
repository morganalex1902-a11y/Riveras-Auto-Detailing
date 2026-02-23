import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ element, adminOnly = false }: ProtectedRouteProps) => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return element;
};
