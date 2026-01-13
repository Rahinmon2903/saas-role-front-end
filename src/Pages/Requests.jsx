import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const Requests = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const role = auth.user.role;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [remark, setRemark] = useState("");
  const [activeRequest, setActiveRequest] = useState(null);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (role === "admin") {
      fetchManagers();
    }
  }, []);

  const fetchManagers = async () => {
    try {
      const res = await api.get("/admin/users");
      setManagers(res.data.filter((user) => user.role == "manager"));
    } catch (error) {
      toast.error("Failed to fetch managers");
    }
  };

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

  const createRequest = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

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

  const updateStatus = async (id, status) => {
    if (status === "rejected" && !remark.trim()) {
      toast.error("Remark is required");
      return;
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

  return (
    <div className="p-8 w-full bg-gray-50 min-h-screen space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          {role === "user"
            ? "Create and track your submitted requests"
            : "Review and act on assigned requests"}
        </p>
      </div>

      {/* USER: Create Request */}
      {role === "user" && (
        <div className="bg-white border rounded-xl p-6 max-w-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            New request
          </h3>

          <form onSubmit={createRequest} className="space-y-4">
            <input
              type="text"
              placeholder="Request title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-gray-900"
            />

            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-gray-900"
              rows={3}
            />

            <button
              type="submit"
              disabled={submitting}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-md
                         font-medium hover:bg-gray-800 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit request"}
            </button>
          </form>
        </div>
      )}

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
          No requests found
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Created by</th>
                <th className="p-4 text-left">Remark</th>
                {role === "manager" && (
                  <th className="p-4 text-left">Action</th>
                )}
              </tr>
            </thead>

            <tbody>
              {requests.map((r) => (
                <tr
                  key={r._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-900">{r.title}</td>

                  <td className="p-4">
                    <StatusBadge status={r.status} />
                  </td>

                  <td className="p-4 text-gray-700">
                    {r.createdBy?.name || "You"}
                  </td>

                  <td className="p-4 text-gray-600">{r.remark || "—"}</td>

                  {role === "manager" && (
                    <td className="p-4 space-y-2">
                      {activeRequest === r._id && (
                        <textarea
                          value={remark}
                          onChange={(e) => setRemark(e.target.value)}
                          placeholder="Add remark"
                          className="w-full border rounded-md px-2 py-1"
                        />
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setActiveRequest(r._id);
                            updateStatus(r._id, "approved");
                          }}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs
                                     hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => {
                            setActiveRequest(r._id);
                            updateStatus(r._id, "rejected");
                          }}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs
                                     hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
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
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full
                  text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default Requests;
