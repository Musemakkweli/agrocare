import React, { useState, useEffect } from "react"; 
import AdminLayout from "./AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faFileCsv, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Dummy users
const dummyUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "0781234567", status: "Active", role: "farmer" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0789876543", status: "Inactive", role: "farmer" },
  { id: 3, name: "Mike Brown", email: "mike@example.com", phone: "0785555555", status: "Active", role: "leader" },
  { id: 4, name: "Alice Green", email: "alice@example.com", phone: "0784444444", status: "Active", role: "agronomist" },
  { id: 5, name: "Bob White", email: "bob@example.com", phone: "0781112233", status: "Active", role: "donor" },
  { id: 6, name: "Mary Black", email: "mary@example.com", phone: "0783334455", status: "Inactive", role: "farmer" },
  { id: 7, name: "Steve Brown", email: "steve@example.com", phone: "0787778888", status: "Active", role: "leader" },
  { id: 8, name: "Anna Grey", email: "anna@example.com", phone: "0789990001", status: "Active", role: "donor" },
  { id: 9, name: "Chris Green", email: "chris@example.com", phone: "0785556677", status: "Active", role: "agronomist" },
  { id: 10, name: "Lily White", email: "lily@example.com", phone: "0782223344", status: "Inactive", role: "farmer" },
];

export default function AdminUsers({ role }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [actionOpenId, setActionOpenId] = useState(null);

  // Modal state
  const [modal, setModal] = useState({ type: "", user: null });

  useEffect(() => {
    const filtered = dummyUsers.filter(u => u.role === role);
    setUsers(filtered);
    setCurrentPage(1);
  }, [role]);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const displayedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const downloadCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Status"];
    const rows = users.map(u => [u.id, u.name, u.email, u.phone, u.status]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${role}s.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID", "Name", "Email", "Phone", "Status"];
    const tableRows = users.map(u => [u.id, u.name, u.email, u.phone, u.status]);
    doc.autoTable({ head: [tableColumn], body: tableRows });
    doc.save(`${role}s.pdf`);
  };

  const handleDelete = (user) => {
    setModal({ type: "delete", user });
  };

  const confirmDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== modal.user.id));
    setModal({ type: "", user: null });
  };

  const handleUpdate = (user) => {
    setModal({ type: "update", user });
  };

  const handleView = (user) => {
    setModal({ type: "view", user });
  };

  const saveUpdate = (updatedName) => {
    setUsers(prev => prev.map(u => u.id === modal.user.id ? { ...u, name: updatedName } : u));
    setModal({ type: "", user: null });
  };

  return (
    <AdminLayout user={{ name: "Admin User", role: "Administrator" }}>
      <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          {role.charAt(0).toUpperCase() + role.slice(1)}s
        </h1>

        {/* Search + Export */}
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white w-full md:w-1/3"
          />
          <div className="flex gap-2">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
            >
              <FontAwesomeIcon icon={faFileCsv} /> CSV
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
            >
              <FontAwesomeIcon icon={faFilePdf} /> PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700">
            <thead className="bg-green-100 dark:bg-green-800">
              <tr>
                {["ID", "Name", "Email", "Phone", "Status", "Action"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 border-b border-gray-300 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((u, idx) => (
                <tr
                  key={u.id}
                  className={`border-b border-gray-200 dark:border-gray-700 ${
                    idx % 2 === 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-white dark:bg-slate-800"
                  } hover:bg-green-100 dark:hover:bg-green-800 transition`}
                >
                  <td className="px-4 py-2">{u.id}</td>
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.phone}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        u.status === "Active" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center relative">
                    <button
                      className="p-2 rounded hover:bg-green-200 dark:hover:bg-green-700 transition"
                      onClick={() => setActionOpenId(actionOpenId === u.id ? null : u.id)}
                    >
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>

                    {/* Dropdown Menu */}
                    {actionOpenId === u.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-700 shadow rounded border border-gray-200 dark:border-gray-600 z-10">
                        <button
                          className="w-full px-4 py-2 hover:bg-green-100 dark:hover:bg-green-600 text-left text-gray-700 dark:text-gray-200"
                          onClick={() => { handleView(u); setActionOpenId(null); }}
                        >
                          View
                        </button>
                        <button
                          className="w-full px-4 py-2 hover:bg-green-100 dark:hover:bg-green-600 text-left text-gray-700 dark:text-gray-200"
                          onClick={() => { handleUpdate(u); setActionOpenId(null); }}
                        >
                          Update
                        </button>
                        <button
                          className="w-full px-4 py-2 hover:bg-green-100 dark:hover:bg-green-600 text-left text-gray-700 dark:text-gray-200"
                          onClick={() => { handleDelete(u); setActionOpenId(null); }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {displayedUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-gray-500 dark:text-gray-300">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-3 py-1 rounded bg-green-200 dark:bg-green-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-green-500 text-white"
                  : "bg-green-100 text-gray-700 dark:bg-green-700 dark:text-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-3 py-1 rounded bg-green-200 dark:bg-green-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {modal.user && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-80 shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-600 dark:text-gray-200 hover:text-green-500"
                onClick={() => setModal({ type: "", user: null })}
              >
                ✖
              </button>

              {modal.type === "view" && (
                <>
                  <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{modal.user.name}</h2>
                  <p><strong>Email:</strong> {modal.user.email}</p>
                  <p><strong>Phone:</strong> {modal.user.phone}</p>
                  <p><strong>Status:</strong> {modal.user.status}</p>
                  <p><strong>Role:</strong> {modal.user.role}</p>
                </>
              )}

              {modal.type === "update" && (
                <>
                  <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Update User</h2>
                  <input
                    type="text"
                    defaultValue={modal.user.name}
                    onChange={(e) => setModal(prev => ({ ...prev, user: { ...prev.user, name: e.target.value } }))}
                    className="w-full p-2 border rounded border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white mb-4"
                  />
                  <button
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                    onClick={() => saveUpdate(modal.user.name)}
                  >
                    Save
                  </button>
                </>
              )}

              {modal.type === "delete" && (
                <>
                  <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Delete User</h2>
                  <p>Are you sure you want to delete <strong>{modal.user.name}</strong>?</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
                      onClick={() => setModal({ type: "", user: null })}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                      onClick={confirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
