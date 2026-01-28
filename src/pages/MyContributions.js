import React, { useState } from "react";
import NavLayout from "./NavLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faUser,
  faCalendarAlt,
  faDownload,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

export default function MyContributions() {
  const [contributions] = useState([
    { id: 1, donor: "John Doe", amount: 50, createdAt: "2026-01-28", title: "Support for Crop Tools", message: "Funds for buying crop tools and seeds." },
    { id: 2, donor: "Jane Smith", amount: 100, createdAt: "2026-01-27", title: "Fertilizer Donation", message: "Providing fertilizer for maize fields." },
    { id: 3, donor: "Alice Brown", amount: 75, createdAt: "2026-01-26", title: "Pesticide Support", message: "Funds for pest control chemicals." },
  ]);

  const [selected, setSelected] = useState(null); // selected contribution

  // Handle download (CSV format as example)
  const handleDownload = (c) => {
    const csvContent = `Title,Donor,Amount,Date,Message\n"${c.title}","${c.donor}",${c.amount},"${c.createdAt}","${c.message}"`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${c.title.replace(/\s/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <NavLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-4">
          My Contributions
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributions.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5 flex flex-col justify-between transition hover:shadow-lg cursor-pointer"
              onClick={() => setSelected(c)}
            >
              <h2 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
                {c.title}
              </h2>

              <p className="text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} /> {c.donor}
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2 mt-1">
                <FontAwesomeIcon icon={faDollarSign} /> ${c.amount}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                <FontAwesomeIcon icon={faCalendarAlt} /> {c.createdAt}
              </p>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {selected && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg w-96 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-700 dark:text-green-400">{selected.title}</h2>
                <button onClick={() => setSelected(null)}>
                  <FontAwesomeIcon icon={faTimes} className="text-gray-600 dark:text-gray-300 text-lg" />
                </button>
              </div>

              <p className="mb-2 text-gray-700 dark:text-gray-200"><FontAwesomeIcon icon={faUser} /> Donor: {selected.donor}</p>
              <p className="mb-2 text-gray-700 dark:text-gray-200"><FontAwesomeIcon icon={faDollarSign} /> Amount: ${selected.amount}</p>
              <p className="mb-2 text-gray-500 dark:text-gray-400"><FontAwesomeIcon icon={faCalendarAlt} /> Date: {selected.createdAt}</p>
              <p className="mb-4 text-gray-700 dark:text-gray-200">Message: {selected.message}</p>

              <button
                onClick={() => handleDownload(selected)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <FontAwesomeIcon icon={faDownload} /> Download
              </button>
            </div>
          </div>
        )}
      </div>
    </NavLayout>
  );
}
