import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEye,
  faPen,
  faTrash,
  faPlus,
  faExclamationTriangle,
  faArrowUp,
  faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import NavLayout from "./NavLayout";

export default function ReportComplaintDashboard() {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "Pest infestation in maize",
      type: "Pest Attack",
      location: "Field A",
      status: "Pending",
      createdAt: "2026-01-28 10:30 AM",
    },
    {
      id: 2,
      title: "Goat ate crops",
      type: "Animal Damage",
      location: "Field B",
      status: "Resolved",
      createdAt: "2026-01-27 02:15 PM",
    },
  ]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    location: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newComplaint = {
      id: complaints.length + 1,
      title: formData.title,
      type: formData.type,
      location: formData.location,
      status: "Pending",
      createdAt: new Date().toLocaleString(),
    };

    setComplaints([newComplaint, ...complaints]);
    setFormData({ title: "", type: "", description: "", location: "", image: null });
    setShowForm(false);
    alert("Complaint submitted successfully!");
  };

  const handleDelete = (id) => {
    setComplaints(complaints.filter(c => c.id !== id));
    setActiveDropdown(null);
  };

  const handleView = (c) => {
    alert(`Viewing complaint:\nTitle: ${c.title}\nType: ${c.type}\nLocation: ${c.location}\nStatus: ${c.status}\nCreated At: ${c.createdAt}`);
    setActiveDropdown(null);
  };

  const handleUpdate = (c) => {
    alert("You can implement update functionality here.");
    setActiveDropdown(null);
  };

  return (
    <NavLayout>
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">My Complaints</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
        >
          <FontAwesomeIcon icon={faPlus} /> New Complaint
        </button>
      </div>

      {/* COMPLAINTS TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c, index) => (
              <tr key={c.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                <td className="p-3">{index + 1}</td>
                <td className="p-3 text-gray-900 dark:text-gray-200">{c.title}</td>
                <td className="p-3 text-gray-900 dark:text-gray-200">{c.type}</td>
                <td className="p-3 text-gray-900 dark:text-gray-200">{c.location}</td>
                <td className="p-3 text-gray-900 dark:text-gray-200">{c.createdAt}</td>
                <td className={`p-3 font-semibold ${c.status === "Resolved" ? "text-green-600" : "text-red-500"}`}>
                  {c.status}
                </td>
                <td className="p-3 relative">
                  {/* THREE DOTS BUTTON */}
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === c.id ? null : c.id)}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>

                  {/* DROPDOWN */}
                  {activeDropdown === c.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 shadow-lg rounded-lg z-10">
                      <button
                        onClick={() => handleView(c)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2" /> View
                      </button>
                      <button
                        onClick={() => handleUpdate(c)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                      >
                        <FontAwesomeIcon icon={faPen} className="mr-2" /> Update
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-red-600 dark:text-red-400"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NEW COMPLAINT POPUP FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 font-bold text-lg hover:text-red-500"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold text-green-800 dark:text-green-400 mb-4">
              Report a Complaint
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Complaint Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Field / Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">Upload Image (optional)</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 rounded-lg bg-gray-300 dark:bg-slate-600 dark:text-white hover:bg-gray-400 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </NavLayout>
  );
}
