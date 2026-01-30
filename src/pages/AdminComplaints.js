import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faEye, faTrash, faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import AdminLayout from "./AdminLayout";

// Dummy users
const users = [
  { id: 1, name: "Leader Mike Brown", role: "leader" },
  { id: 2, name: "Agronomist Alice Green", role: "agronomist" },
  { id: 3, name: "Donor Bob White", role: "donor" },
];

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "Pest infestation in maize",
      type: "Pest Attack",
      location: "Field A",
      status: "Pending",
      createdAt: "2026-01-28 10:30 AM",
      assignedTo: null,
      description: "Pests are damaging maize crops in field A.",
    },
    {
      id: 2,
      title: "Goat ate crops",
      type: "Animal Damage",
      location: "Field B",
      status: "Resolved",
      createdAt: "2026-01-27 02:15 PM",
      assignedTo: "Leader Mike Brown",
      description: "A goat entered the field and ate crops.",
    },
  ]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [assignComplaint, setAssignComplaint] = useState(null);
  const [assignedUser, setAssignedUser] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter & pagination
  const filteredComplaints = complaints.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase()) ||
      (c.assignedTo || "").toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export CSV
  const exportCSV = () => {
    const csv = Papa.unparse(filteredComplaints);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "complaints.csv";
    link.click();
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Complaints Report", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Title", "Type", "Location", "Status", "Assigned To", "Date"]],
      body: filteredComplaints.map((c) => [
        c.title,
        c.type,
        c.location,
        c.status,
        c.assignedTo || "Unassigned",
        c.createdAt,
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [248, 187, 208], textColor: [60, 60, 60] },
    });
    doc.save("complaints.pdf");
  };

  // Handlers
  const handleDelete = (id) => {
    setComplaints(complaints.filter((c) => c.id !== id));
    setActiveDropdown(null);
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

  const handleAssign = () => {
    if (!assignedUser) return;
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === assignComplaint.id ? { ...c, assignedTo: assignedUser } : c
      )
    );
    setAssignComplaint(null);
  };

  return (
    <AdminLayout user={{ name: "Admin User", role: "Administrator" }}>
      <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-900 space-y-6">
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">
          Manage Complaints
        </h1>

        {/* SEARCH + EXPORT */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-1/3 dark:bg-slate-700 dark:text-gray-100 dark:border-slate-600"
          />
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faFileArrowDown} /> CSV
            </button>
            <button
              onClick={exportPDF}
              className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg flex items-center gap-2 hover:bg-pink-200 dark:bg-pink-800 dark:text-pink-200 dark:hover:bg-pink-700"
            >
              <FontAwesomeIcon icon={faFileArrowDown} /> PDF
            </button>
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
        <th className="p-3 text-left text-gray-700 dark:text-gray-200">Status</th>
        <th className="p-3 text-left text-gray-700 dark:text-gray-200">Assigned To</th>
        <th className="p-3 text-left text-gray-700 dark:text-gray-200">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-gray-50 dark:bg-slate-800">
      {paginatedComplaints.map((c, index) => (
        <tr
          key={c.id}
          className="border-b border-gray-300 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
        >
          <td className="p-3 text-gray-800 dark:text-gray-200">{index + 1}</td>
          <td className="p-3 text-gray-800 dark:text-gray-200">{c.title}</td>
          <td className="p-3 text-gray-800 dark:text-gray-200">{c.type}</td>
          <td className="p-3 text-gray-800 dark:text-gray-200">{c.location}</td>
          <td
            className={`p-3 font-semibold ${
              c.status === "Resolved"
                ? "text-green-600 dark:text-green-400"
                : "text-amber-500 dark:text-amber-400"
            }`}
          >
            {c.status}
          </td>
          <td className="p-3 text-gray-800 dark:text-gray-200">{c.assignedTo || "Unassigned"}</td>
          <td className="p-3 relative text-gray-800 dark:text-gray-200">
            <button
              onClick={() =>
                setActiveDropdown(activeDropdown === c.id ? null : c.id)
              }
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>

            {activeDropdown === c.id && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-700 shadow rounded z-10 border border-gray-300 dark:border-slate-600">
                <button
                  onClick={() => handleView(c)}
                  className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600"
                >
                  <FontAwesomeIcon icon={faEye} /> View
                </button>
                <button
                  onClick={() => handleOpenAssign(c)}
                  className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600"
                >
                  Assign
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-slate-600"
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
                  currentPage === i + 1
                    ? "bg-green-600 text-white dark:bg-green-500 dark:text-white"
                    : "bg-gray-100 dark:bg-slate-700 dark:text-gray-200"
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
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Complaint Details</h2>
              <p><b>Title:</b> {viewComplaint.title}</p>
              <p><b>Type:</b> {viewComplaint.type}</p>
              <p><b>Location:</b> {viewComplaint.location}</p>
              <p><b>Status:</b> {viewComplaint.status}</p>
              <p><b>Assigned To:</b> {viewComplaint.assignedTo || "Unassigned"}</p>
              <div className="mt-2">
                <b>Description:</b>
                <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded">{viewComplaint.description}</div>
              </div>
              <div className="text-right mt-4">
                <button
                  onClick={() => setViewComplaint(null)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
              <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Assign Complaint</h2>
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
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
