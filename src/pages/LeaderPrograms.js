import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faWater,
  faBug,
  faEllipsisV,
  faLeaf,
  faHandsHelping,
  faEye
} from "@fortawesome/free-solid-svg-icons";

// Predefined icons for selection
const iconOptions = [
  { name: "Seedling", icon: faSeedling },
  { name: "Water", icon: faWater },
  { name: "Pest Control", icon: faBug }
];

export default function LeaderPrograms() {
  const [programs, setPrograms] = useState([
    {
      id: 1,
      title: "Maize Pest Control",
      location: "Huye District",
      description: "Helping farmers protect maize crops from pests.",
      icon: faBug,
      status: "Ongoing"
    },
    {
      id: 2,
      title: "Organic Fertilizer Support",
      location: "Nyamagabe District",
      description: "Providing eco-friendly fertilizers to small farmers.",
      icon: faSeedling,
      status: "Funding Open"
    },
    {
      id: 3,
      title: "Irrigation for Dry Seasons",
      location: "Southern Province",
      description: "Improving water access for sustainable farming.",
      icon: faWater,
      status: "Seeking Donors"
    }
  ]);

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Current program & form state
  const [currentProgram, setCurrentProgram] = useState(null);
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    status: "Funding Open",
    icon: faSeedling
  });

  // Open modals
  const openAddModal = () => {
    setForm({
      title: "",
      location: "",
      description: "",
      status: "Funding Open",
      icon: faSeedling
    });
    setCurrentProgram(null);
    setShowFormModal(true);
  };

  const openEditModal = (program) => {
    setForm(program);
    setCurrentProgram(program);
    setShowFormModal(true);
  };

  const openViewModal = (program) => {
    setCurrentProgram(program);
    setShowViewModal(true);
  };

  const openDeleteModal = (program) => {
    setCurrentProgram(program);
    setShowDeleteModal(true);
  };

  // Form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (icon) =>
    setForm((prev) => ({ ...prev, icon }));

  // Save / Update program
  const handleSave = () => {
    if (!form.title.trim() || !form.location.trim() || !form.description.trim()) {
      alert("Please fill all fields!");
      return;
    }

    if (currentProgram) {
      // Update existing
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === currentProgram.id ? { ...form, id: currentProgram.id } : p
        )
      );
    } else {
      // Add new
      const newProgram = { ...form, id: Date.now() };
      setPrograms((prev) => [...prev, newProgram]);
    }

    // Reset form & close modal
    setForm({
      title: "",
      location: "",
      description: "",
      status: "Funding Open",
      icon: faSeedling
    });
    setCurrentProgram(null);
    setShowFormModal(false);
  };

  // Delete program
  const handleDelete = () => {
    setPrograms((prev) => prev.filter((p) => p.id !== currentProgram.id));
    setCurrentProgram(null);
    setShowDeleteModal(false);
  };

  // Status pill colors
  const statusStyle = (status) => {
    if (status === "Ongoing")
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    if (status === "Funding Open")
      return "bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300";
    return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
  };

  return (
    <div className="min-h-screen p-6 bg-green-50 dark:bg-slate-900 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faLeaf} /> AgroCare Programs
          </h1>
          <p className="text-sm text-green-700 dark:text-green-300">
            Supporting farmers through impactful agricultural programs
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2 rounded-xl bg-green-700 hover:bg-green-800 
                     text-white shadow flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faHandsHelping} /> Add Program
        </button>
      </div>

      {/* PROGRAMS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((program) => (
          <div
            key={program.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-md 
                       hover:shadow-xl transition border border-green-100 
                       dark:border-slate-700 relative"
          >
            {/* ICON */}
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
              <FontAwesomeIcon
                icon={program.icon}
                className="text-green-700 dark:text-green-300 text-2xl"
              />
            </div>

            {/* ACTION MENU */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => openViewModal(program)}
                className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-slate-700"
                title="View Program"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button
                onClick={() => openEditModal(program)}
                className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-slate-700"
                title="Edit Program"
              >
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
              <button
                onClick={() => openDeleteModal(program)}
                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-700"
                title="Delete Program"
              >
                🗑️
              </button>
            </div>

            {/* CONTENT */}
            <h3 className="text-lg font-bold text-green-800 dark:text-green-300">
              {program.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              📍 {program.location}
            </p>
            <p className="text-sm mt-4 text-gray-700 dark:text-gray-300">
              {program.description}
            </p>

            {/* STATUS */}
            <div className="mt-6">
              <span className={`px-4 py-1 text-xs font-semibold rounded-full ${statusStyle(program.status)}`}>
                {program.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FORM MODAL (Add / Update) */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold">{currentProgram ? "Update Program" : "Add Program"}</h2>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full p-2 border rounded"
            />
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full p-2 border rounded"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border rounded"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option>Funding Open</option>
              <option>Ongoing</option>
              <option>Seeking Donors</option>
            </select>

            <div className="flex gap-2">
              {iconOptions.map((i) => (
                <button
                  key={i.name}
                  onClick={() => handleIconChange(i.icon)}
                  className={`px-3 py-1 rounded border ${form.icon === i.icon ? "bg-green-100 border-green-600" : ""}`}
                >
                  {i.name}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <button onClick={() => setShowFormModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-green-700 text-white rounded">
                {currentProgram ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && currentProgram && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">{currentProgram.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">📍 {currentProgram.location}</p>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">{currentProgram.description}</p>
            <span className={`px-4 py-1 text-xs font-semibold rounded-full ${statusStyle(currentProgram.status)}`}>
              {currentProgram.status}
            </span>

            <div className="flex justify-end mt-4">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && currentProgram && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-md space-y-4">
            <h2 className="font-bold text-lg">Delete Program</h2>
            <p>
              Are you sure you want to delete <strong>{currentProgram.title}</strong>? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
