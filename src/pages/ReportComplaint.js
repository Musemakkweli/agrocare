import React, { useState, useEffect, useCallback, useRef } from "react"; // Added useRef
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEye,
  faPen,
  faTrash,
  faPlus,
  faExclamationTriangle,
  faFileArrowDown,
  faLeaf,
  faMapMarkerAlt,
  faTag,
  faImage,
  faTimes,
  faSearch,
  faFilter,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons"; // Removed unused faCheckCircle and faClock
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import NavLayout from "./NavLayout";
import {
  createComplaint,
  getUserComplaints,
  updateComplaint,
  deleteComplaint,
} from "../complaintsApi";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportComplaintDashboard() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [editId, setEditId] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    location: "",
    image: null,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // Complaint types matching Public Complaint page
  const complaintTypes = [
    { value: "Pest Attack", label: "Pest Attack", icon: "🐛" },
    { value: "Animal Damage", label: "Animal Damage", icon: "🦊" },
    { value: "Crop Disease", label: "Crop Disease", icon: "🌱" },
    { value: "Theft", label: "Theft", icon: "🔒" },
    { value: "Weather Damage", label: "Weather Damage", icon: "🌧️" },
    { value: "Soil Issue", label: "Soil Issue", icon: "🪴" },
    { value: "Equipment Failure", label: "Equipment Failure", icon: "🚜" },
    { value: "Other", label: "Other Issue", icon: "📌" },
  ];

  // ================= FETCH =================
  const fetchComplaints = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) {
      alert("❌ User not logged in");
      setComplaints([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getUserComplaints(user.id);
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
      alert("❌ Could not fetch complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // ================= FILTER & PAGINATION =================
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.type?.toLowerCase().includes(search.toLowerCase()) ||
      c.status?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === "all" || c.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= EXPORT =================
  const exportCSV = () => {
    const csv = Papa.unparse(filteredComplaints);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `complaints_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(22, 163, 74);
    doc.text("Complaints Report", 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [["Title", "Type", "Location", "Status", "Date"]],
      body: filteredComplaints.map((c) => [
        c.title,
        c.type,
        c.location,
        c.status,
        new Date(c.created_at).toLocaleDateString(),
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [22, 163, 74], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 253, 244] },
    });

    doc.save(`complaints_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // ================= IMAGE HANDLERS =================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setFormData({ ...formData, image: file });
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
    setFormData({ ...formData, image: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("❌ User not logged in!");
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("type", formData.type);
      submitData.append("description", formData.description);
      submitData.append("location", formData.location);
      submitData.append("user_id", userId);
      
      if (selectedImage) {
        submitData.append("image", selectedImage);
      }

      if (editId) {
        await updateComplaint(editId, submitData);
      } else {
        await createComplaint(submitData);
      }

      setFormData({ title: "", type: "", description: "", location: "", image: null });
      setSelectedImage(null);
      setImagePreview(null);
      setEditId(null);
      setShowForm(false);
      fetchComplaints();
    } catch (err) {
      console.error("Failed to submit complaint", err);
      alert("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      await deleteComplaint(id);
      fetchComplaints();
    } catch (err) {
      console.error("Failed to delete complaint", err);
      alert("❌ Could not delete complaint!");
    }
    setActiveDropdown(null);
  };

  const handleView = (c) => {
    setViewComplaint(c);
    setActiveDropdown(null);
  };

  const handleUpdate = (c) => {
    setFormData({
      title: c.title,
      type: c.type,
      description: c.description,
      location: c.location,
      image: null,
    });
    setEditId(c.id);
    setShowForm(true);
    setActiveDropdown(null);
  };

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "in progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  /* ================= UI ================= */
  return (
    <NavLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-6">
        {/* HEADER with agriculture theme */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <FontAwesomeIcon icon={faLeaf} className="text-green-600" />
                My Farm Complaints
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Track and manage all your farming issues in one place
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setFormData({ title: "", type: "", description: "", location: "", image: null });
                setSelectedImage(null);
                setImagePreview(null);
                setEditId(null);
                setShowForm(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl flex items-center gap-2 hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              <FontAwesomeIcon icon={faPlus} /> Report New Issue
            </motion.button>
          </div>
        </motion.div>

        {/* SEARCH + FILTER + EXPORT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 dark:border-gray-700 p-4 mb-6"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search complaints by title, type, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2">
                <FontAwesomeIcon icon={faFilter} className="text-green-600" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-300"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportCSV}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition border border-blue-200 dark:border-blue-800"
              >
                <FontAwesomeIcon icon={faFileArrowDown} />
                CSV
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportPDF}
                className="px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center gap-2 hover:bg-green-100 dark:hover:bg-green-900/50 transition border border-green-200 dark:border-green-800"
              >
                <FontAwesomeIcon icon={faFileArrowDown} />
                PDF
              </motion.button>
            </div>
          </div>
        </motion.div>
{/* TABLE - Agriculture themed */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 p-6"
>
  {loading ? (
    <div className="flex justify-center items-center py-20">
      <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-green-600" />
    </div>
  ) : (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-green-100 dark:border-gray-700">
              <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">#</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Title</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Location</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedComplaints.map((c, index) => {
                // Ensure we have a valid complaint object with an id
                const complaintId = c?.id || c?.complaint_id || c?._id;
                if (!complaintId) {
                  console.warn("Complaint missing ID:", c);
                  return null;
                }
                
                return (
                  <motion.tr
                    key={complaintId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-4 text-gray-800 dark:text-gray-200">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800 dark:text-white">{c.title || "Untitled"}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
                        {c.type || "Unknown"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-green-500" size="sm" />
                      {c.location || "Not specified"}
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : "Recently added"}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(c.status)}`}>
                        {c.status || "pending"}
                      </span>
                    </td>
                    <td className="p-4 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === complaintId ? null : complaintId);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                      >
                        <FontAwesomeIcon icon={faEllipsisV} className="text-gray-600 dark:text-gray-300" />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === complaintId && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-100 dark:border-gray-600 z-10"
                          >
                            <button
                              onClick={() => {
                                handleView(c);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-xl flex items-center gap-2"
                            >
                              <FontAwesomeIcon icon={faEye} className="text-blue-500" /> View
                            </button>
                            <button
                              onClick={() => {
                                handleUpdate(c);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                            >
                              <FontAwesomeIcon icon={faPen} className="text-green-500" /> Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(complaintId);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-600 last:rounded-b-xl flex items-center gap-2"
                            >
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {filteredComplaints.length === 0 && (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-gray-400 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No complaints found</p>
          <button
            onClick={() => {
              setFormData({ title: "", type: "", description: "", location: "", image: null });
              setSelectedImage(null);
              setImagePreview(null);
              setEditId(null);
              setShowForm(true);
            }}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Report Your First Issue
          </button>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                currentPage === i + 1
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </motion.button>
          ))}
        </div>
      )}
    </>
  )}
</motion.div>

{/* VIEW MODAL - Compact and User-Friendly */}
<AnimatePresence>
  {viewComplaint && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setViewComplaint(null)}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Back Button */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-5 py-3 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FontAwesomeIcon icon={faLeaf} />
            Complaint Details
          </h2>
          <button
            onClick={() => setViewComplaint(null)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          {/* Status Badge - Prominent at top */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Complaint #{viewComplaint.id || viewComplaint.complaint_id || viewComplaint._id || "N/A"}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(viewComplaint.status)}`}>
              {viewComplaint.status || "pending"}
            </span>
          </div>

          {/* Title */}
          <div className="bg-green-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Title</p>
            <p className="font-medium text-gray-800 dark:text-white">{viewComplaint.title || "Untitled"}</p>
          </div>

          {/* Type and Location in 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">{viewComplaint.type || "Unknown"}</p>
            </div>
            <div className="bg-green-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-green-500" size="xs" />
                Location
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white">{viewComplaint.location || "Not specified"}</p>
            </div>
          </div>

          {/* Date */}
          <div className="bg-green-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Reported On</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {viewComplaint.created_at 
                ? new Date(viewComplaint.created_at).toLocaleString() 
                : "Recently added"}
            </p>
          </div>

          {/* Description */}
          <div className="bg-green-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Description</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {viewComplaint.description || "No description provided"}
            </p>
          </div>

          {/* Image if exists */}
          {viewComplaint.image && (
            <div className="bg-green-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Attached Image</p>
              <img 
                src={viewComplaint.image} 
                alt="Complaint" 
                className="max-h-40 rounded-lg mx-auto cursor-pointer hover:opacity-90 transition"
                onClick={() => window.open(viewComplaint.image, '_blank')}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                handleUpdate(viewComplaint);
                setViewComplaint(null);
              }}
              className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faPen} size="sm" />
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this complaint?")) {
                  const complaintId = viewComplaint.id || viewComplaint.complaint_id || viewComplaint._id;
                  if (complaintId) {
                    handleDelete(complaintId);
                    setViewComplaint(null);
                  } else {
                    alert("❌ Cannot delete: Complaint ID not found");
                  }
                }
              }}
              className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faTrash} size="sm" />
              Delete
            </button>
            <button
              onClick={() => setViewComplaint(null)}
              className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
        {/* FORM MODAL - Matching Public Complaint design */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    {editId ? "Update Complaint" : "Report a Farm Issue"}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Title */}
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
                      placeholder="e.g., Maize leaves turning yellow"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type of Issue *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select issue type</option>
                      {complaintTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
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
                      placeholder="e.g., Field A, North Section"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="Describe the issue in detail. Include affected crops, symptoms, when you noticed it, etc."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FontAwesomeIcon icon={faImage} className="mr-2 text-green-600" />
                      Upload Image (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      
                      {imagePreview ? (
                        <div className="relative mb-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-40 rounded-lg mx-auto"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-green-500 hover:text-green-600 transition flex items-center justify-center gap-2"
                      >
                        <FontAwesomeIcon icon={faImage} />
                        Click to upload an image (max 5MB)
                      </button>
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faExclamationTriangle} />}
                      {editId ? "Update" : "Submit"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </NavLayout>
  );
}