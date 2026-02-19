import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEdit, 
  faCamera, 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faTractor,
  faSeedling,
  faHandHoldingHeart,
  faUserTie,
  faChartLine,
  faSave,
  faTimes,
  faCheckCircle,
  faExclamationTriangle,
  faSpinner,
  faUserCog
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import BASE_URL from "../config";

// Import all NavLayouts
import NavLayout from "./NavLayout";
import LeaderNavLayout from "./LeaderNavLayout";
import AgronomistNavLayout from "./AgronomistNavLayout";
import FinanceNavLayout from "./FinanceNavLayout";
import DonorNavLayout from "./DonorNavLayout";
import AdminLayout from "./AdminLayout"; // Using AdminLayout as per your preference

// Role-based profile components (keep all your existing profile components as they are)
const FarmerProfile = ({ user, isEditing, handleChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" />
          Full Name
        </label>
        {isEditing ? (
          <input
            type="text"
            name="fullname"
            value={user.fullname || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200 font-medium">{user.fullname}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-green-600" />
          Email
        </label>
        <p className="text-gray-900 dark:text-gray-200">{user.email}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faPhone} className="mr-2 text-green-600" />
          Phone
        </label>
        {isEditing ? (
          <input
            type="text"
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-green-600" />
          Farm Location
        </label>
        {isEditing ? (
          <input
            type="text"
            name="farm_location"
            value={user.farm_location || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Farm location"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.farm_location || "Not specified"}</p>
        )}
      </div>
    </div>

    {/* Farmer-specific fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faSeedling} className="mr-2 text-green-600" />
          Crop Type
        </label>
        {isEditing ? (
          <input
            type="text"
            name="crop_type"
            value={user.crop_type || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Maize, Beans, Coffee"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.crop_type || "Not specified"}</p>
        )}
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-green-600" />
          District
        </label>
        {isEditing ? (
          <input
            type="text"
            name="district"
            value={user.district || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="District"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.district || "Not specified"}</p>
        )}
      </div>
    </div>
  </div>
);

const AgronomistProfile = ({ user, isEditing, handleChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" />
          Full Name
        </label>
        {isEditing ? (
          <input
            type="text"
            name="fullname"
            value={user.fullname || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200 font-medium">{user.fullname}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-green-600" />
          Email
        </label>
        <p className="text-gray-900 dark:text-gray-200">{user.email}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faPhone} className="mr-2 text-green-600" />
          Phone
        </label>
        {isEditing ? (
          <input
            type="text"
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.phone}</p>
        )}
      </div>
    </div>

    {/* Agronomist-specific fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Expertise
        </label>
        {isEditing ? (
          <input
            type="text"
            name="expertise"
            value={user.expertise || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Crop Diseases, Pest Management"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.expertise || "Not specified"}</p>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          License
        </label>
        {isEditing ? (
          <input
            type="text"
            name="license"
            value={user.license || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="License number"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.license || "Not specified"}</p>
        )}
      </div>
    </div>
  </div>
);

const DonorProfile = ({ user, isEditing, handleChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" />
          Organization/Name
        </label>
        {isEditing ? (
          <input
            type="text"
            name="fullname"
            value={user.fullname || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200 font-medium">{user.fullname}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-green-600" />
          Email
        </label>
        <p className="text-gray-900 dark:text-gray-200">{user.email}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faPhone} className="mr-2 text-green-600" />
          Phone
        </label>
        {isEditing ? (
          <input
            type="text"
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.phone}</p>
        )}
      </div>
    </div>

    {/* Donor-specific fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Organization Name
        </label>
        {isEditing ? (
          <input
            type="text"
            name="org_name"
            value={user.org_name || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Organization name"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.org_name || "Not specified"}</p>
        )}
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Funding Amount
        </label>
        {isEditing ? (
          <input
            type="text"
            name="funding"
            value={user.funding || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., $5000"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.funding || "Not specified"}</p>
        )}
      </div>
    </div>

    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Donor Type
      </label>
      {isEditing ? (
        <select
          name="donor_type"
          value={user.donor_type || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Select donor type</option>
          <option value="person">Person</option>
          <option value="organization">Organization</option>
        </select>
      ) : (
        <p className="text-gray-900 dark:text-gray-200 capitalize">{user.donor_type || "Not specified"}</p>
      )}
    </div>
  </div>
);

const LeaderProfile = ({ user, isEditing, handleChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faUserTie} className="mr-2 text-green-600" />
          Full Name
        </label>
        {isEditing ? (
          <input
            type="text"
            name="fullname"
            value={user.fullname || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200 font-medium">{user.fullname}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-green-600" />
          Email
        </label>
        <p className="text-gray-900 dark:text-gray-200">{user.email}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faPhone} className="mr-2 text-green-600" />
          Phone
        </label>
        {isEditing ? (
          <input
            type="text"
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.phone}</p>
        )}
      </div>
    </div>

    {/* Leader-specific fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        {isEditing ? (
          <input
            type="text"
            name="leader_title"
            value={user.leader_title || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., District Agricultural Officer"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.leader_title || "Not specified"}</p>
        )}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-amber-600" />
          District
        </label>
        {isEditing ? (
          <input
            type="text"
            name="district"
            value={user.district || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="District"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.district || "Not specified"}</p>
        )}
      </div>
    </div>
  </div>
);

const FinanceProfile = ({ user, isEditing, handleChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" />
          Full Name
        </label>
        {isEditing ? (
          <input
            type="text"
            name="fullname"
            value={user.fullname || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200 font-medium">{user.fullname}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-green-600" />
          Email
        </label>
        <p className="text-gray-900 dark:text-gray-200">{user.email}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faPhone} className="mr-2 text-green-600" />
          Phone
        </label>
        {isEditing ? (
          <input
            type="text"
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.phone}</p>
        )}
      </div>
    </div>

    {/* Finance-specific fields */}
    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Department
      </label>
      {isEditing ? (
        <input
          type="text"
          name="department"
          value={user.department || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="e.g., Agricultural Finance"
        />
      ) : (
        <p className="text-gray-900 dark:text-gray-200">{user.department || "Not specified"}</p>
      )}
    </div>
  </div>
);

// Admin profile component
const AdminProfile = ({ user, isEditing, handleChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" />
          Full Name
        </label>
        {isEditing ? (
          <input
            type="text"
            name="fullname"
            value={user.fullname || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200 font-medium">{user.fullname}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-green-600" />
          Email
        </label>
        <p className="text-gray-900 dark:text-gray-200">{user.email}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faPhone} className="mr-2 text-green-600" />
          Phone
        </label>
        {isEditing ? (
          <input
            type="text"
            name="phone"
            value={user.phone || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.phone}</p>
        )}
      </div>
    </div>

    {/* Admin-specific fields */}
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        <FontAwesomeIcon icon={faUserCog} className="mr-2 text-gray-600" />
        Admin Level
      </label>
      {isEditing ? (
        <select
          name="admin_level"
          value={user.admin_level || "super"}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="super">Super Admin</option>
          <option value="moderator">Moderator</option>
        </select>
      ) : (
        <p className="text-gray-900 dark:text-gray-200 capitalize">{user.admin_level || "Super Admin"}</p>
      )}
    </div>
  </div>
);

// Helper function to get the correct NavLayout based on user role
const getNavLayout = (role) => {
  switch(role) {
    case "leader":
      return LeaderNavLayout;
    case "agronomist":
      return AgronomistNavLayout;
    case "finance":
      return FinanceNavLayout;
    case "donor":
      return DonorNavLayout;
    case "admin":
      return AdminLayout;
    case "farmer":
    default:
      return NavLayout;
  }
};

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);  
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load user from localStorage and fetch profile from backend
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Get user from localStorage first
        const storedUser = JSON.parse(localStorage.getItem("user"));
        
        if (!storedUser || !storedUser.id) {
          setError("No user found. Please login again.");
          setLoading(false);
          return;
        }

        // Fetch latest profile data from backend
        const response = await fetch(`${BASE_URL}/users/profile/${storedUser.id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const profileData = await response.json();
        
        // Load saved profile image from localStorage if it exists
        const savedImage = localStorage.getItem(`profileImage_${storedUser.id}`);
        if (savedImage) {
          profileData.profileImage = savedImage;
        }

        setUser(profileData);
        setProfileImage(profileData.profileImage || null);
        setError(null);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile data");
        
        // Fallback to localStorage data if backend fails
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          setUser(storedUser);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File too large. Maximum size is 5MB");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      setSaving(true);
      
      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Upload to backend
      const response = await fetch(`${BASE_URL}/users/${user.id}/profile-picture`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      
      // Update local state with new image URL
      const imageUrl = data.imageUrl;
      setTempImage(imageUrl);
      setProfileImage(imageUrl);
      
      // Save to localStorage
      localStorage.setItem(`profileImage_${user.id}`, imageUrl);

      setSuccessMessage("Profile picture uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error uploading image:", err);
      setErrorMessage("Failed to upload image. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Prepare profile data for update
      const profileData = {};
      
      // Common fields
      if (user.fullname) profileData.fullname = user.fullname;
      if (user.phone) profileData.phone = user.phone;
      
      // Role-specific fields
      switch(user.role) {
        case "farmer":
          if (user.farm_location) profileData.farm_location = user.farm_location;
          if (user.crop_type) profileData.crop_type = user.crop_type;
          if (user.district) profileData.district = user.district;
          break;
        case "agronomist":
          if (user.expertise) profileData.expertise = user.expertise;
          if (user.license) profileData.license = user.license;
          break;
        case "donor":
          if (user.org_name) profileData.org_name = user.org_name;
          if (user.funding) profileData.funding = user.funding;
          if (user.donor_type) profileData.donor_type = user.donor_type;
          break;
        case "leader":
          if (user.leader_title) profileData.leader_title = user.leader_title;
          if (user.district) profileData.district = user.district;
          break;
        case "finance":
          if (user.department) profileData.department = user.department;
          break;
        case "admin":
          if (user.admin_level) profileData.admin_level = user.admin_level;
          break;
        default:
          // No role-specific fields for unknown roles
          break;
      }

      // Send update to backend
      const response = await fetch(`${BASE_URL}/users/profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();

      // Update localStorage with new user data
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedStoredUser = { ...storedUser, ...user };
      localStorage.setItem("user", JSON.stringify(updatedStoredUser));

      setSuccessMessage(result.is_profile_completed 
        ? "Profile updated successfully! Your profile is now complete." 
        : "Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      setIsEditing(false);
      
    } catch (err) {
      console.error("Error saving profile:", err);
      setErrorMessage("Failed to update profile. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempImage(null);
    // Revert to saved image
    setProfileImage(user.profileImage || null);
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case "farmer": return faTractor;
      case "agronomist": return faSeedling;
      case "donor": return faHandHoldingHeart;
      case "leader": return faUserTie;
      case "finance": return faChartLine;
      case "admin": return faUserCog;
      default: return faUser;
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case "farmer": return "from-green-500 to-green-600";
      case "agronomist": return "from-blue-500 to-blue-600";
      case "donor": return "from-purple-500 to-purple-600";
      case "leader": return "from-amber-500 to-amber-600";
      case "finance": return "from-emerald-500 to-emerald-600";
      case "admin": return "from-gray-600 to-gray-700";
      default: return "from-green-500 to-green-600";
    }
  };

  const renderProfileByRole = () => {
    if (!user) return null;

    switch(user.role) {
      case "farmer":
        return <FarmerProfile user={user} isEditing={isEditing} handleChange={handleChange} />;
      case "agronomist":
        return <AgronomistProfile user={user} isEditing={isEditing} handleChange={handleChange} />;
      case "donor":
        return <DonorProfile user={user} isEditing={isEditing} handleChange={handleChange} />;
      case "leader":
        return <LeaderProfile user={user} isEditing={isEditing} handleChange={handleChange} />;
      case "finance":
        return <FinanceProfile user={user} isEditing={isEditing} handleChange={handleChange} />;
      case "admin":
        return <AdminProfile user={user} isEditing={isEditing} handleChange={handleChange} />;
      default:
        return <FarmerProfile user={user} isEditing={isEditing} handleChange={handleChange} />;
    }
  };

  // Get the correct NavLayout based on user role
  const NavLayoutComponent = user ? getNavLayout(user.role) : NavLayout;

  if (loading) {
    return (
      <NavLayoutComponent>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-green-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
          </div>
        </div>
      </NavLayoutComponent>
    );
  }

  if (error) {
    return (
      <NavLayoutComponent>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
          <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-6 rounded-xl max-w-md">
            <h3 className="font-bold text-lg mb-2">Error</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </NavLayoutComponent>
    );
  }

  if (!user) {
    return (
      <NavLayoutComponent>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-6 rounded-xl max-w-md">
            <h3 className="font-bold text-lg mb-2">No User Found</h3>
            <p>Please login to view your profile.</p>
          </div>
        </div>
      </NavLayoutComponent>
    );
  }

  return (
    <NavLayoutComponent>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 p-6 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`bg-gradient-to-r ${getRoleColor(user.role)} p-3 rounded-xl`}>
                  <FontAwesomeIcon icon={getRoleIcon(user.role)} className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {user.fullname}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {user.role} • {user.is_profile_completed ? "Profile Complete" : "Profile Incomplete"}
                  </p>
                </div>
              </div>
              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl flex items-center gap-2 hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md"
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit Profile
                </motion.button>
              )}
            </div>
          </div>

          {/* Success/Error Messages */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-lg flex items-center gap-3"
              >
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                {successMessage}
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-lg flex items-center gap-3"
              >
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Profile Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 overflow-hidden">
            {/* Profile Image Section */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-white dark:bg-gray-700 overflow-hidden ring-4 ring-white/50">
                    <img
                      src={tempImage || profileImage || user.profileImage || `https://ui-avatars.com/api/?name=${user.fullname}&background=16a34a&color=fff&size=128`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full cursor-pointer hover:bg-green-700 transition shadow-lg">
                      {saving ? (
                        <FontAwesomeIcon icon={faSpinner} spin className="text-white" />
                      ) : (
                        <FontAwesomeIcon icon={faCamera} className="text-white" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={saving}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="p-6">
              {renderProfileByRole()}

              {/* Edit/Save Buttons */}
              {isEditing && (
                <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      <FontAwesomeIcon icon={faSave} />
                    )}
                    Save Changes
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Approval Status - Only show for non-admin users */}
          {user.role !== "admin" && !user.is_approved && (
            <div className="mt-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              Your account is pending approval. Some features may be limited.
            </div>
          )}

          {/* Role Badge */}
          <div className="mt-4 text-center">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              user.role === "farmer" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
              user.role === "agronomist" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
              user.role === "donor" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
              user.role === "leader" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" :
              user.role === "finance" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" :
              user.role === "admin" ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" :
              "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            }`}>
              <FontAwesomeIcon icon={getRoleIcon(user.role)} />
              {user.role} Account
            </span>
          </div>
        </motion.div>
      </div>
    </NavLayoutComponent>
  );
}