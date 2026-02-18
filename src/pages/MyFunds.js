import React, { useState } from "react";
import NavLayout from "./NavLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faUser,
  faCalendarAlt,
  faDownload,
  faTimes,
  faPlus,
  faPhone,
  faEllipsisV,
  faPen,
  faTrash,
  faEye,
  faHandHoldingHeart,
  faInfoCircle,
  faFilter,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

export default function SupportPage({ user }) {
  const [requests, setRequests] = useState([
    { 
      id: 1, 
      donor: "John Doe", 
      amount: 50, 
      createdAt: "2026-01-28", 
      title: "Support for Crop Tools", 
      message: "Funds for buying crop tools and seeds. Need hoes, machetes, and watering cans for the upcoming planting season.",
      name: "John Doe", 
      contact: "john@example.com",
      status: "pending",
      category: "tools"
    },
    { 
      id: 2, 
      donor: "Jane Smith", 
      amount: 100, 
      createdAt: "2026-01-27", 
      title: "Fertilizer Donation", 
      message: "Providing organic fertilizer for maize fields. Need enough for 2 acres of maize plantation.",
      name: "Jane Smith", 
      contact: "jane@example.com",
      status: "approved",
      category: "fertilizer"
    },
    { 
      id: 3, 
      donor: "Farmers Cooperative", 
      amount: 75, 
      createdAt: "2026-01-26", 
      title: "Irrigation System Support", 
      message: "Help with installing drip irrigation for vegetable garden during dry season.",
      name: "Peter Mwangi", 
      contact: "peter@farm.coop",
      status: "pending",
      category: "irrigation"
    },
  ]);

  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [newRequest, setNewRequest] = useState({ 
    title: "", 
    amount: "", 
    message: "", 
    name: user?.name || "", 
    contact: user?.email || "",
    category: "tools",
    status: "pending"
  });
  const [showModal, setShowModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Categories for filtering
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "tools", label: "Tools & Equipment", icon: "🔧" },
    { value: "fertilizer", label: "Fertilizer", icon: "🌱" },
    { value: "seeds", label: "Seeds", icon: "🌿" },
    { value: "irrigation", label: "Irrigation", icon: "💧" },
    { value: "other", label: "Other", icon: "📦" },
  ];

  // Filter requests based on search and category
  const filteredRequests = requests.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || r.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (r) => {
    const csvContent = `Title,Donor,Amount,Date,Message,Name,Contact,Category,Status\n"${r.title}","${r.donor}",${r.amount},"${r.createdAt}","${r.message}","${r.name}","${r.contact}","${r.category}","${r.status}"`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${r.title.replace(/\s/g, "_")}_support.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const submitRequest = () => {
    if (!newRequest.title || !newRequest.amount || !newRequest.name || !newRequest.contact) return;

    if (editing) {
      setRequests(requests.map(r => r.id === editing.id ? { ...editing, ...newRequest } : r));
      setEditing(null);
    } else {
      const newEntry = {
        id: requests.length + 1,
        donor: user?.name || "Anonymous",
        amount: parseFloat(newRequest.amount),
        createdAt: new Date().toISOString().split("T")[0],
        title: newRequest.title,
        message: newRequest.message,
        name: newRequest.name,
        contact: newRequest.contact,
        category: newRequest.category,
        status: "pending"
      };
      setRequests([newEntry, ...requests]);
    }

    setNewRequest({ 
      title: "", 
      amount: "", 
      message: "", 
      name: user?.name || "", 
      contact: user?.email || "",
      category: "tools",
      status: "pending"
    });
    setShowModal(false);
  };

  const cancelRequest = () => {
    setNewRequest({ 
      title: "", 
      amount: "", 
      message: "", 
      name: user?.name || "", 
      contact: user?.email || "",
      category: "tools",
      status: "pending"
    });
    setShowModal(false);
    setEditing(null);
  };

  const handleEdit = (r) => {
    setEditing(r);
    setNewRequest({ 
      title: r.title, 
      amount: r.amount, 
      message: r.message, 
      name: r.name, 
      contact: r.contact,
      category: r.category || "tools",
      status: r.status
    });
    setShowModal(true);
    setOpenMenuId(null);
  };

  const handleDelete = (r) => {
    if (window.confirm("Are you sure you want to delete this support request?")) {
      setRequests(requests.filter(req => req.id !== r.id));
      setOpenMenuId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case "tools": return "🔧";
      case "fertilizer": return "🌱";
      case "seeds": return "🌿";
      case "irrigation": return "💧";
      default: return "📦";
    }
  };

  return (
    <NavLayout user={user}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <FontAwesomeIcon icon={faHandHoldingHeart} className="text-green-600" />
                Support & Funding
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Request financial assistance or support for your farming needs
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl flex items-center gap-2 hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              <FontAwesomeIcon icon={faPlus} /> New Support Request
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 dark:border-gray-700 p-4 mb-6"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search requests by title, donor, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2">
                <FontAwesomeIcon icon={faFilter} className="text-green-600" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-300"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Support Requests Grid */}
        {filteredRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 p-12 text-center"
          >
            <FontAwesomeIcon icon={faHandHoldingHeart} className="text-5xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Support Requests Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first support request</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition inline-flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} /> Create Request
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredRequests.map((r, index) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 relative group"
                >
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-2xl">{getCategoryIcon(r.category)}</span>
                  </div>

                  {/* Three dots menu */}
                  <div className="absolute top-4 right-4">
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === r.id ? null : r.id); }}
                    >
                      <FontAwesomeIcon icon={faEllipsisV} className="text-gray-500 dark:text-gray-400" />
                    </button>

                    <AnimatePresence>
                      {openMenuId === r.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-100 dark:border-gray-600 z-10"
                        >
                          <button
                            onClick={() => setSelected(r)}
                            className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-xl flex items-center gap-2"
                          >
                            <FontAwesomeIcon icon={faEye} className="text-blue-500" /> View
                          </button>
                          <button
                            onClick={() => handleEdit(r)}
                            className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                          >
                            <FontAwesomeIcon icon={faPen} className="text-green-500" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(r)}
                            className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-600 last:rounded-b-xl flex items-center gap-2"
                          >
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-8 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(r.status)}`}>
                      {r.status}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 pr-8">{r.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-green-500 w-4" />
                      {r.donor}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <FontAwesomeIcon icon={faDollarSign} className="text-green-500 w-4" />
                      <span className="font-semibold text-green-600 dark:text-green-400">${r.amount}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500 w-4" />
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                    {r.message}
                  </p>

                  {/* View Details Button */}
                  <button
                    onClick={() => setSelected(r)}
                    className="w-full mt-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faEye} /> View Details
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* REQUEST FORM MODAL */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={cancelRequest}
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
                    <FontAwesomeIcon icon={faHandHoldingHeart} />
                    {editing ? "Edit Request" : "New Support Request"}
                  </h2>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FontAwesomeIcon icon={faUser} className="mr-2 text-green-600" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={newRequest.name}
                        onChange={e => setNewRequest({ ...newRequest, name: e.target.value })}
                      />
                    </div>

                    {/* Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FontAwesomeIcon icon={faPhone} className="mr-2 text-green-600" />
                        Phone or Email *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter phone number or email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={newRequest.contact}
                        onChange={e => setNewRequest({ ...newRequest, contact: e.target.value })}
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title of Request *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Support for Crop Tools"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={newRequest.title}
                        onChange={e => setNewRequest({ ...newRequest, title: e.target.value })}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={newRequest.category}
                        onChange={e => setNewRequest({ ...newRequest, category: e.target.value })}
                      >
                        {categories.filter(c => c.value !== "all").map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-green-600" />
                        Amount Needed ($) *
                      </label>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={newRequest.amount}
                        onChange={e => setNewRequest({ ...newRequest, amount: e.target.value })}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description / Message *
                      </label>
                      <textarea
                        rows="4"
                        placeholder="Describe what you need support for..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={newRequest.message}
                        onChange={e => setNewRequest({ ...newRequest, message: e.target.value })}
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={cancelRequest}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitRequest}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition font-medium flex items-center justify-center gap-2"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        {editing ? "Update" : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VIEW REQUEST MODAL */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-5 py-3 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FontAwesomeIcon icon={faHandHoldingHeart} />
                    Support Request Details
                  </h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
                  {/* Status Badge */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Request #{selected.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selected.status)}`}>
                      {selected.status}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="bg-green-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Title</p>
                    <p className="font-medium text-gray-800 dark:text-white">{selected.title}</p>
                  </div>

                  {/* Category */}
                  <div className="bg-green-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Category</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {getCategoryIcon(selected.category)} {selected.category}
                    </p>
                  </div>

                  {/* Donor and Amount in 2 columns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <FontAwesomeIcon icon={faUser} className="mr-1 text-green-500" size="xs" />
                        Donor
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{selected.donor}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <FontAwesomeIcon icon={faDollarSign} className="mr-1 text-green-500" size="xs" />
                        Amount
                      </p>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">${selected.amount}</p>
                    </div>
                  </div>

                  {/* Date and Contact in 2 columns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-green-500" size="xs" />
                        Date
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(selected.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <FontAwesomeIcon icon={faPhone} className="mr-1 text-green-500" size="xs" />
                        Contact
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{selected.contact}</p>
                    </div>
                  </div>

                  {/* Requestor Name */}
                  <div className="bg-green-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <FontAwesomeIcon icon={faUser} className="mr-1 text-green-500" size="xs" />
                      Requested By
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{selected.name}</p>
                  </div>

                  {/* Description */}
                  <div className="bg-green-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-1 text-green-500" size="xs" />
                      Description
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selected.message}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        handleEdit(selected);
                        setSelected(null);
                      }}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faPen} size="sm" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this request?")) {
                          handleDelete(selected);
                          setSelected(null);
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faTrash} size="sm" />
                      Delete
                    </button>
                    <button
                      onClick={() => handleDownload(selected)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faDownload} size="sm" />
                      Download
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </NavLayout>
  );
}