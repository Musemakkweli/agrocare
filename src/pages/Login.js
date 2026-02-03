import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faHome } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [formData, setFormData] = useState({
    identifier: "", // email or phone
    password: "",
  });

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Authentication logic here
    console.log("Login submitted:", formData);

    // Redirect example
    navigate("/completion");
  };

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
          className="bg-white dark:bg-slate-800 rounded-xl shadow-md
                     px-6 py-6 max-w-sm w-full space-y-4"
        >
          <h2 className="text-center font-bold text-green-700 dark:text-green-400">
            Login to Your Account
          </h2>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-green-700 dark:text-green-300">
              Email or Phone
            </label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your email or phone number"
              required
              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-1 focus:ring-green-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-green-700 dark:text-green-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-1 focus:ring-green-400"
            />
          </div>

          <div className="text-right text-xs">
            <Link to="/forgot-password" className="text-green-600 dark:text-green-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2 text-sm bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 transition"
          >
            Login
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
