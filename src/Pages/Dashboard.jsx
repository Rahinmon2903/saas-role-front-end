import { useEffect, useState } from "react";
import api from "../services/api";

const Dashboard = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const role = auth.user.role;

  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (role === "admin") {
    fetchAdminStats();
  }
   
  }, [role]);

  const fetchAdminStats = async () => {
    const res = await api.get("/admin/stats");
    setStats(res.data);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Welcome, {role.toUpperCase()}
      </h2>

      {role === "admin" && stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="border p-4">
            <p>Total Users</p>
            <h3>{stats.totalUsers}</h3>
          </div>

          <div className="border p-4">
            <p>Total Requests</p>
            <h3>{stats.totalRequests}</h3>
          </div>

          <div className="border p-4">
            <p>Pending Requests</p>
            <h3>{stats.totalPendingRequests}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

