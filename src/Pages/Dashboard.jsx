import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const role = auth.user.role;
  const navigate = useNavigate();

  const [adminStats, setAdminStats] = useState(null);
  //user Information
  const [userStats, setUserStats] = useState(null);
  const [managerStats, setManagerStats] = useState(null);

  useEffect(() => {
    if (role === "admin") loadAdminStats();
    if (role === "user") loadUserStats();
    if (role === "manager") loadManagerStats();
  }, [role]);

  /* ================= ADMIN ================= */

  const loadAdminStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setAdminStats(res.data);
    } catch {
      toast.error("Failed to load admin dashboard");
    }
  };

  /* ================= USER ================= */

  const loadUserStats = async () => {
    try {
      // Get user requests
      const res = await api.get("/requests");
      // Count
      const total = res.data.length;
      //filtering only pending request
      const pending = res.data.filter(
        (r) => r.status === "pending"
      ).length;

      setUserStats({
        total,
        pending,
        completed: total - pending,
      });
    } catch {
      toast.error("Failed to load user dashboard");
    }
  };

  /* ================= MANAGER ================= */

  const loadManagerStats = async () => {
    try {
      const res = await api.get("/requests/assigned");
      const total = res.data.length;
      const pending = res.data.filter(
        (r) => r.status === "pending"
      ).length;

      setManagerStats({
        total,
        pending,
        completed: total - pending,
      });
    } catch {
      toast.error("Failed to load manager dashboard");
    }
  };

  /* ================= ADMIN VIEW ================= */

  if (role === "admin" && adminStats) {
    const pieData = [
      {
        name: "Pending",
        value: adminStats.totalPendingRequests,
      },
      {
        name: "Processed",
        value:
          adminStats.totalApprovedRequests +
          adminStats.totalRejectedRequests,
      },
    ];

    const COLORS = ["#3B82F6", "#374151"];

    return (
      <main className="flex-1 bg-neutral-950 min-h-screen p-8 space-y-10 text-neutral-200">
        <Header
          title="Admin Dashboard"
          subtitle="System overview"
        />

        <PrimaryCard
          label="Pending Requests (Needs Action)"
          value={adminStats.totalPendingRequests}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Stat label="Total Users" value={adminStats.totalUsers} />
          <Stat
            label="Total Requests"
            value={adminStats.totalRequests}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Request Distribution" span={2}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={65}
                    outerRadius={95}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <InfoCard>
            Pending requests require assignment or approval.
            Processed requests include approved and rejected
            records.
          </InfoCard>
        </div>
      </main>
    );
  }

  /* ================= MANAGER VIEW ================= */

  if (role === "manager" && managerStats) {
    return (
      <main className="flex-1 bg-neutral-950 min-h-screen p-8 space-y-8 text-neutral-200">
        <Header
          title={`Welcome, ${auth.user.name}`}
          subtitle="Requests assigned to you"
        />

        <PrimaryCard
          label="Pending Approvals"
          value={managerStats.pending}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat label="Total Assigned" value={managerStats.total} />
          <Stat label="Pending" value={managerStats.pending} highlight />
          <Stat
            label="Completed"
            value={managerStats.completed}
          />
        </div>

        <Card title="Next Action">
          Review pending requests and approve or reject them
          to keep workflows moving.
          <div className="mt-4">
            <button
              onClick={() => navigate("/requests")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
            >
              Go to Requests
            </button>
          </div>
        </Card>
      </main>
    );
  }

  /* ================= USER VIEW ================= */

  if (role === "user" && userStats) {
    return (
      <main className="flex-1 bg-neutral-950 min-h-screen p-8 space-y-8 text-neutral-200">
        <Header
          title={`Welcome, ${auth.user.name}`}
          subtitle="Your request activity"
        />

        <Card title="Create a new request">
          Submit a request for approval or processing.
          <div className="mt-4">
            <button
              onClick={() => navigate("/requests")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
            >
              New Request
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat label="Total Requests" value={userStats.total} />
          <Stat label="Pending" value={userStats.pending} highlight />
          <Stat
            label="Completed"
            value={userStats.completed}
          />
        </div>

        <InfoCard>
          You will be notified when a request is approved or
          rejected.
        </InfoCard>
      </main>
    );
  }

  return null;
};

/* ================= REUSABLE COMPONENTS ================= */

const Header = ({ title, subtitle }) => (
  <div>
    <h2 className="text-xl font-semibold text-white">
      {title}
    </h2>
    <p className="text-sm text-neutral-500">
      {subtitle}
    </p>
  </div>
);

const PrimaryCard = ({ label, value }) => (
  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
    <p className="text-xs uppercase text-neutral-500">
      {label}
    </p>
    <p className="text-4xl font-semibold text-white mt-2">
      {value}
    </p>
  </div>
);

const Stat = ({ label, value, highlight }) => (
  <div
    className={`bg-neutral-900 border border-neutral-800 p-4 rounded
      ${
        highlight ? "border-blue-500 text-white" : "text-neutral-300"
      }`}
  >
    <p className="text-xs uppercase text-neutral-500">
      {label}
    </p>
    <p className="text-2xl font-semibold mt-2">
      {value}
    </p>
  </div>
);

const Card = ({ title, children, span }) => (
  <div
    className={`bg-neutral-900 border border-neutral-800 rounded-lg p-6
      ${span === 2 ? "lg:col-span-2" : ""}`}
  >
    <h3 className="text-sm font-semibold text-white mb-2">
      {title}
    </h3>
    <div className="text-sm text-neutral-400">
      {children}
    </div>
  </div>
);

const InfoCard = ({ children }) => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 text-sm text-neutral-400">
    {children}
  </div>
);

export default Dashboard;



