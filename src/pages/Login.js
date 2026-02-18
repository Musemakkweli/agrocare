// src/pages/Login.js
import React, { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faHome } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";

export default function Login() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ==============================
     Redirect Logic - WITH ADMIN
  ============================== */
  const redirectUser = useCallback(
    (user) => {
      if (!user.is_approved) {
        setError(true);
        setMessage("Your account is not approved yet.");
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
          navigate("/admin/dashboard");  // ✅ Admin redirect
          break;
        default:
          navigate("/");
      }
    },
    [navigate]
  );

  /* ==============================
     Fetch latest profile after login - WITH ADMIN
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
          endpoint = `${BASE_URL}/profile/admin/${user.id}`;  // ✅ Admin endpoint
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
     Auto redirect if already logged in
     ⚠️ COMMENTED OUT FOR TESTING ⚠️
  ============================== */
  // useEffect(() => {
  //   const savedUser = JSON.parse(localStorage.getItem("user"));
  //   if (savedUser) {
  //     fetchLatestUser(savedUser).then((latestUser) => {
  //       localStorage.setItem("user", JSON.stringify(latestUser));
  //       redirectUser(latestUser);
  //     });
  //   }
  // }, [redirectUser]);

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

      const latestUser = await fetchLatestUser(user);
      localStorage.setItem("user", JSON.stringify(latestUser));

      setMessage(backendMessage || "Login successful!");
      redirectUser(latestUser);
    } catch (err) {
      console.error(err);
      setError(true);
      setMessage(err.response?.data?.detail || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     UI
  ============================== */
  return (
    <div className="h-screen overflow-hidden bg-gray-200 dark:bg-slate-900 flex flex-col">
      {/* HEADER */}
      <header className="bg-green-600 dark:bg-green-800 py-2 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLeaf} className="text-white" />
            <span className="text-white font-bold">AgroCare</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleThemeToggle}
              className="px-2 py-1 text-xs rounded bg-white dark:bg-green-700 dark:text-white text-green-600 font-medium"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <Link to="/">
              <FontAwesomeIcon icon={faHome} className="text-white" />
            </Link>
          </div>
        </div>
      </header>

      {/* LOGIN FORM */}
      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-md px-6 py-6 max-w-sm w-full space-y-4"
        >
          <h2 className="text-center font-bold text-green-700 dark:text-green-400">
            Login to Your Account
          </h2>

          {message && (
            <p className={`text-sm text-center ${error ? "text-red-600" : "text-green-600"} font-medium`}>
              {message}
            </p>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-green-700 dark:text-green-300">Email or Phone</label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              placeholder="Enter your email or phone number"
              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-1 focus:ring-green-400"
            />
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="text-xs font-medium text-green-700 dark:text-green-300">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-1 focus:ring-green-400 w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-7 text-green-600 dark:text-green-400 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="text-right text-xs">
            <Link to="/forgot-password" className="text-green-600 dark:text-green-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-sm bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-xs text-gray-600 dark:text-gray-300">
            Don’t have an account?{" "}
            <Link to="/register" className="text-green-600 dark:text-green-400 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}