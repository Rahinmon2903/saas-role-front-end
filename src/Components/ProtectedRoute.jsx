import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (!auth) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(auth?.user?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
