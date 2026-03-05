// src/pages/Register.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLeaf, 
  faHome,
  faEye,
  faEyeSlash,
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faArrowRight,
  faUserTag
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [role, setRole] = useState("");
  const [donorType, setDonorType] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: role,
      };

      const response = await axios.post(`${BASE_URL}/register`, payload);

      console.log("Registered successfully:", response.data);

      setMessage("Registration successful! Redirecting to login...");
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Failed to register:", err.response?.data || err.message);

      if (err.response?.data?.detail?.includes("already exists")) {
        setError("This phone number or email is already registered.");
      } else if (err.response?.data?.detail?.includes("password")) {
        setError("Password does not meet requirements or do not match.");
      } else {
        setError(err.response?.data?.message || "Failed to register. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#E8F3E8] dark:bg-gray-900 flex items-center justify-center p-2 overflow-hidden">
      
      {/* Floating Action Buttons */}
      <div className="fixed top-1 right-1 sm:top-2 sm:right-2 z-50 flex gap-2">
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

      {/* White Register Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[320px] xs:max-w-[340px] sm:max-w-[360px]"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          
          {/* Compact Header - Smaller title */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 px-4 py-3 text-center">
            <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1 shadow">
              <FontAwesomeIcon icon={faLeaf} className="text-white text-sm" />
            </div>
            <h2 className="text-sm font-bold text-white">eLIMA</h2>
            <p className="text-green-100 text-[10px] mt-0.5">Create account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto">
            
            {/* Success Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-1.5 rounded bg-green-50 text-green-600 text-[10px] text-center border border-green-200"
              >
                {message}
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-1.5 rounded bg-red-50 text-red-600 text-[10px] text-center border border-red-200"
              >
                {error}
              </motion.div>
            )}

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <FontAwesomeIcon icon={faUser} className="text-green-500 text-[10px]" />
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                  className="w-full pl-6 pr-2 py-1.5 text-[11px] rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
                <FontAwesomeIcon 
                  icon={faUser} 
                  className="absolute left-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-[10px]" 
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <FontAwesomeIcon icon={faEnvelope} className="text-green-500 text-[10px]" />
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email address"
                  className="w-full pl-6 pr-2 py-1.5 text-[11px] rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
                <FontAwesomeIcon 
                  icon={faEnvelope} 
                  className="absolute left-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-[10px]" 
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
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
                  placeholder="Create password"
                  className="w-full pl-6 pr-6 py-1.5 text-[11px] rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
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

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <FontAwesomeIcon icon={faLock} className="text-green-500 text-[10px]" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm password"
                  className="w-full pl-6 pr-6 py-1.5 text-[11px] rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
                <FontAwesomeIcon 
                  icon={faLock} 
                  className="absolute left-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-[10px]" 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 text-[10px]"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                </button>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <FontAwesomeIcon icon={faPhone} className="text-green-500 text-[10px]" />
                Phone
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="10 digit number"
                  maxLength="10"
                  className="w-full pl-6 pr-2 py-1.5 text-[11px] rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
                <FontAwesomeIcon 
                  icon={faPhone} 
                  className="absolute left-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-[10px]" 
                />
              </div>
              {formData.phone.length > 0 && formData.phone.length !== 10 && (
                <p className="text-red-500 text-[8px] mt-0.5">Must be 10 digits</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <FontAwesomeIcon icon={faUserTag} className="text-green-500 text-[10px]" />
                Role
              </label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setDonorType("");
                }}
                required
                className="w-full px-2 py-1.5 text-[11px] rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select role</option>
                <option value="farmer">🌾 Farmer</option>
                <option value="agronomist">🌱 Agronomist</option>
                <option value="donor">🤝 Donor</option>
                <option value="leader">👥 Leader</option>
                <option value="finance">💰 Finance</option>
              </select>
            </div>

            {/* Donor Type */}
            {role === "donor" && (
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
                  Donor Type
                </label>
                <select
                  value={donorType}
                  onChange={(e) => setDonorType(e.target.value)}
                  required
                  className="w-full px-2 py-1.5 text-[11px] rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-1 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select type</option>
                  <option value="person">👤 Individual</option>
                  <option value="organization">🏢 Organization</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 text-[11px] font-medium shadow flex items-center justify-center gap-1 disabled:opacity-50 mt-1"
            >
              {loading ? (
                <>
                  <div className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[8px]" />
                </>
              )}
            </motion.button>

            {/* Login Link */}
            <p className="text-center text-[9px] text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-green-600 dark:text-green-400 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-2 mt-1 text-[7px] text-gray-600 dark:text-gray-400">
          <span>🔒 Secure</span>
          <span>🌱 Free</span>
          <span>✅ Verified</span>
        </div>
      </motion.div>
    </div>
  );
}