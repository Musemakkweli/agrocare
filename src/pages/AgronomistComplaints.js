import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AgronomistComplaints() {
  const [complaints] = useState([
    { id: 1, title: "Pest infestation in maize", farmer: "John Nkurunziza", status: "Pending", date: "2026-02-01" },
    { id: 2, title: "Low crop yield", farmer: "Mary Uwimana", status: "Resolved", date: "2026-01-28" },
    { id: 3, title: "Soil fertility issue", farmer: "Alex Habimana", status: "Pending", date: "2026-01-30" },
    { id: 4, title: "Watering problem", farmer: "Jean Mutoni", status: "Pending", date: "2026-01-31" },
    { id: 5, title: "Goat destroyed crops", farmer: "Alice Uwase", status: "Resolved", date: "2026-01-29" },
    { id: 6, title: "Fertilizer shortage", farmer: "Paul Habumugisha", status: "Pending", date: "2026-02-01" },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [openMenuId, setOpenMenuId] = useState(null);
  const [modalData, setModalData] = useState(null); // null = no modal open
  const [isRespondMode, setIsRespondMode] = useState(false);
  const [responseText, setResponseText] = useState("");

  const filteredComplaints = useMemo(() => {
    let data = complaints;
    if (filterStatus !== "All") data = data.filter(c => c.status === filterStatus);
    if (search.trim() !== "") {
      data = data.filter(
        c => c.title.toLowerCase().includes(search.toLowerCase()) ||
             c.farmer.toLowerCase().includes(search.toLowerCase())
      );
    }
    return data;
  }, [complaints, filterStatus, search]);

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  const toggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);

  const handleView = (complaint) => {
    setModalData(complaint);
    setIsRespondMode(false);
  };

  const handleRespond = (complaint) => {
    setModalData(complaint);
    setIsRespondMode(true);
    setResponseText("");
  };

  const closeModal = () => setModalData(null);

  const submitResponse = () => {
    alert(`Response submitted:\n\n${responseText}`); // Replace with API call later
    closeModal();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Complaints Report", 14, 20);
    const tableColumn = ["#", "Title", "Farmer", "Status", "Date"];
    const tableRows = paginatedComplaints.map((c, i) => [
      startIndex + i + 1, c.title, c.farmer, c.status, c.date
    ]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 25 });
    doc.save("complaints_report.pdf");
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Assigned Complaints</h2>

      {/* SEARCH + FILTER + EXPORT */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by farmer or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 w-full sm:w-64"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="flex gap-2">
          <CSVLink
            data={paginatedComplaints}
            filename={"complaints_report.csv"}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            CSV
          </CSVLink>
          <button
            onClick={exportPDF}
            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
          >
            PDF
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-4">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border text-left">Title</th>
              <th className="p-3 border text-left">Farmer</th>
              <th className="p-3 border text-left">Status</th>
              <th className="p-3 border text-left">Date</th>
              <th className="p-3 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-900 dark:text-gray-100">
            {paginatedComplaints.map((c, i) => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-green-900 transition">
                <td className="p-3 border">{startIndex + i + 1}</td>
                <td className="p-3 border">{c.title}</td>
                <td className="p-3 border">{c.farmer}</td>
                <td className={`p-3 border font-semibold ${
                  c.status === "Resolved" ? "text-green-700 dark:text-green-300" : "text-yellow-700 dark:text-yellow-300"
                }`}>{c.status}</td>
                <td className="p-3 border">{c.date}</td>
                <td className="p-3 border relative">
                  <button
                    onClick={() => toggleMenu(c.id)}
                    className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>

                  {openMenuId === c.id && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded shadow z-10">
                      <button
                        onClick={() => handleView(c)}
                        className="w-full text-left px-4 py-2 hover:bg-green-100 dark:hover:bg-green-700 flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faEye} /> View
                      </button>
                      {c.status === "Pending" && (
                        <button
                          onClick={() => handleRespond(c)}
                          className="w-full text-left px-4 py-2 hover:bg-yellow-100 dark:hover:bg-yellow-700 flex items-center gap-2"
                        >
                          <FontAwesomeIcon icon={faPen} /> Respond
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {paginatedComplaints.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No complaints found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1 ? "bg-green-600 text-white" : "bg-white dark:bg-slate-700 dark:text-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {isRespondMode ? "Respond to Complaint" : "View Complaint"}
            </h2>

            {!isRespondMode ? (
              <div className="space-y-2">
                <p><strong>Title:</strong> {modalData.title}</p>
                <p><strong>Farmer:</strong> {modalData.farmer}</p>
                <p><strong>Status:</strong> {modalData.status}</p>
                <p><strong>Date:</strong> {modalData.date}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p><strong>Title:</strong> {modalData.title}</p>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response..."
                  className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  rows={5}
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 dark:bg-slate-600 rounded"
              >
                Close
              </button>
              {isRespondMode && (
                <button
                  onClick={submitResponse}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
