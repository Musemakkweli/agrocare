import React, { useState, useMemo, useEffect } from "react";
import {
  faEye,
  faSpinner,
  faExclamationTriangle,
  faDownload,
  faCheckCircle,
  faHourglassHalf,
  faClipboardList
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BASE_URL from "../config";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function LeaderAgronomistsPage() {
  const [agronomists, setAgronomists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [viewAgronomist, setViewAgronomist] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [districtFilter, setDistrictFilter] = useState("all");
  const [showComplaints, setShowComplaints] = useState(false);

  const itemsPerPage = 5;

  // Fetch agronomists from backend
  useEffect(() => {
    const fetchAgronomists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/agronomists?skip=0&limit=100`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch agronomists: ${response.status}`);
        }
        
        const data = await response.json();
        setAgronomists(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching agronomists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgronomists();
  }, []);

  // Get unique districts for filter
  const districts = useMemo(() => {
    const uniqueDistricts = [...new Set(agronomists.map(a => a.district).filter(Boolean))];
    return uniqueDistricts;
  }, [agronomists]);

  // Filter agronomists based on search and district
  const filteredAgronomists = useMemo(() => {
    if (!agronomists.length) return [];
    
    return agronomists.filter((a) => {
      const matchesSearch = `${a.name} ${a.email} ${a.phone} ${a.district} ${a.expertise}`
        .toLowerCase()
        .includes(search.toLowerCase());
      
      const matchesDistrict = districtFilter === "all" || a.district === districtFilter;
      
      return matchesSearch && matchesDistrict;
    });
  }, [agronomists, search, districtFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAgronomists.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgronomists = filteredAgronomists.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, districtFilter]);

  // Download data as CSV
  const downloadCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'District', 'Expertise', 'License', 'Status', 'Total Complaints', 'Resolved', 'Pending'];
    const rows = filteredAgronomists.map(a => [
      a.id,
      a.name,
      a.email,
      a.phone,
      a.district,
      a.expertise,
      a.license,
      a.is_approved ? 'Approved' : 'Pending',
      a.total_assigned_complaints,
      a.resolved_complaints,
      a.pending_complaints
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agronomists_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Download data as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.setTextColor(40, 80, 40);
    doc.text("Agronomists Directory", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    doc.autoTable({
      startY: 40,
      head: [['ID', 'Name', 'District', 'Expertise', 'Status', 'Complaints']],
      body: filteredAgronomists.map(a => [
        a.id,
        a.name,
        a.district,
        a.expertise,
        a.is_approved ? 'Approved' : 'Pending',
        `${a.resolved_complaints}/${a.total_assigned_complaints}`
      ]),
      headStyles: {
        fillColor: [40, 80, 40],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 245, 240]
      },
      styles: {
        fontSize: 10
      }
    });
    
    doc.save(`agronomists_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-green-800" />
          <span className="mt-4 text-green-800">Loading agronomists...</span>
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
              <h3 className="font-bold">Error loading agronomists</h3>
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
              Agronomists Directory
            </h2>
            <p className="text-green-700">
              Manage agronomists and their assigned complaints
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
              placeholder="Search by name, email, district, expertise..."
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

            {/* District filter */}
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="
                px-4 py-2 rounded-lg
                bg-white text-gray-900
                border border-green-300
                focus:outline-none focus:ring-2 focus:ring-green-500
                cursor-pointer
              "
            >
              <option value="all">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
            {filteredAgronomists.length} agronomists found
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-sm border border-green-200 bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-800 text-white">
                <th className="p-4 text-left font-medium">#</th>
                <th className="p-4 text-left font-medium">Agronomist</th>
                <th className="p-4 text-left font-medium">District</th>
                <th className="p-4 text-left font-medium">Expertise</th>
                <th className="p-4 text-left font-medium">Phone</th>
                <th className="p-4 text-left font-medium">Complaints</th>
                <th className="p-4 text-left font-medium">Status</th>
                <th className="p-4 text-left font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-green-200">
              {paginatedAgronomists.map((a, index) => (
                <tr
                  key={a.id}
                  className="hover:bg-green-50 transition-colors"
                >
                  <td className="p-4 text-green-900">
                    {startIndex + index + 1}
                  </td>

                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{a.name}</div>
                      <div className="text-sm text-gray-500">{a.email}</div>
                    </div>
                  </td>

                  <td className="p-4 text-gray-700">
                    {a.district || '-'}
                  </td>

                  <td className="p-4 text-gray-700">
                    {a.expertise || '-'}
                  </td>

                  <td className="p-4 text-gray-700">
                    {a.phone || '-'}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{a.total_assigned_complaints}</span>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-green-600" title="Resolved">
                          <FontAwesomeIcon icon={faCheckCircle} /> {a.resolved_complaints}
                        </span>
                        <span className="text-yellow-600" title="Pending">
                          <FontAwesomeIcon icon={faHourglassHalf} /> {a.pending_complaints}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        a.is_approved
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      }`}
                    >
                      {a.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => {
                        setViewAgronomist(a);
                        setShowComplaints(false);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-green-700 text-white hover:bg-green-800 transition text-sm"
                    >
                      <FontAwesomeIcon icon={faEye} size="sm" />
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedAgronomists.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-8 text-center text-green-600 bg-green-50"
                  >
                    <p>No agronomists found</p>
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
        {viewAgronomist && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
              {/* Modal header */}
              <div className="bg-green-800 p-4 sticky top-0">
                <h2 className="text-xl font-bold text-white">{viewAgronomist.name}</h2>
              </div>
              
              {/* Modal body */}
              <div className="p-6 space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{viewAgronomist.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{viewAgronomist.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">District</p>
                    <p className="font-medium text-gray-900">{viewAgronomist.district || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expertise</p>
                    <p className="font-medium text-gray-900">{viewAgronomist.expertise || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License</p>
                    <p className="font-medium text-gray-900">{viewAgronomist.license || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-medium ${
                      viewAgronomist.is_approved ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {viewAgronomist.is_approved ? 'Approved' : 'Pending Approval'}
                    </p>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Total Assigned</p>
                    <p className="text-2xl font-bold text-blue-800">{viewAgronomist.total_assigned_complaints}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Resolved</p>
                    <p className="text-2xl font-bold text-green-800">{viewAgronomist.resolved_complaints}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-800">{viewAgronomist.pending_complaints}</p>
                  </div>
                </div>

                {/* Toggle Complaints Button */}
                <button
                  onClick={() => setShowComplaints(!showComplaints)}
                  className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
                >
                  <FontAwesomeIcon icon={faClipboardList} />
                  {showComplaints ? 'Hide' : 'Show'} Assigned Complaints ({viewAgronomist.assigned_complaints.length})
                </button>

                {/* Assigned Complaints List */}
                {showComplaints && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900">Assigned Complaints</h3>
                    {viewAgronomist.assigned_complaints.length > 0 ? (
                      viewAgronomist.assigned_complaints.map(complaint => (
                        <div key={complaint.id} className="border border-green-200 rounded-lg p-4 hover:bg-green-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{complaint.title}</h4>
                              <p className="text-sm text-gray-600">Type: {complaint.type}</p>
                              <p className="text-sm text-gray-600">Location: {complaint.location}</p>
                              <p className="text-sm text-gray-600">Farmer: {complaint.farmer_name}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                              complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {complaint.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No complaints assigned</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Modal footer */}
              <div className="border-t border-gray-200 p-4 flex justify-end">
                <button
                  onClick={() => {
                    setViewAgronomist(null);
                    setShowComplaints(false);
                  }}
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