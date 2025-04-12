import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const role = localStorage.getItem("userRole");
  const location = useLocation();

  if (!role || !allowedRoles.includes(role)) {
    // 👇 Redirect to login and store intended location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;