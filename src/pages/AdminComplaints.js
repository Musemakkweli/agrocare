import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEllipsisV, 
  faEye, 
  faTrash, 
  faFileArrowDown,
  faSync,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faUser,
  faMapMarkerAlt,
  faTag,
  faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import AdminLayout from "./AdminLayout";
import BASE_URL from "../config";

// Dummy users (keep for assignment)
const users = [
  { id: 1, name: "Leader Mike Brown", role: "leader" },
  { id: 2, name: "Agronomist Alice Green", role: "agronomist" },
  { id: 3, name: "Donor Bob White", role: "donor" },
];

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [assignComplaint, setAssignComplaint] = useState(null);
  const [assignedUser, setAssignedUser] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const itemsPerPage = 5;

  // Fetch complaints from backend
  const fetchComplaints = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const response = await fetch(`${BASE_URL}/complaints`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setComplaints([]);
          return;
        }
        throw new Error(`Failed to fetch complaints: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform backend data to match frontend structure
      const transformedComplaints = data.map(complaint => ({
        id: complaint.id,
        title: complaint.title || complaint.description?.substring(0, 50) + '...' || 'Untitled Complaint',
        type: complaint.type || 'General',
        location: complaint.location || 'Not specified',
        status: complaint.status || 'pending',
        createdAt: complaint.created_at ? new Date(complaint.created_at).toLocaleString() : 'N/A',
        assignedTo: complaint.assigned_to || null,
        description: complaint.description || 'No description provided',
        user_id: complaint.user_id,
        priority: complaint.priority || 'normal',
        resolution_notes: complaint.resolution_notes
      }));
      
      setComplaints(transformedComplaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setFetchError(error.message);
      
      // Fallback to mock data if API fails
      const mockComplaints = [
        {
          id: 1,
          title: "Pest infestation in maize",
          type: "Pest Attack",
          location: "Field A",
          status: "pending",
          createdAt: new Date().toLocaleString(),
          assignedTo: null,
          description: "Pests are damaging maize crops in field A.",
          priority: "high",
          user_id: 101
        },
        {
          id: 2,
          title: "Goat ate crops",
          type: "Animal Damage",
          location: "Field B",
          status: "resolved",
          createdAt: new Date(Date.now() - 86400000).toLocaleString(),
          assignedTo: "Leader Mike Brown",
          description: "A goat entered the field and ate crops.",
          priority: "normal",
          user_id: 102,
          resolution_notes: "Compensation provided to farmer"
        },
        {
          id: 3,
          title: "Irrigation system broken",
          type: "Infrastructure",
          location: "Field C",
          status: "pending",
          createdAt: new Date(Date.now() - 172800000).toLocaleString(),
          assignedTo: null,
          description: "The irrigation pump is not working.",
          priority: "critical",
          user_id: 103
        },
      ];
      
      setComplaints(mockComplaints);
    } finally {
      setLoading(false);
    }
  };

  // Update complaint status (assign/resolve)
  const updateComplaintStatus = async (id, updates) => {
    try {
      const response = await fetch(`${BASE_URL}/complaints/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update complaint');
      }

      // Refresh complaints after update
      fetchComplaints();
    } catch (error) {
      console.error("Error updating complaint:", error);
      alert("Failed to update complaint. Please try again.");
    }
  };

  // Delete complaint
  const deleteComplaint = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/complaints/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete complaint');
      }

      // Remove from local state
      setComplaints(complaints.filter(c => c.id !== id));
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error deleting complaint:", error);
      alert("Failed to delete complaint. Please try again.");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Filter & pagination
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase()) ||
      (c.location || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.assignedTo || '').toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export CSV
  const exportCSV = () => {
    const exportData = filteredComplaints.map(c => ({
      ID: c.id,
      Title: c.title,
      Type: c.type,
      Location: c.location,
      Status: c.status,
      'Assigned To': c.assignedTo || 'Unassigned',
      'Created At': c.createdAt,
      Description: c.description,
      Priority: c.priority
    }));
    
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `complaints_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Complaints Report", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Title", "Type", "Location", "Status", "Priority", "Assigned To", "Date"]],
      body: filteredComplaints.map((c) => [
        c.title.substring(0, 30) + (c.title.length > 30 ? '...' : ''),
        c.type,
        c.location,
        c.status,
        c.priority,
        c.assignedTo || "Unassigned",
        c.createdAt,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 163, 74], textColor: [255, 255, 255] },
    });
    doc.save(`complaints_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Handlers
  const handleDelete = (id) => {
    deleteComplaint(id);
  };

  const handleView = (c) => {
    setViewComplaint(c);
    setActiveDropdown(null);
  };

  const handleOpenAssign = (c) => {
    setAssignComplaint(c);
    setAssignedUser(c.assignedTo || "");
    setActiveDropdown(null);
  };

  const handleAssign = async () => {
    if (!assignedUser) return;
    
    await updateComplaintStatus(assignComplaint.id, {
      assigned_to: assignedUser,
      status: 'in_progress'
    });
    
    setAssignComplaint(null);
  };

  const handleResolve = async (id) => {
    await updateComplaintStatus(id, {
      status: 'resolved',
      resolved_at: new Date().toISOString()
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
          <FontAwesomeIcon icon={faClock} />
          Pending
        </span>;
      case 'in_progress':
        return <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          <FontAwesomeIcon icon={faSync} className="animate-spin" />
          In Progress
        </span>;
      case 'resolved':
        return <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          <FontAwesomeIcon icon={faCheckCircle} />
          Resolved
        </span>;
      case 'rejected':
        return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          Rejected
        </span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status || 'pending'}</span>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'critical':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Critical</span>;
      case 'high':
        return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">High</span>;
      case 'normal':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Normal</span>;
      case 'low':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Low</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Normal</span>;
    }
  };

  if (loading) {
    return (
      <AdminLayout user={{ name: "Admin User", role: "Administrator" }}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading complaints...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={{ name: "Admin User", role: "Administrator" }}>
      <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-900 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 flex items-center gap-2">
              <FontAwesomeIcon icon={faTag} />
              Manage Complaints
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total: {filteredComplaints.length} complaints
            </p>
          </div>

          {/* Refresh button */}
          <button
            onClick={fetchComplaints}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSync} />
            Refresh
          </button>
        </div>

        {/* Error Display */}
        {fetchError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
              <div>
                <p className="text-red-700 font-medium">Error loading complaints</p>
                <p className="text-red-600 text-sm">{fetchError}</p>
              </div>
            </div>
            <button
              onClick={fetchComplaints}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-green-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Complaints</p>
            <p className="text-2xl font-bold text-green-700">{complaints.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {complaints.filter(c => c.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
            <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {complaints.filter(c => c.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-gray-500 dark:text-gray-400">Resolved</p>
            <p className="text-2xl font-bold text-green-600">
              {complaints.filter(c => c.status === 'resolved').length}
            </p>
          </div>
        </div>

        {/* SEARCH + FILTERS + EXPORT */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2 flex-1">
              <input
                type="text"
                placeholder="Search complaints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded flex-1 dark:bg-slate-700 dark:text-gray-100 dark:border-slate-600"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border px-3 py-2 rounded dark:bg-slate-700 dark:text-gray-100 dark:border-slate-600"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700"
              >
                <FontAwesomeIcon icon={faFileArrowDown} /> CSV
              </button>
              <button
                onClick={exportPDF}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 hover:bg-green-200 dark:bg-green-800 dark:text-green-200 dark:hover:bg-green-700"
              >
                <FontAwesomeIcon icon={faFileArrowDown} /> PDF
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl shadow overflow-x-auto border border-gray-300 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-200 dark:bg-slate-700 border-b border-gray-300 dark:border-slate-600">
              <tr>
                <th className="p-3 text-left text-gray-700 dark:text-gray-200">#</th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-200">Title</th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-200">Type</th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-200">Location</th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-200">Priority</th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-200">Status</th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-200">Assigned To</th>
                <th className="p-3 text-left text-gray-700 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-50 dark:bg-slate-800">
              {paginatedComplaints.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No complaints found
                  </td>
                </tr>
              ) : (
                paginatedComplaints.map((c, index) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-300 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                  >
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      <div className="font-medium">{c.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                        {c.createdAt}
                      </div>
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{c.type}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-gray-500" />
                      {c.location}
                    </td>
                    <td className="p-3">{getPriorityBadge(c.priority)}</td>
                    <td className="p-3">{getStatusBadge(c.status)}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      <FontAwesomeIcon icon={faUser} className="mr-1 text-gray-500" />
                      {c.assignedTo || "Unassigned"}
                    </td>
                    <td className="p-3 relative text-gray-800 dark:text-gray-200">
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === c.id ? null : c.id)
                        }
                        className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>

                      {activeDropdown === c.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-700 shadow rounded z-10 border border-gray-300 dark:border-slate-600">
                          <button
                            onClick={() => handleView(c)}
                            className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600"
                          >
                            <FontAwesomeIcon icon={faEye} className="mr-2" /> View
                          </button>
                          <button
                            onClick={() => handleOpenAssign(c)}
                            className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600"
                          >
                            <FontAwesomeIcon icon={faUser} className="mr-2" /> Assign
                          </button>
                          {c.status !== 'resolved' && (
                            <button
                              onClick={() => handleResolve(c.id)}
                              className="block w-full px-4 py-2 text-left text-green-600 hover:bg-gray-100 dark:hover:bg-slate-600"
                            >
                              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> Resolve
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-slate-600"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center py-4 gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-green-600 text-white dark:bg-green-500 dark:text-white"
                      : "bg-gray-100 dark:bg-slate-700 dark:text-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* VIEW MODAL */}
        {viewComplaint && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 dark:text-gray-100 flex items-center gap-2">
                <FontAwesomeIcon icon={faEye} className="text-green-600" />
                Complaint Details
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
                    <p className="font-medium dark:text-gray-200">{viewComplaint.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                    <p className="font-medium dark:text-gray-200">{viewComplaint.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium dark:text-gray-200">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-gray-500" />
                      {viewComplaint.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <p className="font-medium">{getStatusBadge(viewComplaint.status)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
                    <p className="font-medium">{getPriorityBadge(viewComplaint.priority)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Assigned To</p>
                    <p className="font-medium dark:text-gray-200">
                      <FontAwesomeIcon icon={faUser} className="mr-1 text-gray-500" />
                      {viewComplaint.assignedTo || "Unassigned"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                  <p className="font-medium dark:text-gray-200">{viewComplaint.createdAt}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Description</p>
                  <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg text-gray-800 dark:text-gray-200">
                    {viewComplaint.description}
                  </div>
                </div>

                {viewComplaint.resolution_notes && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Resolution Notes</p>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-gray-800 dark:text-gray-200">
                      {viewComplaint.resolution_notes}
                    </div>
                  </div>
                )}

                {viewComplaint.user_id && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Submitted By</p>
                    <p className="font-medium dark:text-gray-200">User #{viewComplaint.user_id}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setViewComplaint(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-slate-600 dark:text-gray-200 dark:hover:bg-slate-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ASSIGN MODAL */}
        {assignComplaint && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4 dark:text-gray-100 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-green-600" />
                Assign Complaint
              </h2>
              
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Assigning: <span className="font-medium">{assignComplaint.title}</span>
              </p>
              
              <select
                value={assignedUser}
                onChange={(e) => setAssignedUser(e.target.value)}
                className="w-full p-2 border rounded mb-4 dark:bg-slate-700 dark:text-gray-100 dark:border-slate-600"
              >
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setAssignComplaint(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-slate-600 dark:text-gray-200 dark:hover:bg-slate-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!assignedUser}
                  className={`px-4 py-2 rounded text-white ${
                    assignedUser 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}