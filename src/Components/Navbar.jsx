import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FaBell,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  /* ================= FETCH ================= */

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch {
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  /* ================= ACTIONS ================= */

  const handleRead = async (n) => {
    if (!n.isRead) {
      await api.put(`/notifications/${n._id}/read`);
    }
    setOpen(false);
    fetchNotifications();
    if (n.link) navigate(n.link);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  /* ================= UI ================= */

  return (
    <header className="h-16 bg-neutral-900 border-b border-neutral-800 px-6 flex items-center justify-between">
      {/* LEFT — BRAND */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-blue-600/15 text-blue-400 flex items-center justify-center text-sm font-bold">
          RB
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white tracking-wide">
            RBAC Control Panel
          </h1>
          <p className="text-[11px] text-neutral-500">
            Internal system
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6 relative">
        {/* NOTIFICATIONS */}
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative text-neutral-400 hover:text-white transition focus:outline-none"
            aria-label="Notifications"
          >
            <FaBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] min-w-[16px] h-4 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-96 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl z-50">
              <div className="px-4 py-3 border-b border-neutral-800 flex justify-between items-center">
                <span className="text-sm font-semibold text-white">
                  Notifications
                </span>
                <span className="text-xs text-neutral-500">
                  {unreadCount} unread
                </span>
              </div>

              {notifications.length === 0 ? (
                <div className="p-6 text-sm text-neutral-500 text-center">
                  No notifications
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-neutral-800">
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleRead(n)}
                      className={`px-4 py-3 text-sm cursor-pointer transition
                        ${
                          !n.isRead
                            ? "bg-neutral-800 text-white"
                            : "text-neutral-400"
                        }
                        hover:bg-neutral-800`}
                    >
                      <p className="leading-snug">
                        {n.message}
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Click to view
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* USER */}
        <div className="flex items-center gap-3 pl-6 border-l border-neutral-800">
          <FaUserCircle className="text-neutral-500" size={20} />
          <div className="leading-tight">
            <p className="text-sm text-neutral-300">
              {auth?.user?.name}
            </p>
            <p className="text-[11px] text-neutral-500 uppercase tracking-wide">
              {auth?.user?.role}
            </p>
          </div>
          <button
            onClick={logout}
            className="ml-2 text-neutral-400 hover:text-red-400 transition"
            title="Logout"
          >
            <FaSignOutAlt size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

