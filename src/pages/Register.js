// src/pages/Register.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faHome } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Import backend base URL
import BASE_URL from "../config";

// Reusable InputField component
const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-green-700 dark:text-green-300">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-slate-600
      dark:bg-slate-700 dark:text-white focus:ring-1 focus:ring-green-400"
    />
  </div>
);

export default function Register() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [role, setRole] = useState("");
  const [donorType, setDonorType] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Fixed handleChange to allow full input without cutting letters
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // correctly updates state
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      // Map frontend keys to backend keys
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: role,
      };

      const response = await axios.post(`${BASE_URL}/register`, payload);

      console.log("Registered successfully:", response.data);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Failed to register:", error.response?.data || error.message);
      alert("Failed to register. See console for details.");
    }
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
              className="px-2 py-1 text-xs rounded bg-white dark:bg-green-700
              dark:text-white text-green-600 font-medium"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>

            <Link to="/">
              <FontAwesomeIcon icon={faHome} className="text-white" />
            </Link>
          </div>
        </div>
      </header>

      {/* FORM */}
      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-md
          p-4 w-full max-w-sm space-y-3"
        >
          <h2 className="text-center font-bold text-green-700 dark:text-green-400">
            Create Account
          </h2>

          <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
          <InputField label="Password" name="password" value={formData.password} onChange={handleChange} type="password" />
          <InputField label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" />
          <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />

          {/* ROLE */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-green-700 dark:text-green-300">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setDonorType("");
              }}
              required
              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-slate-600
              dark:bg-slate-700 dark:text-white"
            >
              <option value="">-- Choose Role --</option>
              <option value="farmer">Farmer</option>
              <option value="agronomist">Agronomist</option>
              <option value="donor">Donor</option>
              <option value="leader">Leader</option>
              <option value="finance">Finance</option>
            </select>
          </div>

          {/* DONOR TYPE */}
          {role === "donor" && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-green-700 dark:text-green-300">
                Donor Type
              </label>
              <select
                value={donorType}
                onChange={(e) => setDonorType(e.target.value)}
                required
                className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-slate-600
                dark:bg-slate-700 dark:text-white"
              >
                <option value="">-- Select Type --</option>
                <option value="person">Person</option>
                <option value="organization">Organization</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 text-sm bg-green-600 dark:bg-green-500
            text-white rounded hover:bg-green-700 transition"
          >
            Register
          </button>

          <p className="text-center text-xs text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 dark:text-green-400 font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
