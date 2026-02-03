import React, { useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faHome } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileCompletion({ userRole }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [formData, setFormData] = useState({
    farmLocation: "",
    cropType: "",
    phone: "",
    expertise: "",
    license: "",
    orgName: "",
    funding: "",
    district: "",
    leaderTitle: "",
    department: "",
    donorType: "",
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

    // Call your API to save profile
    console.log("Profile submitted:", formData);
    alert("Profile completed successfully!");
    navigate("/farmer/dashboard"); // Redirect to user dashboard
  };

  const InputField = ({ label, name, value, type = "text" }) => (
    <div className="flex flex-col mb-2">
      <label className="mb-1 text-green-700 dark:text-green-300 font-medium text-sm">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
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

      {/* Spacer */}
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
              <InputField label="Farm Location" name="farmLocation" value={formData.farmLocation} />
              <InputField label="Crop Type" name="cropType" value={formData.cropType} />
              <InputField label="Phone Number" name="phone" value={formData.phone} />
            </>
          )}

          {/* Agronomist */}
          {userRole === "agronomist" && (
            <>
              <InputField label="Expertise" name="expertise" value={formData.expertise} />
              <InputField label="License/ID Number" name="license" value={formData.license} />
              <InputField label="Phone Number" name="phone" value={formData.phone} />
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
              {formData.donorType === "person" && (
                <InputField label="Phone Number" name="phone" value={formData.phone} />
              )}
              {formData.donorType === "organization" && (
                <>
                  <InputField label="Organization Name" name="orgName" value={formData.orgName} />
                  <InputField label="Funding Capacity (USD)" name="funding" value={formData.funding} type="number" />
                  <InputField label="Phone Number" name="phone" value={formData.phone} />
                </>
              )}
            </>
          )}

          {/* Leader */}
          {userRole === "leader" && (
            <>
              <InputField label="Title/Position" name="leaderTitle" value={formData.leaderTitle} />
              <InputField label="District/Sector" name="district" value={formData.district} />
              <InputField label="Phone Number" name="phone" value={formData.phone} />
            </>
          )}

          {/* Finance */}
          {userRole === "finance" && (
            <>
              <InputField label="Department" name="department" value={formData.department} />
              <InputField label="Phone Number" name="phone" value={formData.phone} />
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
