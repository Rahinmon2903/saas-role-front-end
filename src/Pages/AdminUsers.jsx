import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to change role");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-neutral-950 p-8 text-neutral-400">
        Loading users…
      </div>
    );
  }

  return (
    <main className="flex-1 bg-neutral-950 min-h-screen p-8 text-neutral-200 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-white">
          User Management
        </h1>
        <p className="text-sm text-neutral-500">
          Manage roles and access permissions
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-800 text-neutral-400">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Current Role</th>
              <th className="p-4 text-left">Change Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-t border-neutral-800 hover:bg-neutral-800/40 transition"
              >
                <td className="p-4">
                  <div className="font-medium text-white">
                    {u.name}
                  </div>
                </td>

                <td className="p-4 text-neutral-400">
                  {u.email}
                </td>

                <td className="p-4">
                  <RoleBadge role={u.role} />
                </td>

                <td className="p-4">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      changeRole(u._id, e.target.value)
                    }
                    className="bg-neutral-950 border border-neutral-700 rounded px-3 py-1 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-6 text-center text-neutral-500">
            No users found
          </div>
        )}
      </div>
    </main>
  );
};

/* ================= UI HELPERS ================= */

const RoleBadge = ({ role }) => {
  const styles = {
    admin: "bg-red-500/10 text-red-400",
    manager: "bg-blue-500/10 text-blue-400",
    user: "bg-green-500/10 text-green-400",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${styles[role]}`}
    >
      {role}
    </span>
  );
};

export default AdminUsers;
