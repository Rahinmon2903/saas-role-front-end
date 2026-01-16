import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Get users
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (user, newRole) => {
    // Prevent role change because same role avoid unexpected execution
    if (user.role === newRole) return;
    // Confirm role change
    const confirm = window.confirm(
      `Change role of "${user.name}" from ${user.role.toUpperCase()} to ${newRole.toUpperCase()}?`
    );
    // Cancel role change
    if (!confirm) return;

    try {
      // Update user role
      setUpdatingId(user._id);
      //sending data to backend
      await api.put(`/admin/users/${user._id}/role`, {
        role: newRole,
      });
      // Success
      toast.success("Role updated");
      loadUsers();
    } catch {
      // Error
      toast.error("Failed to update role");
    } finally {
      
      setUpdatingId(null);
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
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Control access levels and administrative privileges
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-neutral-800 text-neutral-400 uppercase text-[11px] tracking-wide">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
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
                  <div className="text-xs text-neutral-500">
                    User ID: {u._id.slice(-6)}
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
                    disabled={updatingId === u._id}
                    value={u.role}
                    onChange={(e) =>
                      changeRole(u, e.target.value)
                    }
                    className="bg-neutral-950 border border-neutral-700 rounded-md px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>

                  {updatingId === u._id && (
                    <p className="text-xs text-neutral-500 mt-1">
                      Updating…
                    </p>
                  )}
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



const RoleBadge = ({ role }) => {
  const styles = {
    admin: "bg-red-500/15 text-red-400",
    manager: "bg-blue-500/15 text-blue-400",
    user: "bg-green-500/15 text-green-400",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${styles[role]}`}
    >
      {role.toUpperCase()}
    </span>
  );
};

export default AdminUsers;
