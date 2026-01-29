import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faWater,
  faBug,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";

// Predefined icons for selection
const iconOptions = [
  { name: "Seedling", icon: faSeedling },
  { name: "Water", icon: faWater },
  { name: "Bug", icon: faBug },
];

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([
    {
      id: 1,
      title: "Maize Pest Control Fund",
      location: "Huye District",
      description:
        "Support farmers in fighting maize pests using safe and effective treatments.",
      icon: faBug,
      status: "Funding Open",
    },
    {
      id: 2,
      title: "Organic Fertilizer Initiative",
      location: "Nyamagabe District",
      description: "Provide eco-friendly fertilizers to small-scale farmers.",
      icon: faSeedling,
      status: "Ongoing",
    },
    {
      id: 3,
      title: "Irrigation Expansion Program",
      location: "Southern Province",
      description:
        "Help farmers access reliable irrigation systems for dry seasons.",
      icon: faWater,
      status: "Seeking Donors",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editProgram, setEditProgram] = useState(null);
  const [openActionId, setOpenActionId] = useState(null);

  // DELETE MODAL STATE
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    status: "Funding Open",
    icon: faSeedling,
  });

  const openAddModal = () => {
    setForm({
      title: "",
      location: "",
      description: "",
      status: "Funding Open",
      icon: faSeedling,
    });
    setEditProgram(null);
    setShowModal(true);
  };

  const openEditModal = (program) => {
    setForm(program);
    setEditProgram(program);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (icon) =>
    setForm((prev) => ({ ...prev, icon }));

  const handleSave = () => {
    if (!form.title || !form.location || !form.description) return;

    if (editProgram) {
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === editProgram.id ? { ...form, id: editProgram.id } : p
        )
      );
    } else {
      setPrograms((prev) => [...prev, { ...form, id: Date.now() }]);
    }

    setShowModal(false);
  };

  // OPEN DELETE CONFIRMATION
  const openDeleteModal = (program) => {
    setProgramToDelete(program);
    setShowDeleteModal(true);
    setOpenActionId(null);
  };

  // CONFIRM DELETE
  const confirmDelete = () => {
    setPrograms((prev) =>
      prev.filter((p) => p.id !== programToDelete.id)
    );
    setShowDeleteModal(false);
    setProgramToDelete(null);
  };

  return (
    <AdminLayout user={{ name: "Admin User", role: "Administrator" }}>
      <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Manage Programs
          </h1>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white shadow transition"
          >
            Add Program
          </button>
        </div>

        {/* PROGRAM CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md 
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                         border border-slate-200 dark:border-slate-700 relative group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3 mb-4">
                  <FontAwesomeIcon
                    icon={program.icon}
                    className="text-green-600 text-3xl group-hover:scale-110 transition"
                  />
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-300">
                    {program.title}
                  </h3>
                </div>

                {/* ACTION MENU */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenActionId(
                        openActionId === program.id ? null : program.id
                      )
                    }
                    className="p-2 rounded hover:bg-green-200 dark:hover:bg-green-700 transition"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>

                  {openActionId === program.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-700 
                                    shadow-lg rounded-lg border border-gray-200 
                                    dark:border-gray-600 z-20 overflow-hidden">
                      <button
                        onClick={() => {
                          openEditModal(program);
                          setOpenActionId(null);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-green-100 
                                   dark:hover:bg-green-600 text-gray-700 
                                   dark:text-gray-200 transition"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => openDeleteModal(program)}
                        className="w-full px-4 py-2 text-left hover:bg-green-100 
                                   dark:hover:bg-green-600 text-gray-700 
                                   dark:text-gray-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <strong>Location:</strong> {program.location}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">
                {program.description}
              </p>
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 
                               text-green-700 dark:bg-green-900 
                               dark:text-green-300 font-semibold">
                {program.status}
              </span>
            </div>
          ))}
        </div>

        {/* ADD / UPDATE MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-lg shadow-lg space-y-4">
              <h2 className="text-xl font-bold">
                {editProgram ? "Update Program" : "Add Program"}
              </h2>

              <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="w-full p-2 rounded border"
              />
              <input
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                className="w-full p-2 rounded border"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 rounded border"
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 rounded border"
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
                    className={`px-3 py-1 rounded border ${
                      form.icon === i.icon
                        ? "bg-green-100 border-green-600"
                        : ""
                    }`}
                  >
                    {i.name}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-green-600 text-white"
                >
                  {editProgram ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl max-w-md w-full shadow-lg space-y-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                Delete Program
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to delete{" "}
                <strong>{programToDelete?.title}</strong>? This action cannot be
                undone.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
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
