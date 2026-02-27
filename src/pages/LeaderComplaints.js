import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEye,
  faPen,
  faTrash,
  faFileArrowDown,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { useOutletContext } from "react-router-dom";
import BASE_URL from "../config";

export default function LeaderComplaintsPage() {
  const { filter } = useOutletContext() || {};

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    location: "",
    status: "",
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch complaints from backend - wrapped in useCallback to fix dependency warning
  const fetchComplaints = async () => {
    setRefreshing(true);
    setFetchError(null);
    try {
      let url = `${BASE_URL}/complaints?skip=0&limit=100`;
      
      // Apply filter from context
      if (filter && filter !== "All") {
        if (filter === "Resolved") url += "&status=resolved";
        else if (filter === "Escalated") url += "&status=escalated";
        else if (filter === "Pending") url += "&status=pending";
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }
      
      const data = await response.json();
      
      // Transform data to match table structure
      const transformedData = data.map(c => ({
        id: c.id,
        title: c.title,
        type: c.type,
        description: c.description,
        location: c.location,
        status: c.status.charAt(0).toUpperCase() + c.status.slice(1), // Capitalize first letter
        createdAt: new Date(c.created_at).toLocaleString(),
        submittedBy: c.user?.fullname || `User #${c.user_id}` || "Anonymous",
        user_id: c.user_id,
        priority: c.priority
      }));
      
      setComplaints(transformedData);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setFetchError(error.message);
      
      // Sample data for testing
      const sampleData = [
        {
          id: 1,
          title: "Pest infestation in maize",
          type: "Pest Attack",
          description: "Pests destroyed maize crops",
          location: "Field A",
          status: "Pending",
          createdAt: new Date("2026-01-28T10:30:00").toLocaleString(),
          submittedBy: "Farmer John",
        },
        {
          id: 2,
          title: "Goat ate crops",
          type: "Animal Damage",
          description: "Neighbor goat destroyed crops",
          location: "Field B",
          status: "Resolved",
          createdAt: new Date("2026-01-27T14:15:00").toLocaleString(),
          submittedBy: "Farmer Mary",
        },
        {
          id: 3,
          title: "Flooded field",
          type: "Weather Damage",
          description: "Heavy rain flooded field",
          location: "Field C",
          status: "Escalated",
          createdAt: new Date("2026-01-26T08:00:00").toLocaleString(),
          submittedBy: "Farmer Alex",
        },
        {
          id: 4,
          title: "Irrigation system broken",
          type: "Infrastructure",
          description: "Water pump not working",
          location: "Field D",
          status: "Pending",
          createdAt: new Date("2026-01-25T11:20:00").toLocaleString(),
          submittedBy: "Farmer Sarah",
        },
        {
          id: 5,
          title: "Fertilizer shortage",
          type: "Supply",
          description: "Need organic fertilizer",
          location: "Field E",
          status: "Pending",
          createdAt: new Date("2026-01-24T09:45:00").toLocaleString(),
          submittedBy: "Farmer Paul",
        },
        {
          id: 6,
          title: "Disease outbreak",
          type: "Health",
          description: "Crops showing disease symptoms",
          location: "Field F",
          status: "Escalated",
          createdAt: new Date("2026-01-23T15:30:00").toLocaleString(),
          submittedBy: "Farmer Peter",
        }
      ];
      
      setComplaints(sampleData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update complaint
  const handleUpdateComplaint = async () => {
    if (!editId) return;
    
    try {
      const response = await fetch(`${BASE_URL}/complaints/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          description: formData.description,
          location: formData.location,
          status: formData.status.toLowerCase()
        })
      });
      
      if (!response.ok) throw new Error("Failed to update complaint");
      
      // Refresh the list
      fetchComplaints();
      
      setEditId(null);
      setShowForm(false);
      alert("✅ Complaint updated successfully!");
    } catch (error) {
      console.error("Error updating complaint:", error);
      alert("Failed to update complaint");
    }
  };

  // Delete complaint
  const handleDeleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    
    try {
      const response = await fetch(`${BASE_URL}/complaints/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete complaint");
      
      setComplaints(complaints.filter((c) => c.id !== id));
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error deleting complaint:", error);
      alert("Failed to delete complaint");
    }
  };

  // ================= FILTER & SEARCH =================
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.type?.toLowerCase().includes(search.toLowerCase()) ||
      c.status?.toLowerCase().includes(search.toLowerCase()) ||
      c.submittedBy?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = !filter || filter === "All" ? true : c.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ================= EXPORT =================
  const exportCSV = () => {
    const exportData = filteredComplaints.map(c => ({
      ID: c.id,
      Title: c.title,
      Type: c.type,
      Location: c.location,
      'Submitted By': c.submittedBy,
      Status: c.status,
      Date: c.createdAt,
      Description: c.description
    }));
    
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `complaints_${filter || 'all'}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Complaints Report ${filter && filter !== "All" ? `- ${filter}` : ''}`, 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Title", "Type", "Location", "Submitted By", "Status", "Date"]],
      body: filteredComplaints.map((c) => [
        c.title,
        c.type,
        c.location,
        c.submittedBy,
        c.status,
        c.createdAt,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255] },
    });
    doc.save(`complaints_${filter || 'all'}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // ================= HANDLERS =================
  const handleView = (c) => setViewComplaint(c);
  
  const handleDelete = (id) => {
    handleDeleteComplaint(id);
  };
  
  const handleUpdate = (c) => {
    setFormData({
      title: c.title,
      type: c.type,
      description: c.description,
      location: c.location,
      status: c.status,
    });
    setEditId(c.id);
    setShowForm(true);
    setActiveDropdown(null);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateComplaint();
  };

  const statusColor = (status) => {
    if (status === "Pending") return "text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-semibold";
    if (status === "Resolved") return "text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold";
    if (status === "Escalated") return "text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-semibold";
    return "text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-xs font-semibold";
  };

  const buttonColor = (type) => {
    if (type === "primary") return "bg-green-600 hover:bg-green-700 text-white";
    if (type === "secondary") return "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800";
    if (type === "export") return "bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900 dark:text-amber-200 dark:hover:bg-amber-800";
    return "bg-gray-100 hover:bg-gray-200 text-gray-700";
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-green-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* HEADER WITH FILTER INDICATOR */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">
          Complaints {filter && filter !== "All" && `- ${filter}`}
        </h1>
        <button
          onClick={fetchComplaints}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${buttonColor("secondary")}`}
        >
          <FontAwesomeIcon icon={faSync} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* SEARCH + EXPORT */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-3">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="🔍 Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${buttonColor("export")}`}
          >
            <FontAwesomeIcon icon={faFileArrowDown} /> CSV
          </button>

          <button
            onClick={exportPDF}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${buttonColor("secondary")}`}
          >
            <FontAwesomeIcon icon={faFileArrowDown} /> PDF
          </button>
        </div>
      </div>

      {/* Error message */}
      {fetchError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
          ⚠️ {fetchError}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-green-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700 dark:text-gray-200">
            <thead className="bg-gradient-to-r from-green-50 to-amber-50 dark:from-gray-700 dark:to-gray-600">
              <tr>
                <th className="p-3 border-b border-green-200 dark:border-gray-600 text-left text-green-800 dark:text-green-400">#</th>
                <th className="p-3 border-b border-green-200 dark:border-gray-600 text-left text-green-800 dark:text-green-400">Title</th>
                <th className="p-3 border-b border-green-200 dark:border-gray-600 text-left text-green-800 dark:text-green-400">Type</th>
                <th className="p-3 border-b border-green-200 dark:border-gray-600 text-left text-green-800 dark:text-green-400">Location</th>
                <th className="p-3 border-b border-green-200 dark:border-gray-600 text-left text-green-800 dark:text-green-400">Submitted By</th>
                <th className="p-3 border-b border-green-200 dark:border-gray-600 text-left text-green-800 dark:text-green-400">Status</th>
                <th className="p-3 border-b border-green-200 dark:border-gray-600 text-left text-green-800 dark:text-green-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedComplaints.map((c, i) => (
                <tr
                  key={c.id}
                  className="border-b border-green-100 dark:border-gray-700 hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="p-3 font-medium text-green-700 dark:text-green-400">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{c.title}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs dark:bg-amber-900/30 dark:text-amber-300">
                      {c.type}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{c.location}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{c.submittedBy}</td>
                  <td className="p-3">
                    <span className={statusColor(c.status)}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === c.id ? null : c.id)
                      }
                      className="p-2 hover:bg-green-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <FontAwesomeIcon icon={faEllipsisV} className="text-green-600 dark:text-green-400" />
                    </button>

                    {activeDropdown === c.id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10 border border-green-100 dark:border-gray-700 overflow-hidden">
                        <button
                          onClick={() => handleView(c)}
                          className="block w-full px-3 py-2 text-left hover:bg-green-50 dark:hover:bg-gray-700 text-green-700 dark:text-green-400 text-sm"
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-2" /> View
                        </button>
                        <button
                          onClick={() => handleUpdate(c)}
                          className="block w-full px-3 py-2 text-left hover:bg-green-50 dark:hover:bg-gray-700 text-amber-600 dark:text-amber-400 text-sm"
                        >
                          <FontAwesomeIcon icon={faPen} className="mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="block w-full px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-sm"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {paginatedComplaints.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2"></div>
                    <p>No complaints found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-green-100 dark:border-gray-700">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg transition-all ${
                  currentPage === i + 1
                    ? buttonColor("primary")
                    : "border border-green-200 hover:bg-green-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl border-t-4 border-green-500">
            <h2 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-400">🌾 {viewComplaint.title}</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <span className="text-green-600 font-medium w-24">Type:</span>
                <span className="text-gray-700 dark:text-gray-200">{viewComplaint.type}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
                <span className="text-amber-600 font-medium w-24">Location:</span>
                <span className="text-gray-700 dark:text-gray-200">{viewComplaint.location}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <span className="text-green-600 font-medium w-24">Submitted By:</span>
                <span className="text-gray-700 dark:text-gray-200">{viewComplaint.submittedBy}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
                <span className="text-amber-600 font-medium w-24">Status:</span>
                <span className={`${statusColor(viewComplaint.status)}`}>
                  {viewComplaint.status}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <span className="text-green-600 font-medium w-24">Date:</span>
                <span className="text-gray-700 dark:text-gray-200">{viewComplaint.createdAt}</span>
              </div>
              <div className="mt-4">
                <p className="text-green-600 font-medium mb-2">Description:</p>
                <div className="bg-gradient-to-br from-green-50 to-amber-50 p-4 rounded-lg text-gray-700 dark:bg-gray-700 dark:text-gray-200 border border-green-100">
                  {viewComplaint.description}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewComplaint(null)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl border-t-4 border-amber-500">
            <h2 className="text-xl font-bold mb-4 text-amber-700 dark:text-amber-400">✏️ Update Complaint</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-green-700 dark:text-green-400 text-sm">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-green-700 dark:text-green-400 text-sm">Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-green-700 dark:text-green-400 text-sm">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-green-700 dark:text-green-400 text-sm">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                >
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Escalated">Escalated</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-green-700 dark:text-green-400 text-sm">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full p-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold hover:from-amber-700 hover:to-amber-800 flex items-center gap-2 transition-all"
                >
                  <FontAwesomeIcon icon={faPen} /> Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}