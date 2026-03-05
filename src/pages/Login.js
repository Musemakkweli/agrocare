// src/pages/Login.js
import React, { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLeaf, 
  faEye, 
  faEyeSlash,
  faEnvelope,
  faPhone,
  faLock,
  faArrowRight,
  faHome
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  /* ==============================
     Redirect Logic
  ============================== */
  const redirectUser = useCallback(
    (user) => {
      if (!user.is_approved) {
        setError(true);
        setMessage("Your account is not approved yet. Please wait for admin approval.");
        return;
      }

      if (!user.is_profile_completed) {
        navigate("/completion");
        return;
      }

      switch (user.role) {
        case "farmer":
          navigate("/farmer/dashboard");
          break;
        case "agronomist":
          navigate("/agronomist");
          break;
        case "donor":
          navigate("/donor");
          break;
        case "leader":
          navigate("/leader");
          break;
        case "finance":
          navigate("/finance");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    },
    [navigate]
  );

  /* ==============================
     Fetch latest profile after login
  ============================== */
  const fetchLatestUser = async (user) => {
    try {
      let endpoint = "";
      switch (user.role) {
        case "farmer":
          endpoint = `${BASE_URL}/profile/farmer/${user.id}`;
          break;
        case "agronomist":
          endpoint = `${BASE_URL}/profile/agronomist/${user.id}`;
          break;
        case "donor":
          endpoint = `${BASE_URL}/profile/donor/${user.id}`;
          break;
        case "leader":
          endpoint = `${BASE_URL}/profile/leader/${user.id}`;
          break;
        case "finance":
          endpoint = `${BASE_URL}/profile/finance/${user.id}`;
          break;
        case "admin":
          endpoint = `${BASE_URL}/profile/admin/${user.id}`;
          break;
        default:
          return user;
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      return { ...user, ...response.data };
    } catch (err) {
      console.error("Failed to fetch latest user profile:", err);
      return user;
    }
  };

  /* ==============================
     Check for saved credentials
  ============================== */
  useEffect(() => {
    const savedIdentifier = localStorage.getItem("savedIdentifier");
    if (savedIdentifier) {
      setFormData(prev => ({ ...prev, identifier: savedIdentifier }));
      setRememberMe(true);
    }
  }, []);

  /* ==============================
     Theme toggle
  ============================== */
  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  /* ==============================
     Handle input change
  ============================== */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ==============================
     Handle login submit
  ============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/login`, formData);
      const { user, access_token, message: backendMessage } = response.data;

      localStorage.setItem("token", access_token);

      if (rememberMe) {
        localStorage.setItem("savedIdentifier", formData.identifier);
      } else {
        localStorage.removeItem("savedIdentifier");
      }

      const latestUser = await fetchLatestUser(user);
      localStorage.setItem("user", JSON.stringify(latestUser));

      setMessage(backendMessage || "Login successful!");
      
      setTimeout(() => {
        redirectUser(latestUser);
      }, 1000);
      
    } catch (err) {
      console.error(err);
      setError(true);
      setMessage(err.response?.data?.detail || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     UI - Nude Green Background, White Card
  ============================== */
  return (
    <div className="h-screen bg-[#E8F3E8] dark:bg-gray-900 flex items-center justify-center p-2 overflow-hidden">
      
      {/* Floating Action Buttons */}
      <div className="fixed top-1 right-1 sm:top-2 sm:right-2 z-50">
        <button
          onClick={handleThemeToggle}
          className="p-1.5 sm:p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all text-xs sm:text-sm"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      <Link
        to="/"
        className="fixed top-1 left-1 sm:top-2 sm:left-2 p-1.5 sm:p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all z-50"
        aria-label="Go home"
      >
        <FontAwesomeIcon icon={faHome} className="text-green-600 text-xs sm:text-sm" />
      </Link>

      {/* White Login Card - Visible on nude green background */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[300px] xs:max-w-[320px] sm:max-w-[340px]"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          
          {/* Header - Keep the green gradient for contrast */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 px-3 py-3 sm:px-4 sm:py-4 text-center">
            <div className="bg-white/20 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mx-auto mb-1 shadow">
              <FontAwesomeIcon icon={faLeaf} className="text-white text-sm sm:text-base" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">eLIMA</h2>
            <p className="text-green-100 text-[10px] sm:text-xs mt-0.5">Sign in to continue</p>
          </div>

          {/* Form - White background */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            
            {/* Alert */}
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-1.5 rounded text-[10px] sm:text-xs ${
                  error 
                    ? "bg-red-50 text-red-600" 
                    : "bg-green-50 text-green-600"
                }`}
              >
                {message}
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-0.5">
              <label className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <FontAwesomeIcon icon={faEnvelope} className="text-green-500 text-[10px]" />
                Email/Phone
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  placeholder="Enter email or phone"
                  className="w-full pl-6 pr-2 py-1.5 text-[11px] sm:text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
                <FontAwesomeIcon 
                  icon={faPhone} 
                  className="absolute left-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-[10px]" 
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-0.5">
              <label className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <FontAwesomeIcon icon={faLock} className="text-green-500 text-[10px]" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                  className="w-full pl-6 pr-6 py-1.5 text-[11px] sm:text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
                <FontAwesomeIcon 
                  icon={faLock} 
                  className="absolute left-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-[10px]" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 text-[10px]"
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-2.5 h-2.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-[10px] text-gray-600 dark:text-gray-300">Remember</span>
              </label>
              
              <Link 
                to="/forgot-password" 
                className="text-[10px] text-green-600 dark:text-green-400 hover:text-green-700 hover:underline"
              >
                Forgot?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 text-[11px] font-medium shadow flex items-center justify-center gap-1 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <div className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[8px]" />
                </>
              )}
            </motion.button>

            {/* Sign Up Link */}
            <p className="text-center text-[10px] text-gray-600 dark:text-gray-400">
              New to eLIMA?{" "}
              <Link 
                to="/register" 
                className="text-green-600 dark:text-green-400 font-medium hover:text-green-700 hover:underline"
              >
                Create account
              </Link>
            </p>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-2 mt-1.5 text-[8px] text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-0.5">🔒 <span>Secure</span></span>
          <span className="flex items-center gap-0.5">🌱 <span>Free</span></span>
          <span className="flex items-center gap-0.5">✅ <span>Verified</span></span>
        </div>
      </motion.div>
    </div>
  );
}