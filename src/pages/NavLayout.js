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

export default function NavLayout({ children }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [showPrograms, setShowPrograms] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // ✅ new state for collapsing sidebar

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

  return (
    <div className="flex min-h-screen bg-gray-200 dark:bg-slate-900">

      {/* SIDEBAR */}
      <aside className={`${isCollapsed ? "w-20" : "w-64"} bg-green-600 dark:bg-green-800 text-white flex flex-col transition-all duration-300`}>
        <div className="p-6 flex items-center justify-between gap-2 text-xl font-bold">
          {!isCollapsed && <span>Farmer</span>}
          {/* ✅ Hamburger button */}
          <button onClick={() => setIsCollapsed(c => !c)} className="p-2 rounded hover:bg-green-500 dark:hover:bg-green-700">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
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
              <button onClick={() => navigate("/my-contributions")} className={sidebarSub}>
                <FontAwesomeIcon icon={faSeedling} /> My Contributions
              </button>
            </div>
          )}

          <button onClick={() => navigate("/profile")} className={sidebarBtn}>
            <FontAwesomeIcon icon={faUser} /> {!isCollapsed && "Profile"}
          </button>
        </nav>

        <button
          onClick={() => navigate("/logout")}
          className="flex items-center gap-2 px-4 py-3 hover:bg-green-500 transition"
        >
          <FontAwesomeIcon icon={faSignOutAlt} /> {!isCollapsed && "Logout"}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-slate-900 shadow mb-6">
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">
            Welcome, Farmer John 👋
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
              onClick={() =>
                setDarkMode(d => (d === "dark" ? "light" : "dark"))
              }
              className="px-3 py-1 rounded bg-gray-300 dark:bg-slate-700 dark:text-white"
            >
              {darkMode === "dark" ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        {/* CHILDREN */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
