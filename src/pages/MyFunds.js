import React, { useState } from "react";
import NavLayout from "./NavLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faUser,
  faCalendarAlt,
  faDownload,
  faTimes,
  faPlus,
  
  faPhone
} from "@fortawesome/free-solid-svg-icons";

export default function SupportPage({ user }) {
  const [requests, setRequests] = useState([
    { id: 1, donor: "John Doe", amount: 50, createdAt: "2026-01-28", title: "Support for Crop Tools", message: "Funds for buying crop tools and seeds.", name: "John Doe", contact: "john@example.com" },
    { id: 2, donor: "Jane Smith", amount: 100, createdAt: "2026-01-27", title: "Fertilizer Donation", message: "Providing fertilizer for maize fields.", name: "Jane Smith", contact: "jane@example.com" },
  ]);

  const [selected, setSelected] = useState(null);
  const [newRequest, setNewRequest] = useState({ title: "", amount: "", message: "", name: "", contact: "" });
  const [showModal, setShowModal] = useState(false);

  const handleDownload = (r) => {
    const csvContent = `Title,Donor,Amount,Date,Message,Name,Contact\n"${r.title}","${r.donor}",${r.amount},"${r.createdAt}","${r.message}","${r.name}","${r.contact}"`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${r.title.replace(/\s/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const submitRequest = () => {
    if (!newRequest.title || !newRequest.amount || !newRequest.name || !newRequest.contact) return;

    const newEntry = {
      id: requests.length + 1,
      donor: user?.name || "Anonymous",
      amount: newRequest.amount,
      createdAt: new Date().toISOString().split("T")[0],
      title: newRequest.title,
      message: newRequest.message,
      name: newRequest.name,
      contact: newRequest.contact
    };

    setRequests([newEntry, ...requests]);
    setNewRequest({ title: "", amount: "", message: "", name: "", contact: "" });
    setShowModal(false);
  };

  const cancelRequest = () => {
    setNewRequest({ title: "", amount: "", message: "", name: "", contact: "" });
    setShowModal(false);
  };

  return (
    <NavLayout user={user}>
      <div className="space-y-6">
        {/* PAGE TITLE */}
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-4">
          Support
        </h1>

        {/* OPEN MODAL BUTTON */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <FontAwesomeIcon icon={faPlus} /> Request Funding / Support
        </button>

        {/* SUPPORT HISTORY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5 flex flex-col justify-between transition hover:shadow-lg cursor-pointer"
              onClick={() => setSelected(r)}
            >
              <h2 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
                {r.title}
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} /> {r.donor}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2 mt-1">
                <FontAwesomeIcon icon={faDollarSign} /> ${r.amount}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                <FontAwesomeIcon icon={faCalendarAlt} /> {r.createdAt}
              </p>
            </div>
          ))}
        </div>

        {/* REQUEST FORM MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-700 dark:text-green-400">
                  Request Funding / Support
                </h2>
                <button onClick={cancelRequest}>
                  <FontAwesomeIcon icon={faTimes} className="text-gray-600 dark:text-gray-300 text-lg" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
                  value={newRequest.name}
                  onChange={e => setNewRequest({ ...newRequest, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Phone or Email"
                  className="px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
                  value={newRequest.contact}
                  onChange={e => setNewRequest({ ...newRequest, contact: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Title of request"
                  className="px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
                  value={newRequest.title}
                  onChange={e => setNewRequest({ ...newRequest, title: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Amount needed ($)"
                  className="px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
                  value={newRequest.amount}
                  onChange={e => setNewRequest({ ...newRequest, amount: e.target.value })}
                />
                <textarea
                  placeholder="Description / message"
                  className="px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
                  value={newRequest.message}
                  onChange={e => setNewRequest({ ...newRequest, message: e.target.value })}
                />

                <div className="flex gap-4">
                  <button
                    onClick={submitRequest}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Submit
                  </button>
                  <button
                    onClick={cancelRequest}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW REQUEST MODAL */}
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
              <p className="mb-2 text-gray-700 dark:text-gray-200"><FontAwesomeIcon icon={faUser} /> Name: {selected.name}</p>
              <p className="mb-4 text-gray-700 dark:text-gray-200"><FontAwesomeIcon icon={faPhone} /> Contact: {selected.contact}</p>
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
