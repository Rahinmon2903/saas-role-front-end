import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const Requests = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const role = auth.user.role;

  const [requests, setRequests] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  // User create
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Manager action
  const [remark, setRemark] = useState("");
  const [activeRequest, setActiveRequest] = useState(null);

  /* ===================== EFFECTS ===================== */

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (role === "admin") {
      fetchManagers();
    }
  }, [role]);

  /* ===================== FETCH ===================== */

  const fetchRequests = async () => {
    try {
      let res;
      if (role === "admin") {
        res = await api.get("/requests/all");
      } else if (role === "manager") {
        res = await api.get("/requests/assigned");
      } else {
        res = await api.get("/requests");
      }
      setRequests(res.data);
    } catch {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: workload-aware managers fetch
  const fetchManagers = async () => {
    try {
      const res = await api.get("/admin/managers/workload");
      setManagers(res.data);
    } catch {
      toast.error("Failed to load manager workload");
    }
  };

  /* ===================== USER ===================== */

  const createRequest = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");

    try {
      setSubmitting(true);
      await api.post("/requests/create", { title, description });
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

  /* ===================== ADMIN ===================== */

  const assignRequest = async (requestId, managerId) => {
    if (!managerId) return;

    try {
      await api.put(`/requests/${requestId}/assign`, { managerId });
      toast.success("Request assigned");
      fetchRequests();
      fetchManagers(); // refresh workload
    } catch {
      toast.error("Failed to assign request");
    }
  };

  /* ===================== MANAGER ===================== */

  const updateStatus = async (id, status) => {
    if (status === "rejected" && !remark.trim()) {
      return toast.error("Remark is required");
    }

    try {
      await api.put(`/requests/${id}`, { status, remark });
      toast.success("Request updated");
      setRemark("");
      setActiveRequest(null);
      fetchRequests();
    } catch {
      toast.error("Failed to update request");
    }
  };

  if (loading) {
    return <p className="p-8 text-gray-500">Loading requests…</p>;
  }

  /* ===================== UI ===================== */

  return (
    <div className="p-8 w-full bg-gray-50 min-h-screen space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          {role === "admin"
            ? "View and assign all requests"
            : role === "manager"
            ? "Review assigned requests"
            : "Create and track your requests"}
        </p>
      </div>

      {/* USER CREATE */}
      {role === "user" && (
        <div className="bg-white border rounded-xl p-6 max-w-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">New request</h3>
          <form onSubmit={createRequest} className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Request title"
              className="w-full border rounded-md px-3 py-2"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={3}
              className="w-full border rounded-md px-3 py-2"
            />
            <button
              disabled={submitting}
              className="bg-gray-900 text-white px-5 py-2 rounded-md"
            >
              {submitting ? "Submitting…" : "Submit request"}
            </button>
          </form>
        </div>
      )}

      {/* TABLE */}
      {requests.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
          No requests found
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Created by</th>
                <th className="p-4 text-left">Assigned to</th>
                <th className="p-4 text-left">Details</th>
                {role === "manager" && <th className="p-4">Action</th>}
              </tr>
            </thead>

            <tbody>
              {requests.map((r) => (
                <tr key={r._id} className="border-t align-top">
                  <td className="p-4 font-medium">{r.title}</td>

                  <td className="p-4">
                    <StatusBadge status={r.status} />
                  </td>

                  <td className="p-4">{r.createdBy?.name || "You"}</td>

                  {/* ADMIN ASSIGN WITH WORKLOAD */}
                  <td className="p-4">
                    {role === "admin" ? (
                      <select
                        value={r.assignedTo?._id || ""}
                        disabled={r.status !== "pending"}
                        onChange={(e) =>
                          assignRequest(r._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm w-full"
                      >
                        <option value="">Unassigned</option>

                        {managers.map((m) => (
                          <option
                            key={m._id}
                            value={m._id}
                            className={
                              m.pendingCount >= 5
                                ? "text-red-600"
                                : m.pendingCount >= 3
                                ? "text-yellow-600"
                                : ""
                            }
                          >
                            {m.name} ({m.pendingCount} pending)
                          </option>
                        ))}
                      </select>
                    ) : (
                      r.assignedTo?.name || "—"
                    )}
                  </td>

                  {/* DETAILS + HISTORY */}
                  <td className="p-4 text-gray-600">
                    <div>{r.remark || "—"}</div>

                    {r.history?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {r.history.map((h, i) => (
                          <div
                            key={i}
                            className="text-xs text-gray-500"
                          >
                            <span className="font-medium">
                              {h.action.toUpperCase()}
                            </span>{" "}
                            by {h.by?.name || "System"}
                            {h.remark && ` — ${h.remark}`}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* MANAGER ACTION */}
                  {role === "manager" && (
                    <td className="p-4 space-y-2">
                      {r.status === "pending" &&
                        (activeRequest === r._id ? (
                          <>
                            <textarea
                              value={remark}
                              onChange={(e) =>
                                setRemark(e.target.value)
                              }
                              placeholder="Add remark"
                              className="w-full border rounded px-2 py-1"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateStatus(r._id, "approved")
                                }
                                className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                              >
                                Confirm Approve
                              </button>
                              <button
                                onClick={() =>
                                  updateStatus(r._id, "rejected")
                                }
                                className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                              >
                                Confirm Reject
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setActiveRequest(r._id)
                              }
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                setActiveRequest(r._id)
                              }
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Reject
                            </button>
                          </div>
                        ))}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
      {status}
    </span>
  );
};

export default Requests;


