import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClipboardList,
  faUsers,
  faUser,
  faUserTie,
  faSignOutAlt,
  faBell,
  faSeedling,
  faChevronDown,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Outlet } from "react-router-dom";

export default function LeaderNavLayout({ user }) {
  const navigate = useNavigate();

  // ================= STATE =================
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [showComplaints, setShowComplaints] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Complaint filter (shared with pages)
  const [filter, setFilter] = useState("All");

  const onFilterComplaints = (status) => {
    setFilter(status);
    navigate("/leader/complaints"); // ✅ ENSURE NAVIGATION
  };

  // ================= DARK MODE =================
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode);
  }, [darkMode]);

  // ================= STYLES =================
  const sidebarBtn =
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition hover:bg-green-500 dark:hover:bg-green-700";

  const sidebarSub =
    "w-full flex items-center gap-2 px-6 py-2 text-sm rounded-lg transition hover:bg-green-400 dark:hover:bg-green-600";

  const getInitials = (name) => {
    if (!name) return "L";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ================= JSX =================
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900 overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 ${
          isCollapsed ? "w-20" : "w-64"
        } bg-green-700 dark:bg-green-900 text-white flex flex-col transition-all duration-300`}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between p-4 border-b border-green-600">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faSeedling}
              className="text-2xl text-green-300"
            />
            {!isCollapsed && (
              <span className="font-bold text-lg">AgroCare Leader</span>
            )}
          </div>
          <button onClick={() => setIsCollapsed(!isCollapsed)}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        {/* USER INFO */}
        <div className="flex items-center gap-3 p-6">
          <div className="w-12 h-12 rounded-full bg-green-300 dark:bg-green-800 flex items-center justify-center text-green-900 dark:text-white font-bold text-lg">
            {getInitials(user?.name)}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold">{user?.name || "Leader"}</span>
              <span className="text-xs">{user?.role || "Sector Leader"}</span>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <button onClick={() => navigate("/leader")} className={sidebarBtn}>
            <FontAwesomeIcon icon={faHome} />
            {!isCollapsed && "Dashboard"}
          </button>

          <button
            onClick={() => navigate("/leader/programs")}
            className={sidebarBtn}
          >
            <FontAwesomeIcon icon={faSeedling} />
            {!isCollapsed && "Programs"}
          </button>

          {/* COMPLAINTS */}
          <button
            onClick={() => setShowComplaints(!showComplaints)}
            className={sidebarBtn}
          >
            <FontAwesomeIcon icon={faClipboardList} />
            {!isCollapsed && "Complaints"}
            {!isCollapsed && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`ml-auto transition ${
                  showComplaints ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {showComplaints && !isCollapsed && (
            <div className="space-y-1">
              <button
                onClick={() => onFilterComplaints("All")}
                className={sidebarSub}
              >
                All Complaints
              </button>
              <button
                onClick={() => onFilterComplaints("Resolved")}
                className={sidebarSub}
              >
                Resolved
              </button>
              <button
                onClick={() => onFilterComplaints("Escalated")}
                className={sidebarSub}
              >
                Escalated
              </button>
            </div>
          )}

          <button
            onClick={() => navigate("/leader/farmers")}
            className={sidebarBtn}
          >
            <FontAwesomeIcon icon={faUsers} />
            {!isCollapsed && "Farmers"}
          </button>

          {/* ✅ AGRONOMISTS */}
          <button
            onClick={() => navigate("/leader/agronomist")}
            className={sidebarBtn}
          >
            <FontAwesomeIcon icon={faUserTie} />
            {!isCollapsed && "Agronomists"}
          </button>

          <button
            onClick={() => navigate("/leader/profile")}
            className={sidebarBtn}
          >
            <FontAwesomeIcon icon={faUser} />
            {!isCollapsed && "Profile"}
          </button>
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 px-4 py-3 hover:bg-green-500 transition"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          {!isCollapsed && "Logout"}
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main
        className={`flex-1 flex flex-col ${
          isCollapsed ? "ml-20" : "ml-64"
        } transition-all duration-300`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-slate-900 shadow sticky top-0 z-40">
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">
            Leader Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <FontAwesomeIcon
              icon={faBell}
              className="text-xl text-green-700 dark:text-green-300"
            />

            <button
              onClick={() =>
                setDarkMode((d) => (d === "dark" ? "light" : "dark"))
              }
              className="px-3 py-1 rounded bg-gray-300 dark:bg-slate-700 dark:text-white"
            >
              {darkMode === "dark" ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet context={{ filter, onFilterComplaints }} />
        </div>
      </main>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-2">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
