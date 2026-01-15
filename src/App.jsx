import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import ProtectedRoute from "./Components/ProtectedRoute";
import Loading from "./Components/Loading";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Requests from "./Pages/Requests";
import AdminUsers from "./Pages/AdminUsers";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

const AppLayout = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <Loading show={loading} />

      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />

        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navbar />
              <div className="flex">
                <Sidebar />
                <Dashboard />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Navbar />
              <div className="flex">
                <Sidebar />
                <Requests />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Navbar />
              <div className="flex">
                <Sidebar />
                <AdminUsers />
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
