import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Users, FileText, Clock } from "lucide-react";

const Dashboard = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const role = auth.user.role;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === "admin") {
      fetchAdminStats();
    }
  }, [role]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch {
      toast.error("Unable to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Logged in as <span className="font-medium">{role.toUpperCase()}</span>
        </p>
      </div>

      {/* ADMIN DASHBOARD */}
      {role === "admin" && (
        <>
          {loading && (
            <p className="text-sm text-gray-500">Loading stats…</p>
          )}

          {!loading && stats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon={<Users className="w-6 h-6" />}
                  gradient="from-indigo-500 to-indigo-600"
                />
                <StatCard
                  title="Total Requests"
                  value={stats.totalRequests}
                  icon={<FileText className="w-6 h-6" />}
                  gradient="from-emerald-500 to-emerald-600"
                />
                <StatCard
                  title="Pending Requests"
                  value={stats.totalPendingRequests}
                  icon={<Clock className="w-6 h-6" />}
                  gradient="from-amber-500 to-amber-600"
                />
              </div>

              {/* Secondary section */}
              <div className="mt-10 bg-white border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  System overview
                </h3>
                <p className="text-sm text-gray-600">
                  Monitor user growth, request volume, and pending approvals
                  across the platform.
                </p>
              </div>
            </>
          )}
        </>
      )}

      {/* MANAGER / USER DASHBOARD */}
      {role !== "admin" && (
        <div className="bg-white border rounded-xl p-8 max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Use the sidebar to create new requests, track their status,
            and manage approvals assigned to you.
          </p>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, gradient }) => {
  return (
    <div
      className={`rounded-xl p-6 text-white bg-gradient-to-br ${gradient}
                  shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <h3 className="text-4xl font-semibold mt-2">
            {value}
          </h3>
        </div>
        <div className="opacity-90">{icon}</div>
      </div>
    </div>
  );
};

export default Dashboard;


