import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faRobot,
  faPlus,
  faGlobe,
  faUser,
  faSignOutAlt,
  faBell,
  faSeedling,
  faChevronDown,
  faBars
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function NavLayout({ children, user }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [showPrograms, setShowPrograms] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const notifications = [
    "⚠️ Possible pest outbreak nearby",
    "🌦️ Heavy rain expected tomorrow",
    "🌱 Fertilizer support available"
  ];

  useEffect(() => {
    const root = document.documentElement;
    darkMode === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    localStorage.setItem("theme", darkMode);
  }, [darkMode]);

  const sidebarBtn =
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition hover:bg-green-500 dark:hover:bg-green-700";
  const sidebarSub =
    "w-full flex items-center gap-2 px-6 py-2 text-sm rounded-lg transition hover:bg-green-400 dark:hover:bg-green-600";

  const handleLogout = () => setShowLogoutModal(true);
const confirmLogout = () => {
  // ✅ Clear user session
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setShowLogoutModal(false);

  // ✅ Go to login page
  navigate("/login");
};


  const getInitials = (name) => {
    if (!name) return "F";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gray-200 dark:bg-slate-900 overflow-hidden">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 ${
          isCollapsed ? "w-20" : "w-64"
        } bg-green-700 dark:bg-green-900 text-white flex flex-col transition-all duration-300`}
      >
        {/* LOGO + COLLAPSE BUTTON */}
        <div className="flex items-center justify-between p-4 border-b border-green-600">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faSeedling} className="text-2xl text-green-300" />
            {!isCollapsed && <span className="font-bold text-lg">AgroCare</span>}
          </div>
          <button onClick={() => setIsCollapsed(!isCollapsed)}>
            <FontAwesomeIcon icon={faBars} className="text-white" />
          </button>
        </div>

        {/* USER INFO */}
        <div className="flex items-center gap-3 p-6">
          <div className="w-12 h-12 rounded-full bg-green-300 dark:bg-green-800 flex items-center justify-center text-green-900 dark:text-white font-bold text-lg">
            {getInitials(user?.name)}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold">{user?.name || "Farmer"}</span>
              <span className="text-xs">{user?.role || "Agricultural User"}</span>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <button onClick={() => navigate("/farmer/dashboard")} className={sidebarBtn}>
            <FontAwesomeIcon icon={faHome} /> {!isCollapsed && "Dashboard"}
          </button>
          <button onClick={() => navigate("/ai-chat")} className={sidebarBtn}>
            <FontAwesomeIcon icon={faRobot} /> {!isCollapsed && "AI Assistant"}
          </button>
          <button onClick={() => navigate("/report-complaint")} className={sidebarBtn}>
            <FontAwesomeIcon icon={faPlus} /> {!isCollapsed && "Report Complaint"}
          </button>

          {/* Programs Dropdown */}
          <button onClick={() => setShowPrograms(!showPrograms)} className={sidebarBtn}>
            <FontAwesomeIcon icon={faGlobe} /> {!isCollapsed && "Programs"}
            {!isCollapsed && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`ml-auto transition ${showPrograms ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {showPrograms && !isCollapsed && (
            <div className="space-y-1">
              <button onClick={() => navigate("/programs")} className={sidebarSub}>
                <FontAwesomeIcon icon={faGlobe} /> All Programs
              </button>
              <button onClick={() => navigate("/my-funds")} className={sidebarSub}>
                <FontAwesomeIcon icon={faSeedling} /> My Funds
              </button>
            </div>
          )}

          <button onClick={() => navigate("/profile")} className={sidebarBtn}>
            <FontAwesomeIcon icon={faUser} /> {!isCollapsed && "Profile"}
          </button>
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-3 hover:bg-green-500 transition mt-auto"
        >
          <FontAwesomeIcon icon={faSignOutAlt} /> {!isCollapsed && "Logout"}
        </button>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main
        className={`flex-1 flex flex-col ml-20 sm:ml-64 overflow-hidden`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-slate-900 shadow flex-shrink-0 sticky top-0 z-40">
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer">
              <FontAwesomeIcon
                icon={faBell}
                className="text-xl text-green-700 dark:text-green-300"
              />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            </div>
            <button
              onClick={() => setDarkMode(d => (d === "dark" ? "light" : "dark"))}
              className="px-3 py-1 rounded bg-gray-300 dark:bg-slate-700 dark:text-white"
            >
              {darkMode === "dark" ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        {/* SCROLLABLE CHILDREN */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-sm shadow-lg space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Confirm Logout</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-slate-600 dark:text-white hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
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
