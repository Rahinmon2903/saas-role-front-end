import React from 'react';
import { Link } from "react-router-dom";

const Sidebar = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const role = auth?.user?.role;

  return (
    <div className="w-60 bg-gray-100 h-full p-4">
      <ul className="space-y-3">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/requests">Requests</Link></li>

        {role === "admin" && (
          <li><Link to="/admin/users">Users</Link></li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
