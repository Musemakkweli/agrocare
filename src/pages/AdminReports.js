import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function AdminReports() {
  const [reports, setReports] = useState([
    {
      id: 1,
      program: "Maize Pest Control Fund",
      type: "Complaint",
      submittedBy: "Farmer John",
      date: "2026-01-25",
      status: "Pending",
      description: "Pests are affecting maize crops in Huye District.",
      expanded: false
    },
    {
      id: 2,
      program: "Organic Fertilizer Initiative",
      type: "Feedback",
      submittedBy: "Farmer Mary",
      date: "2026-01-26",
      status: "Resolved",
      description: "Fertilizer delivery was timely and helpful.",
      expanded: false
    },
    {
      id: 3,
      program: "Irrigation Expansion Program",
      type: "Complaint",
      submittedBy: "Farmer Paul",
      date: "2026-01-27",
      status: "Pending",
      description: "Irrigation system is not functional in Southern Province.",
      expanded: false
    },
  ]);

  const [search, setSearch] = useState("");

  // Toggle expanded report
  const toggleExpand = (id) => {
    setReports(reports.map(r => r.id === id ? {...r, expanded: !r.expanded} : r));
  };

  // Filtered reports based on search
  const filteredReports = reports.filter(r =>
    r.program.toLowerCase().includes(search.toLowerCase()) ||
    r.submittedBy.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  // Download individual report as JSON
  const downloadReport = (report) => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${report.program.replace(/\s/g, "_")}.json`;
    link.click();
  };

  return (
    <AdminLayout user={{ name: "Admin User", role: "Administrator" }}>
      <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Admin Reports
          </h1>
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* REPORTS LIST */}
        <div className="space-y-4">
          {filteredReports.map((r) => (
            <div key={r.id} className="bg-white dark:bg-slate-800 rounded-xl shadow p-4">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleExpand(r.id)}>
                <div>
                  <h2 className="text-lg font-semibold text-green-700 dark:text-green-300">{r.program}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {r.type} | {r.submittedBy} | {r.date} | 
                    <span className={`font-bold ${r.status === "Pending" ? "text-red-600" : "text-green-600"}`}>
                      {r.status}
                    </span>
                  </p>
                </div>
                <FontAwesomeIcon icon={r.expanded ? faChevronUp : faChevronDown} className="text-gray-500 dark:text-gray-400" />
              </div>

              {r.expanded && (
                <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2 text-gray-700 dark:text-gray-200">
                  <p>{r.description}</p>
                  <button
                    onClick={() => downloadReport(r)}
                    className="mt-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <FontAwesomeIcon icon={faDownload} /> Download
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredReports.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300">No reports found.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}