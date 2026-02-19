import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const Requests = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const role = auth.user.role;
  // for getting request from backend
  const [requests, setRequests] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  // user create
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("other");
  const [submitting, setSubmitting] = useState(false);

  //filtering
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // manager action
  const [remark, setRemark] = useState("");
  const [activeRequest, setActiveRequest] = useState(null);

  // history modal
  const [showHistory, setShowHistory] = useState(false);
  const [historyRequest, setHistoryRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
    if (role === "admin") fetchManagers();
  }, []);
  console.log(showHistory);

  /*  FETCH  */

  const fetchRequests = async () => {
    try {
      const res =
        role === "admin"
          ? await api.get("/requests/all")
          : role === "manager"
            ? await api.get("/requests/assigned")
            : await api.get("/requests");

      setRequests(res.data);
    } catch {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const res = await api.get("/admin/managers/workload");
      setManagers(res.data);
    } catch {
      toast.error("Failed to load managers");
    }
  };
  3;

  /* USER*/

  const createRequest = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title required");

    try {
      setSubmitting(true);
      await api.post("/requests/create", {
        title,
        description,
        priority,
        category,
      });
      toast.success("Request submitted");
      setTitle("");
      setDescription("");
      fetchRequests();
    } catch {
      toast.error("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  /* ADMIN  */

  const assignRequest = async (id, managerId) => {
    if (!managerId) return;
    try {
      await api.put(`/requests/${id}/assign`, { managerId });
      toast.success("Assigned");
      fetchRequests();
    } catch {
      toast.error("Assignment failed");
    }
  };

  /*MANAGER */

  const updateStatus = async (id, status) => {
    if (status === "rejected" && !remark.trim()) {
      return toast.error("Remark required");
    }

    try {
      await api.put(`/requests/${id}`, { status, remark });
      toast.success("Request updated");
      setRemark("");
      setActiveRequest(null);
      fetchRequests();
    } catch {
      toast.error("Update failed");
    }
  };

  const priorityColors = {
    low: "bg-green-500/10 text-green-400",
    medium: "bg-yellow-500/10 text-yellow-400",
    high: "bg-orange-500/10 text-orange-400",
    critical: "bg-red-500/10 text-red-400",
  };
  const getSLAStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);

    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diff < 0)
      return { label: "Overdue", style: "bg-red-500/10 text-red-400" };

    if (diff === 0)
      return { label: "Due Today", style: "bg-yellow-500/10 text-yellow-400" };

    return {
      label: `${diff} days left`,
      style: "bg-blue-500/10 text-blue-400",
    };
  };

  const analytics = {
    total: requests.length,

    open: requests.filter((r) => r.status === "open").length,

    inProgress: requests.filter((r) => r.status === "in_progress").length,

    resolved: requests.filter((r) => r.status === "resolved").length,

    overdue: requests.filter((r) => getSLAStatus(r.dueDate).label === "Overdue")
      .length,
  };
  const actionColors = {
    created: "bg-blue-400",
    assigned: "bg-purple-400",
    resolved: "bg-green-400",
    rejected: "bg-red-400",
  };

  const priorityStats = {
    low: requests.filter((r) => r.priority === "low").length,
    medium: requests.filter((r) => r.priority === "medium").length,
    high: requests.filter((r) => r.priority === "high").length,
    critical: requests.filter((r) => r.priority === "critical").length,
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (priorityFilter !== "all" && r.priority !== priorityFilter) return false;
    if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex-1 bg-neutral-950 p-8 text-neutral-400">Loading…</div>
    );
  }

  return (
    <main className="flex-1 bg-neutral-950 min-h-screen p-8 text-neutral-200 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-white">Requests</h1>
        <p className="text-sm text-neutral-500">
          {role === "admin"
            ? "Assign and oversee requests"
            : role === "manager"
              ? "Review assigned requests"
              : "Track your submitted requests"}
        </p>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <MetricCard title="Total" value={analytics.total} />
        <MetricCard title="Open" value={analytics.open} />
        <MetricCard title="In Progress" value={analytics.inProgress} />
        <MetricCard title="Resolved" value={analytics.resolved} />
        <MetricCard title="Overdue" value={analytics.overdue} danger />
      </div>
      {/* PRIORITY DISTRIBUTION */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 max-w-xs">
        <p className="text-xs text-neutral-500 mb-3">Priority Distribution</p>

        {Object.entries(priorityStats).map(([key, value]) => (
          <div key={key} className="flex justify-between text-xs py-1">
            <span className="text-neutral-400 capitalize">{key}</span>
            <span className="text-white">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Category</option>
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
          <option value="network">Network</option>
          <option value="access">Access</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* USER CREATE */}
      {role === "user" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-xl">
          <h3 className="text-sm font-semibold text-white mb-3">New Request</h3>
          <form onSubmit={createRequest} className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm"
            />
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">Critical Priority</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm"
            >
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="network">Network</option>
              <option value="access">Access</option>
              <option value="other">Other</option>
            </select>

            <button
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </form>
        </div>
      )}

      {/* ADMIN TABLE */}
      {role === "admin" ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-800 text-neutral-400">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Created By</th>
                <th className="p-3 text-left">Assigned To</th>
                <th className="p-3 text-right">History</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((r) => (
                <tr
                  key={r._id}
                  className="border-t border-neutral-800 hover:bg-neutral-800/40"
                >
                  <td className="p-3 font-medium text-white">{r.title}</td>
                  <td className="p-3">
                    <StatusBadge status={r.status} />
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${priorityColors[r.priority]}`}
                      >
                        {r.priority}
                      </span>

                      <span className="px-2 py-1 rounded text-xs bg-neutral-800">
                        {r.category}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 mt-1">
                      Due: {new Date(r.dueDate).toLocaleDateString()}
                    </p>

                    {(() => {
                      const sla = getSLAStatus(r.dueDate);

                      return (
                        <span
                          className={`px-2 py-1 rounded text-xs ${sla.style}`}
                        >
                          {sla.label}
                        </span>
                      );
                    })()}
                  </td>

                  <td className="p-3 text-neutral-400">{r.createdBy?.name}</td>
                  <td className="p-3">
                    <select
                      value={r.assignedTo?._id || ""}
                      disabled={r.status !== "open"}
                      onChange={(e) => assignRequest(r._id, e.target.value)}
                      className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs w-full"
                    >
                      <option value="">Unassigned</option>
                      //
                      {managers.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name} · {m.pendingCount}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setHistoryRequest(r);
                        setShowHistory(true);
                      }}
                      className="text-blue-400 text-xs hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* USER + MANAGER CARDS */
        <div className="space-y-4">
          {filteredRequests.map((r) => (
            <div
              key={r._id}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3"
            >
              <div className="flex justify-between">
                <h3 className="text-white font-medium">{r.title}</h3>
                <StatusBadge status={r.status} />
              </div>

              <p className="text-sm text-neutral-400">{r.description}</p>

              <button
                onClick={() => {
                  setHistoryRequest(r);
                  setShowHistory(true);
                }}
                className="text-xs text-blue-400 hover:underline"
              >
                View history
              </button>

              {role === "manager" && r.status === "in_progress" && (
                <div className="space-y-2 border-t border-neutral-800 pt-3">
                  {activeRequest === r._id && (
                    <textarea
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="Add remark"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-sm"
                    />
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        activeRequest === r._id
                          ? updateStatus(r._id, "resolved")
                          : setActiveRequest(r._id)
                      }
                      className="bg-green-600 px-3 py-1 rounded text-xs"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() =>
                        activeRequest === r._id
                          ? updateStatus(r._id, "rejected")
                          : setActiveRequest(r._id)
                      }
                      className="bg-red-600 px-3 py-1 rounded text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* HISTORY MODAL */}
      {showHistory && historyRequest && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-lg">
            <div className="flex justify-between px-5 py-3 border-b border-neutral-800">
              <h3 className="text-white text-sm font-semibold">
                Request History
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {historyRequest.history.map((h, i) => (
                <div key={i} className="flex gap-3">
                  {/* TIMELINE LINE + DOT */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-2 h-2 rounded-full mt-1
    ${actionColors[h.action] || "bg-neutral-500"}`}
                    />

                    {i !== historyRequest.history.length - 1 && (
                      <div className="w-px flex-1 bg-neutral-700 mt-1" />
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="pb-4">
                    <p className="text-sm font-semibold text-white">
                      {h.action.replace("_", " ").toUpperCase()}
                    </p>

                    <p className="text-xs text-neutral-400">
                      By {h.by?.name} ({h.by?.role})
                    </p>

                    <p className="text-xs text-neutral-500">
                      {new Date(h.at).toLocaleString()}
                    </p>

                    {h.remark && (
                      <p className="text-xs text-neutral-300 mt-1">
                        {h.remark}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    open: "bg-yellow-500/10 text-yellow-400",
    in_progress: "bg-blue-500/10 text-blue-400",
    resolved: "bg-green-500/10 text-green-400",
    closed: "bg-neutral-500/10 text-neutral-400",
    rejected: "bg-red-500/10 text-red-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${map[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
};
const MetricCard = ({ title, value, danger }) => {
  return (
    <div
      className={`bg-neutral-900 border border-neutral-800 rounded-lg p-4
      ${danger ? "border-red-500/30" : ""}`}
    >
      <p className="text-xs text-neutral-500">{title}</p>

      <p
        className={`text-lg font-semibold
        ${danger ? "text-red-400" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
};

export default Requests;
