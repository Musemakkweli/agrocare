import React, { useState } from "react";
import NavLayout from "../pages/NavLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCamera } from "@fortawesome/free-solid-svg-icons";

export default function ProfilePage() {
  // Dummy user data
  const [user, setUser] = useState({
    fullname: "Farmer John",
    email: "farmer.john@example.com",
    phone: "+250 788 123 456",
    country: "Rwanda",
    district: "Huye",
    sector: "Tumba",
    profileImage: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempImage, setTempImage] = useState(null); // for new image preview

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // Here you would send data to backend (not implemented)
    setIsEditing(false);
    if (tempImage) {
      setUser({ ...user, profileImage: tempImage });
      setTempImage(null);
    }
  };

  return (
    <NavLayout>
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">
            Profile
          </h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
            >
              <FontAwesomeIcon icon={faEdit} /> Edit Profile
            </button>
          )}
        </div>

        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden relative">
            <img
              src={tempImage || user.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full cursor-pointer">
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

        {/* PROFILE INFO */}
        <div className="space-y-4">
          {/* Fullname */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-200">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="fullname"
                value={user.fullname}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-200">{user.fullname}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-200">
              Email
            </label>
            <p className="text-gray-900 dark:text-gray-200">{user.email}</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-200">
              Phone
            </label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-gray-200">{user.phone}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-200">
              Location
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="country"
                  value={user.country}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white mb-2"
                  placeholder="Country"
                />
                <input
                  type="text"
                  name="district"
                  value={user.district}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white mb-2"
                  placeholder="District"
                />
                <input
                  type="text"
                  name="sector"
                  value={user.sector}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white"
                  placeholder="Sector"
                />
              </>
            ) : (
              <p className="text-gray-900 dark:text-gray-200">
                {user.country}, {user.district}, {user.sector}
              </p>
            )}
          </div>
        </div>

        {/* SAVE BUTTON */}
        {isEditing && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </NavLayout>
  );
}
