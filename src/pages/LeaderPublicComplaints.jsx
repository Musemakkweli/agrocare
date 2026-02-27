import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEye,
  faPen,
  faTrash,
  faFileArrowDown,
  faExclamationTriangle,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { useOutletContext } from "react-router-dom";
import BASE_URL from "../config";

export default function LeaderPublicComplaints() {
  const { publicFilter } = useOutletContext() || {};

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
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
    name: "",
    phone: "",
    email: ""
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 5;

  // Fetch public complaints from backend
  const fetchPublicComplaints = async () => {
    setRefreshing(true);
    setFetchError(null);
    try {
      let url = `${BASE_URL}/public-complaints?skip=0&limit=100`;
      
      // Apply filter from context
      if (publicFilter === "pending") {
        url += "&status=pending";
      }
      if (publicFilter === "urgent") {
        url += "&urgent=true";
      }
      if (publicFilter === "resolved") {
        url += "&status=resolved";
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch public complaints");
      }
      
      const data = await response.json();
      
      // Transform data to match table structure
      const transformedData = data.map(c => ({
        id: c.id,
        title: c.title,
        type: c.type,
        description: c.description,
        location: c.location,
        status: c.status,
        createdAt: new Date(c.created_at).toLocaleString(),
        submittedBy: c.name,
        phone: c.phone,
        email: c.email || 'N/A',
        urgent: c.urgent,
        image: c.image
      }));
      
      setComplaints(transformedData);
    } catch (error) {
      console.error("Error fetching public complaints:", error);
      setFetchError(error.message);
      
      // Sample data for testing
      const sampleData = [
        {
          id: 1,
          title: "Pest infestation in community farm",
          type: "Pest Attack",
          description: "Community maize farm is affected by pests. Need urgent assistance.",
          location: "Village A",
          status: "pending",
          createdAt: new Date("2026-02-25T10:30:00Z").toLocaleString(),
          submittedBy: "John Public",
          phone: "+250 788 123 456",
          email: "john@example.com",
          urgent: true,
          image: null
        },
        {
          id: 2,
          title: "Irrigation system broken",
          type: "Infrastructure",
          description: "Public irrigation pump not working for 3 days",
          location: "Village B",
          status: "pending",
          createdAt: new Date("2026-02-24T14:20:00Z").toLocaleString(),
          submittedBy: "Mary Community",
          phone: "+250 789 456 123",
          email: "",
          urgent: false,
          image: null
        },
        {
          id: 3,
          title: "Flood damage",
          type: "Weather Damage",
          description: "Heavy rains flooded community fields",
          location: "Village C",
          status: "resolved",
          createdAt: new Date("2026-02-23T09:15:00Z").toLocaleString(),
          submittedBy: "Peter Farmer",
          phone: "+250 782 345 678",
          email: "peter@example.com",
          urgent: true,
          image: null
        },
        {
          id: 4,
          title: "Road blocked by fallen trees",
          type: "Infrastructure",
          description: "Trees fell on access road to farms",
          location: "Village D",
          status: "pending",
          createdAt: new Date("2026-02-22T16:45:00Z").toLocaleString(),
          submittedBy: "Sarah Community",
          phone: "+250 788 987 654",
          email: "sarah@example.com",
          urgent: false,
          image: null
        },
        {
          id: 5,
          title: "Drought affecting crops",
          type: "Weather Damage",
          description: "No rain for 3 weeks, crops dying",
          location: "Village E",
          status: "pending",
          createdAt: new Date("2026-02-21T11:20:00Z").toLocaleString(),
          submittedBy: "Paul Farmer",
          phone: "+250 789 321 654",
          email: "",
          urgent: true,
          image: null
        }
      ];
      
      setComplaints(sampleData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPublicComplaints();
  }, [publicFilter]); // Re-fetch when filter changes

  // ================= FILTER & SEARCH =================
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.type?.toLowerCase().includes(search.toLowerCase()) ||
      c.status?.toLowerCase().includes(search.toLowerCase()) ||
      c.submittedBy?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());
    
    // Apply filter from context - exactly like complaints page
    const matchesFilter = !publicFilter || publicFilter === "All" ? true : 
      publicFilter === "urgent" ? c.urgent === true : c.status === publicFilter;
    
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
      Name: c.submittedBy,
      Phone: c.phone,
      Email: c.email,
      Title: c.title,
      Type: c.type,
      Location: c.location,
      Status: c.status,
      Urgent: c.urgent ? 'Yes' : 'No',
      Date: c.createdAt
    }));
    
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `public_complaints_${publicFilter || 'all'}.csv`;
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Public Complaints Report ${publicFilter && publicFilter !== "All" ? `- ${publicFilter}` : ''}`, 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Name", "Title", "Type", "Location", "Status", "Urgent", "Date"]],
      body: filteredComplaints.map((c) => [
        c.submittedBy,
        c.title,
        c.type,
        c.location,
        c.status,
        c.urgent ? "Yes" : "No",
        c.createdAt,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255] },
    });
    doc.save(`public_complaints_${publicFilter || 'all'}.pdf`);
  };

  // ================= HANDLERS =================
  const handleView = (c) => setViewComplaint(c);
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    
    try {
      const response = await fetch(`${BASE_URL}/public-complaint/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete");
      
      setComplaints(complaints.filter((c) => c.id !== id));
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete complaint");
    }
  };

  const handleUpdate = (c) => {
    setFormData({
      title: c.title,
      type: c.type,
      description: c.description,
      location: c.location,
      status: c.status,
      name: c.submittedBy,
      phone: c.phone,
      email: c.email
    });
    setEditId(c.id);
    setShowForm(true);
    setActiveDropdown(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${BASE_URL}/public-complaint/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error("Failed to update");
      
      // Refresh the list
      fetchPublicComplaints();
      
      setEditId(null);
      setShowForm(false);
      alert("✅ Complaint updated successfully!");
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update complaint");
    }
  };

  const statusColor = (status) => {
    if (status === "pending") return "text-amber-500";
    if (status === "resolved") return "text-green-600";
    if (status === "reviewed") return "text-blue-600";
    return "";
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* HEADER WITH FILTER INDICATOR - like complaints page */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">
          Public Complaints {publicFilter && publicFilter !== "All" && `- ${publicFilter}`}
        </h1>
        <button
          onClick={fetchPublicComplaints}
          className="px-3 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
        >
          <FontAwesomeIcon icon={faSync} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* SEARCH + EXPORT */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by name, title, location, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
        />

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-1 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
          >
            <FontAwesomeIcon icon={faFileArrowDown} /> CSV
          </button>

          <button
            onClick={exportPDF}
            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-1 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
          >
            <FontAwesomeIcon icon={faFileArrowDown} /> PDF
          </button>
        </div>
      </div>

      {/* Error message */}
      {fetchError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {fetchError}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 overflow-x-auto">
        <table className="w-full text-sm text-gray-700 dark:text-gray-200 border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">#</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">Name/Contact</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">Title</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">Type</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">Location</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">Status</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">Urgent</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedComplaints.map((c, i) => (
              <tr
                key={c.id}
                className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="p-2">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                <td className="p-2">
                  <div className="font-medium">{c.submittedBy}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                    {c.phone}
                  </div>
                  {c.email && c.email !== 'N/A' && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                      {c.email}
                    </div>
                  )}
                </td>
                <td className="p-2 font-medium">{c.title}</td>
                <td className="p-2">{c.type}</td>
                <td className="p-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-gray-400" />
                  {c.location}
                </td>
                <td className={`p-2 font-semibold ${statusColor(c.status)}`}>
                  {c.status}
                </td>
                <td className="p-2">
                  {c.urgent ? (
                    <span className="text-red-600 flex items-center gap-1">
                      <FontAwesomeIcon icon={faExclamationTriangle} /> Yes
                    </span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>
                <td className="p-2 relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(activeDropdown === c.id ? null : c.id)
                    }
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>

                  {activeDropdown === c.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-700 shadow rounded z-10">
                      <button
                        onClick={() => handleView(c)}
                        className="block w-full px-3 py-1 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <FontAwesomeIcon icon={faEye} /> View
                      </button>
                      <button
                        onClick={() => handleUpdate(c)}
                        className="block w-full px-3 py-1 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <FontAwesomeIcon icon={faPen} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="block w-full px-3 py-1 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {paginatedComplaints.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500 dark:text-gray-400">
                  No public complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white"
                    : "dark:bg-gray-700 dark:text-gray-200"
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-200">{viewComplaint.title}</h2>
            
            <div className="space-y-2">
              <p className="text-gray-800 dark:text-gray-200">
                <b>Name:</b> {viewComplaint.submittedBy}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <b>Phone:</b> {viewComplaint.phone}
              </p>
              {viewComplaint.email && viewComplaint.email !== 'N/A' && (
                <p className="text-gray-800 dark:text-gray-200">
                  <b>Email:</b> {viewComplaint.email}
                </p>
              )}
              <p className="text-gray-800 dark:text-gray-200">
                <b>Type:</b> {viewComplaint.type}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <b>Location:</b> {viewComplaint.location}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <b>Status:</b> {viewComplaint.status}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <b>Urgent:</b> {viewComplaint.urgent ? 'Yes' : 'No'}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <b>Date:</b> {viewComplaint.createdAt}
              </p>
              <p className="mt-2 text-gray-800 dark:text-gray-200">
                <b>Description:</b>
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                {viewComplaint.description}
              </div>
            </div>

            <div className="text-right mt-3">
              <button
                onClick={() => setViewComplaint(null)}
                className="px-4 py-1 bg-red-600 text-white rounded"
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
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl w-full max-w-md min-h-[50vh] flex flex-col">
            <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-200">Update Public Complaint</h2>
            <form onSubmit={handleSubmit} className="space-y-3 flex-1 overflow-y-auto">
              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-1 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-sm dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 flex items-center gap-2 text-sm"
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