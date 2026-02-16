import React, { useEffect, useState, useCallback } from "react";
import NavLayout from "./NavLayout";
import BASE_URL from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEllipsisV, faPen, faEye, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

// Reusable modal component
const Modal = ({ title, children, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-lg">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="mb-4">{children}</div>
      <div className="flex justify-end gap-2">
        {onConfirm && (
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Confirm
          </button>
        )}
        <button
          onClick={onClose}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default function FieldsPage() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [viewField, setViewField] = useState(null); // view modal
  const [deleteFieldId, setDeleteFieldId] = useState(null); // delete modal

  const [fieldForm, setFieldForm] = useState({
    name: "",
    area: "",
    crop_type: "",
    location: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loadFields = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/fields/user/${user.id}`);
      const data = await res.json();
      setFields(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load fields:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadFields();
  }, [loadFields]);

  // Add or update field
  const submitField = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      let res;
      if (editingFieldId) {
        res = await fetch(`${BASE_URL}/fields/${editingFieldId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...fieldForm, user_id: user.id }),
        });
      } else {
        res = await fetch(`${BASE_URL}/fields`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...fieldForm, user_id: user.id }),
        });
      }

      if (!res.ok) throw new Error("Failed to save field");

      setFieldForm({ name: "", area: "", crop_type: "", location: "" });
      setEditingFieldId(null);
      setShowForm(false);
      loadFields();
    } catch (err) {
      console.error(err);
      alert("Failed to save field");
    }
  };

  const confirmDelete = async () => {
    if (!deleteFieldId) return;
    try {
      const res = await fetch(`${BASE_URL}/fields/${deleteFieldId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete field");
      setFields(fields.filter((f) => f.id !== deleteFieldId));
      setDeleteFieldId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete field");
    }
  };

  const handleDownload = (field) => {
    const csvContent = `Name,Area,Crop,Location\n${field.name},${field.area},${field.crop_type},${field.location}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${field.name.replace(/\s/g, "_")}_field.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEdit = (field) => {
    setFieldForm({
      name: field.name,
      area: field.area,
      crop_type: field.crop_type,
      location: field.location,
    });
    setEditingFieldId(field.id);
    setShowForm(true);
    setMenuOpen(null);
  };

  return (
    <NavLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-green-900 dark:text-green-300">My Fields</h1>

        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) setEditingFieldId(null);
          }}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <FontAwesomeIcon icon={faPlus} /> {editingFieldId ? "Edit Field" : "Add Field"}
        </button>

        {/* Form */}
        {showForm && (
          <form onSubmit={submitField} className="mb-6 p-4 bg-green-100 dark:bg-green-700 rounded-2xl shadow space-y-3">
            <h2 className="text-lg font-bold mb-2">{editingFieldId ? "Edit Field" : "Add Field"}</h2>
            <input
              placeholder="Field Name"
              value={fieldForm.name}
              onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              placeholder="Area"
              value={fieldForm.area}
              onChange={(e) => setFieldForm({ ...fieldForm, area: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              placeholder="Crop Type"
              value={fieldForm.crop_type}
              onChange={(e) => setFieldForm({ ...fieldForm, crop_type: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              placeholder="Location"
              value={fieldForm.location}
              onChange={(e) => setFieldForm({ ...fieldForm, location: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <button className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700">
              {editingFieldId ? "Update Field" : "Save Field"}
            </button>
          </form>
        )}

        {loading ? (
          <p>Loading fields...</p>
        ) : fields.length === 0 ? (
          <p>No fields added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((f) => (
              <div
                key={f.id}
                className="p-5 bg-green-200 dark:bg-green-700 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 relative"
              >
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-green-900 dark:text-green-200 text-lg mb-2">{f.name}</h2>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === f.id ? null : f.id)}
                      className="p-2 rounded hover:bg-green-300 dark:hover:bg-green-800"
                    >
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                    {menuOpen === f.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 shadow-lg rounded border border-gray-200 dark:border-gray-700 z-10">
                        <button
                          onClick={() => setViewField(f)}
                          className="w-full text-left px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900"
                        >
                          <FontAwesomeIcon icon={faEye} /> View
                        </button>
                        <button
                          onClick={() => handleEdit(f)}
                          className="w-full text-left px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900"
                        >
                          <FontAwesomeIcon icon={faPen} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteFieldId(f.id)}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p>Area: {f.area ?? "-"}</p>
                <p>Crop: {f.crop_type ?? "-"}</p>
                <p>Location: {f.location ?? "-"}</p>

                <button
                  onClick={() => handleDownload(f)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faDownload} /> Download
                </button>
              </div>
            ))}
          </div>
        )}

        {/* View Modal */}
        {viewField && (
          <Modal
            title="Field Details"
            onClose={() => setViewField(null)}
          >
            <p><strong>Name:</strong> {viewField.name}</p>
            <p><strong>Area:</strong> {viewField.area}</p>
            <p><strong>Crop:</strong> {viewField.crop_type}</p>
            <p><strong>Location:</strong> {viewField.location}</p>
          </Modal>
        )}

        {/* Delete Modal */}
        {deleteFieldId && (
          <Modal
            title="Confirm Delete"
            onClose={() => setDeleteFieldId(null)}
            onConfirm={confirmDelete}
          >
            Are you sure you want to delete this field?
          </Modal>
        )}
      </div>
    </NavLayout>
  );
}
