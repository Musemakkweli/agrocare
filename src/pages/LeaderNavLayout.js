import React, { useState, useEffect, useCallback } from "react";
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
  faGlobe,
  faSun,
  faMoon,
  faSpinner,
  faCheckCircle,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function LeaderNavLayout() {
  const navigate = useNavigate();

  // ================= STATE =================
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [showComplaints, setShowComplaints] = useState(false);
  const [showPublicComplaints, setShowPublicComplaints] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(3); // eslint-disable-line no-unused-vars
  const [showNotifications, setShowNotifications] = useState(false);

  // ================= FILTER STATES =================
  const [filter, setFilter] = useState("All");
  const [publicFilter, setPublicFilter] = useState("All");

  // ================= FETCH LOGGED-IN USER FROM LOCALSTORAGE =================
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        
        if (!savedUser) {
          navigate("/login");
          return;
        }
        
        setUser(savedUser);
      } catch (error) {
        console.error("Error loading user:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  // ================= FILTER HANDLERS =================
  const onFilterComplaints = useCallback((status) => {
    setFilter(status);
    navigate("/leader/complaints");
  }, [navigate]);

  const onFilterPublicComplaints = useCallback((status) => {
    setPublicFilter(status);
    navigate("/leader/public-complaints");
  }, [navigate]);

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

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => prev === "dark" ? "light" : "dark");
  }, []);

  // ================= NOTIFICATION HANDLER =================
  const toggleNotifications = useCallback(() => {
    setShowNotifications(prev => !prev);
  }, []);

  // ================= STYLES =================
  const sidebarBtn = (isActive = false) => 
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
      isActive 
        ? "bg-green-600 text-white" 
        : "hover:bg-green-600 dark:hover:bg-green-700"
    }`;

  const sidebarSub = (isActive = false) => 
    `w-full flex items-center gap-2 px-6 py-2 text-sm rounded-lg transition-all duration-200 ${
      isActive 
        ? "bg-green-500 text-white" 
        : "hover:bg-green-500 dark:hover:bg-green-600"
    }`;

  const getInitials = (name) => {
    if (!name) return "L";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const confirmLogout = useCallback(() => {
    localStorage.clear();
    navigate("/login");
  }, [navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-slate-900 items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-green-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // If no user after loading, don't render (will redirect)
  if (!user) {
    return null;
  }

 const userName = user?.full_name || user?.fullname || user?.name || "Leader";
  const userRole = user?.role || "Sector Leader";
  const userInitials = getInitials(userName);

  // ================= JSX =================
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900 overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 h-full z-50 ${
          isCollapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-green-700 to-green-800 dark:from-green-900 dark:to-green-950 text-white flex flex-col transition-all duration-300 shadow-xl`}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between p-4 border-b border-green-600 dark:border-green-800">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <FontAwesomeIcon
              icon={faSeedling}
              className="text-2xl text-green-300"
            />
            {!isCollapsed && (
              <span className="font-bold text-lg">AgroCare</span>
            )}
          </motion.div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:text-green-200"
          >
            <FontAwesomeIcon icon={faBars} />
          </motion.button>
        </div>

        {/* USER INFO */}
        <motion.div 
          className="flex items-center gap-3 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {userInitials}
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="font-semibold">{userName}</span>
              <span className="text-xs text-green-200">{userRole}</span>
            </motion.div>
          )}
        </motion.div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/leader")}
            className={sidebarBtn()}
          >
            <FontAwesomeIcon icon={faHome} />
            {!isCollapsed && "Dashboard"}
          </motion.button>

          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/leader/programs")}
            className={sidebarBtn()}
          >
            <FontAwesomeIcon icon={faSeedling} />
            {!isCollapsed && "Programs"}
          </motion.button>

          {/* COMPLAINTS (User complaints) */}
          <div>
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowComplaints(!showComplaints)}
              className={sidebarBtn()}
            >
              <FontAwesomeIcon icon={faClipboardList} />
              {!isCollapsed && "Complaints"}
              {!isCollapsed && (
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`ml-auto transition-transform duration-300 ${
                    showComplaints ? "rotate-180" : ""
                  }`}
                />
              )}
            </motion.button>

            <AnimatePresence>
              {showComplaints && !isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => onFilterComplaints("All")}
                    className={sidebarSub(filter === "All")}
                  >
                    All Complaints
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => onFilterComplaints("Resolved")}
                    className={sidebarSub(filter === "Resolved")}
                  >
                    Resolved
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => onFilterComplaints("Pending")}
                    className={sidebarSub(filter === "Pending")}
                  >
                    Pending
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PUBLIC COMPLAINTS */}
          <div>
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPublicComplaints(!showPublicComplaints)}
              className={sidebarBtn()}
            >
              <FontAwesomeIcon icon={faGlobe} />
              {!isCollapsed && "Public Complaints"}
              {!isCollapsed && (
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`ml-auto transition-transform duration-300 ${
                    showPublicComplaints ? "rotate-180" : ""
                  }`}
                />
              )}
            </motion.button>

            <AnimatePresence>
              {showPublicComplaints && !isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => onFilterPublicComplaints("All")}
                    className={sidebarSub(publicFilter === "All")}
                  >
                    All Public
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => onFilterPublicComplaints("Pending")}
                    className={sidebarSub(publicFilter === "Pending")}
                  >
                    Pending
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => onFilterPublicComplaints("urgent")}
                    className={sidebarSub(publicFilter === "urgent")}
                  >
                    Urgent
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => onFilterPublicComplaints("resolved")}
                    className={sidebarSub(publicFilter === "resolved")}
                  >
                    Resolved
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/leader/farmers")}
            className={sidebarBtn()}
          >
            <FontAwesomeIcon icon={faUsers} />
            {!isCollapsed && "Farmers"}
          </motion.button>

          {/* AGRONOMISTS */}
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/leader/agronomist")}
            className={sidebarBtn()}
          >
            <FontAwesomeIcon icon={faUserTie} />
            {!isCollapsed && "Agronomists"}
          </motion.button>

          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/leader/profile")}
            className={sidebarBtn()}
          >
            <FontAwesomeIcon icon={faUser} />
            {!isCollapsed && "Profile"}
          </motion.button>
        </nav>

        {/* LOGOUT - Changed back to original green hover */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2 px-4 py-3 hover:bg-green-600 transition-colors mt-auto"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          {!isCollapsed && "Logout"}
        </motion.button>
      </motion.aside>

      {/* ================= MAIN ================= */}
      <main
        className={`flex-1 flex flex-col ${
          isCollapsed ? "ml-20" : "ml-64"
        } transition-all duration-300`}
      >
        {/* HEADER */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 shadow-md sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700"
        >
          <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">
            Leader Dashboard
          </h1>

          <div className="flex items-center gap-4">
            {/* Welcome message with user name */}
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600 dark:text-gray-300 hidden md:block"
            >
              Welcome back, <span className="font-semibold text-green-600 dark:text-green-400">{userName}</span>
            </motion.span>
            
            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleNotifications}
                className="relative"
              >
                <FontAwesomeIcon
                  icon={faBell}
                  className="text-xl text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors"
                />
                {notifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                    {notifications}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-700 rounded-lg shadow-xl border dark:border-gray-600 z-50"
                  >
                    <div className="p-3 border-b dark:border-gray-600">
                      <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />
                        <span>3 pending complaints</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                        <span>2 resolved today</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600 transition"
            >
              <FontAwesomeIcon icon={darkMode === "dark" ? faSun : faMoon} />
            </motion.button>
          </div>
        </motion.div>

        {/* CONTENT */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-slate-900"
        >
          <Outlet context={{ 
            filter, 
            publicFilter,
            onFilterComplaints, 
            onFilterPublicComplaints,
            user 
          }} />
        </motion.div>
      </main>

      {/* LOGOUT MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-sm shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Confirm Logout</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Are you sure you want to logout, <span className="font-semibold">{userName}</span>?
              </p>
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}