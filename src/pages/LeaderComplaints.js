import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEye,
  faPen,
  faTrash,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { useOutletContext } from "react-router-dom";

export default function LeaderComplaintsPage() {
  const { filter } = useOutletContext() || {};

  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "Pest infestation in maize",
      type: "Pest Attack",
      description: "Pests destroyed maize crops",
      location: "Field A",
      status: "Pending",
      createdAt: "2026-01-28 10:30 AM",
      submittedBy: "Farmer John",
    },
    {
      id: 2,
      title: "Goat ate crops",
      type: "Animal Damage",
      description: "Neighbor goat destroyed crops",
      location: "Field B",
      status: "Resolved",
      createdAt: "2026-01-27 02:15 PM",
      submittedBy: "Farmer Mary",
    },
    {
      id: 3,
      title: "Flooded field",
      type: "Weather Damage",
      description: "Heavy rain flooded field",
      location: "Field C",
      status: "Escalated",
      createdAt: "2026-01-26 08:00 AM",
      submittedBy: "Farmer Alex",
    },
  ]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    location: "",
    image: null,
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ================= FILTER & SEARCH =================
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase()) ||
      c.submittedBy.toLowerCase().includes(search.toLowerCase());
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
    const csv = Papa.unparse(filteredComplaints);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "complaints.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Leader Complaints Report", 14, 15);
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
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255] },
    });
    doc.save("complaints.pdf");
  };

  // ================= HANDLERS =================
  const handleView = (c) => setViewComplaint(c);
  const handleDelete = (id) => {
    setComplaints(complaints.filter((c) => c.id !== id));
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
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setComplaints(
      complaints.map((c) => (c.id === editId ? { ...c, ...formData } : c))
    );
    setEditId(null);
    setShowForm(false);
    alert("✅ Complaint updated successfully!");
  };

  const statusColor = (status) => {
    if (status === "Pending") return "text-amber-500";
    if (status === "Resolved") return "text-green-600";
    if (status === "Escalated") return "text-red-600";
    return "";
  };

  return (
    <div className="p-4">
      {/* SEARCH + EXPORT */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search complaints..."
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

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 overflow-x-auto">
        <table className="w-full text-sm text-gray-700 dark:text-gray-200 border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">#</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">Title</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">Type</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">Location</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">Submitted By</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">Status</th>
              <th className="p-2 border-b border-gray-300 dark:border-gray-600 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedComplaints.map((c, i) => (
              <tr
                key={c.id}
                className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{c.title}</td>
                <td className="p-2">{c.type}</td>
                <td className="p-2">{c.location}</td>
                <td className="p-2">{c.submittedBy}</td>
                <td className={`p-2 font-semibold ${statusColor(c.status)}`}>
                  {c.status}
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
                <td colSpan={7} className="text-center p-4 text-gray-500 dark:text-gray-400">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
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
      </div>

      {/* VIEW MODAL */}
      {viewComplaint && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-200">{viewComplaint.title}</h2>
            <p className="text-gray-800 dark:text-gray-200"><b>Type:</b> {viewComplaint.type}</p>
            <p className="text-gray-800 dark:text-gray-200"><b>Location:</b> {viewComplaint.location}</p>
            <p className="text-gray-800 dark:text-gray-200"><b>Status:</b> {viewComplaint.status}</p>
            <p className="mt-2 text-gray-800 dark:text-gray-200"><b>Description:</b></p>
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">{viewComplaint.description}</div>
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
            <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-200">Update Complaint</h2>
            <form onSubmit={handleSubmit} className="space-y-3 flex-1 overflow-y-auto">
              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  placeholder="Title"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">Complaint Type</label>
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
                  placeholder="Field / Location"
                />
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
                  placeholder="Description"
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
