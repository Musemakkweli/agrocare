import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [identifier, setIdentifier] = useState("");
  const [sent, setSent] = useState(false);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset requested for:", identifier);
    setSent(true); // simulate success
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

      {/* FORGOT PASSWORD FORM */}
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
          <h2 className="text-xl font-bold text-green-800 dark:text-green-400 text-center mb-2">
            Forgot Password
          </h2>

          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mb-4">
            Enter your email or phone number and we will send you instructions to reset your password.
          </p>

          {!sent ? (
            <>
              {/* Email or Phone */}
              <div className="flex flex-col">
                <label className="mb-1 text-green-700 dark:text-green-300 font-medium text-sm">
                  Email or Phone
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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

              {/* Submit */}
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
                Send Reset Link / Code
              </button>
            </>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-green-700 dark:text-green-400 font-medium text-sm">
                ✅ Instructions have been sent!
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Please check your email or phone messages.
              </p>
            </div>
          )}

          {/* Back to Login */}
          <p className="text-center text-xs text-gray-700 dark:text-gray-300">
            Remember your password?{" "}
            <Link to="/login" className="text-green-600 dark:text-green-400 font-medium hover:underline">
              Back to Login
            </Link>
          </p>
        </form>
      </section>

    </div>
  );
}
