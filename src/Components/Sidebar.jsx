import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const role = auth?.user?.role;
  const location = useLocation();

  const navItem = (to, label) => {
    const active = location.pathname === to;

    return (
      <Link
        to={to}
        className={`block px-4 py-2 rounded-lg text-sm font-medium transition
          ${
            active
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-200"
          }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r px-4 py-6">
      {/* Brand */}
      <div className="mb-10 px-2">
        <h2 className="text-lg font-semibold text-gray-900">
          RBAC System
        </h2>
        <p className="text-xs text-gray-500">
          Internal dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItem("/dashboard", "Dashboard")}
        {navItem("/requests", "Requests")}

        {role === "admin" && (
          <>
            <div className="pt-4 pb-1 px-2 text-xs uppercase tracking-wide text-gray-400">
              Admin
            </div>
            {navItem("/admin/users", "User Management")}
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
