import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faGlobe,
  faExclamationTriangle,
  faSeedling,
  faUser,
  faSignOutAlt,
  faBell,
  faChevronDown,
  faBars
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function AdminLayout({ children, user }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") || "light");
  const [showUsersSubmenu, setShowUsersSubmenu] = useState(false);
  const [showProgramsSubmenu, setShowProgramsSubmenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const notifications = [
    "New complaint submitted",
    "Donation received",
    "User registration pending approval"
  ];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode === "dark");
    localStorage.setItem("theme", darkMode);
  }, [darkMode]);

  const sidebarBtn = "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition hover:bg-green-500 dark:hover:bg-green-700";
  const sidebarSub = "w-full flex items-center gap-2 px-6 py-2 text-sm rounded-lg transition hover:bg-green-400 dark:hover:bg-green-600";

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
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
              <span className="font-semibold">{user?.name || "Admin"}</span>
              <span className="text-xs">{user?.role || "Administrator"}</span>
            </div>
          )}
        </div>

        {/* SIDEBAR LINKS */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <button onClick={() => navigate("/admin/dashboard")} className={sidebarBtn}>
            <FontAwesomeIcon icon={faHome} /> {!isCollapsed && "Dashboard"}
          </button>

          {/* Users Submenu */}
          <button onClick={() => setShowUsersSubmenu(!showUsersSubmenu)} className={sidebarBtn}>
            <FontAwesomeIcon icon={faUsers} /> {!isCollapsed && "Users"}
            {!isCollapsed && <FontAwesomeIcon icon={faChevronDown} className={`ml-auto transition ${showUsersSubmenu ? "rotate-180" : ""}`} />}
          </button>
          {showUsersSubmenu && !isCollapsed && (
            <div className="space-y-1">
              <button onClick={() => navigate("/admin/users/farmers")} className={sidebarSub}>Farmers</button>
              <button onClick={() => navigate("/admin/users/leaders")} className={sidebarSub}>Leaders</button>
              <button onClick={() => navigate("/admin/users/agronomists")} className={sidebarSub}>Agronomists</button>
              <button onClick={() => navigate("/admin/users/donors")} className={sidebarSub}>Donors</button>
            </div>
          )}

          {/* Programs Submenu */}
          <button onClick={() => setShowProgramsSubmenu(!showProgramsSubmenu)} className={sidebarBtn}>
            <FontAwesomeIcon icon={faGlobe} /> {!isCollapsed && "Programs"}
            {!isCollapsed && <FontAwesomeIcon icon={faChevronDown} className={`ml-auto transition ${showProgramsSubmenu ? "rotate-180" : ""}`} />}
          </button>
          {showProgramsSubmenu && !isCollapsed && (
            <div className="space-y-1">
              <button onClick={() => navigate("/admin/programs")} className={sidebarSub}>All Programs</button>
              <button onClick={() => navigate("/admin/programs/contributions")} className={sidebarSub}>Contributions</button>
            </div>
          )}

          {/* Complaints */}
          <button onClick={() => navigate("/admin/complaints")} className={sidebarBtn}>
            <FontAwesomeIcon icon={faExclamationTriangle} /> {!isCollapsed && "Complaints"}
          </button>

          {/* Profile */}
          <button onClick={() => navigate("/profile")} className={sidebarBtn}>
            <FontAwesomeIcon icon={faUser} /> {!isCollapsed && "Profile"}
          </button>
        </nav>

        {/* LOGOUT */}
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 hover:bg-green-500 transition mt-auto">
          <FontAwesomeIcon icon={faSignOutAlt} /> {!isCollapsed && "Logout"}
        </button>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className={`flex-1 flex flex-col ml-20 sm:ml-64 overflow-hidden`}>
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-slate-900 shadow flex-shrink-0 sticky top-0 z-40">
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer">
              <FontAwesomeIcon icon={faBell} className="text-xl text-green-700 dark:text-green-300"/>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            </div>
            <button onClick={() => setDarkMode(d => (d === "dark" ? "light" : "dark"))} className="px-3 py-1 rounded bg-gray-300 dark:bg-slate-700 dark:text-white">
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
            <p className="text-gray-600 dark:text-gray-300">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-slate-600 dark:text-white hover:bg-gray-400 transition">Cancel</button>
              <button onClick={confirmLogout} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
