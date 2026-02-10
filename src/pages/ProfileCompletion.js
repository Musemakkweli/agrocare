// src/pages/ProfileCompletion.js
import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faHome } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";

// Stable InputField component
const InputField = React.memo(({ label, name, value, onChange, type = "text", error }) => (
  <div className="flex flex-col mb-2">
    <label className="mb-1 text-green-700 dark:text-green-300 font-medium text-sm">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`px-2 py-1 rounded border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-slate-700 dark:text-white text-sm ${
        error ? "border-red-500 focus:ring-red-400" : ""
      }`}
    />
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
));

export default function ProfileCompletion() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [userRole, setUserRole] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Navigate after profile completion
  const navigateAfterCompletion = useCallback(
    (role) => {
      switch (role) {
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
        default:
          navigate("/");
      }
    },
    [navigate]
  );

  // Load user info and initialize formData
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    setUserRole(user.role);

    if (Boolean(user.profile_completed)) {
      navigateAfterCompletion(user.role);
      return;
    }

    // Initialize formData from backend (snake_case -> camelCase)
    switch (user.role) {
      case "farmer":
        setFormData({
          farmLocation: user.farm_location || "",
          cropType: user.crop_type || "",
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
          donorType: user.donor_type || "",
          orgName: user.org_name || "",
          funding: user.funding || "",
          phone: user.phone || "",
        });
        break;
      case "leader":
        setFormData({
          leaderTitle: user.leader_title || "",
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
  }, [navigate, navigateAfterCompletion]);

  // Theme toggle
  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return; // digits only
      setPhoneError(value.length > 0 && value.length < 10 ? "Phone must be 10 digits" : "");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phone && formData.phone.length !== 10) {
      setPhoneError("Phone number must be 10 digits");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) throw new Error("User not found in localStorage");

      const endpointMap = {
        farmer: "farmer",
        agronomist: "agronomist",
        donor: "donor",
        leader: "leader",
        finance: "finance",
      };
      const rolePath = endpointMap[user.role];
      if (!rolePath) throw new Error("Invalid user role");

      // Convert formData to backend snake_case
      let payload = {};
      switch (user.role) {
        case "farmer":
          payload = {
            farm_location: formData.farmLocation,
            crop_type: formData.cropType,
            phone: formData.phone,
          };
          break;
        case "agronomist":
          payload = {
            expertise: formData.expertise,
            license: formData.license,
            phone: formData.phone,
          };
          break;
        case "donor":
          payload = {
            donor_type: formData.donorType?.toLowerCase(),
            org_name: formData.orgName || null,
            funding: formData.funding || null,
            phone: formData.phone,
          };
          break;
        case "leader":
          payload = {
            leader_title: formData.leaderTitle,
            district: formData.district,
            phone: formData.phone,
          };
          break;
        case "finance":
          payload = {
            department: formData.department,
            phone: formData.phone,
          };
          break;
        default:
          payload = {};
      }

      const response = await axios.put(
        `${BASE_URL}/profile/${rolePath}/${user.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Update localStorage
      const updatedUser = { ...user, ...response.data, profile_completed: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("Profile completed successfully! Redirecting...");
      setTimeout(() => {
        navigateAfterCompletion(user.role);
      }, 1500);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          setMessage(err.response.data.detail.map((d) => d.msg).join(", "));
        } else if (typeof err.response.data.detail === "string") {
          setMessage(err.response.data.detail);
        } else {
          setMessage("Failed to complete profile.");
        }
      } else {
        setMessage(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userRole) return null;

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

      {/* PROFILE FORM */}
      <section className="flex-grow flex justify-center items-start py-10 px-4 overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-md px-6 py-8 max-w-md w-full space-y-3"
        >
          <h2 className="text-xl font-bold text-green-800 dark:text-green-400 text-center mb-4">
            Complete Your Profile
          </h2>

          {message && (
            <div className={`p-2 rounded text-center text-sm font-medium ${message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}

          {/* Farmer */}
          {userRole === "farmer" && (
            <>
              <InputField label="Farm Location" name="farmLocation" value={formData.farmLocation} onChange={handleChange} />
              <InputField label="Crop Type" name="cropType" value={formData.cropType} onChange={handleChange} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} error={phoneError} />
            </>
          )}

          {/* Agronomist */}
          {userRole === "agronomist" && (
            <>
              <InputField label="Expertise" name="expertise" value={formData.expertise} onChange={handleChange} />
              <InputField label="License/ID Number" name="license" value={formData.license} onChange={handleChange} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} error={phoneError} />
            </>
          )}

          {/* Donor */}
          {userRole === "donor" && (
            <>
              <div className="flex flex-col mb-2">
                <label className="mb-1 text-green-700 dark:text-green-300 font-medium text-sm">Donor Type</label>
                <select
                  name="donorType"
                  value={formData.donorType || ""}
                  onChange={handleChange}
                  className="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-slate-700 dark:text-white text-sm"
                >
                  <option value="">-- Select Type --</option>
                  <option value="person">Person</option>
                  <option value="organization">Organization</option>
                </select>
              </div>

              {formData.donorType?.toLowerCase() === "person" && (
                <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} error={phoneError} />
              )}
              {formData.donorType?.toLowerCase() === "organization" && (
                <>
                  <InputField label="Organization Name" name="orgName" value={formData.orgName} onChange={handleChange} />
                  <InputField label="Funding Capacity (USD)" name="funding" type="number" value={formData.funding} onChange={handleChange} />
                  <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} error={phoneError} />
                </>
              )}
            </>
          )}

          {/* Leader */}
          {userRole === "leader" && (
            <>
              <InputField label="Title/Position" name="leaderTitle" value={formData.leaderTitle} onChange={handleChange} />
              <InputField label="District/Sector" name="district" value={formData.district} onChange={handleChange} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} error={phoneError} />
            </>
          )}

          {/* Finance */}
          {userRole === "finance" && (
            <>
              <InputField label="Department" name="department" value={formData.department} onChange={handleChange} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} error={phoneError} />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 bg-green-600 dark:bg-green-500 text-white font-medium rounded shadow hover:bg-green-700 transition text-sm flex justify-center items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <>
                <span className="loader-border h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                Completing...
              </>
            ) : (
              "Complete Profile"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
