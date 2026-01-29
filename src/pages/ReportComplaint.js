import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEye,
  faPen,
  faTrash,
  faPlus,
  faExclamationTriangle,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import NavLayout from "./NavLayout";

export default function ReportComplaintDashboard() {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "Pest infestation in maize",
      type: "Pest Attack",
      description: "Pests destroyed maize crops",
      location: "Field A",
      status: "Pending",
      createdAt: "2026-01-28 10:30 AM",
    },
    {
      id: 2,
      title: "Goat ate crops",
      type: "Animal Damage",
      description: "Neighbor goat destroyed crops",
      location: "Field B",
      status: "Resolved",
      createdAt: "2026-01-27 02:15 PM",
    },
  ]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    location: "",
    image: null,
  });

  /* ================= FILTER & PAGINATION ================= */
  const filteredComplaints = complaints.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ================= EXPORT ================= */
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
    doc.text("Complaints Report", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [["Title", "Type", "Location", "Status", "Date"]],
      body: filteredComplaints.map((c) => [
        c.title,
        c.type,
        c.location,
        c.status,
        c.createdAt,
      ]),
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [248, 187, 208],
        textColor: [60, 60, 60],
      },
    });

    doc.save("complaints.pdf");
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setComplaints(
        complaints.map((c) => (c.id === editId ? { ...c, ...formData } : c))
      );
      setEditId(null);
      setShowForm(false);
      alert("✅ Complaint updated successfully!");
    } else {
      const newComplaint = {
        id: complaints.length + 1,
        ...formData,
        status: "Pending",
        createdAt: new Date().toLocaleString(),
      };
      setComplaints([newComplaint, ...complaints]);
      setFormData({ title: "", type: "", description: "", location: "", image: null });
      setShowForm(false);
      alert("✅ Complaint submitted successfully!");
    }
  };

  const handleDelete = (id) => {
    setComplaints(complaints.filter((c) => c.id !== id));
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

  /* ================= UI ================= */
  return (
    <NavLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">My Complaints</h1>
        <button
          onClick={() => {
            setFormData({ title: "", type: "", description: "", location: "", image: null });
            setEditId(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} /> New Complaint
        </button>
      </div>

      {/* SEARCH + EXPORT */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2 hover:bg-blue-200"
          >
            <FontAwesomeIcon icon={faFileArrowDown} />
            CSV
          </button>

          <button
            onClick={exportPDF}
            className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg flex items-center gap-2 hover:bg-pink-200"
          >
            <FontAwesomeIcon icon={faFileArrowDown} />
            PDF
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow p-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedComplaints.map((c, index) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{c.title}</td>
                <td className="p-3">{c.type}</td>
                <td className="p-3">{c.location}</td>
                <td className="p-3">{c.createdAt}</td>

                {/* STATUS COLOR */}
                <td
                  className={`p-3 font-semibold ${
                    c.status === "Resolved" ? "text-green-600" : "text-amber-500"
                  }`}
                >
                  {c.status}
                </td>

                <td className="p-3 relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(activeDropdown === c.id ? null : c.id)
                    }
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>

                  {activeDropdown === c.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white shadow rounded">
                      <button
                        onClick={() => handleView(c)}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faEye} /> View
                      </button>
                      <button
                        onClick={() => handleUpdate(c)}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faPen} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-green-600 text-white" : ""
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
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Complaint Details</h2>
            <p>
              <b>Title:</b> {viewComplaint.title}
            </p>
            <p>
              <b>Type:</b> {viewComplaint.type}
            </p>
            <p>
              <b>Location:</b> {viewComplaint.location}
            </p>
            <p>
              <b>Status:</b> {viewComplaint.status}
            </p>
            <p className="mt-2">
              <b>Description:</b>
            </p>
            <div className="bg-gray-100 p-3 rounded">{viewComplaint.description}</div>

            <div className="text-right mt-4">
              <button
                onClick={() => setViewComplaint(null)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPACT SCROLLABLE FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white p-4 rounded-xl w-full max-w-md min-h-[60vh] flex flex-col">
            <h2 className="text-lg font-bold mb-3">
              {editId ? "Update Complaint" : "Report Complaint"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 flex-1 overflow-y-auto">
              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  placeholder="Title"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">
                  Complaint Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="">Select type</option>
                  <option value="Pest Attack">Pest Attack</option>
                  <option value="Animal Damage">Animal Damage</option>
                  <option value="Crop Disease">Crop Disease</option>
                  <option value="Theft">Theft</option>
                  <option value="Weather Damage">Weather Damage</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">
                  Field / Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  placeholder="Location"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  placeholder="Description"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200 text-sm">
                  Upload Image (optional)
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-1 rounded-lg bg-gray-300 dark:bg-slate-600 dark:text-white hover:bg-gray-400 text-sm transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-1 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center gap-2 text-sm"
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  {editId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </NavLayout>
  );
}
