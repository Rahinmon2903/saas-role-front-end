

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
    <header className="h-14 bg-neutral-900 border-b border-neutral-800 px-6 flex items-center justify-between">
      {/* LEFT */}
      <div>
        <h1 className="text-sm font-semibold text-white uppercase tracking-wide">
          RBAC Control Panel
        </h1>
        <p className="text-[11px] text-neutral-500">
          Internal system
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6 relative">
        {/* NOTIFICATION */}
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative text-neutral-300 hover:text-white"
          >
            <FaBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-96 bg-neutral-900 border border-neutral-800 rounded shadow-xl z-50">
              <div className="px-4 py-2 border-b border-neutral-800 text-sm font-semibold text-white">
                Notifications
              </div>

              {notifications.length === 0 ? (
                <div className="p-4 text-sm text-neutral-500">
                  No notifications
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleRead(n)}
                      className={`px-4 py-3 text-sm cursor-pointer border-b border-neutral-800
                        ${
                          !n.isRead
                            ? "bg-neutral-800 text-white"
                            : "text-neutral-400"
                        }
                        hover:bg-neutral-800`}
                    >
                      {n.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* USER */}
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-neutral-400" size={18} />
          <span className="text-sm text-neutral-300">
            {auth?.user?.name}
          </span>
          <button
            onClick={logout}
            className="text-neutral-400 hover:text-red-400"
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
