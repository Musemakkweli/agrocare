// pages/admin/AdminUsers.jsx
import React, { useState, useEffect, useCallback } from "react"; 
import AdminLayout from "./AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEllipsisV, 
  faFileCsv, 
  faFilePdf,
  faUserPlus,
  faTimes,
  faCheck,
  faMapMarkerAlt,
  faEye,
  faEdit,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";
import BASE_URL from "../config";

export default function AdminUsers({ role }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [actionOpenId, setActionOpenId] = useState(null);

  // Modal states
  const [modal, setModal] = useState({ type: "", user: null });
  
  // Add user modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "farmer",
    district: "",
    farm_size: "",
    crops: ""
  });

  // Fetch users from backend - wrapped in useCallback
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      
      // Filter by role
      const filtered = data.filter(u => u.role === role);
      setUsers(filtered);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Now includes fetchUsers in dependencies

  // Handle add new user
  const handleAddUser = async () => {
    // Validation
    if (!newUser.full_name || !newUser.email || !newUser.password) {
      alert("Please fill in all required fields");
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (newUser.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: newUser.full_name,
          email: newUser.email,
          phone: newUser.phone,
          password: newUser.password,
          role: newUser.role,
          district: newUser.district,
          farm_size: newUser.farm_size,
          crops: newUser.crops ? newUser.crops.split(',').map(c => c.trim()) : []
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to register user');
      }

      const addedUser = await response.json();
      
      // Add to users list if role matches
      if (addedUser.role === role) {
        setUsers(prev => [...prev, addedUser]);
      }
      
      setShowAddModal(false);
      setNewUser({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "farmer",
        district: "",
        farm_size: "",
        crops: ""
      });
      
      alert(`User ${addedUser.full_name} added successfully! They need approval before login.`);
    } catch (error) {
      console.error("Error adding user:", error);
      alert(error.message);
    }
  };

  // Handle delete user (you'll need to create this endpoint)
  const handleDelete = (user) => {
    setModal({ type: "delete", user });
  };

  const confirmDelete = async () => {
    try {
      // You'll need to create this endpoint
      // const response = await fetch(`${BASE_URL}/users/${modal.user.id}`, {
      //   method: 'DELETE',
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to delete user');
      // }
      
      setUsers(prev => prev.filter(u => u.id !== modal.user.id));
      setModal({ type: "", user: null });
      alert(`User ${modal.user.full_name} deleted successfully!`);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  // Handle update user (you'll need to create this endpoint)
  const handleUpdate = (user) => {
    setModal({ type: "update", user: { ...user } });
  };

  const saveUpdate = async () => {
    try {
      // You'll need to create this endpoint
      // const response = await fetch(`${BASE_URL}/users/${modal.user.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     full_name: modal.user.full_name,
      //     email: modal.user.email,
      //     phone: modal.user.phone,
      //     district: modal.user.district
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to update user');
      // }
      
      setUsers(prev => prev.map(u => u.id === modal.user.id ? modal.user : u));
      setModal({ type: "", user: null });
      alert(`User updated successfully!`);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleView = (user) => {
    setModal({ type: "view", user });
  };

  // Filter users based on search
  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  // Pagination
  const displayedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Export functions
  const downloadCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Role", "Status"];
    const rows = users.map(u => [u.id, u.full_name, u.email, u.phone, u.role, u.is_approved ? "Active" : "Pending"]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${role}s.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID", "Name", "Email", "Phone", "Role", "Status"];
    const tableRows = users.map(u => [u.id, u.full_name, u.email, u.phone, u.role, u.is_approved ? "Active" : "Pending"]);
    doc.autoTable({ head: [tableColumn], body: tableRows });
    doc.save(`${role}s.pdf`);
  };

  // Get status badge
  const getStatusBadge = (user) => {
    if (user.is_approved) {
      return <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">Active</span>;
    } else {
      return <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs">Pending</span>;
    }
  };

  if (loading) {
    return (
      <AdminLayout user={{ name: "Admin User", role: "Administrator" }}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout user={{ name: "Admin User", role: "Administrator" }}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-600">
            <p className="text-xl font-bold">Error</p>
            <p className="mt-2">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={{ name: "Admin User", role: "Administrator" }}>
      <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen space-y-4">
        
        {/* Header with Add Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {role.charAt(0).toUpperCase() + role.slice(1)}s
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            Add New {role}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-green-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total {role}s</p>
            <p className="text-2xl font-bold text-green-700">{users.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
            <p className="text-2xl font-bold text-green-600">{users.filter(u => u.is_approved).length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{users.filter(u => !u.is_approved).length}</p>
          </div>
        </div>

        {/* Search + Export */}
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
          <input
            type="text"
            placeholder="Search by name, email or phone"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white w-full md:w-1/3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
            >
              <FontAwesomeIcon icon={faFileCsv} /> CSV
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
            >
              <FontAwesomeIcon icon={faFilePdf} /> PDF
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-green-100 dark:bg-green-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayedUsers.map((u, idx) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`hover:bg-green-50 dark:hover:bg-green-900/10 transition ${
                      idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-700/50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm mr-3">
                          {u.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{u.full_name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{u.phone || 'N/A'}</div>
                      {u.district && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500" />
                          {u.district}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(u)}
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <button
                        className="p-2 rounded hover:bg-green-200 dark:hover:bg-green-700 transition"
                        onClick={() => setActionOpenId(actionOpenId === u.id ? null : u.id)}
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>

                      {/* Dropdown Menu */}
                      {actionOpenId === u.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-700 shadow-lg rounded-lg border border-gray-200 dark:border-gray-600 z-10">
                          <button
                            className="w-full px-4 py-2 hover:bg-green-100 dark:hover:bg-green-600 text-left text-gray-700 dark:text-gray-200 flex items-center gap-2"
                            onClick={() => { handleView(u); setActionOpenId(null); }}
                          >
                            <FontAwesomeIcon icon={faEye} className="text-blue-500" />
                            View
                          </button>
                          <button
                            className="w-full px-4 py-2 hover:bg-green-100 dark:hover:bg-green-600 text-left text-gray-700 dark:text-gray-200 flex items-center gap-2"
                            onClick={() => { handleUpdate(u); setActionOpenId(null); }}
                          >
                            <FontAwesomeIcon icon={faEdit} className="text-green-500" />
                            Update
                          </button>
                          <button
                            className="w-full px-4 py-2 hover:bg-green-100 dark:hover:bg-green-600 text-left text-gray-700 dark:text-gray-200 flex items-center gap-2"
                            onClick={() => { handleDelete(u); setActionOpenId(null); }}
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
                {displayedUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} entries
              </div>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-green-600 text-white"
                        : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add User Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FontAwesomeIcon icon={faUserPlus} />
                      Add New {role?.charAt(0).toUpperCase() + role?.slice(1)}
                    </h2>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={newUser.full_name}
                        onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500"
                        placeholder="078XXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        District
                      </label>
                      <input
                        type="text"
                        value={newUser.district}
                        onChange={(e) => setNewUser({...newUser, district: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500"
                        placeholder="Kigali"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {role === 'farmer' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Farm Size
                        </label>
                        <input
                          type="text"
                          value={newUser.farm_size}
                          onChange={(e) => setNewUser({...newUser, farm_size: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500"
                          placeholder="2.5 hectares"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Crops (comma separated)
                        </label>
                        <input
                          type="text"
                          value={newUser.crops}
                          onChange={(e) => setNewUser({...newUser, crops: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500"
                          placeholder="Maize, Beans, Coffee"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleAddUser}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      Register User
                    </button>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Modal */}
        {modal.type === "view" && modal.user && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold dark:text-white">User Details</h2>
                <button
                  onClick={() => setModal({ type: "", user: null })}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xl">
                    {modal.user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-lg dark:text-white">{modal.user.full_name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{modal.user.email}</p>
                  </div>
                </div>
                
                <p><strong className="dark:text-white">Phone:</strong> <span className="dark:text-gray-300">{modal.user.phone || 'N/A'}</span></p>
                <p><strong className="dark:text-white">Role:</strong> <span className="dark:text-gray-300">{modal.user.role}</span></p>
                <p><strong className="dark:text-white">Status:</strong> {getStatusBadge(modal.user)}</p>
                {modal.user.district && (
                  <p><strong className="dark:text-white">District:</strong> <span className="dark:text-gray-300">{modal.user.district}</span></p>
                )}
                {modal.user.farm_size && (
                  <p><strong className="dark:text-white">Farm Size:</strong> <span className="dark:text-gray-300">{modal.user.farm_size}</span></p>
                )}
                {modal.user.crops && modal.user.crops.length > 0 && (
                  <p><strong className="dark:text-white">Crops:</strong> <span className="dark:text-gray-300">{modal.user.crops.join(', ')}</span></p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {modal.type === "update" && modal.user && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Update User</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={modal.user.full_name || ''}
                    onChange={(e) => setModal(prev => ({ 
                      ...prev, 
                      user: { ...prev.user, full_name: e.target.value } 
                    }))}
                    className="w-full p-2 border rounded border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={modal.user.email || ''}
                    onChange={(e) => setModal(prev => ({ 
                      ...prev, 
                      user: { ...prev.user, email: e.target.value } 
                    }))}
                    className="w-full p-2 border rounded border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={modal.user.phone || ''}
                    onChange={(e) => setModal(prev => ({ 
                      ...prev, 
                      user: { ...prev.user, phone: e.target.value } 
                    }))}
                    className="w-full p-2 border rounded border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={saveUpdate}
                >
                  Save Changes
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded hover:bg-gray-300 dark:hover:bg-slate-600"
                  onClick={() => setModal({ type: "", user: null })}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {modal.type === "delete" && modal.user && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Delete User</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete <strong>{modal.user.full_name}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded hover:bg-gray-300 dark:hover:bg-slate-600"
                  onClick={() => setModal({ type: "", user: null })}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}