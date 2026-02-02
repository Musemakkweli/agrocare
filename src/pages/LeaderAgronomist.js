import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useOutletContext } from "react-router-dom";

export default function LeaderComplaintsPage() {
  const outlet = useOutletContext();
  const filter = outlet?.filter || "All";

  // ================= DATA =================
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "Pest infestation in maize",
      type: "Pest Attack",
      description: "Pests destroyed maize crops",
      location: "Field A",
      status: "Pending",
      createdAt: "2026-01-28",
      agronomist: "Paul Kayumba",
    },
    {
      id: 2,
      title: "Goat ate crops",
      type: "Animal Damage",
      description: "Neighbor goat destroyed crops",
      location: "Field B",
      status: "Resolved",
      createdAt: "2026-01-27",
      agronomist: "Marie Uwase",
    },
    {
      id: 3,
      title: "Flooded field",
      type: "Weather Damage",
      description: "Heavy rain flooded field",
      location: "Field C",
      status: "Escalated",
      createdAt: "2026-01-26",
      agronomist: "Alex Habimana",
    },
  ]);

  // ================= STATE =================
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // ================= FILTER =================
  const filteredComplaints = useMemo(() => {
    if (filter === "All") return complaints;
    return complaints.filter((c) => c.status === filter);
  }, [complaints, filter]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ================= ACTIONS =================
  const handleView = (complaint) => {
    setViewComplaint(complaint);
    setActiveDropdown(null);
  };

  const handleDelete = (id) => {
    setComplaints((prev) => prev.filter((c) => c.id !== id));
    setActiveDropdown(null);
  };

  const statusStyle = (status) => {
    if (status === "Resolved") return "text-green-600";
    if (status === "Escalated") return "text-red-600";
    return "text-amber-500";
  };

  // ================= UI =================
  return (
    <div className="space-y-5">
      {/* TABLE */}
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3 border-b text-left font-semibold">#</th>
              <th className="px-4 py-3 border-b text-left font-semibold">Title</th>
              <th className="px-4 py-3 border-b text-left font-semibold">Agronomist</th>
              <th className="px-4 py-3 border-b text-left font-semibold">Location</th>
              <th className="px-4 py-3 border-b text-left font-semibold">Status</th>
              <th className="px-4 py-3 border-b text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-800 dark:text-gray-200">
            {paginatedComplaints.map((c, i) => (
              <tr
                key={c.id}
                className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <td className="px-4 py-3">
                  {startIndex + i + 1}
                </td>
                <td className="px-4 py-3 font-medium">{c.title}</td>
                <td className="px-4 py-3">{c.agronomist}</td>
                <td className="px-4 py-3">{c.location}</td>
                <td className={`px-4 py-3 font-semibold ${statusStyle(c.status)}`}>
                  {c.status}
                </td>
                <td className="px-4 py-3 relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(activeDropdown === c.id ? null : c.id)
                    }
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>

                  {activeDropdown === c.id && (
                    <div className="absolute right-2 top-10 w-32 rounded-md border bg-white dark:bg-slate-800 shadow z-20">
                      <button
                        onClick={() => handleView(c)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700"
                      >
                        <FontAwesomeIcon icon={faEye} /> View
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700"
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
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No complaints found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-white dark:bg-slate-800 dark:text-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* VIEW MODAL */}
      {viewComplaint && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-3">{viewComplaint.title}</h2>

            <p><b>Agronomist:</b> {viewComplaint.agronomist}</p>
            <p><b>Type:</b> {viewComplaint.type}</p>
            <p><b>Location:</b> {viewComplaint.location}</p>
            <p><b>Status:</b> {viewComplaint.status}</p>

            <p className="mt-2 font-semibold">Description</p>
            <div className="mt-1 bg-gray-100 dark:bg-slate-700 p-3 rounded">
              {viewComplaint.description}
            </div>

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
    </div>
  );
}
