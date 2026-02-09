// src/layouts/DonorNavLayout.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faSignOutAlt,
  faBell,
  faLeaf,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function DonorNavLayout({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    darkMode === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    localStorage.setItem("theme", darkMode);
  }, [darkMode]);

  const getInitials = (name) => {
    if (!name) return "D";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/login"; // logout redirect
  };

  // dynamic button styling based on active route
  const sidebarBtn = (path) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-green-600 dark:hover:bg-green-700 ${
      location.pathname === path ? "bg-green-600 dark:bg-green-700" : ""
    }`;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-full z-50 ${
          isCollapsed ? "w-20" : "w-64"
        } bg-green-700 dark:bg-green-900 text-white transition-all duration-300`}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between p-4 border-b border-green-600">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLeaf} className="text-2xl text-green-300" />
            {!isCollapsed && <span className="font-bold text-lg">Donor</span>}
          </div>
          <button onClick={() => setIsCollapsed(!isCollapsed)}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        {/* USER */}
        <div className="flex items-center gap-3 p-6">
          <div className="w-12 h-12 rounded-full bg-green-300 text-green-900 font-bold flex items-center justify-center">
            {getInitials(user?.name)}
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-semibold">{user?.name || "Donor"}</p>
              <p className="text-xs">Donor</p>
            </div>
          )}
        </div>

        {/* NAV */}
        <nav className="px-3 space-y-1">
          <button
            onClick={() => navigate("/donor")}
            className={sidebarBtn("/donor")}
          >
            <FontAwesomeIcon icon={faHome} />
            {!isCollapsed && "Dashboard"}
          </button>

          <button
            onClick={() => navigate("/donor/profile")}
            className={sidebarBtn("/donor/profile")}
          >
            <FontAwesomeIcon icon={faUser} />
            {!isCollapsed && "Profile"}
          </button>
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 px-4 py-3 hover:bg-green-600 mt-auto w-full"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          {!isCollapsed && "Logout"}
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 ml-20 sm:ml-64 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 shadow sticky top-0 z-40">
          <h1 className="text-xl font-bold text-green-700 dark:text-green-400">
            Donor Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <FontAwesomeIcon
              icon={faBell}
              className="text-green-600 dark:text-green-400"
            />
            <button
              onClick={() => setDarkMode((d) => (d === "dark" ? "light" : "dark"))}
              className="px-3 py-1 rounded bg-gray-300 dark:bg-slate-700"
            >
              {darkMode === "dark" ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-sm">
            <h2 className="text-lg font-bold mb-3">Confirm Logout</h2>
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
