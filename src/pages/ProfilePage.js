import React, { useState, useEffect } from "react";
import NavLayout from "../pages/NavLayout";
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
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

// Role-based profile components
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
            value={user.fullname}
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
            value={user.phone}
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
          Location
        </label>
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              name="country"
              value={user.country}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Country"
            />
            <input
              type="text"
              name="district"
              value={user.district}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="District"
            />
            <input
              type="text"
              name="sector"
              value={user.sector}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Sector"
            />
          </div>
        ) : (
          <p className="text-gray-900 dark:text-gray-200">
            {user.country}, {user.district}, {user.sector}
          </p>
        )}
      </div>
    </div>

    {/* Farmer-specific fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faTractor} className="mr-2 text-green-600" />
          Farm Size (hectares)
        </label>
        {isEditing ? (
          <input
            type="number"
            name="farmSize"
            value={user.farmSize || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., 5"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200 font-semibold">{user.farmSize || "Not specified"} ha</p>
        )}
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faSeedling} className="mr-2 text-green-600" />
          Main Crops
        </label>
        {isEditing ? (
          <input
            type="text"
            name="mainCrops"
            value={user.mainCrops || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Maize, Beans, Coffee"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.mainCrops || "Not specified"}</p>
        )}
      </div>
    </div>

    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Farming Experience
      </label>
      {isEditing ? (
        <select
          name="experience"
          value={user.experience || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Select experience</option>
          <option value="beginner">Beginner (0-2 years)</option>
          <option value="intermediate">Intermediate (3-5 years)</option>
          <option value="experienced">Experienced (6-10 years)</option>
          <option value="expert">Expert (10+ years)</option>
        </select>
      ) : (
        <p className="text-gray-900 dark:text-gray-200 capitalize">{user.experience || "Not specified"}</p>
      )}
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
            value={user.fullname}
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
            value={user.phone}
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
          Location
        </label>
        {isEditing ? (
          <input
            type="text"
            name="location"
            value={user.location || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="City, Country"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.location || "Not specified"}</p>
        )}
      </div>
    </div>

    {/* Agronomist-specific fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Specialization
        </label>
        {isEditing ? (
          <input
            type="text"
            name="specialization"
            value={user.specialization || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Crop Diseases, Pest Management"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.specialization || "Not specified"}</p>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Years of Experience
        </label>
        {isEditing ? (
          <input
            type="number"
            name="yearsExperience"
            value={user.yearsExperience || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., 5"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.yearsExperience || "Not specified"} years</p>
        )}
      </div>
    </div>

    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Qualifications
      </label>
      {isEditing ? (
        <textarea
          name="qualifications"
          value={user.qualifications || ""}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="List your degrees, certifications, etc."
        />
      ) : (
        <p className="text-gray-900 dark:text-gray-200">{user.qualifications || "Not specified"}</p>
      )}
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
            value={user.fullname}
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
            value={user.phone}
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
          Location
        </label>
        {isEditing ? (
          <input
            type="text"
            name="location"
            value={user.location || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="City, Country"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.location || "Not specified"}</p>
        )}
      </div>
    </div>

    {/* Donor-specific fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faHandHoldingHeart} className="mr-2 text-purple-600" />
          Total Donations
        </label>
        {isEditing ? (
          <input
            type="number"
            name="totalDonations"
            value={user.totalDonations || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., 5000"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200 font-semibold text-green-600">${user.totalDonations || "0"}</p>
        )}
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Number of Projects Supported
        </label>
        {isEditing ? (
          <input
            type="number"
            name="projectsSupported"
            value={user.projectsSupported || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., 10"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.projectsSupported || "0"} projects</p>
        )}
      </div>
    </div>

    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Areas of Interest
      </label>
      {isEditing ? (
        <input
          type="text"
          name="interests"
          value={user.interests || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="e.g., Irrigation, Seeds, Training"
        />
      ) : (
        <p className="text-gray-900 dark:text-gray-200">{user.interests || "Not specified"}</p>
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
            value={user.fullname}
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
            value={user.phone}
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
          Region/District
        </label>
        {isEditing ? (
          <input
            type="text"
            name="region"
            value={user.region || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Huye District"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.region || "Not specified"}</p>
        )}
      </div>
    </div>

    {/* Leader-specific fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Position/Title
        </label>
        {isEditing ? (
          <input
            type="text"
            name="position"
            value={user.position || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., District Agricultural Officer"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.position || "Not specified"}</p>
        )}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <FontAwesomeIcon icon={faChartLine} className="mr-2 text-amber-600" />
          Farmers Under Leadership
        </label>
        {isEditing ? (
          <input
            type="number"
            name="farmersCount"
            value={user.farmersCount || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., 500"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.farmersCount || "0"} farmers</p>
        )}
      </div>
    </div>

    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Responsibilities
      </label>
      {isEditing ? (
        <textarea
          name="responsibilities"
          value={user.responsibilities || ""}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Describe your leadership role and responsibilities"
        />
      ) : (
        <p className="text-gray-900 dark:text-gray-200">{user.responsibilities || "Not specified"}</p>
      )}
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
            value={user.fullname}
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
            value={user.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Department
        </label>
        {isEditing ? (
          <input
            type="text"
            name="department"
            value={user.department || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Agricultural Finance"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.department || "Not specified"}</p>
        )}
      </div>
    </div>

    {/* Finance-specific fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Funds Managed
        </label>
        {isEditing ? (
          <input
            type="number"
            name="fundsManaged"
            value={user.fundsManaged || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., 100000"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200 font-semibold text-green-600">${user.fundsManaged || "0"}</p>
        )}
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Programs Supported
        </label>
        {isEditing ? (
          <input
            type="number"
            name="programsCount"
            value={user.programsCount || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., 15"
          />
        ) : (
          <p className="text-gray-900 dark:text-gray-200">{user.programsCount || "0"} programs</p>
        )}
      </div>
    </div>
  </div>
);

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        // Load saved profile image if it exists
        const savedImage = localStorage.getItem(`profileImage_${storedUser.id}`);
        if (savedImage) {
          storedUser.profileImage = savedImage;
        }
        
        // Add mock role-specific data
        const roleData = {
          farmer: {
            farmSize: "5",
            mainCrops: "Maize, Beans, Coffee",
            experience: "intermediate",
            ...storedUser
          },
          agronomist: {
            specialization: "Crop Diseases",
            yearsExperience: "8",
            qualifications: "BSc in Agriculture, MSc in Plant Pathology",
            location: "Kigali, Rwanda",
            ...storedUser
          },
          donor: {
            totalDonations: "15000",
            projectsSupported: "12",
            interests: "Irrigation, Seeds, Training",
            location: "Kigali, Rwanda",
            ...storedUser
          },
          leader: {
            position: "District Agricultural Officer",
            region: "Huye District",
            farmersCount: "2500",
            responsibilities: "Oversee agricultural programs, coordinate with farmers and agronomists",
            ...storedUser
          },
          finance: {
            department: "Agricultural Finance",
            fundsManaged: "500000",
            programsCount: "25",
            ...storedUser
          }
        };

        const role = storedUser.role || "farmer";
        const userData = roleData[role] || storedUser;
        setUser(userData);
        setProfileImage(userData.profileImage || null);
      } else {
        // Mock data for demo
        setUser({
          id: 1,
          fullname: "John Farmer",
          email: "john.farmer@example.com",
          phone: "+250 788 123 456",
          role: "farmer",
          country: "Rwanda",
          district: "Huye",
          sector: "Tumba",
          farmSize: "5",
          mainCrops: "Maize, Beans, Coffee",
          experience: "intermediate",
          profileImage: null,
        });
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempImage(imageUrl);
      setProfileImage(imageUrl);
      
      // Immediately save to localStorage
      if (user?.id) {
        localStorage.setItem(`profileImage_${user.id}`, imageUrl);
      }
    }
  };

  const handleSave = () => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      try {
        if (tempImage) {
          // Save image permanently
          const updatedUser = { ...user, profileImage: tempImage };
          setUser(updatedUser);
          setProfileImage(tempImage);
          
          // Save to localStorage with user-specific key
          if (user.id) {
            localStorage.setItem(`profileImage_${user.id}`, tempImage);
          }
          
          setTempImage(null);
        }
        
        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(user));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        setIsEditing(false);
      } catch (error) {
        setSaveError(true);
        setTimeout(() => setSaveError(false), 3000);
      } finally {
        setLoading(false);
      }
    }, 1000);
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
      default:
        return <FarmerProfile user={user} isEditing={isEditing} handleChange={handleChange} />;
    }
  };

  if (loading) {
    return (
      <NavLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-green-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
          </div>
        </div>
      </NavLayout>
    );
  }

  return (
    <NavLayout>
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
                    {user.role} • Member since {new Date().getFullYear()}
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
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-lg flex items-center gap-3"
              >
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                Profile updated successfully!
              </motion.div>
            )}

            {saveError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-lg flex items-center gap-3"
              >
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
                Failed to update profile. Please try again.
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
                      <FontAwesomeIcon icon={faCamera} className="text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
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
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
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

          {/* Role Badge */}
          <div className="mt-4 text-center">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              user.role === "farmer" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
              user.role === "agronomist" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
              user.role === "donor" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
              user.role === "leader" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" :
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
            }`}>
              <FontAwesomeIcon icon={getRoleIcon(user.role)} />
              {user.role} Account
            </span>
          </div>
        </motion.div>
      </div>
    </NavLayout>
  );
}