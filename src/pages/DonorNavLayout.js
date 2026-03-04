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
  faChartLine,
  faHandHoldingHeart,
  faClock,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";

export default function DonorNavLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your donation to Farm Input Program was successful", read: false, time: "5 min ago" },
    { id: 2, message: "New impact report available for Irrigation Project", read: false, time: "1 hour ago" },
    { id: 3, message: "3 farmers in Gitarama received your support", read: true, time: "yesterday" }
  ]);

  // Get logged-in user
  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) {
        setUser(savedUser);
      } else {
        // Mock user for development
        setUser({
          name: "John Donor",
          email: "john@example.com",
          full_name: "John Donor"
        });
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, []);

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
      .toUpperCase()
      .substring(0, 2);
  };

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/login"; // logout redirect
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // dynamic button styling based on active route
  const sidebarBtn = (path) => {
    const isActive = location.pathname === path || 
                    (path !== '/donor' && location.pathname.startsWith(path));
    
    return `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? "bg-green-600 dark:bg-green-700 text-white shadow-lg" 
        : "text-green-100 hover:bg-green-600/80 dark:hover:bg-green-700/80 hover:text-white"
    }`;
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-full z-50 ${
          isCollapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-green-700 to-green-800 dark:from-green-800 dark:to-green-900 text-white transition-all duration-300 shadow-xl`}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between p-4 border-b border-green-600 dark:border-green-700">
          <Link to="/donor" className="flex items-center gap-2">
            <div className="bg-green-500 p-1.5 rounded-lg">
              <FontAwesomeIcon icon={faLeaf} className="text-xl text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg tracking-wide">Donor<span className="text-green-300">Portal</span></span>
            )}
          </Link>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-green-600 dark:hover:bg-green-700 rounded-lg transition"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        {/* USER */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-4 border-b border-green-600 dark:border-green-700`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-300 to-green-400 text-green-900 font-bold flex items-center justify-center text-lg shadow-lg flex-shrink-0">
            {getInitials(user?.full_name || user?.name)}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="font-semibold truncate">{user?.full_name || user?.name || "Donor"}</p>
              <p className="text-xs text-green-200">Verified Donor</p>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="px-3 py-4 space-y-1">
          <button
            onClick={() => navigate("/donor")}
            className={sidebarBtn("/donor")}
          >
            <FontAwesomeIcon icon={faHome} className="w-5" />
            {!isCollapsed && "Dashboard"}
          </button>

          <button
            onClick={() => navigate("/donor/impact")}
            className={sidebarBtn("/donor/impact")}
          >
            <FontAwesomeIcon icon={faChartLine} className="w-5" />
            {!isCollapsed && "Impact Overview"}
          </button>

          <button
            onClick={() => navigate("/programs")}
            className={sidebarBtn("/programs")}
          >
            <FontAwesomeIcon icon={faHandHoldingHeart} className="w-5" />
            {!isCollapsed && "Programs"}
          </button>

          <button
            onClick={() => navigate("/donor/transactions")}
            className={sidebarBtn("/donor/transactions")}
          >
            <FontAwesomeIcon icon={faClock} className="w-5" />
            {!isCollapsed && "Transactions"}
          </button>

          <button
            onClick={() => navigate("/profile")}
            className={sidebarBtn("/profile")}
          >
            <FontAwesomeIcon icon={faUser} className="w-5" />
            {!isCollapsed && "Profile"}
          </button>

        
        </nav>

        {/* BOTTOM SECTION */}
        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
          <button
            onClick={() => navigate("/donor/help")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-green-100 hover:bg-green-600 dark:hover:bg-green-700 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faQuestionCircle} className="w-5" />
            {!isCollapsed && "Help & Support"}
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-green-100 hover:bg-red-600 dark:hover:bg-red-700 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
            {!isCollapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'} flex flex-col transition-all duration-300`}>
        {/* HEADER */}
        <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              {location.pathname === '/donor' && 'Donor Dashboard'}
              {location.pathname === '/donor/impact' && 'Impact Overview'}
              {location.pathname === '/programs' && 'Supported Programs'}
              {location.pathname === '/donor/transactions' && 'Transaction History'}
              {location.pathname === '/profile' && 'My Profile'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <FontAwesomeIcon icon={faBell} className="text-lg" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadNotifications > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-green-600 hover:text-green-700"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                            !notification.read ? 'bg-green-50 dark:bg-green-900/20' : ''
                          }`}
                        >
                          <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <p className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(d => d === "dark" ? "light" : "dark")}
              className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {darkMode === "dark" ? "☀️" : "🌙"}
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.full_name || user?.name || 'Donor'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Donor</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white font-bold flex items-center justify-center">
                {getInitials(user?.full_name || user?.name)}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          {children ? children : <Outlet />}
        </div>
      </main>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirm Logout</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to logout? You'll need to login again to access your dashboard.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}