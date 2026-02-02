import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faUser,
  faMapMarkerAlt,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";

export default function LeaderFarmersPage() {
  // ================= DATA =================
  const [farmers] = useState([
    {
      id: 1,
      name: "John Nkurunziza",
      phone: "0781234567",
      location: "Kayonza",
      status: "Active",
      complaints: 3,
    },
    {
      id: 2,
      name: "Mary Uwimana",
      phone: "0723456789",
      location: "Rwamagana",
      status: "Active",
      complaints: 1,
    },
    {
      id: 3,
      name: "Alex Habimana",
      phone: "0798765432",
      location: "Ngoma",
      status: "Inactive",
      complaints: 2,
    },
    {
      id: 4,
      name: "Peter Mugisha",
      phone: "0733333333",
      location: "Bugesera",
      status: "Active",
      complaints: 4,
    },
  ]);

  // ================= STATE =================
  const [search, setSearch] = useState("");
  const [viewFarmer, setViewFarmer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // ================= FILTER =================
  const filteredFarmers = useMemo(() => {
    return farmers.filter((f) =>
      `${f.name} ${f.location} ${f.phone}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [farmers, search]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFarmers = filteredFarmers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ================= UI =================
  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Farmers
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Farmers who have submitted complaints
        </p>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search farmer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full sm:w-1/3 px-3 py-2 rounded-lg
          bg-white text-gray-900
          border border-gray-300
          dark:bg-slate-800 dark:text-gray-100 dark:border-slate-600
          focus:outline-none focus:ring-2 focus:ring-green-500
        "
      />

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="p-3 border dark:border-slate-700 text-left">#</th>
              <th className="p-3 border dark:border-slate-700 text-left">Farmer</th>
              <th className="p-3 border dark:border-slate-700 text-left">Location</th>
              <th className="p-3 border dark:border-slate-700 text-left">Phone</th>
              <th className="p-3 border dark:border-slate-700 text-left">Complaints</th>
              <th className="p-3 border dark:border-slate-700 text-left">Status</th>
              <th className="p-3 border dark:border-slate-700 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="text-gray-900 dark:text-gray-100">
            {paginatedFarmers.map((f, index) => (
              <tr
                key={f.id}
                className="hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <td className="p-3 border dark:border-slate-700">
                  {startIndex + index + 1}
                </td>

                <td className="p-3 border dark:border-slate-700 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} />
                  {f.name}
                </td>

                <td className="p-3 border dark:border-slate-700">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="mr-1 text-gray-500 dark:text-gray-400"
                  />
                  {f.location}
                </td>

                <td className="p-3 border dark:border-slate-700">
                  {f.phone}
                </td>

                <td className="p-3 border dark:border-slate-700">
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className="mr-1 text-blue-600"
                  />
                  {f.complaints}
                </td>

                <td
                  className={`p-3 border dark:border-slate-700 font-semibold ${
                    f.status === "Active"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {f.status}
                </td>

                <td className="p-3 border dark:border-slate-700">
                  <button
                    onClick={() => setViewFarmer(f)}
                    className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    <FontAwesomeIcon icon={faEye} /> View
                  </button>
                </td>
              </tr>
            ))}

            {paginatedFarmers.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No farmers found
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
      {viewFarmer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-3">{viewFarmer.name}</h2>

            <p><b>Phone:</b> {viewFarmer.phone}</p>
            <p><b>Location:</b> {viewFarmer.location}</p>
            <p><b>Status:</b> {viewFarmer.status}</p>
            <p><b>Total Complaints:</b> {viewFarmer.complaints}</p>

            <div className="text-right mt-4">
              <button
                onClick={() => setViewFarmer(null)}
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
