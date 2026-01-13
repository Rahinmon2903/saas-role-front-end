import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
       const res = await api.get("/admin/users");
    setUsers(res.data);
    toast.success("Users fetched successfully");
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
      
    }
   
  };

  const changeRole = async (id, role) => {
    try {
        await api.put(`/admin/users/${id}/role`, { role });
    toast.success("Role changed successfully");
    fetchUsers();
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to change role");
      
    }
  
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Management</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) =>
                    changeRole(u._id, e.target.value)
                  }
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
    </div>
  );
};

export default AdminUsers;
