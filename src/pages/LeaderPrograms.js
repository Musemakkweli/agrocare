import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faWater,
  faBug,
  faLeaf,
  faEye,
  faEdit,
  faTrash,
  faPlus,
  faMapMarkerAlt,
  faCalendarAlt,
  faDollarSign,
  faSearch,
  faTimes,
  faSpinner,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import BASE_URL from "../config";

// Predefined icons for selection
const iconOptions = [
  { name: "Seedling", icon: faSeedling, value: "seedling" },
  { name: "Water", icon: faWater, value: "water" },
  { name: "Pest Control", icon: faBug, value: "bug" },
  { name: "Leaf", icon: faLeaf, value: "leaf" }
];

// Map icon strings to FontAwesome icons
const getIconFromString = (iconString) => {
  switch(iconString) {
    case "seedling": return faSeedling;
    case "water": return faWater;
    case "bug": return faBug;
    case "leaf": return faLeaf;
    default: return faSeedling;
  }
};

export default function LeaderPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Current program & form state
  const [currentProgram, setCurrentProgram] = useState(null);
  const [form, setForm] = useState({
    title: "",
    name: "", // Backend might use 'name' instead of 'title'
    location: "",
    description: "",
    status: "Funding Open",
    icon: "seedling",
    start_date: "",
    end_date: "",
    budget: "",
    farmers: 0
  });

  // Plant-based color palette
  const colors = {
    primary: "#2D6A4F",
    secondary: "#74C69D",
    lightBg: "#E9F5E9",
    mediumBg: "#D8E9D8",
    cardBg: "#F8FFF8",
    text: "#1B3B2F",
    border: "#B7D7B7",
    accent: "#40916C"
  };

  // Fetch programs from backend
  const fetchPrograms = async () => {
    setRefreshing(true);
    setFetchError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/programs`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch programs: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform backend data to match frontend structure
      const transformedPrograms = data.map(program => ({
        id: program.id,
        title: program.name || program.title,
        name: program.name,
        location: program.location || "Not specified",
        description: program.description || "",
        status: program.status || "Funding Open",
        icon: program.icon || "seedling",
        start_date: program.start_date,
        end_date: program.end_date,
        budget: program.budget,
        farmers: program.farmers || Math.floor(Math.random() * 50) + 10,
        progress: program.progress || Math.floor(Math.random() * 100),
        created_at: program.created_at
      }));
      
      setPrograms(transformedPrograms);
    } catch (error) {
      console.error("Error fetching programs:", error);
      setFetchError(error.message);
      
      // Fallback sample data
      setPrograms([
        {
          id: 1,
          title: "Maize Pest Control",
          location: "Huye District",
          description: "Helping farmers protect maize crops from pests.",
          icon: "bug",
          status: "Ongoing",
          farmers: 35,
          progress: 75,
          start_date: "2026-01-15",
          end_date: "2026-06-30",
          budget: 5000
        },
        {
          id: 2,
          title: "Organic Fertilizer Support",
          location: "Nyamagabe District",
          description: "Providing eco-friendly fertilizers to small farmers.",
          icon: "seedling",
          status: "Funding Open",
          farmers: 25,
          progress: 45,
          start_date: "2026-02-01",
          end_date: "2026-08-31",
          budget: 3500
        },
        {
          id: 3,
          title: "Irrigation for Dry Seasons",
          location: "Southern Province",
          description: "Improving water access for sustainable farming.",
          icon: "water",
          status: "Seeking Donors",
          farmers: 40,
          progress: 30,
          start_date: "2026-03-10",
          end_date: "2026-12-20",
          budget: 8000
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Create new program
  const handleCreateProgram = async () => {
    if (!form.title.trim() && !form.name.trim()) {
      alert("Please enter program title!");
      return;
    }

    try {
      const programData = {
  title: form.title || form.name,   // must match schema
  description: form.description,
  location: form.location,
  status: form.status,
  icon: form.icon,
  start_date: form.start_date || null,
  end_date: form.end_date || null,
  goal: form.budget ? parseFloat(form.budget) : 0,  // goal is required
  raised: 0,
  farmers: form.farmers || 0,
  progress: 0
};
      const response = await fetch(`${BASE_URL}/api/programs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(programData)
      });

      if (!response.ok) throw new Error("Failed to create program");

     // const newProgram = await response.json();
      
      // Refresh programs list
      fetchPrograms();
      
      // Reset form & close modal
      resetForm();
      setShowFormModal(false);
    } catch (error) {
      console.error("Error creating program:", error);
      alert("Failed to create program. Please try again.");
    }
  };

  // Update program
  const handleUpdateProgram = async () => {
    if (!currentProgram) return;

    try {
      const programData = {
        name: form.title || form.name,
        description: form.description,
        location: form.location,
        status: form.status,
        icon: form.icon,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        budget: form.budget ? parseFloat(form.budget) : null
      };

      const response = await fetch(`${BASE_URL}/api/programs/${currentProgram.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(programData)
      });

      if (!response.ok) throw new Error("Failed to update program");

      // Refresh programs list
      fetchPrograms();
      
      // Reset form & close modal
      resetForm();
      setShowFormModal(false);
    } catch (error) {
      console.error("Error updating program:", error);
      alert("Failed to update program. Please try again.");
    }
  };

  // Delete program
  const handleDeleteProgram = async () => {
    if (!currentProgram) return;

    try {
      const response = await fetch(`${BASE_URL}/api/programs/${currentProgram.id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete program");

      // Refresh programs list
      fetchPrograms();
      
      setCurrentProgram(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting program:", error);
      alert("Failed to delete program. Please try again.");
    }
  };

  // Open modals
  const openAddModal = () => {
    resetForm();
    setCurrentProgram(null);
    setShowFormModal(true);
  };

  const openEditModal = (program) => {
    setForm({
      title: program.title || program.name,
      name: program.name,
      location: program.location,
      description: program.description,
      status: program.status,
      icon: program.icon || "seedling",
      start_date: program.start_date || "",
      end_date: program.end_date || "",
      budget: program.budget || "",
      farmers: program.farmers || 0
    });
    setCurrentProgram(program);
    setShowFormModal(true);
  };

  const openViewModal = (program) => {
    setCurrentProgram(program);
    setShowViewModal(true);
  };

  const openDeleteModal = (program) => {
    setCurrentProgram(program);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setForm({
      title: "",
      name: "",
      location: "",
      description: "",
      status: "Funding Open",
      icon: "seedling",
      start_date: "",
      end_date: "",
      budget: "",
      farmers: 0
    });
  };

  // Form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (iconValue) => {
    setForm((prev) => ({ ...prev, icon: iconValue }));
  };

  // Filter programs
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = 
      (program.title || program.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || program.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Status pill colors
  const getStatusStyle = (status) => {
    switch(status) {
      case "Ongoing":
        return "bg-green-100 text-green-800 border-green-200";
      case "Funding Open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Seeking Donors":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get icon from program
  const getProgramIcon = (program) => {
    const iconString = program.icon || "seedling";
    return getIconFromString(iconString);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.lightBg }}>
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl mb-4" style={{ color: colors.primary }} />
          <p style={{ color: colors.text }}>Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-8" style={{ backgroundColor: colors.lightBg }}>
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: colors.text }}>
            <FontAwesomeIcon icon={faLeaf} style={{ color: colors.primary }} /> 
            AgroCare Programs
          </h1>
          <p className="text-sm" style={{ color: colors.accent }}>
            Supporting farmers through impactful agricultural programs
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchPrograms}
            className="px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md transition"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.text }}
          >
            <FontAwesomeIcon icon={faSpinner} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          
          <button
            onClick={openAddModal}
            className="px-5 py-2 rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-2"
            style={{ backgroundColor: colors.primary, color: 'white' }}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Program
          </button>
        </div>
      </div>

      {/* Error Message */}
      {fetchError && (
        <div className="p-4 rounded-lg border-l-4" style={{ backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }}>
          <p style={{ color: '#92400E' }}>{fetchError}</p>
        </div>
      )}

      {/* SEARCH & FILTER */}
      <div className="p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4" 
           style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
        <div className="flex-1 relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3" style={{ color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: colors.lightBg, 
              borderColor: colors.border,
              color: colors.text
            }}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: colors.lightBg, 
              borderColor: colors.border,
              color: colors.text
            }}
          >
            <option value="all">All Status</option>
            <option value="Funding Open">Funding Open</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Seeking Donors">Seeking Donors</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* STATS SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <p className="text-sm" style={{ color: '#6B7280' }}>Total Programs</p>
          <p className="text-2xl font-bold" style={{ color: colors.primary }}>{programs.length}</p>
        </div>
        <div className="p-4 rounded-xl shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <p className="text-sm" style={{ color: '#6B7280' }}>Active Programs</p>
          <p className="text-2xl font-bold" style={{ color: colors.accent }}>
            {programs.filter(p => p.status === "Ongoing" || p.status === "Funding Open").length}
          </p>
        </div>
        <div className="p-4 rounded-xl shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <p className="text-sm" style={{ color: '#6B7280' }}>Total Farmers</p>
          <p className="text-2xl font-bold" style={{ color: colors.secondary }}>
            {programs.reduce((sum, p) => sum + (p.farmers || 0), 0)}
          </p>
        </div>
      </div>

      {/* PROGRAMS GRID */}
      {filteredPrograms.length === 0 ? (
        <div className="p-12 rounded-xl text-center border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <p style={{ color: '#6B7280' }}>No programs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border relative group"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
            >
              {/* ICON */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                   style={{ backgroundColor: colors.mediumBg }}>
                <FontAwesomeIcon
                  icon={getProgramIcon(program)}
                  className="text-3xl"
                  style={{ color: colors.primary }}
                />
              </div>

              {/* ACTION MENU */}
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openViewModal(program)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  title="View Program"
                >
                  <FontAwesomeIcon icon={faEye} style={{ color: colors.primary }} />
                </button>
                <button
                  onClick={() => openEditModal(program)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  title="Edit Program"
                >
                  <FontAwesomeIcon icon={faEdit} style={{ color: colors.accent }} />
                </button>
                <button
                  onClick={() => openDeleteModal(program)}
                  className="p-2 rounded-full hover:bg-red-100 transition"
                  title="Delete Program"
                >
                  <FontAwesomeIcon icon={faTrash} style={{ color: '#EF4444' }} />
                </button>
              </div>

              {/* CONTENT */}
              <h3 className="text-xl font-bold mb-1" style={{ color: colors.text }}>
                {program.title || program.name}
              </h3>
              
              <div className="flex items-center gap-1 text-sm mb-3" style={{ color: '#6B7280' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                <span>{program.location}</span>
              </div>

              <p className="text-sm mb-4 line-clamp-2" style={{ color: '#4B5563' }}>
                {program.description}
              </p>

              {/* PROGRESS BAR */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: '#6B7280' }}>Progress</span>
                  <span style={{ color: colors.text }}>{program.progress || 0}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.mediumBg }}>
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${program.progress || 0}%`, backgroundColor: colors.primary }}
                  ></div>
                </div>
              </div>

              {/* FARMERS COUNT */}
              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faChartLine} style={{ color: colors.secondary }} />
                <span className="text-sm" style={{ color: colors.text }}>{program.farmers || 0} farmers</span>
              </div>

              {/* STATUS & BUDGET */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(program.status)}`}>
                  {program.status}
                </span>
                
                {program.budget && (
                  <span className="text-xs font-medium" style={{ color: colors.primary }}>
                    <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                    {program.budget.toLocaleString()}
                  </span>
                )}
              </div>

              {/* DATES */}
              {(program.start_date || program.end_date) && (
                <div className="mt-3 pt-3 border-t text-xs flex items-center gap-2" 
                     style={{ borderColor: colors.border, color: '#6B7280' }}>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>
                    {program.start_date ? new Date(program.start_date).toLocaleDateString() : 'Start'} - 
                    {program.end_date ? new Date(program.end_date).toLocaleDateString() : 'End'}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* FORM MODAL (Add / Update) */}
      <AnimatePresence>
        {showFormModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFormModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4"
              style={{ backgroundColor: colors.cardBg }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                  {currentProgram ? "Update Program" : "Add New Program"}
                </h2>
                <button onClick={() => setShowFormModal(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: colors.text }}>Program Title *</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Maize Pest Control"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.lightBg, 
                      borderColor: colors.border,
                      color: colors.text
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: colors.text }}>Location *</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g., Huye District"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.lightBg, 
                      borderColor: colors.border,
                      color: colors.text
                    }}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium" style={{ color: colors.text }}>Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the program..."
                    rows="3"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.lightBg, 
                      borderColor: colors.border,
                      color: colors.text
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: colors.text }}>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.lightBg, 
                      borderColor: colors.border,
                      color: colors.text
                    }}
                  >
                    <option>Funding Open</option>
                    <option>Ongoing</option>
                    <option>Seeking Donors</option>
                    <option>Completed</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: colors.text }}>Budget ($)</label>
                  <input
                    name="budget"
                    type="number"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="e.g., 5000"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.lightBg, 
                      borderColor: colors.border,
                      color: colors.text
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: colors.text }}>Start Date</label>
                  <input
                    name="start_date"
                    type="date"
                    value={form.start_date}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.lightBg, 
                      borderColor: colors.border,
                      color: colors.text
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: colors.text }}>End Date</label>
                  <input
                    name="end_date"
                    type="date"
                    value={form.end_date}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: colors.lightBg, 
                      borderColor: colors.border,
                      color: colors.text
                    }}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium" style={{ color: colors.text }}>Icon</label>
                  <div className="flex gap-3 flex-wrap">
                    {iconOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleIconChange(option.value)}
                        className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition ${
                          form.icon === option.value 
                            ? 'bg-green-100 border-green-600' 
                            : 'hover:bg-gray-50'
                        }`}
                        style={{ 
                          borderColor: form.icon === option.value ? colors.primary : colors.border,
                          backgroundColor: form.icon === option.value ? colors.mediumBg : 'transparent'
                        }}
                      >
                        <FontAwesomeIcon icon={option.icon} style={{ color: colors.primary }} />
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t" style={{ borderColor: colors.border }}>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="px-6 py-2 rounded-lg transition"
                  style={{ backgroundColor: colors.mediumBg, color: colors.text }}
                >
                  Cancel
                </button>
                <button
                  onClick={currentProgram ? handleUpdateProgram : handleCreateProgram}
                  className="px-6 py-2 text-white rounded-lg transition hover:opacity-90"
                  style={{ backgroundColor: colors.primary }}
                >
                  {currentProgram ? "Update Program" : "Create Program"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {showViewModal && currentProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="rounded-xl w-full max-w-lg p-6 space-y-4"
              style={{ backgroundColor: colors.cardBg }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.mediumBg }}>
                    <FontAwesomeIcon icon={getProgramIcon(currentProgram)} className="text-2xl" style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                      {currentProgram.title || currentProgram.name}
                    </h2>
                    <p className="text-sm flex items-center gap-1" style={{ color: '#6B7280' }}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      {currentProgram.location}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowViewModal(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.lightBg }}>
                  <p className="text-sm" style={{ color: colors.text }}>{currentProgram.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs" style={{ color: '#6B7280' }}>Status</p>
                    <span className={`inline-block px-3 py-1 mt-1 text-xs font-semibold rounded-full border ${getStatusStyle(currentProgram.status)}`}>
                      {currentProgram.status}
                    </span>
                  </div>
                  
                  {currentProgram.budget && (
                    <div>
                      <p className="text-xs" style={{ color: '#6B7280' }}>Budget</p>
                      <p className="font-semibold mt-1" style={{ color: colors.primary }}>
                        <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                        {currentProgram.budget.toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs" style={{ color: '#6B7280' }}>Farmers</p>
                    <p className="font-semibold mt-1" style={{ color: colors.accent }}>
                      {currentProgram.farmers || 0} farmers
                    </p>
                  </div>

                  <div>
                    <p className="text-xs" style={{ color: '#6B7280' }}>Progress</p>
                    <p className="font-semibold mt-1" style={{ color: colors.primary }}>
                      {currentProgram.progress || 0}%
                    </p>
                  </div>

                  {(currentProgram.start_date || currentProgram.end_date) && (
                    <div className="col-span-2">
                      <p className="text-xs" style={{ color: '#6B7280' }}>Duration</p>
                      <p className="text-sm mt-1 flex items-center gap-2" style={{ color: colors.text }}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        {currentProgram.start_date ? new Date(currentProgram.start_date).toLocaleDateString() : 'Start'} - 
                        {currentProgram.end_date ? new Date(currentProgram.end_date).toLocaleDateString() : 'End'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(currentProgram);
                  }}
                  className="px-4 py-2 rounded-lg transition flex items-center gap-2"
                  style={{ backgroundColor: colors.mediumBg, color: colors.text }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 text-white rounded-lg transition"
                  style={{ backgroundColor: colors.primary }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {showDeleteModal && currentProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="rounded-xl w-full max-w-md p-6 space-y-4"
              style={{ backgroundColor: colors.cardBg }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faTrash} className="text-2xl text-red-600" />
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: colors.text }}>Delete Program</h2>
                <p className="mb-2" style={{ color: '#6B7280' }}>
                  Are you sure you want to delete <strong>{currentProgram.title || currentProgram.name}</strong>?
                </p>
                <p className="text-sm" style={{ color: '#EF4444' }}>This action cannot be undone.</p>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t" style={{ borderColor: colors.border }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-lg transition"
                  style={{ backgroundColor: colors.mediumBg, color: colors.text }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProgram}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete Program
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}