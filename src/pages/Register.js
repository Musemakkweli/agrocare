import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Register() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [role, setRole] = useState("");
  const [donorType, setDonorType] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    farmLocation: "",
    cropType: "",
    phone: "",
    expertise: "",
    license: "",
    orgName: "",
    funding: "",
    district: "",
    leaderTitle: "",
    department: "", // for finance role
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
    console.log("Form submitted:", formData);
  };

  const InputField = ({ label, name, value, onChange, type = "text" }) => (
    <div className="flex flex-col mb-2">
      <label className="mb-1 text-green-700 dark:text-green-300 font-medium text-sm">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-slate-700 dark:text-white text-sm"
      />
    </div>
  );

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

      {/* Spacer for fixed header */}
      <div className="h-16"></div>

      {/* REGISTRATION FORM */}
      <section className="flex-grow flex justify-center items-start py-8 px-4">
        <form 
          onSubmit={handleSubmit} 
          className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 max-w-md w-full space-y-3"
        >
          <h2 className="text-xl font-bold text-green-800 dark:text-green-400 text-center mb-3">
            Register an Account
          </h2>

          <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
          <InputField label="Password" name="password" value={formData.password} onChange={handleChange} type="password" />
          <InputField label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" />

          {/* Role Selection */}
          <div className="flex flex-col mb-2">
            <label className="mb-1 text-green-700 dark:text-green-300 font-medium text-sm">Select Role</label>
            <select
              name="role"
              value={role}
              onChange={(e) => { setRole(e.target.value); setDonorType(""); }}
              required
              className="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-slate-700 dark:text-white text-sm"
            >
              <option value="">-- Choose Role --</option>
              <option value="farmer">Farmer</option>
              <option value="agronomist">Agronomist</option>
              <option value="donor">Donor</option>
              <option value="leader">Leader</option>
              <option value="finance">Finance</option> {/* Added Finance Role */}
            </select>
          </div>

          {/* Role-specific Fields */}
          {role === "farmer" && (
            <>
              <InputField label="Farm Location" name="farmLocation" value={formData.farmLocation} onChange={handleChange} />
              <InputField label="Crop Type" name="cropType" value={formData.cropType} onChange={handleChange} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            </>
          )}

          {role === "agronomist" && (
            <>
              <InputField label="Expertise" name="expertise" value={formData.expertise} onChange={handleChange} />
              <InputField label="License/ID Number" name="license" value={formData.license} onChange={handleChange} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            </>
          )}

          {role === "donor" && (
            <>
              <div className="flex flex-col mb-2">
                <label className="mb-1 text-green-700 dark:text-green-300 font-medium text-sm">Donor Type</label>
                <select
                  name="donorType"
                  value={donorType}
                  onChange={(e) => setDonorType(e.target.value)}
                  required
                  className="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-slate-700 dark:text-white text-sm"
                >
                  <option value="">-- Select Type --</option>
                  <option value="person">Person</option>
                  <option value="organization">Organization</option>
                </select>
              </div>

              {donorType === "person" && (
                <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
              )}
              {donorType === "organization" && (
                <>
                  <InputField label="Organization Name" name="orgName" value={formData.orgName} onChange={handleChange} />
                  <InputField label="Funding Capacity (USD)" name="funding" value={formData.funding} onChange={handleChange} type="number" />
                  <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                </>
              )}
            </>
          )}

          {role === "leader" && (
            <>
              <InputField label="Title/Position" name="leaderTitle" value={formData.leaderTitle} onChange={handleChange} />
              <InputField label="District/Sector" name="district" value={formData.district} onChange={handleChange} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            </>
          )}

          {role === "finance" && (
            <>
              <InputField label="Department" name="department" value={formData.department} onChange={handleChange} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
            </>
          )}

          <button 
            type="submit"
            className="w-full py-2 bg-green-600 dark:bg-green-500 text-white font-medium rounded shadow hover:bg-green-700 transition text-sm"
          >
            Register
          </button>

          <p className="text-center text-xs text-gray-700 dark:text-gray-300 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 dark:text-green-400 font-medium hover:underline">
              Login here
            </Link>
          </p>

        </form>
      </section>
    </div>
  );
}
