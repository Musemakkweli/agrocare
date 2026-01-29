import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faFileCsv,
  faFilePdf,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";

/* ---------------- DUMMY DATA ---------------- */
const initialContributions = [
  {
    id: 1,
    contributor: "John Doe",
    email: "john@example.com",
    program: "Irrigation Expansion Program",
    amount: 50000,
    method: "Mobile Money",
    status: "Completed",
    date: "2025-01-12",
  },
  {
    id: 2,
    contributor: "Anna Grey",
    email: "anna@example.com",
    program: "Organic Fertilizer Initiative",
    amount: 30000,
    method: "Bank Transfer",
    status: "Pending",
    date: "2025-01-15",
  },
  {
    id: 3,
    contributor: "Peter Brown",
    email: "peter@example.com",
    program: "Irrigation Expansion Program",
    amount: 80000,
    method: "Mobile Money",
    status: "Completed",
    date: "2025-01-18",
  },
];

export default function AdminContributions() {
  const [data, setData] = useState(initialContributions);
  const [actionId, setActionId] = useState(null);
  const [selected, setSelected] = useState(null);

  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  /* ---------- FILTER & PAGINATION ---------- */
  const [filterProgram, setFilterProgram] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const filteredData = data.filter((c) => {
    return (
      (filterProgram ? c.program === filterProgram : true) &&
      (filterStatus ? c.status === filterStatus : true)
    );
  });

  const totalPages = Math.ceil(filteredData.length / perPage);
  const displayed = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  /* ---------- EXPORT ---------- */
  const exportCSV = () => {
    const headers = ["Contributor", "Program", "Amount", "Method", "Status", "Date"];
    const rows = data.map((c) => [
      c.contributor,
      c.program,
      c.amount,
      c.method,
      c.status,
      c.date,
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "contributions.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Contributions Report", 14, 10);
    doc.autoTable({
      head: [["Contributor", "Program", "Amount", "Method", "Status", "Date"]],
      body: data.map((c) => [
        c.contributor,
        c.program,
        c.amount,
        c.method,
        c.status,
        c.date,
      ]),
    });
    doc.save("contributions.pdf");
  };

  /* ---------- DELETE ---------- */
  const confirmDelete = () => {
    setData((prev) => prev.filter((c) => c.id !== selected.id));
    setShowDelete(false);
  };

  return (
    <AdminLayout user={{ name: "Admin", role: "Administrator" }}>
      <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-300">
            Contributions
          </h1>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="px-3 py-2 bg-green-600 text-white rounded">
              <FontAwesomeIcon icon={faFileCsv} /> CSV
            </button>
            <button onClick={exportPDF} className="px-3 py-2 bg-green-600 text-white rounded">
              <FontAwesomeIcon icon={faFilePdf} /> PDF
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-4 mt-6">
          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="p-2 rounded border"
          >
            <option value="">All Programs</option>
            {[...new Set(data.map((d) => d.program))].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 rounded border"
          >
            <option value="">All Status</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-green-100">
              <tr>
                {["Contributor", "Program", "Amount", "Method", "Status", "Date", "Action"].map((h) => (
                  <th key={h} className="px-4 py-2 border text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((c) => (
                <tr key={c.id} className="border hover:bg-green-50">
                  <td className="px-4 py-2">{c.contributor}</td>
                  <td className="px-4 py-2">{c.program}</td>
                  <td className="px-4 py-2">{c.amount} RWF</td>
                  <td className="px-4 py-2">{c.method}</td>
                  <td className="px-4 py-2">{c.status}</td>
                  <td className="px-4 py-2">{c.date}</td>
                  <td className="px-4 py-2 relative">
                    <button onClick={() => setActionId(actionId === c.id ? null : c.id)}>
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>

                    {actionId === c.id && (
                      <div className="absolute right-0 bg-white shadow rounded w-32 z-10">
                        <button
                          onClick={() => {
                            setSelected(c);
                            setShowView(true);
                            setActionId(null);
                          }}
                          className="block w-full px-4 py-2 hover:bg-green-100"
                        >
                          <FontAwesomeIcon icon={faEye} /> View
                        </button>
                        <button
                          onClick={() => {
                            setSelected(c);
                            setShowDelete(true);
                            setActionId(null);
                          }}
                          className="block w-full px-4 py-2 hover:bg-green-100"
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
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 bg-green-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-green-600 text-white" : "bg-green-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 bg-green-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* VIEW MODAL */}
        {showView && selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-96 space-y-2">
              <h2 className="font-bold text-lg">Contribution Details</h2>
              <p><strong>Contributor:</strong> {selected.contributor}</p>
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Program:</strong> {selected.program}</p>
              <p><strong>Amount:</strong> {selected.amount} RWF</p>
              <p><strong>Method:</strong> {selected.method}</p>
              <p><strong>Status:</strong> {selected.status}</p>
              <p><strong>Date:</strong> {selected.date}</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowView(false)}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {showDelete && selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-96 space-y-2">
              <h2 className="font-bold text-lg">Delete Contribution</h2>
              <p>Are you sure you want to delete this contribution?</p>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowDelete(false)}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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
