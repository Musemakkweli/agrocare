import React, { useEffect, useState, useCallback } from "react";
import NavLayout from "./NavLayout";
import BASE_URL from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faPen, faEye, faTrash, faPlus, faDownload } from "@fortawesome/free-solid-svg-icons";

// Modal component
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

export default function HarvestPage() {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingHarvestId, setEditingHarvestId] = useState(null);
  const [viewHarvest, setViewHarvest] = useState(null); // view modal
  const [deleteHarvestId, setDeleteHarvestId] = useState(null); // delete modal
  const [harvestForm, setHarvestForm] = useState({
    field_id: "",
    crop_type: "",
    harvest_date: "",
    status: "upcoming",
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loadHarvests = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/harvests/user/${user.id}`);
      const data = await res.json();
      setHarvests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load harvests:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadHarvests();
  }, [loadHarvests]);

  const submitHarvest = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    if (!harvestForm.field_id || !harvestForm.harvest_date) {
      alert("Field ID and Harvest Date are required");
      return;
    }

    const payload = {
      farmer_id: Number(user.id),
      field_id: Number(harvestForm.field_id),
      crop_type: harvestForm.crop_type || null,
      harvest_date: harvestForm.harvest_date,
      status: harvestForm.status || "upcoming",
    };

    try {
      let res;
      if (editingHarvestId) {
        res = await fetch(`${BASE_URL}/harvests/${editingHarvestId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${BASE_URL}/harvests`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Failed to save harvest");

      setHarvestForm({ field_id: "", crop_type: "", harvest_date: "", status: "upcoming" });
      setEditingHarvestId(null);
      setShowForm(false);
      loadHarvests();
    } catch (err) {
      console.error(err);
      alert("Failed to save harvest. Please check the input.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteHarvestId) return;
    try {
      const res = await fetch(`${BASE_URL}/harvests/${deleteHarvestId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete harvest");
      setHarvests(harvests.filter((h) => h.id !== deleteHarvestId));
      setDeleteHarvestId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete harvest");
    }
  };

  const handleDownload = (h) => {
    const csvContent = `Field ID,Crop,Date,Status\n${h.field_id},${h.crop_type || ""},${new Date(h.harvest_date).toLocaleDateString()},${h.status}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `harvest_${h.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEdit = (h) => {
    setHarvestForm({
      field_id: h.field_id,
      crop_type: h.crop_type || "",
      harvest_date: h.harvest_date.split("T")[0],
      status: h.status || "upcoming",
    });
    setEditingHarvestId(h.id);
    setShowForm(true);
    setMenuOpen(null);
  };

  return (
    <NavLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-green-900 dark:text-green-300">My Harvests</h1>

        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) setEditingHarvestId(null);
          }}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <FontAwesomeIcon icon={faPlus} /> {editingHarvestId ? "Edit Harvest" : "Add Harvest"}
        </button>

        {showForm && (
          <form
            onSubmit={submitHarvest}
            className="mb-6 p-4 bg-green-100 dark:bg-green-700 rounded-2xl shadow space-y-3"
          >
            <h2 className="text-lg font-bold mb-2">{editingHarvestId ? "Edit Harvest" : "Add Harvest"}</h2>
            <input
              type="number"
              placeholder="Field ID"
              value={harvestForm.field_id}
              onChange={(e) => setHarvestForm({ ...harvestForm, field_id: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              placeholder="Crop Type"
              value={harvestForm.crop_type}
              onChange={(e) => setHarvestForm({ ...harvestForm, crop_type: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="date"
              placeholder="Harvest Date"
              value={harvestForm.harvest_date}
              onChange={(e) => setHarvestForm({ ...harvestForm, harvest_date: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={harvestForm.status}
              onChange={(e) => setHarvestForm({ ...harvestForm, status: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
            <button className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700">
              {editingHarvestId ? "Update Harvest" : "Save Harvest"}
            </button>
          </form>
        )}

        {loading ? (
          <p>Loading harvests...</p>
        ) : harvests.length === 0 ? (
          <p>No harvests scheduled.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {harvests.map((h) => (
              <div
                key={h.id}
                className="p-5 bg-green-200 dark:bg-green-700 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 relative"
              >
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-green-900 dark:text-green-200 text-lg mb-2">
                    {h.crop_type || "Unknown Crop"} - Field {h.field_id}
                  </h2>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === h.id ? null : h.id)}
                      className="p-2 rounded hover:bg-green-300 dark:hover:bg-green-800"
                    >
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                    {menuOpen === h.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 shadow-lg rounded border border-gray-200 dark:border-gray-700 z-10">
                        <button
                          onClick={() => setViewHarvest(h)}
                          className="w-full text-left px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900"
                        >
                          <FontAwesomeIcon icon={faEye} /> View
                        </button>
                        <button
                          onClick={() => handleEdit(h)}
                          className="w-full text-left px-4 py-2 hover:bg-green-100 dark:hover:bg-green-900"
                        >
                          <FontAwesomeIcon icon={faPen} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteHarvestId(h.id)}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p>Date: {new Date(h.harvest_date).toLocaleDateString()}</p>
                <p>Status: {h.status}</p>

                <button
                  onClick={() => handleDownload(h)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faDownload} /> Download
                </button>
              </div>
            ))}
          </div>
        )}

        {/* View Modal */}
        {viewHarvest && (
          <Modal title="Harvest Details" onClose={() => setViewHarvest(null)}>
            <p><strong>Field ID:</strong> {viewHarvest.field_id}</p>
            <p><strong>Crop:</strong> {viewHarvest.crop_type || "N/A"}</p>
            <p><strong>Date:</strong> {new Date(viewHarvest.harvest_date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {viewHarvest.status}</p>
          </Modal>
        )}

        {/* Delete Modal */}
        {deleteHarvestId && (
          <Modal
            title="Confirm Delete"
            onClose={() => setDeleteHarvestId(null)}
            onConfirm={confirmDelete}
          >
            Are you sure you want to delete this harvest?
          </Modal>
        )}
      </div>
    </NavLayout>
  );
}
