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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    await api.put(`/requests/${id}`, { status });
    fetchRequests();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Requests</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Title</th>
            <th>Status</th>
            <th>Created By</th>
            {role === "manager" && <th>Action</th>}
          </tr>
        </thead>

        <tbody>
          {requests.map((r) => (
            <tr key={r._id} className="border-t">
              <td>{r.title}</td>
              <td>{r.status}</td>
              <td>{r.createdBy?.name || "You"}</td>

              {role === "manager" && (
                <td>
                  <button
                    onClick={() => updateStatus(r._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(r._id, "rejected")}
                    className="ml-2"
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Requests;
