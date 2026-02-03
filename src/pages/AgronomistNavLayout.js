import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClipboardList,
  faUser,
  faSignOutAlt,
  faBell,
  faLeaf,
  faChevronDown,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Outlet, useNavigate } from "react-router-dom";

export default function AgronomistNavLayout({ user }) {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showComplaints, setShowComplaints] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Table filter state
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const root = document.documentElement;
    darkMode === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    localStorage.setItem("theme", darkMode);
  }, [darkMode]);

  const sidebarBtn =
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-green-600 dark:hover:bg-green-700";
  const sidebarSub =
    "w-full flex items-center gap-2 px-6 py-2 text-sm rounded-lg transition hover:bg-green-500 dark:hover:bg-green-600";

  const getInitials = (name) => {
    if (!name) return "A";
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
            {!isCollapsed && <span className="font-bold text-lg">Agronomist</span>}
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
              <p className="font-semibold">{user?.name || "Agronomist"}</p>
              <p className="text-xs">Field Expert</p>
            </div>
          )}
        </div>

        {/* NAV */}
        <nav className="px-3 space-y-1">
          <button
            onClick={() => {
              setFilterStatus("All");
              navigate("/agronomist/complaints");
            }}
            className={sidebarBtn}
          >
            <FontAwesomeIcon icon={faHome} />
            {!isCollapsed && "Dashboard"}
          </button>

          {/* Complaints */}
          <button
            onClick={() => setShowComplaints(!showComplaints)}
            className={sidebarBtn}
          >
            <FontAwesomeIcon icon={faClipboardList} />
            {!isCollapsed && "Complaints"}
            {!isCollapsed && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`ml-auto transition ${showComplaints ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {showComplaints && !isCollapsed && (
            <div className="space-y-1">
              <button
                onClick={() => {
                  setFilterStatus("Pending");
                  navigate("/agronomist/complaints");
                }}
                className={`${sidebarSub} ${filterStatus === "Pending" ? "bg-green-600" : ""}`}
              >
                Pending
              </button>
              <button
                onClick={() => {
                  setFilterStatus("Resolved");
                  navigate("/agronomist/complaints");
                }}
                className={`${sidebarSub} ${filterStatus === "Resolved" ? "bg-green-600" : ""}`}
              >
                Resolved
              </button>
              <button
                onClick={() => {
                  setFilterStatus("All");
                  navigate("/agronomist/complaints");
                }}
                className={`${sidebarSub} ${filterStatus === "All" ? "bg-green-600" : ""}`}
              >
                See All
              </button>
            </div>
          )}

          <button
            onClick={() => navigate("/profile")}
            className={sidebarBtn}
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
            Agronomist Dashboard
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
          <Outlet context={{ filterStatus, setFilterStatus }} />
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
