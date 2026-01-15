import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaUsers,
} from "react-icons/fa";

const Sidebar = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const role = auth?.user?.role;
  const location = useLocation();

  const Item = ({ to, label, Icon }) => {
    const active = location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-2.5 text-sm
          border-l-4 transition
          ${
            active
              ? "bg-neutral-800 border-blue-500 text-white font-semibold"
              : "border-transparent text-neutral-400 hover:bg-neutral-800"
          }`}
      >
        <Icon className="text-base" />
        {label}
      </Link>
    );
  };

  return (
    <aside className="w-64 min-h-screen bg-neutral-900 border-r border-neutral-800 flex flex-col">
      {/* HEADER */}
      <div className="px-5 py-4 border-b border-neutral-800">
        <h1 className="text-sm font-semibold text-white uppercase tracking-wide">
          RBAC SYSTEM
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Internal Control Panel
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 py-4">
        <Item
          to="/dashboard"
          label="Dashboard"
          Icon={FaTachometerAlt}
        />
        <Item
          to="/requests"
          label="Requests"
          Icon={FaFileAlt}
        />

        {role === "admin" && (
          <>
            <div className="mt-6 px-4 text-xs font-semibold uppercase text-neutral-500">
              Administration
            </div>
            <Item
              to="/admin/users"
              label="User Management"
              Icon={FaUsers}
            />
          </>
        )}
      </nav>

      {/* FOOTER */}
      <div className="px-5 py-3 border-t border-neutral-800 text-xs text-neutral-500">
        Role:{" "}
        <span className="font-semibold text-neutral-200">
          {role}
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
