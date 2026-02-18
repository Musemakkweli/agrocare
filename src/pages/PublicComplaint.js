import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faHome,
  faExclamationTriangle,
  faImage,
  faMapMarkerAlt,
  faUser,
  faPhone,
  faEnvelope,
  faPaperPlane,
  faTimes,
  faCheckCircle,
  faTag // Added for title field
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";

export default function PublicComplaint() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // Changed to single image
  const [imagePreview, setImagePreview] = useState(null); // Changed to single preview
  const fileInputRef = useRef(null);

  // Form data state - Updated to match backend
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    title: "", // Added title field
    complaintType: "crop_disease", // This will be sent as 'type' to backend
    description: "",
    location: "",
    urgent: false
  });

  // Complaint types
  const complaintTypes = [
    { value: "crop_disease", label: "Crop Disease" },
    { value: "pest_infestation", label: "Pest Infestation" },
    { value: "weather_damage", label: "Weather Damage" },
    { value: "soil_issue", label: "Soil Issue" },
    { value: "fertilizer_problem", label: "Fertilizer Problem" },
    { value: "equipment_failure", label: "Equipment Failure" },
    { value: "other", label: "Other Issue" }
  ];

  // Theme toggle
  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Handle image upload - Changed to single image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Clear previous preview if exists
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Remove image
  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Clear form
  const clearForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      title: "",
      complaintType: "crop_disease",
      description: "",
      location: "",
      urgent: false
    });
    // Clear image
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
    setError("");
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Create FormData for multipart upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("phone", formData.phone);
      submitData.append("email", formData.email || "");
      submitData.append("title", formData.title); // Add title
      submitData.append("type", formData.complaintType); // Send as 'type' to match backend
      submitData.append("description", formData.description);
      submitData.append("location", formData.location);
      submitData.append("urgent", formData.urgent);
      
      // Append single image if selected
      if (selectedImage) {
        submitData.append("image", selectedImage);
      }

      // Send to backend
      const response = await axios.post(`${BASE_URL}/public-complaint`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        clearForm();
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: "smooth" });
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setError(
        err.response?.data?.detail || 
        "Failed to submit complaint. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-all">
      {/* ================= HEADER ================= */}
      <header className="bg-green-700 dark:bg-green-900 fixed top-0 w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faLeaf} className="text-white text-xl" />
            <span className="text-white font-semibold text-lg">AgroCare</span>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <button
              onClick={handleThemeToggle}
              className="text-white hover:text-green-200 transition"
            >
              {theme === "dark" ? "🌞" : "🌙"}
            </button>

            <Link to="/">
              <FontAwesomeIcon
                icon={faHome}
                className="text-white cursor-pointer hover:text-green-200"
              />
            </Link>

            <Link to="/login" className="text-white hover:text-green-200">
              Login
            </Link>

            <Link
              to="/register"
              className="border border-green-300 text-green-100 px-3 py-1 rounded-md hover:bg-green-600/20"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <div className="h-16"></div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg flex items-center gap-3">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl" />
            <div>
              <p className="font-semibold">Complaint Submitted Successfully!</p>
              <p className="text-sm">Thank you for reporting. Our team will review your complaint and get back to you soon.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              Report a Farming Issue
            </h1>
            <p className="text-green-100 text-sm mt-1">
              No login required. Report crop diseases, pest problems, or any farming issues.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" />
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faPhone} className="mr-2 text-green-600" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 0788123456"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-green-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com (optional)"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-green-600" />
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Huye District, Sector"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Complaint Details */}
            <div className="space-y-6">
              {/* Title Field - New */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faTag} className="mr-2 text-green-600" />
                  Complaint Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Brief title for your complaint (e.g., Maize leaves turning yellow)"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type of Issue *
                </label>
                <select
                  name="complaintType"
                  value={formData.complaintType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {complaintTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe the Problem *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Please describe the issue in detail. Include information about affected crops, when you noticed the problem, any symptoms, etc."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Image Upload - Changed to single image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faImage} className="mr-2 text-green-600" />
                  Upload Image (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {imagePreview ? (
                    <div className="relative mb-4 inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        <FontAwesomeIcon icon={faTimes} size="xs" />
                      </button>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-green-500 hover:text-green-600 transition flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faImage} />
                    Click to upload an image (max 5MB)
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Upload a photo of affected crops, pests, or damage to help us diagnose better.
                  </p>
                </div>
              </div>

              {/* Urgent Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="urgent"
                  id="urgent"
                  checked={formData.urgent}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="urgent" className="text-sm text-gray-700 dark:text-gray-300">
                  This is an urgent issue (needs immediate attention)
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    Submit Complaint
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={clearForm}
                className="px-6 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
              >
                Clear Form
              </button>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Your information will only be used to address your complaint. 
              We respect your privacy and will not share your data.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}