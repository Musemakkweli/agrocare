// FinanceNavLayout.js
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faDollarSign,
  faUser,
  faSignOutAlt,
  faBell,
  faLeaf,
  faChevronRight,
  faChevronLeft,
  faCog,
  faQuestionCircle,
  faChartLine,
  faHistory,
  faMoon,
  faSun,
  faInfoCircle,
  faCircle,
  faCheckCircle,
  faExclamationTriangle,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function FinanceNavLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [ setIsFullscreen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New fund request from Farmer John", time: "5 min ago", read: false, type: "info" },
    { id: 2, text: "Budget report ready for download", time: "1 hour ago", read: false, type: "success" },
    { id: 3, text: "Payment to Agro Supplies processed", time: "3 hours ago", read: true, type: "success" },
    { id: 4, text: "Low balance alert for Farm Equipment fund", time: "1 day ago", read: true, type: "warning" },
  ]);

  // Refs for click outside detection
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // ================= FETCH LOGGED-IN USER FROM LOCALSTORAGE =================
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        
        if (!savedUser || !token) {
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

  // Theme effect
  useEffect(() => {
    const root = document.documentElement;
    darkMode === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    localStorage.setItem("theme", darkMode);
  }, [darkMode]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Toggle sidebar with 'b' key
      if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsCollapsed(prev => !prev);
      }
      // Toggle dark mode with 'd' key
      if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setDarkMode(prev => prev === "dark" ? "light" : "dark");
      }
      // Close modals with Escape
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowUserMenu(false);
        setShowLogoutModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getInitials = (name) => {
    if (!name) return "F";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Navigation items
  const navItems = [
    { path: "/finance", icon: faHome, label: "Dashboard" },
    { path: "/finance/manage-funds", icon: faDollarSign, label: "Manage Funds" },
    { path: "/finance/transactions", icon: faHistory, label: "Transactions" },
    { path: "/finance/reports", icon: faChartLine, label: "Reports" },
    { path: "/profile", icon: faUser, label: "Profile" },
  ];

  // Notification badge color
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return faCheckCircle;
      case 'warning': return faExclamationTriangle;
      case 'info': return faInfoCircle;
      default: return faCircle;
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  // dynamic button styling with hover effect
  const sidebarBtn = (path, index) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative group ${
      location.pathname === path 
        ? "bg-green-600 dark:bg-green-700 text-white shadow-lg" 
        : "text-green-100 hover:bg-green-600 dark:hover:bg-green-700 hover:text-white hover:shadow-md"
    } ${hoveredItem === index ? 'scale-105' : ''}`;

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-slate-900 items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-green-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user after loading, don't render (will redirect)
  if (!user) {
    return null;
  }

  const userName = user?.full_name || user?.fullname || user?.name || "Finance";
  const userRole = user?.role || "Finance Manager";
  const userInitials = getInitials(userName);
  const userEmail = user?.email || "finance@agrocare.com";

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-full z-50 ${
          isCollapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-green-700 to-green-800 dark:from-green-900 dark:to-green-950 text-white transition-all duration-300 shadow-xl`}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between p-4 border-b border-green-600 dark:border-green-800">
          <div className="flex items-center gap-2">
            <div className="relative">
              <FontAwesomeIcon icon={faLeaf} className="text-2xl text-green-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-300 rounded-full animate-ping"></span>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg tracking-wider">Finance</span>
            )}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-green-600 transition group relative"
            title={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
          >
            <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
            {isCollapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                Expand (Ctrl+B)
              </span>
            )}
          </button>
        </div>

        {/* USER */}
        <div className="flex items-center gap-3 p-6 border-b border-green-600 dark:border-green-800">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-300 to-green-400 text-green-900 font-bold flex items-center justify-center text-lg shadow-lg">
              {userInitials}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-green-700"></span>
          </div>
          {!isCollapsed && (
            <div className="animate-fadeIn">
              <p className="font-semibold">{userName}</p>
              <p className="text-xs text-green-200">{userRole}</p>
            </div>
          )}
        </div>

        {/* NAV */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item, index) => (
            <div key={item.path} className="relative">
              <button
                onClick={() => navigate(item.path)}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                className={sidebarBtn(item.path, index)}
              >
                <FontAwesomeIcon icon={item.icon} className="text-lg" />
                {!isCollapsed && item.label}
                
                {/* Active indicator */}
                {location.pathname === item.path && !isCollapsed && (
                  <span className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                )}
              </button>
              
              {/* Tooltip when collapsed */}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="absolute bottom-4 left-0 right-0 flex items-center gap-2 px-4 py-3 hover:bg-green-600 transition w-full group"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          {!isCollapsed && "Logout"}
          {isCollapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
              Logout
            </span>
          )}
        </button>

        {/* Version info */}
        {!isCollapsed && (
          <div className="absolute bottom-20 left-0 right-0 text-center">
            <p className="text-xs text-green-300">v2.0.0</p>
          </div>
        )}
      </aside>

      {/* MAIN */}
      <main className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'} flex flex-col transition-all duration-300`}>
        {/* HEADER */}
        <header className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 shadow-md sticky top-0 z-40 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Finance Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Welcome message with user name */}
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden md:block">
              Welcome back, <span className="font-semibold text-green-600 dark:text-green-400">{userName}</span>
            </span>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="text-green-600 dark:text-green-400 hover:scale-110 transition"
              title="Toggle fullscreen"
            >
              <FontAwesomeIcon icon={faChartLine} />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-green-600 dark:text-green-400 hover:scale-110 transition"
              >
                <FontAwesomeIcon icon={faBell} className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 animate-slideDown z-50">
                  <div className="p-3 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-green-600 hover:text-green-700"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition cursor-pointer border-b last:border-b-0 ${
                            !notif.read ? 'bg-green-50 dark:bg-green-900/20' : ''
                          }`}
                        >
                          <div className="flex gap-2">
                            <FontAwesomeIcon 
                              icon={getNotificationIcon(notif.type)} 
                              className={`${getNotificationColor(notif.type)} mt-1`} 
                            />
                            <div>
                              <p className="text-sm">{notif.text}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="p-4 text-center text-gray-500">No notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme toggle - Simple button */}
            <button
              onClick={() => setDarkMode((d) => (d === "dark" ? "light" : "dark"))}
              className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600 transition"
              title="Toggle theme (Ctrl+D)"
            >
              <FontAwesomeIcon icon={darkMode === "dark" ? faSun : faMoon} />
            </button>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                  {userInitials}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 animate-slideDown z-50">
                  <div className="p-3 border-b border-gray-200 dark:border-slate-700">
                    <p className="font-semibold">{userName}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { navigate("/profile"); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faUser} className="text-sm" />
                      Profile
                    </button>
                    <button
                      onClick={() => { navigate("/settings"); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faCog} className="text-sm" />
                      Settings
                    </button>
                    <button
                      onClick={() => { setShowUserMenu(false); setShowLogoutModal(true); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-red-600 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children ? children : <Outlet context={{ user }} />}
        </div>
      </main>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-sm shadow-2xl animate-scaleIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faSignOutAlt} className="text-red-600" />
              </div>
              <h2 className="text-lg font-bold">Confirm Logout</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to logout, <span className="font-semibold">{userName}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-slate-700 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts help */}
      <div className="fixed bottom-4 right-4">
        <button
          className="w-10 h-10 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition flex items-center justify-center"
          title="Keyboard shortcuts"
          onClick={() => alert('Ctrl+B: Toggle sidebar\nCtrl+D: Toggle theme\nEsc: Close modals')}
        >
          <FontAwesomeIcon icon={faQuestionCircle} />
        </button>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}