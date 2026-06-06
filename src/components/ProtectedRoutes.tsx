import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRoutesProps {
  allowedRoles: string[];
}

const ProtectedRoutes = ({ allowedRoles }: ProtectedRoutesProps) => {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const role = sessionStorage.getItem("userRole");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;