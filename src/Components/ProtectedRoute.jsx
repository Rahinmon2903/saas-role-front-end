import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const location = useLocation();

  let auth = null;

  try {
    auth = JSON.parse(localStorage.getItem("auth"));
  } catch {
    auth = null;
  }

  /* Not logged in */
  if (!auth?.token || !auth?.user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  /*  Role restriction */
  if (roles && !roles.includes(auth.user.role)) {
    return <Navigate to="/login" replace />;
    // OR /unauthorized if you build that page
  }

  return children;
};

export default ProtectedRoute;

