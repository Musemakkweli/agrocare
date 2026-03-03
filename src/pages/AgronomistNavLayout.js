import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faSignOutAlt,
  faBell,
  faLeaf,
  faChevronDown,
  faBars,
  faSun,
  faMoon,
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
  faListCheck,
  faClock,
  faExclamationTriangle,
  faComment
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BASE_URL from "../config";

export default function AgronomistNavLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ================= STATE =================
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [showComplaints, setShowComplaints] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadFollowups, setUnreadFollowups] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // ================= FILTER STATES =================
  const [filter, setFilter] = useState("All");

  // ================= FETCH LOGGED-IN USER FROM LOCALSTORAGE =================
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        
        if (!savedUser) {
          setAuthError(true);
          setLoading(false);
          return;
        }

        // Check if user has agronomist role
        if (savedUser.role !== "agronomist") {
          setAuthError(true);
          setLoading(false);
          return;
        }
        
        setUser(savedUser);
        setAuthError(false);
      } catch (error) {
        console.error("Error loading user:", error);
        setAuthError(true);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ================= FETCH NOTIFICATIONS =================
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    setLoadingNotifications(true);
    try {
      const response = await fetch(`${BASE_URL}/notifications/${user.id}`);
      
      if (!response.ok) throw new Error("Failed to fetch notifications");
      
      const data = await response.json();
      setNotifications(data);
      const unread = data.filter(n => !n.is_read).length;
      setUnreadCount(unread);
      
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }, [user]);

  // ================= FETCH UNREAD FOLLOW-UPS =================
  const fetchUnreadFollowups = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`${BASE_URL}/followup/agronomist/${user.id}?status=pending`);
      if (response.ok) {
        const data = await response.json();
        setUnreadFollowups(data.length);
      }
    } catch (error) {
      console.error("Error fetching followups:", error);
    }
  }, [user]);

  // Fetch data when user loads
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadFollowups();
      
      // Poll for new data every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications();
        fetchUnreadFollowups();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications, fetchUnreadFollowups]);

  // ================= MARK NOTIFICATION AS READ =================
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) throw new Error("Failed to mark as read");
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // ================= MARK ALL AS READ =================
  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${BASE_URL}/notifications/mark-all-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id })
      });
      
      if (!response.ok) throw new Error("Failed to mark all as read");
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // ================= FILTER HANDLERS =================
  const onFilterComplaints = useCallback((status) => {
    setFilter(status);
    navigate("/agronomist/complaints");
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
    if (!showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications, fetchNotifications]);

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
    if (!name) return "A";
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

  // Format notification time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case "complaint_assigned":
        return { icon: faListCheck, color: "text-blue-500" };
      case "complaint_resolved":
        return { icon: faCheckCircle, color: "text-green-500" };
      case "admin_alert":
        return { icon: faExclamationTriangle, color: "text-red-500" };
      case "followup_received":
        return { icon: faComment, color: "text-yellow-500" };
      default:
        return { icon: faBell, color: "text-gray-500" };
    }
  };

  // Check active routes
  const isDashboardActive = location.pathname === "/agronomist";
  const isComplaintsActive = location.pathname === "/agronomist/complaints";
  const isFollowupsActive = location.pathname === "/agronomist/followups";
  const isProfileActive = location.pathname === "/profile";

  // ================= RENDER BASED ON STATE =================
  
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

  // Show auth error state
  if (authError || !user) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-slate-900 items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-8 text-center"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in as an agronomist to access this page.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const userName = user?.full_name || user?.fullname || user?.name || "Agronomist";
  const userRole = user?.role || "Agronomist";
  const userInitials = getInitials(userName);
  const isApproved = user?.is_approved || false;

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
        {/* LOGO - Clickable to go to dashboard */}
        <div className="flex items-center justify-between p-4 border-b border-green-600 dark:border-green-800">
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/agronomist")}
          >
            <FontAwesomeIcon
              icon={faLeaf}
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
              className="flex flex-col flex-1"
            >
              <span className="font-semibold truncate">{userName}</span>
              <span className="text-xs text-green-200">{userRole}</span>
            </motion.div>
          )}
          {!isCollapsed && isApproved && (
            <FontAwesomeIcon 
              icon={faCheckCircle} 
              className="text-green-300" 
              title="Approved"
            />
          )}
        </motion.div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {/* DASHBOARD */}
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/agronomist")}
            className={sidebarBtn(isDashboardActive)}
          >
            <FontAwesomeIcon icon={faHome} />
            {!isCollapsed && "Dashboard"}
          </motion.button>

          {/* ASSIGNED COMPLAINTS */}
          <div>
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowComplaints(!showComplaints)}
              className={sidebarBtn(isComplaintsActive)}
            >
              <FontAwesomeIcon icon={faListCheck} />
              {!isCollapsed && "Assigned Complaints"}
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
                    All Assigned
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => onFilterComplaints("Pending")}
                    className={sidebarSub(filter === "Pending")}
                  >
                    Pending
                  </motion.button>
            
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => onFilterComplaints("Resolved")}
                    className={sidebarSub(filter === "Resolved")}
                  >
                    Resolved
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FARMER FOLLOW-UPS */}
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/followups")}
            className={sidebarBtn(isFollowupsActive)}
          >
            <FontAwesomeIcon icon={faComment} />
            {!isCollapsed && "Farmer Follow-ups"}
            {!isCollapsed && unreadFollowups > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                {unreadFollowups} new
              </span>
            )}
          </motion.button>

          {/* PROFILE */}
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile")}
            className={sidebarBtn(isProfileActive)}
          >
            <FontAwesomeIcon icon={faUser} />
            {!isCollapsed && "Profile"}
          </motion.button>
        </nav>

        {/* LOGOUT */}
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
            {isDashboardActive ? "Dashboard" : 
             isComplaintsActive ? "Assigned Complaints" : 
             isFollowupsActive ? "Farmer Follow-ups" : 
             "My Profile"}
          </h1>

          <div className="flex items-center gap-4">
            {/* Welcome message */}
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
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-700 rounded-lg shadow-xl border dark:border-gray-600 z-50"
                  >
                    <div className="p-3 border-b dark:border-gray-600 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Notifications
                        {unreadCount > 0 && (
                          <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-green-600 hover:text-green-700 dark:text-green-400"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {loadingNotifications ? (
                        <div className="p-4 text-center">
                          <FontAwesomeIcon icon={faSpinner} spin className="text-green-600" />
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map(notification => {
                          const { icon, color } = getNotificationIcon(notification.type);
                          return (
                            <div
                              key={notification.id}
                              className={`p-3 border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition ${
                                !notification.is_read ? 'bg-green-50 dark:bg-green-900/20' : ''
                              }`}
                              onClick={() => {
                                if (!notification.is_read) {
                                  markAsRead(notification.id);
                                }
                                if (notification.action_url) {
                                  navigate(notification.action_url);
                                  setShowNotifications(false);
                                }
                              }}
                            >
                              <div className="flex gap-3">
                                <div className={`mt-1 ${color}`}>
                                  <FontAwesomeIcon icon={icon} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-500">
                                    <FontAwesomeIcon icon={faClock} />
                                    <span>{formatTime(notification.created_at)}</span>
                                    {notification.priority === 'high' && (
                                      <span className="text-red-500">● High</span>
                                    )}
                                  </div>
                                </div>
                                {!notification.is_read && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No notifications
                        </div>
                      )}
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

        {/* Approval banner if not approved */}
        {!isApproved && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-3 mx-6 mt-4 rounded-lg flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faExclamationCircle} />
            <span className="text-sm">Your account is pending approval. Some features may be limited.</span>
          </motion.div>
        )}

        {/* CONTENT */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-slate-900"
        >
          {children ? children : (
            <Outlet context={{ 
              filter, 
              onFilterComplaints,
              user 
            }} />
          )}
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