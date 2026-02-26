// pages/admin/ApproveUsers.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserClock,
  faSearch,
  faSync,
  faCheck,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faSort,
  faSortUp,
  faSortDown,
  faPhone,
  faMapMarkerAlt,
  faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import BASE_URL from "../config"; // Correct import

export default function ApproveUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  // Fetch pending users (only unapproved users)
  const fetchPendingUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      // Filter only unapproved users
      const pendingUsers = data.filter(user => !user.is_approved);
      setUsers(pendingUsers);
    } catch (error) {
      console.error("Error fetching pending users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Handle approve user
  const handleApprove = async (user) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/approve/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve user');
      }

      // Remove from list
      setUsers(prev => prev.filter(u => u.id !== user.id));
      
      // Show success message
      alert(`${user.name} has been approved successfully!`);
    } catch (error) {
      console.error("Error approving user:", error);
      alert("Failed to approve user. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject (you'll need to create this endpoint on your backend)
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setActionLoading(true);
    try {
      // You'll need to create this endpoint on your backend
      // For now, we'll just remove from UI
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      
      setShowRejectModal(false);
      setRejectReason("");
      
      alert(`${selectedUser.name} has been rejected.`);
    } catch (error) {
      console.error("Error rejecting user:", error);
      alert("Failed to reject user. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter and sort users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.includes(search) ||
      (user.district && user.district.toLowerCase().includes(search.toLowerCase()));
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  }).sort((a, b) => {
    if (sortConfig.key) {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'created_at') {
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return faSort;
    return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
  };

  // Get role badge color (using only green shades)
  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'farmer': return 'bg-green-100 text-green-800 border-green-200';
      case 'agronomist': return 'bg-green-200 text-green-800 border-green-300';
      case 'leader': return 'bg-green-300 text-green-900 border-green-400';
      case 'donor': return 'bg-green-400 text-white border-green-500';
      default: return 'bg-green-50 text-green-700 border-green-100';
    }
  };

  if (loading) {
    return (
      <AdminLayout user={{ name: "Admin User", role: "Administrator" }}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading pending approvals...</p>
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
              onClick={fetchPendingUsers}
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
      <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen space-y-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <FontAwesomeIcon icon={faUserClock} className="text-green-600" />
              Pending Approvals
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Review and approve new user registrations
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchPendingUsers}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition"
            >
              <FontAwesomeIcon icon={faSync} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards - Using only green */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-green-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Pending</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-500">{users.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-gray-500 dark:text-gray-400">Farmers</p>
            <p className="text-2xl font-bold text-green-600">{users.filter(u => u.role === 'farmer').length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-green-400">
            <p className="text-sm text-gray-500 dark:text-gray-400">Agronomists</p>
            <p className="text-2xl font-bold text-green-600">{users.filter(u => u.role === 'agronomist').length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-green-300">
            <p className="text-sm text-gray-500 dark:text-gray-400">Leaders/Donors</p>
            <p className="text-2xl font-bold text-green-600">
              {users.filter(u => u.role === 'leader' || u.role === 'donor').length}
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone or district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Roles ({users.length})</option>
              <option value="farmer">Farmers ({users.filter(u => u.role === 'farmer').length})</option>
              <option value="agronomist">Agronomists ({users.filter(u => u.role === 'agronomist').length})</option>
              <option value="leader">Leaders ({users.filter(u => u.role === 'leader').length})</option>
              <option value="donor">Donors ({users.filter(u => u.role === 'donor').length})</option>
            </select>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-800 dark:text-white"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
            <FontAwesomeIcon icon={faUserClock} className="text-6xl text-green-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No pending approvals
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {search || roleFilter !== 'all' ? "Try adjusting your search or filters" : "All registrations processed"}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50 dark:bg-green-900/20">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider cursor-pointer hover:text-green-600"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        User
                        <FontAwesomeIcon icon={getSortIcon('name')} className="text-green-600" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider cursor-pointer hover:text-green-600"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center gap-2">
                        Role
                        <FontAwesomeIcon icon={getSortIcon('role')} className="text-green-600" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      Contact
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider cursor-pointer hover:text-green-600"
                      onClick={() => handleSort('district')}
                    >
                      <div className="flex items-center gap-2">
                        District
                        <FontAwesomeIcon icon={getSortIcon('district')} className="text-green-600" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider cursor-pointer hover:text-green-600"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center gap-2">
                        Registered
                        <FontAwesomeIcon icon={getSortIcon('created_at')} className="text-green-600" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentItems.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-green-50 dark:hover:bg-green-900/10 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-sm mr-3 shadow-sm">
                            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <FontAwesomeIcon icon={faPhone} className="text-green-500" />
                          {user.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500" />
                          {user.district || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500" />
                          {new Date(user.created_at || user.registeredAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(user)}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition disabled:opacity-50 flex items-center gap-2"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowRejectModal(true);
                            }}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition disabled:opacity-50 flex items-center gap-2"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-green-50/50 dark:bg-green-900/5">
              <div className="text-sm text-green-700 dark:text-green-400">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-green-300 text-green-700 hover:bg-green-100 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? 'bg-green-600 text-white'
                        : 'border border-green-300 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-green-300 text-green-700 hover:bg-green-100 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl border-t-4 border-red-600">
              <h3 className="text-xl font-bold mb-4 dark:text-white">Reject User</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to reject <span className="font-semibold">{selectedUser.name}</span>?
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faTimes} />
                      Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}