// ManageFundsPage.js
import React, { useState, useMemo } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ManageFundsPage() {
  const [funds, setFunds] = useState([
    { id: 1, donor: "Alice Uwase", program: "Maize Support", amount: 100, status: "Pending", date: "2026-02-01" },
    { id: 2, donor: "John Nkurunziza", program: "Soil Fertility", amount: 200, status: "Completed", date: "2026-01-28" },
    { id: 3, donor: "Mary Uwimana", program: "Irrigation", amount: 150, status: "Pending", date: "2026-01-30" },
    { id: 4, donor: "Alex Habimana", program: "Fertilizer Support", amount: 120, status: "Completed", date: "2026-01-31" },
    { id: 5, donor: "Jean Mutoni", program: "Goat Control", amount: 80, status: "Pending", date: "2026-02-02" },
    { id: 6, donor: "Paul Habumugisha", program: "Seed Distribution", amount: 90, status: "Completed", date: "2026-02-01" },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredFunds = useMemo(() => {
    let data = funds;
    if (filterStatus !== "All") data = data.filter(f => f.status === filterStatus);
    if (search.trim() !== "")
      data = data.filter(f =>
        f.donor.toLowerCase().includes(search.toLowerCase()) ||
        f.program.toLowerCase().includes(search.toLowerCase())
      );
    return data;
  }, [funds, filterStatus, search]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredFunds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFunds = filteredFunds.slice(startIndex, startIndex + itemsPerPage);

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Funds Report", 14, 20);
    const tableColumn = ["#", "Donor", "Program", "Amount", "Status", "Date"];
    const tableRows = filteredFunds.map((f, i) => [i + 1, f.donor, f.program, f.amount, f.status, f.date]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 25 });
    doc.save("funds_report.pdf");
  };

  // Modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);

  const viewFund = (f) => {
    setSelectedFund(f);
    setShowViewModal(true);
  };

  const updateFundStatus = (f) => {
    setFunds(prev =>
      prev.map(item => item.id === f.id ? { ...item, status: "Completed" } : item)
    );
    alert(`Updated ${f.donor}'s contribution to Completed`);
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Manage Funds</h2>

      {/* Search + Filter + Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search donor or program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 w-full"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex gap-2 ml-auto">
          <CSVLink
            data={filteredFunds}
            filename="funds_report.csv"
            className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
          >
            CSV
          </CSVLink>
          <button
            onClick={exportPDF}
            className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
          >
            PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border text-left">Donor</th>
              <th className="p-3 border text-left">Program</th>
              <th className="p-3 border text-left">Amount</th>
              <th className="p-3 border text-left">Status</th>
              <th className="p-3 border text-left">Date</th>
              <th className="p-3 border text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-900 dark:text-gray-100">
            {paginatedFunds.map((f, i) => (
              <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-green-900 transition">
                <td className="p-3 border">{startIndex + i + 1}</td>
                <td className="p-3 border">{f.donor}</td>
                <td className="p-3 border">{f.program}</td>
                <td className="p-3 border">${f.amount}</td>
                <td className={`p-3 border font-semibold ${f.status === "Completed" ? "text-green-700 dark:text-green-300" : "text-yellow-700 dark:text-yellow-300"}`}>
                  {f.status}
                </td>
                <td className="p-3 border">{f.date}</td>
                <td className="p-3 border relative">
                  <div className="relative inline-block text-left group">
                    <button className="px-2 py-1 bg-gray-300 dark:bg-slate-700 rounded hover:bg-gray-400">
                      •••
                    </button>
                    <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-700 shadow-lg rounded-md hidden group-hover:block z-10">
                      <button
                        onClick={() => viewFund(f)}
                        className="block w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-600"
                      >
                        View
                      </button>
                      {f.status === "Pending" && (
                        <button
                          onClick={() => updateFundStatus(f)}
                          className="block w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-600"
                        >
                          Update Status
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedFunds.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No funds found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-green-600 text-white" : "bg-white dark:bg-slate-700 dark:text-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedFund && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-sm">
            <h2 className="text-lg font-bold mb-3">Fund Details</h2>
            <p><strong>Donor:</strong> {selectedFund.donor}</p>
            <p><strong>Program:</strong> {selectedFund.program}</p>
            <p><strong>Amount:</strong> ${selectedFund.amount}</p>
            <p><strong>Status:</strong> {selectedFund.status}</p>
            <p><strong>Date:</strong> {selectedFund.date}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
