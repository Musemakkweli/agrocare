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
    
    // Here you can do actual authentication logic
    console.log("Login submitted:", formData);

    // Redirect to Farmer Dashboard
    navigate("/finance");
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 transition-all duration-300 flex flex-col">

      {/* HEADER */}
      <header className="bg-green-600 dark:bg-green-800 py-3 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faLeaf} className="text-white text-xl" />
            <span className="text-lg font-bold text-white">AgroCare</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleThemeToggle}
              className="px-2 py-1 rounded bg-white dark:bg-green-700 dark:text-white text-green-600 font-medium shadow"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <Link to="/" title="Home">
              <FontAwesomeIcon icon={faHome} className="text-white text-xl hover:text-green-300 transition" />
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16"></div>

      {/* LOGIN FORM */}
      <section className="flex-grow flex justify-center items-start py-10 px-4">
        <form 
          onSubmit={handleSubmit} 
          className="
            bg-white dark:bg-slate-800 
            rounded-xl shadow-md 
            px-6 py-8
            max-w-sm w-full
            space-y-5
          "
        >
          <h2 className="text-xl font-bold text-green-800 dark:text-green-400 text-center mb-4">
            Login to Your Account
          </h2>

          <div className="flex flex-col">
            <label className="mb-1 text-green-700 dark:text-green-300 font-medium text-sm">
              Email or Phone
            </label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your email or phone number"
              required
              className="
                px-3 py-2 
                rounded border border-gray-300 dark:border-slate-600 
                focus:outline-none focus:ring-2 focus:ring-green-400 
                dark:bg-slate-700 dark:text-white 
                text-sm
              "
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-green-700 dark:text-green-300 font-medium text-sm">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="
                px-3 py-2 
                rounded border border-gray-300 dark:border-slate-600 
                focus:outline-none focus:ring-2 focus:ring-green-400 
                dark:bg-slate-700 dark:text-white 
                text-sm
              "
            />
          </div>

          <div className="text-right text-xs">
            <Link to="/forgot-password" className="text-green-600 dark:text-green-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button 
            type="submit"
            className="
              w-full py-2.5 
              bg-green-600 dark:bg-green-500 
              text-white font-medium 
              rounded shadow 
              hover:bg-green-700 transition 
              text-sm
            "
          >
            Login
          </button>

          <p className="text-center text-xs text-gray-700 dark:text-gray-300">
            Don’t have an account?{" "}
            <Link to="/register" className="text-green-600 dark:text-green-400 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </section>

    </div>
  );
}
