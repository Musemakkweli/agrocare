// src/pages/ProfileCompletion.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faHome } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

// Stable InputField component
const InputField = React.memo(({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col mb-2">
    <label className="mb-1 text-green-700 dark:text-green-300 font-medium text-sm">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-slate-700 dark:text-white text-sm"
    />
  </div>
));

export default function ProfileCompletion() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [userRole, setUserRole] = useState("");
  const [formData, setFormData] = useState({});

  // Load user info once
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login"); // If no user, go to login

    setUserRole(user.role);

    // If profile already completed, redirect to dashboard
    if (Boolean(user.profile_completed)) {
      switch (user.role) {
        case "farmer":
          navigate("/farmer/dashboard");
          break;
        case "agronomist":
          navigate("/agronomist/dashboard");
          break;
        case "donor":
          navigate("/donor/dashboard");
          break;
        case "leader":
          navigate("/leader/dashboard");
          break;
        case "finance":
          navigate("/finance/dashboard");
          break;
        default:
          navigate("/");
      }
      return;
    }

    // Initialize formData only for the current role
    switch (user.role) {
      case "farmer":
        setFormData({
          farmLocation: user.farmLocation || "",
          cropType: user.cropType || "",
          phone: user.phone || "",
        });
        break;
      case "agronomist":
        setFormData({
          expertise: user.expertise || "",
          license: user.license || "",
          phone: user.phone || "",
        });
        break;
      case "donor":
        setFormData({
          donorType: user.donorType || "",
          orgName: user.orgName || "",
          funding: user.funding || "",
          phone: user.phone || "",
        });
        break;
      case "leader":
        setFormData({
          leaderTitle: user.leaderTitle || "",
          district: user.district || "",
          phone: user.phone || "",
        });
        break;
      case "finance":
        setFormData({
          department: user.department || "",
          phone: user.phone || "",
        });
        break;
      default:
        setFormData({});
    }
  }, [navigate]);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save completed profile locally
    const updatedUser = {
      ...JSON.parse(localStorage.getItem("user")),
      profile_completed: true,
      ...formData,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Redirect to login after profile completion
    navigate("/login");
  };

  if (!userRole) return null; // Prevent render before userRole is set

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

      <div className="h-16"></div>

      {/* PROFILE FORM */}
      <section className="flex-grow flex justify-center items-start py-10 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-md px-6 py-8 max-w-md w-full space-y-3"
        >
          <h2 className="text-xl font-bold text-green-800 dark:text-green-400 text-center mb-4">
            Complete Your Profile
          </h2>

          {/* Farmer */}
          {userRole === "farmer" && (
            <>
              <InputField label="Farm Location" name="farmLocation" value={formData.farmLocation} onChange={handleChange} />
              <InputField label="Crop Type" name="cropType" value={formData.cropType} onChange={handleChange} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            </>
          )}

          {/* Agronomist */}
          {userRole === "agronomist" && (
            <>
              <InputField label="Expertise" name="expertise" value={formData.expertise} onChange={handleChange} />
              <InputField label="License/ID Number" name="license" value={formData.license} onChange={handleChange} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            </>
          )}

          {/* Donor */}
          {userRole === "donor" && (
            <>
              <div className="flex flex-col mb-2">
                <label className="mb-1 text-green-700 dark:text-green-300 font-medium text-sm">Donor Type</label>
                <select
                  name="donorType"
                  value={formData.donorType}
                  onChange={handleChange}
                  className="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-slate-700 dark:text-white text-sm"
                >
                  <option value="">-- Select Type --</option>
                  <option value="person">Person</option>
                  <option value="organization">Organization</option>
                </select>
              </div>
              {formData.donorType?.toLowerCase() === "person" && (
                <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
              )}
              {formData.donorType?.toLowerCase() === "organization" && (
                <>
                  <InputField label="Organization Name" name="orgName" value={formData.orgName} onChange={handleChange} />
                  <InputField label="Funding Capacity (USD)" name="funding" type="number" value={formData.funding} onChange={handleChange} />
                  <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                </>
              )}
            </>
          )}

          {/* Leader */}
          {userRole === "leader" && (
            <>
              <InputField label="Title/Position" name="leaderTitle" value={formData.leaderTitle} onChange={handleChange} />
              <InputField label="District/Sector" name="district" value={formData.district} onChange={handleChange} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            </>
          )}

          {/* Finance */}
          {userRole === "finance" && (
            <>
              <InputField label="Department" name="department" value={formData.department} onChange={handleChange} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            </>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-green-600 dark:bg-green-500 text-white font-medium rounded shadow hover:bg-green-700 transition text-sm"
          >
            Complete Profile
          </button>
        </form>
      </section>
    </div>
  );
}
