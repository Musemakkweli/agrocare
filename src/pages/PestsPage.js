import React, { useEffect, useState, useCallback } from "react";
import NavLayout from "./NavLayout";
import BASE_URL from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faPen, faEye, faTrash, faPlus, faDownload } from "@fortawesome/free-solid-svg-icons";

// Simple modal component for delete confirmation and view details
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

export default function PestPage() {
  const [pests, setPests] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPestId, setEditingPestId] = useState(null);
  const [viewPest, setViewPest] = useState(null); // for viewing details
  const [deletePestId, setDeletePestId] = useState(null); // for delete confirmation

  const [pestForm, setPestForm] = useState({
    field_id: "",
    pest_type: "",
    severity: "low",
    description: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loadPests = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/pest-alerts/user/${user.id}`);
      const data = await res.json();
      setPests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load pest alerts:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadFields = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${BASE_URL}/fields/user/${user.id}`);
      const data = await res.json();
      setFields(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load fields:", err);
    }
  }, [user?.id]);

  useEffect(() => {
    loadPests();
    loadFields();
  }, [loadPests, loadFields]);

  // Add or update pest alert
  const submitPest = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    if (!pestForm.field_id || !pestForm.pest_type) {
      alert("Field and Pest Type are required");
      return;
    }

    const payload = {
      farmer_id: Number(user.id),
      field_id: Number(pestForm.field_id),
      pest_type: pestForm.pest_type,
      severity: pestForm.severity || "low",
      description: pestForm.description || "",
    };

    try {
      let res;
      if (editingPestId) {
        res = await fetch(`${BASE_URL}/pest-alerts/${editingPestId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${BASE_URL}/pest-alerts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Failed to save pest alert");

      setPestForm({ field_id: "", pest_type: "", severity: "low", description: "" });
      setEditingPestId(null);
      setShowForm(false);
      loadPests();
    } catch (err) {
      console.error(err);
      alert("Failed to save pest alert");
    }
  };

  const confirmDelete = async () => {
    if (!deletePestId) return;
    try {
      const res = await fetch(`${BASE_URL}/pest-alerts/${deletePestId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete pest alert");
      setPests(pests.filter((p) => p.id !== deletePestId));
      setDeletePestId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete pest alert");
    }
  };

  const handleDownload = (p) => {
    const csvContent = `Field ID,Pest Type,Severity,Description\n${p.field_id},${p.pest_type},${p.severity},${p.description}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pest_alert_${p.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEdit = (p) => {
    setPestForm({
      field_id: p.field_id,
      pest_type: p.pest_type,
      severity: p.severity,
      description: p.description,
    });
    setEditingPestId(p.id);
    setShowForm(true);
    setMenuOpen(null);
  };

  return (
    <NavLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-green-900 dark:text-green-300">Pest Alerts</h1>

        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) setEditingPestId(null);
          }}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <FontAwesomeIcon icon={faPlus} /> {editingPestId ? "Edit Pest Alert" : "Add Pest Alert"}
        </button>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={submitPest}
            className="mb-6 p-4 bg-green-100 dark:bg-green-700 rounded-2xl shadow space-y-3"
          >
            <h2 className="text-lg font-bold mb-2">{editingPestId ? "Edit Pest Alert" : "Add Pest Alert"}</h2>

            <select
              value={pestForm.field_id}
              onChange={(e) => setPestForm({ ...pestForm, field_id: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Field</option>
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} (ID: {f.id})
                </option>
              ))}
            </select>

            <input
              placeholder="Pest Type"
              value={pestForm.pest_type}
              onChange={(e) => setPestForm({ ...pestForm, pest_type: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />

            <select
              value={pestForm.severity}
              onChange={(e) => setPestForm({ ...pestForm, severity: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <textarea
              placeholder="Description"
              value={pestForm.description}
              onChange={(e) => setPestForm({ ...pestForm, description: e.target.value })}
              className="w-full p-2 border rounded"
            />

            <button className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700">
              {editingPestId ? "Update Pest Alert" : "Save Pest Alert"}
            </button>
          </form>
        )}

        {/* Pest Cards */}
        {loading ? (
          <p>Loading pest alerts...</p>
        ) : pests.length === 0 ? (
          <p>No pest alerts reported.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pests.map((p) => (
              <div
                key={p.id}
                className="p-5 bg-green-200 dark:bg-green-700 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 relative"
              >
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-green-900 dark:text-green-200 text-lg mb-2">
                    {p.pest_type} - Field {p.field_id}
                  </h2>

                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
                      className="p-2 rounded hover:bg-green-300 dark:hover:bg-green-800"
                    >
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                    {menuOpen === p.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 shadow-lg rounded border border-gray-200 dark:border-gray-700 z-10">
                        <button
                          onClick={() => setViewPest(p)}
                          className="w-full text-left px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900"
                        >
                          <FontAwesomeIcon icon={faEye} /> View
                        </button>
                        <button
                          onClick={() => handleEdit(p)}
                          className="w-full text-left px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900"
                        >
                          <FontAwesomeIcon icon={faPen} /> Edit
                        </button>
                        <button
                          onClick={() => setDeletePestId(p.id)}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p>Severity: {p.severity}</p>
                <p>Description: {p.description}</p>

                <button
                  onClick={() => handleDownload(p)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faDownload} /> Download
                </button>
              </div>
            ))}
          </div>
        )}

        {/* View Modal */}
        {viewPest && (
          <Modal
            title="Pest Alert Details"
            onClose={() => setViewPest(null)}
          >
            <p><strong>Field ID:</strong> {viewPest.field_id}</p>
            <p><strong>Pest Type:</strong> {viewPest.pest_type}</p>
            <p><strong>Severity:</strong> {viewPest.severity}</p>
            <p><strong>Description:</strong> {viewPest.description}</p>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {deletePestId && (
          <Modal
            title="Confirm Delete"
            onClose={() => setDeletePestId(null)}
            onConfirm={confirmDelete}
          >
            Are you sure you want to delete this pest alert?
          </Modal>
        )}
      </div>
    </NavLayout>
  );
}
