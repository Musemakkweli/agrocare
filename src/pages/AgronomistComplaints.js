import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEye, 
  faPen, 
  faEllipsisV,
  faSync,
  faDownload,
  faSearch,
  faFilter,
  faCheckCircle,
  faHourglassHalf,
  faExclamationTriangle,
  faUser,
  faMapMarker,
  faCalendar,
  faTag,
  faTimes,
  faPaperPlane,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import BASE_URL from '../config';

export default function AgronomistComplaints() {
  // State management
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [isRespondMode, setIsRespondMode] = useState(false);
  const [isEditStatusMode, setIsEditStatusMode] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const itemsPerPage = 5;

  // Get logged-in user from localStorage
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userStr && token) {
        const user = JSON.parse(userStr);
        setLoggedInUser(user);
        
        if (user.role !== 'agronomist' && user.role !== 'Agronomist') {
          setError("You are not logged in as an agronomist.");
          setLoading(false);
        }
      } else {
        setError("No user found. Please log in again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
      setError("Error reading user data. Please log in again.");
      setLoading(false);
    }
  }, []);

  // Define fetchAssignedComplaints with useCallback to prevent unnecessary re-renders
  const fetchAssignedComplaints = useCallback(async () => {
    if (!loggedInUser || !loggedInUser.id) {
      setError("No agronomist ID found. Please log in.");
      setLoading(false);
      return;
    }

    setRefreshing(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const agronomistId = loggedInUser.id;
      
      const response = await fetch(
        `${BASE_URL}/agronomists/${agronomistId}/complaints`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          setComplaints([]);
          return;
        }
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(`Failed to fetch complaints: ${response.status}`);
      }
      
      const data = await response.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loggedInUser]); // Add loggedInUser as dependency

  // Fetch complaints when loggedInUser is available
  useEffect(() => {
    if (loggedInUser && loggedInUser.id) {
      fetchAssignedComplaints();
    }
  }, [loggedInUser, fetchAssignedComplaints]); // Add fetchAssignedComplaints to dependencies

  // Filter complaints based on search and status
  const filteredComplaints = useMemo(() => {
    let data = complaints;
    
    if (filterStatus !== "All") {
      data = data.filter(c => c.status === filterStatus);
    }
    
    if (search.trim() !== "") {
      const searchTerm = search.toLowerCase();
      data = data.filter(
        c => c.title?.toLowerCase().includes(searchTerm) ||
             c.farmer_name?.toLowerCase().includes(searchTerm) ||
             c.type?.toLowerCase().includes(searchTerm) ||
             c.location?.toLowerCase().includes(searchTerm)
      );
    }
    
    return data;
  }, [complaints, filterStatus, search]);

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  // Toggle action menu
  const toggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);

  // Handle view complaint
  const handleView = (complaint) => {
    setModalData(complaint);
    setIsRespondMode(false);
    setIsEditStatusMode(false);
  };

  // Handle respond to complaint
  const handleRespond = (complaint) => {
    setModalData(complaint);
    setIsRespondMode(true);
    setIsEditStatusMode(false);
    setResponseText("");
  };

  // Handle edit status
  const handleEditStatus = (complaint) => {
    setModalData(complaint);
    setIsEditStatusMode(true);
    setIsRespondMode(false);
    setSelectedStatus(complaint.status);
  };

  // Close modal
  const closeModal = () => {
    setModalData(null);
    setResponseText("");
    setIsRespondMode(false);
    setIsEditStatusMode(false);
  };

  // Submit status update
  const submitStatusUpdate = async () => {
    if (!selectedStatus) {
      alert("Please select a status");
      return;
    }

    setSubmitting(true);
    
    const formData = new FormData();
    formData.append('user_id', loggedInUser.id);
    formData.append('status', selectedStatus);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${BASE_URL}/complaints/${modalData.id}?user_id=${loggedInUser.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      setComplaints(prev => 
        prev.map(c => c.id === modalData.id ? { 
          ...c, 
          status: selectedStatus
        } : c)
      );
      
      alert('Status updated successfully!');
      closeModal();
    } catch (err) {
      console.error("Status update error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Submit response to complaint
  const submitResponse = async () => {
    if (!responseText.trim()) {
      alert("Please enter a response");
      return;
    }

    setSubmitting(true);
    
    const formData = new FormData();
    formData.append('user_id', loggedInUser.id);
    formData.append('description', responseText);
    formData.append('status', 'Resolved');
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${BASE_URL}/complaints/${modalData.id}?user_id=${loggedInUser.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit response');
      }

      // Update local state
      setComplaints(prev => 
        prev.map(c => c.id === modalData.id ? { 
          ...c, 
          status: 'Resolved',
          description: responseText
        } : c)
      );
      
      alert('Response submitted successfully!');
      closeModal();
    } catch (err) {
      console.error("Submit error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`My Assigned Complaints - ${loggedInUser?.name || 'Agronomist'}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    const tableColumn = ["#", "Title", "Farmer", "Type", "Location", "Status", "Date"];
    const tableRows = paginatedComplaints.map((c, i) => [
      startIndex + i + 1,
      c.title,
      c.farmer_name || "Unknown",
      c.type,
      c.location,
      c.status,
      new Date(c.created_at).toLocaleDateString()
    ]);
    
    doc.autoTable({ 
      head: [tableColumn], 
      body: tableRows, 
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] } // nude green
    });
    
    doc.save(`my_complaints_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Get status badge color - using nude green shades
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Resolved':
        return faCheckCircle;
      case 'Pending':
        return faHourglassHalf;
      default:
        return faExclamationTriangle;
    }
  };

  // Available statuses for dropdown
  const availableStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

  // If no user is logged in, show login prompt
  if (!loggedInUser && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-green-600 text-5xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Not Logged In</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please log in to view your assigned complaints.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your assigned complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with user info - Removed logout button */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                My Assigned Complaints
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-600 dark:text-gray-400">
                  Welcome back, <span className="font-semibold text-green-600 dark:text-green-400">{loggedInUser?.name || 'Agronomist'}</span>
                </p>
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                  Agronomist
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                You have {complaints.length} assigned complaint{complaints.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={fetchAssignedComplaints}
                disabled={refreshing}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faSync} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}

        {/* Search, Filter, Export */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by title, farmer, type or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faFilter} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Export buttons */}
              <CSVLink
                data={paginatedComplaints}
                filename={`my_complaints_${new Date().toISOString().split('T')[0]}.csv`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span className="hidden sm:inline">CSV</span>
              </CSVLink>
              
              <button
                onClick={exportPDF}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50 dark:bg-green-900/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 dark:text-green-200 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 dark:text-green-200 uppercase tracking-wider">
                    Complaint Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 dark:text-green-200 uppercase tracking-wider">
                    Farmer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 dark:text-green-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 dark:text-green-200 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-green-800 dark:text-green-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedComplaints.length > 0 ? (
                  paginatedComplaints.map((complaint, index) => (
                    <tr 
                      key={complaint.id} 
                      className="hover:bg-green-50 dark:hover:bg-green-900/10 transition"
                    >
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {complaint.title}
                          </span>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <FontAwesomeIcon icon={faTag} />
                              {complaint.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <FontAwesomeIcon icon={faMapMarker} />
                              {complaint.location}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className="text-green-600 dark:text-green-300 text-sm" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {complaint.farmer_name || "Unknown"}
                            </span>
                            {complaint.farmer_phone && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {complaint.farmer_phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(complaint.status)}`}>
                          <FontAwesomeIcon icon={getStatusIcon(complaint.status)} />
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <FontAwesomeIcon icon={faCalendar} />
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 relative">
                        <button
                          onClick={() => toggleMenu(complaint.id)}
                          className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition"
                        >
                          <FontAwesomeIcon icon={faEllipsisV} className="text-gray-600 dark:text-gray-400" />
                        </button>

                        {openMenuId === complaint.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => handleView(complaint)}
                              className="w-full text-left px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 text-sm"
                            >
                              <FontAwesomeIcon icon={faEye} className="text-green-600" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleEditStatus(complaint)}
                              className="w-full text-left px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 text-sm"
                            >
                              <FontAwesomeIcon icon={faEdit} className="text-green-600" />
                              Edit Status
                            </button>
                            {complaint.status === "Pending" && (
                              <button
                                onClick={() => handleRespond(complaint)}
                                className="w-full text-left px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 text-sm"
                              >
                                <FontAwesomeIcon icon={faPen} className="text-green-600" />
                                Respond
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      {search || filterStatus !== "All" ? (
                        <div>
                          <FontAwesomeIcon icon={faSearch} className="text-4xl mb-3 text-green-400" />
                          <p className="text-lg">No matching complaints found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filters</p>
                        </div>
                      ) : (
                        <div>
                          <FontAwesomeIcon icon={faHourglassHalf} className="text-4xl mb-3 text-green-400" />
                          <p className="text-lg">No complaints assigned yet</p>
                          <p className="text-sm mt-1">When complaints are assigned to you, they'll appear here</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/20"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        {modalData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {isRespondMode ? "Respond to Complaint" : 
                     isEditStatusMode ? "Edit Complaint Status" : 
                     "Complaint Details"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {!isRespondMode && !isEditStatusMode ? (
                  // View Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Title</label>
                        <p className="mt-1 text-gray-900 dark:text-white">{modalData.title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Type</label>
                        <p className="mt-1 text-gray-900 dark:text-white">{modalData.type}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Farmer</label>
                        <p className="mt-1 text-gray-900 dark:text-white">{modalData.farmer_name || "Unknown"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Location</label>
                        <p className="mt-1 text-gray-900 dark:text-white">{modalData.location}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                        <p className="mt-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(modalData.status)}`}>
                            <FontAwesomeIcon icon={getStatusIcon(modalData.status)} />
                            {modalData.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Date</label>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {new Date(modalData.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
                      <p className="mt-1 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {modalData.description || "No description provided"}
                      </p>
                    </div>

                    {modalData.image && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Image</label>
                        <img 
                          src={modalData.image} 
                          alt="Complaint" 
                          className="mt-1 max-h-64 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ) : isEditStatusMode ? (
                  // Edit Status Mode
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                        Updating Status for: {modalData.title}
                      </h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select New Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select a status</option>
                        {availableStatuses.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Updating the status will notify the farmer of the change.
                      </p>
                    </div>
                  </div>
                ) : (
                  // Respond Mode
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
                        Responding to: {modalData.title}
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Farmer: {modalData.farmer_name || "Unknown"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Response
                      </label>
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Type your response here..."
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        Submitting a response will mark this complaint as Resolved.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  {isRespondMode && (
                    <button
                      onClick={submitResponse}
                      disabled={submitting || !responseText.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                      {submitting ? "Submitting..." : "Submit Response"}
                    </button>
                  )}
                  {isEditStatusMode && (
                    <button
                      onClick={submitStatusUpdate}
                      disabled={submitting || !selectedStatus}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                      {submitting ? "Updating..." : "Update Status"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}