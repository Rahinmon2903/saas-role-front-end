import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const Requests = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const role = auth.user.role;

  const [requests, setRequests] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  // user create
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  /* USER*/

  const createRequest = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title required");

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

  if (loading) {
    return (
      <div className="flex-1 bg-neutral-950 p-8 text-neutral-400">
        Loading…
      </div>
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

      {/* USER CREATE */}
      {role === "user" && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-xl">
          <h3 className="text-sm font-semibold text-white mb-3">
            New Request
          </h3>
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
              {requests.map((r) => (
                <tr
                  key={r._id}
                  className="border-t border-neutral-800 hover:bg-neutral-800/40"
                >
                  <td className="p-3 font-medium text-white">
                    {r.title}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="p-3 text-neutral-400">
                    {r.createdBy?.name}
                  </td>
                  <td className="p-3">
                    <select
                      value={r.assignedTo?._id || ""}
                      disabled={r.status !== "pending"}
                      onChange={(e) =>
                        assignRequest(r._id, e.target.value)
                      }
                      className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs w-full"
                    >
                      <option value="">Unassigned</option>
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
          {requests.map((r) => (
            <div
              key={r._id}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3"
            >
              <div className="flex justify-between">
                <h3 className="text-white font-medium">{r.title}</h3>
                <StatusBadge status={r.status} />
              </div>

              <p className="text-sm text-neutral-400">
                {r.description}
              </p>

              <button
                onClick={() => {
                  setHistoryRequest(r);
                  setShowHistory(true);
                }}
                className="text-xs text-blue-400 hover:underline"
              >
                View history
              </button>

              {role === "manager" && r.status === "pending" && (
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
                          ? updateStatus(r._id, "approved")
                          : setActiveRequest(r._id)
                      }
                      className="bg-green-600 px-3 py-1 rounded text-xs"
                    >
                      Approve
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
                <div
                  key={i}
                  className="border-l-2 border-neutral-700 pl-4"
                >
                  <p className="text-sm text-white">
                    {h.action.toUpperCase()}
                  </p>
                  <p className="text-xs text-neutral-400">
                    By {h.by?.name} ({h.by?.role})
                  </p>
                  {h.remark && (
                    <p className="text-xs text-neutral-300 mt-1">
                      “{h.remark}”
                    </p>
                  )}
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
    pending: "bg-yellow-500/10 text-yellow-400",
    approved: "bg-green-500/10 text-green-400",
    rejected: "bg-red-500/10 text-red-400",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs ${map[status]}`}>
      {status}
    </span>
  );
};

export default Requests;



