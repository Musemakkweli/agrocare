// pages/admin/AdminReports.jsx
import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "./AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faDownload, 
  faChevronDown, 
  faChevronUp,
  faFilter,
  faSync,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faFileAlt,
  faCalendarAlt,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import BASE_URL from "../config";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Helper function to get user display name
  const getUserDisplayName = (report) => {
    if (report.submitted_by?.full_name) {
      return report.submitted_by.full_name;
    }
    if (report.user_id) {
      return `User #${report.user_id}`;
    }
    return 'Anonymous';
  };

  // Fetch reports from backend - wrapped in useCallback
  const fetchReports = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      // Build query params
      let url = `${BASE_URL}/reports`;
      const params = new URLSearchParams();
      
      if (filterType !== "all") params.append("type", filterType);
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (dateRange.start) params.append("start_date", dateRange.start);
      if (dateRange.end) params.append("end_date", dateRange.end);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      
      // Add expanded state to each report and ensure data structure
      const reportsWithState = data.map(report => ({
        ...report,
        expanded: false,
        // Ensure submitted_by exists for compatibility
        submitted_by: report.submitted_by || (report.user_id ? { full_name: `User #${report.user_id}` } : null),
        // Ensure priority has a default
        priority: report.priority || 'normal',
        // Ensure status has a default
        status: report.status || 'pending'
      }));
      
      setReports(reportsWithState);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setFetchError(error.message);
      
      // Fallback to mock data if API fails
      const mockReports = [
        {
          id: 1,
          program: "Maize Pest Control Fund",
          type: "complaint",
          user_id: 101,
          submitted_by: { full_name: "John Farmer", role: "farmer" },
          created_at: "2026-01-25T10:30:00Z",
          status: "pending",
          description: "Pests are affecting maize crops in Huye District.",
          priority: "high",
          attachments: ["image1.jpg", "report.pdf"]
        },
        {
          id: 2,
          program: "Organic Fertilizer Initiative",
          type: "feedback",
          user_id: 102,
          submitted_by: { full_name: "Mary Farmer", role: "farmer" },
          created_at: "2026-01-26T14:20:00Z",
          status: "resolved",
          description: "Fertilizer delivery was timely and helpful.",
          priority: "low",
          resolution_notes: "Feedback noted and shared with team"
        },
        {
          id: 3,
          program: "Irrigation Expansion Program",
          type: "complaint",
          user_id: 103,
          submitted_by: { full_name: "Paul Farmer", role: "farmer" },
          created_at: "2026-01-27T09:15:00Z",
          status: "pending",
          description: "Irrigation system is not functional in Southern Province.",
          priority: "critical"
        },
      ];
      
      setReports(mockReports.map(r => ({ ...r, expanded: false })));
    } finally {
      setLoading(false);
    }
  }, [filterType, filterStatus, dateRange.start, dateRange.end]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Toggle expanded report
  const toggleExpand = (id) => {
    setReports(reports.map(r => r.id === id ? {...r, expanded: !r.expanded} : r));
  };

  // Filter reports based on search
  const filteredReports = reports.filter(r => {
    const userName = getUserDisplayName(r);
    const matchesSearch = 
      r.program?.toLowerCase().includes(search.toLowerCase()) ||
      userName.toLowerCase().includes(search.toLowerCase()) ||
      r.type?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = filterType === "all" || r.type === filterType;
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    
    // Date range filter
    let matchesDate = true;
    if (dateRange.start && dateRange.end && r.created_at) {
      const reportDate = new Date(r.created_at).toISOString().split('T')[0];
      matchesDate = reportDate >= dateRange.start && reportDate <= dateRange.end;
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // Download individual report as JSON
  const downloadReport = (report) => {
    const reportData = {
      id: report.id,
      program: report.program,
      type: report.type,
      user_id: report.user_id,
      submitted_by: report.submitted_by,
      created_at: report.created_at,
      status: report.status,
      description: report.description,
      priority: report.priority,
      attachments: report.attachments,
      resolution_notes: report.resolution_notes
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${report.program?.replace(/\s/g, "_") || 'report'}_${report.id}.json`;
    link.click();
  };

  // Download all reports as CSV
  const downloadAllCSV = () => {
    const headers = ["ID", "Program", "Type", "User ID", "Submitted By", "Date", "Status", "Priority", "Description"];
    const rows = filteredReports.map(r => [
      r.id,
      r.program,
      r.type,
      r.user_id || 'N/A',
      getUserDisplayName(r),
      r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A',
      r.status,
      r.priority || 'normal',
      r.description
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all reports as PDF
  const downloadAllPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID", "Program", "Type", "User", "Date", "Status", "Priority"];
    const tableRows = filteredReports.map(r => [
      r.id,
      r.program,
      r.type,
      getUserDisplayName(r),
      r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A',
      r.status,
      r.priority || 'normal'
    ]);
    
    doc.text("Reports Summary", 14, 15);
    doc.autoTable({ 
      head: [tableColumn], 
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 }
    });
    
    doc.save(`reports_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
          <FontAwesomeIcon icon={faClock} />
          Pending
        </span>;
      case 'resolved':
        return <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          <FontAwesomeIcon icon={faCheckCircle} />
          Resolved
        </span>;
      case 'rejected':
        return <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          Rejected
        </span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status || 'pending'}</span>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'critical':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Critical</span>;
      case 'high':
        return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">High</span>;
      case 'normal':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Normal</span>;
      case 'low':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Low</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Normal</span>;
    }
  };

  // Stats
  const stats = {
    total: filteredReports.length,
    pending: filteredReports.filter(r => r.status === 'pending').length,
    resolved: filteredReports.filter(r => r.status === 'resolved').length,
    critical: filteredReports.filter(r => r.priority === 'critical').length
  };

  if (loading) {
    return (
      <AdminLayout user={{ name: "Admin User", role: "Administrator" }}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading reports...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={{ name: "Admin User", role: "Administrator" }}>
      <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900 space-y-6">

        {/* Error Display */}
        {fetchError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
              <div>
                <p className="text-red-700 font-medium">Error loading reports</p>
                <p className="text-red-600 text-sm">{fetchError}</p>
              </div>
            </div>
            <button
              onClick={fetchReports}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* HEADER with Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <FontAwesomeIcon icon={faFileAlt} className="text-green-600" />
              Admin Reports
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and manage all reports and complaints
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={fetchReports}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSync} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={downloadAllCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faDownload} />
              Export CSV
            </button>
            <button
              onClick={downloadAllPDF}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faFileAlt} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-green-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Reports</p>
            <p className="text-2xl font-bold text-green-700">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-gray-500 dark:text-gray-400">Resolved</p>
            <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-red-500">
            <p className="text-sm text-gray-500 dark:text-gray-400">Critical</p>
            <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
            />
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faFilter} />
              Filters
              <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} />
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
                  >
                    <option value="all">All Types</option>
                    <option value="complaint">Complaints</option>
                    <option value="feedback">Feedback</option>
                    <option value="incident">Incidents</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* REPORTS LIST */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-12 text-center">
              <FontAwesomeIcon icon={faFileAlt} className="text-5xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No reports found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredReports.map((r, idx) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-lg transition"
              >
                <div 
                  className="p-4 cursor-pointer" 
                  onClick={() => toggleExpand(r.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-lg font-semibold text-green-700 dark:text-green-300">
                          {r.program || `Report #${r.id}`}
                        </h2>
                        {getPriorityBadge(r.priority)}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                          <FontAwesomeIcon icon={faFileAlt} className="text-green-500" />
                          {r.type}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                          <FontAwesomeIcon icon={faUser} className="text-green-500" />
                          {getUserDisplayName(r)}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500" />
                          {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                        {getStatusBadge(r.status)}
                      </div>
                    </div>
                    
                    <FontAwesomeIcon 
                      icon={r.expanded ? faChevronUp : faChevronDown} 
                      className="text-gray-500 dark:text-gray-400 ml-auto md:ml-0"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {r.expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-4 space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                          <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg">
                            {r.description}
                          </p>
                        </div>

                        {r.user_id && !r.submitted_by?.full_name && (
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">User ID</h3>
                            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg">
                              #{r.user_id}
                            </p>
                          </div>
                        )}

                        {r.resolution_notes && (
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Resolution Notes</h3>
                            <p className="text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                              {r.resolution_notes}
                            </p>
                          </div>
                        )}

                        {r.attachments && r.attachments.length > 0 && (
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Attachments</h3>
                            <div className="flex flex-wrap gap-2">
                              {r.attachments.map((file, i) => (
                                <button
                                  key={i}
                                  className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 text-sm flex items-center gap-2"
                                >
                                  <FontAwesomeIcon icon={faFileAlt} />
                                  {file}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadReport(r);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-2"
                          >
                            <FontAwesomeIcon icon={faDownload} />
                            Download Report
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}