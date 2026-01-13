import { useEffect, useState } from "react";
import api from "../services/api";

const Requests = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const role = auth.user.role;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      let res;

      if (role === "manager") {
        res = await api.get("/requests/assigned");
      } else {
        res = await api.get("/requests");
      }

      setRequests(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    let remark = "";

    if (status === "rejected") {
      remark = prompt("Enter remark (required for rejection):");
      if (!remark || !remark.trim()) {
        alert("Remark is required to reject a request");
        return;
      }
    } else {
      remark = prompt("Enter remark (optional):") || "";
    }

    try {
      await api.put(`/requests/${id}`, {
        status,
        remark,
      });
      fetchRequests();
    } catch (error) {
      console.error(error);
      alert("Failed to update request status");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">No requests found</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Created By</th>
              <th className="p-2 border">Remark</th>
              {role === "manager" && (
                <th className="p-2 border">Action</th>
              )}
            </tr>
          </thead>

          <tbody>
            {requests.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-2 border">{r.title}</td>
                <td className="p-2 border">{r.status}</td>
                <td className="p-2 border">
                  {r.createdBy?.name || "You"}
                </td>
                <td className="p-2 border">
                  {r.remark || "-"}
                </td>

                {role === "manager" && (
                  <td className="p-2 border">
                    <button
                      className="px-2 py-1 bg-green-500 text-white mr-2"
                      onClick={() =>
                        updateStatus(r._id, "approved")
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white"
                      onClick={() =>
                        updateStatus(r._id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Requests;
