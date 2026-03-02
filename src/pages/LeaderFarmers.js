import React, { useState, useMemo, useEffect } from "react";
import {
  faEye,
  faSpinner,
  faExclamationTriangle,
  faDownload
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BASE_URL from "../config";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function LeaderFarmersPage() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [viewFarmer, setViewFarmer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const itemsPerPage = 5;

  // Fetch farmers from backend
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/farmers?skip=0&limit=100`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch farmers: ${response.status}`);
        }
        
        const data = await response.json();
        setFarmers(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching farmers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  // Filter farmers based on search and status
  const filteredFarmers = useMemo(() => {
    if (!farmers.length) return [];
    
    return farmers.filter((f) => {
      const matchesSearch = `${f.name} ${f.location} ${f.phone}`
        .toLowerCase()
        .includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || f.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [farmers, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFarmers = filteredFarmers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Download data as CSV
  const downloadCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Location', 'Status', 'Complaints'];
    const rows = filteredFarmers.map(f => [
      f.id,
      f.name,
      f.phone,
      f.location,
      f.status,
      f.complaints
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `farmers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Download data as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40, 80, 40); // Dark green
    doc.text("Farmers Directory", 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Create table
    doc.autoTable({
      startY: 40,
      head: [['ID', 'Name', 'Phone', 'Location', 'Status', 'Complaints']],
      body: filteredFarmers.map(f => [
        f.id,
        f.name,
        f.phone,
        f.location,
        f.status,
        f.complaints
      ]),
      headStyles: {
        fillColor: [40, 80, 40], // Dark green
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 245, 240] // Very light green
      },
      styles: {
        fontSize: 10
      }
    });
    
    // Save PDF
    doc.save(`farmers_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-green-800" />
          <span className="mt-4 text-green-800">Loading farmers...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl mr-3 text-red-500" />
            <div>
              <h3 className="font-bold">Error loading farmers</h3>
              <p>{error}</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-green-900">
              Farmers Directory
            </h2>
            <p className="text-green-700">
              Farmers who have submitted complaints
            </p>
          </div>

          {/* Download buttons */}
          <div className="flex gap-2">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg transition"
            >
              <FontAwesomeIcon icon={faDownload} />
              CSV
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg transition"
            >
              <FontAwesomeIcon icon={faDownload} />
              PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-green-200">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search input */}
            <input
              type="text"
              placeholder="Search by name, location or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full sm:w-80 px-4 py-2 rounded-lg
                bg-white text-gray-900
                border border-green-300
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                placeholder:text-green-400
              "
            />

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="
                px-4 py-2 rounded-lg
                bg-white text-gray-900
                border border-green-300
                focus:outline-none focus:ring-2 focus:ring-green-500
                cursor-pointer
              "
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Results count */}
          <div className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
            {filteredFarmers.length} farmers found
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-sm border border-green-200 bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-800 text-white">
                <th className="p-4 text-left font-medium">#</th>
                <th className="p-4 text-left font-medium">Farmer</th>
                <th className="p-4 text-left font-medium">Location</th>
                <th className="p-4 text-left font-medium">Phone</th>
                <th className="p-4 text-left font-medium">Complaints</th>
                <th className="p-4 text-left font-medium">Status</th>
                <th className="p-4 text-left font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-green-200">
              {paginatedFarmers.map((f, index) => (
                <tr
                  key={f.id}
                  className="hover:bg-green-50 transition-colors"
                >
                  <td className="p-4 text-green-900">
                    {startIndex + index + 1}
                  </td>

                  <td className="p-4 font-medium text-gray-900">
                    {f.name}
                  </td>

                  <td className="p-4 text-gray-700">
                    {f.location}
                  </td>

                  <td className="p-4 text-gray-700">
                    {f.phone}
                  </td>

                  <td className="p-4 font-medium text-gray-900">
                    {f.complaints}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        f.status === "Active"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-gray-100 text-gray-800 border border-gray-300"
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => setViewFarmer(f)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-green-700 text-white hover:bg-green-800 transition text-sm"
                    >
                      <FontAwesomeIcon icon={faEye} size="sm" />
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedFarmers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-green-600 bg-green-50"
                  >
                    <p>No farmers found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border transition ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-green-700 border-green-300 hover:bg-green-50"
              }`}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg transition font-medium ${
                  currentPage === i + 1
                    ? "bg-green-800 text-white"
                    : "bg-white text-green-700 border border-green-300 hover:bg-green-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border transition ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-green-700 border-green-300 hover:bg-green-50"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* View Modal */}
        {viewFarmer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl">
              {/* Modal header */}
              <div className="bg-green-800 p-4">
                <h2 className="text-xl font-bold text-white">{viewFarmer.name}</h2>
              </div>
              
              {/* Modal body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{viewFarmer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{viewFarmer.location}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-medium ${
                      viewFarmer.status === "Active" ? "text-green-600" : "text-gray-600"
                    }`}>
                      {viewFarmer.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Complaints</p>
                    <p className="font-medium text-gray-900">{viewFarmer.complaints}</p>
                  </div>
                </div>
              </div>
              
              {/* Modal footer */}
              <div className="border-t border-gray-200 p-4 flex justify-end">
                <button
                  onClick={() => setViewFarmer(null)}
                  className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}