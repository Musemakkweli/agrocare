import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSeedling, 
  faTasks,
  faCheckCircle,
  faUserCheck,
  faTrash,
  faPlus,
  faSearch,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import BASE_URL from "../config";

export default function LeaderDashboardUnique() {
  const [stats, setStats] = useState({
    totalPrograms: 0,
    activePrograms: 0,
    farmersEngaged: 0,
    seasonalTasksCompleted: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    criticalComplaints: 0
  });

  const [programs, setPrograms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [seasonalData, setSeasonalData] = useState([]);
  const [complaintTrends, setComplaintTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  // UI States
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 5;

  // Plant-based color palette - only 2 colors
  const colors = {
    primary: "#2D6A4F", // Deep forest green
    secondary: "#74C69D", // Soft sage green
    lightBg: "#E9F5E9", // Very light nude green
    mediumBg: "#D8E9D8", // Slightly darker nude green
    cardBg: "#F8FFF8", // Off-white with green tint
    text: "#1B3B2F", // Dark forest green for text
    border: "#B7D7B7", // Soft green border
    accent: "#40916C" // Medium green for accents
  };

  // Mock agronomists for assignment
  const agronomists = [
    { id: 1, name: "Alice Green", expertise: "Pest Management" },
    { id: 2, name: "Bob Brown", expertise: "Soil Science" },
    { id: 3, name: "Carol White", expertise: "Irrigation" },
    { id: 4, name: "David Black", expertise: "Crop Diseases" }
  ];

  // Fetch data from backend
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const programsResponse = await fetch(`${BASE_URL}/programs`);
      const programsData = programsResponse.ok ? await programsResponse.json() : [];
      
      const complaintsResponse = await fetch(`${BASE_URL}/complaints`);
      const complaintsData = complaintsResponse.ok ? await complaintsResponse.json() : [];

      const processedPrograms = programsData.length ? programsData : [
        { id: 1, name: "Soil Enrichment", farmers: 35, active: true, progress: 75 },
        { id: 2, name: "Crop Rotation Awareness", farmers: 25, active: false, progress: 45 },
        { id: 3, name: "Irrigation Check", farmers: 40, active: true, progress: 90 },
        { id: 4, name: "Pest Monitoring", farmers: 30, active: true, progress: 60 },
        { id: 5, name: "Seedling Distribution", farmers: 20, active: false, progress: 30 },
      ];
      
      const processedComplaints = complaintsData.length ? complaintsData : [
        { id: 1, title: "Pest infestation in maize", type: "Pest Attack", location: "Field A", status: "pending", priority: "high", created_at: "2026-02-20", description: "Pests damaging maize crops", assigned_to: null },
        { id: 2, title: "Goat ate crops", type: "Animal Damage", location: "Field B", status: "in_progress", priority: "normal", created_at: "2026-02-19", description: "Goat entered field", assigned_to: "Alice Green" },
        { id: 3, title: "Irrigation system broken", type: "Infrastructure", location: "Field C", status: "pending", priority: "critical", created_at: "2026-02-18", description: "Pump not working", assigned_to: null },
        { id: 4, title: "Fertilizer shortage", type: "Supply", location: "Field D", status: "resolved", priority: "high", created_at: "2026-02-17", description: "Need fertilizer urgently", assigned_to: "Bob Brown" },
        { id: 5, title: "Disease outbreak", type: "Health", location: "Field E", status: "pending", priority: "critical", created_at: "2026-02-16", description: "Crops showing disease symptoms", assigned_to: null },
      ];

      setPrograms(processedPrograms);
      setComplaints(processedComplaints);

      setStats({
        totalPrograms: processedPrograms.length,
        activePrograms: processedPrograms.filter(p => p.active).length,
        farmersEngaged: processedPrograms.reduce((a, b) => a + (b.farmers || 0), 0),
        seasonalTasksCompleted: 8,
        pendingComplaints: processedComplaints.filter(c => c.status === "pending").length,
        resolvedComplaints: processedComplaints.filter(c => c.status === "resolved").length,
        criticalComplaints: processedComplaints.filter(c => c.priority === "critical").length
      });

      setComplaintTrends([
        { day: "Mon", complaints: 3, resolved: 2 },
        { day: "Tue", complaints: 5, resolved: 3 },
        { day: "Wed", complaints: 4, resolved: 4 },
        { day: "Thu", complaints: 6, resolved: 3 },
        { day: "Fri", complaints: 3, resolved: 5 },
        { day: "Sat", complaints: 2, resolved: 2 },
        { day: "Sun", complaints: 1, resolved: 1 }
      ]);

      setSeasonalData([
        { month: "Jan", tasks: 3, complaints: 5 },
        { month: "Feb", tasks: 5, complaints: 7 },
        { month: "Mar", tasks: 4, complaints: 4 },
        { month: "Apr", tasks: 6, complaints: 8 },
        { month: "May", tasks: 2, complaints: 3 },
        { month: "Jun", tasks: 7, complaints: 6 }
      ]);

      setFetchError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError("Failed to load data. Using sample data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle complaint assignment
  const handleAssignComplaint = () => {
    if (!assignTo || !selectedComplaint) return;
    
    setComplaints(complaints.map(c => 
      c.id === selectedComplaint.id 
        ? { ...c, assigned_to: assignTo, status: "in_progress" } 
        : c
    ));
    
    setShowAssignModal(false);
    setSelectedComplaint(null);
    setAssignTo("");
  };

  // Handle complaint resolution
  const handleResolveComplaint = () => {
    if (!selectedComplaint) return;
    
    setComplaints(complaints.map(c => 
      c.id === selectedComplaint.id 
        ? { ...c, status: "resolved", resolution_notes: resolutionNotes, resolved_at: new Date().toISOString() } 
        : c
    ));
    
    setShowResolveModal(false);
    setSelectedComplaint(null);
    setResolutionNotes("");
  };

  // Handle complaint deletion
  const handleDeleteComplaint = (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      setComplaints(complaints.filter(c => c.id !== id));
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    const matchesPriority = filterPriority === "all" || c.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);
  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);

  // Get priority badge with plant colors
  const getPriorityBadge = (priority) => {
    switch(priority) {
      case "critical": return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold border border-red-200">Critical</span>;
      case "high": return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold border border-orange-200">High</span>;
      case "normal": return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-200">Normal</span>;
      case "low": return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold border border-green-200">Low</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold border border-gray-200">{priority}</span>;
    }
  };

  // Get status badge with plant colors
  const getStatusBadge = (status) => {
    switch(status) {
      case "pending": return <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold border border-amber-200">Pending</span>;
      case "in_progress": return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-200">In Progress</span>;
      case "resolved": return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-200">Resolved</span>;
      case "rejected": return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold border border-red-200">Rejected</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold border border-gray-200">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D6A4F] mx-auto"></div>
          <p className="mt-4 text-[#1B3B2F]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen space-y-6" style={{ backgroundColor: colors.lightBg }}>
      
      {/* Header with Refresh */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
          Leader Dashboard
        </h1>
        <button
          onClick={fetchData}
          className="px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition hover:shadow-md"
          style={{ backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.text }}
        >
          <FontAwesomeIcon icon={faSync} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {fetchError && (
        <div className="p-4 rounded-lg border-l-4" style={{ backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }}>
          <p style={{ color: '#92400E' }}>{fetchError}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: colors.border }}>
        {["overview", "complaints", "programs"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 font-medium capitalize transition relative"
            style={{ 
              color: activeTab === tab ? colors.primary : '#6B7280',
              borderBottom: activeTab === tab ? `2px solid ${colors.primary}` : 'none'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              label="Total Programs"
              value={stats.totalPrograms}
              icon={faSeedling}
              color={colors.primary}
              bgColor={colors.mediumBg}
              trend="+2 this month"
            />
            <StatsCard
              label="Active Programs"
              value={stats.activePrograms}
              icon={faTasks}
              color={colors.accent}
              bgColor={colors.mediumBg}
              trend={`${Math.round(stats.activePrograms/stats.totalPrograms*100)}% active`}
            />
            <StatsCard
              label="Farmers Engaged"
              value={stats.farmersEngaged}
              icon={faUserCheck}
              color={colors.primary}
              bgColor={colors.mediumBg}
              trend="+45 new"
            />
            <StatsCard
              label="Tasks Completed"
              value={stats.seasonalTasksCompleted}
              icon={faCheckCircle}
              color={colors.accent}
              bgColor={colors.mediumBg}
              trend="This season"
            />
          </div>

          {/* Complaint Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl shadow-md border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
              <p className="text-sm" style={{ color: '#6B7280' }}>Pending Complaints</p>
              <p className="text-2xl font-bold" style={{ color: '#D97706' }}>{stats.pendingComplaints}</p>
              <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Need attention</p>
            </div>
            <div className="p-4 rounded-xl shadow-md border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
              <p className="text-sm" style={{ color: '#6B7280' }}>Resolved Complaints</p>
              <p className="text-2xl font-bold" style={{ color: colors.primary }}>{stats.resolvedComplaints}</p>
              <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>This week</p>
            </div>
            <div className="p-4 rounded-xl shadow-md border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
              <p className="text-sm" style={{ color: '#6B7280' }}>Critical Issues</p>
              <p className="text-2xl font-bold" style={{ color: '#DC2626' }}>{stats.criticalComplaints}</p>
              <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Urgent action needed</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Complaint Trends */}
            <div className="p-4 rounded-xl shadow-md border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
                Complaint Trends
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={complaintTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis dataKey="day" stroke={colors.text} />
                  <YAxis stroke={colors.text} />
                  <Tooltip contentStyle={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }} />
                  <Legend />
                  <Line type="monotone" dataKey="complaints" stroke="#D97706" strokeWidth={2} />
                  <Line type="monotone" dataKey="resolved" stroke={colors.primary} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Priority Distribution */}
            <div className="p-4 rounded-xl shadow-md border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
                Complaints by Priority
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Critical", value: complaints.filter(c => c.priority === "critical").length },
                      { name: "High", value: complaints.filter(c => c.priority === "high").length },
                      { name: "Normal", value: complaints.filter(c => c.priority === "normal").length },
                      { name: "Low", value: complaints.filter(c => c.priority === "low").length }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    label
                  >
                    <Cell fill="#DC2626" />
                    <Cell fill="#F97316" />
                    <Cell fill="#3B82F6" />
                    <Cell fill={colors.secondary} />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Complaints Preview */}
          <div className="p-4 rounded-xl shadow-md border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
                Recent Complaints
              </h2>
              <button
                onClick={() => setActiveTab("complaints")}
                className="text-sm hover:underline"
                style={{ color: colors.primary }}
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {complaints.slice(0, 3).map(complaint => (
                <div key={complaint.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: colors.mediumBg, borderColor: colors.border }}>
                  <div>
                    <p className="font-medium" style={{ color: colors.text }}>{complaint.title}</p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>{complaint.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(complaint.priority)}
                    {getStatusBadge(complaint.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* COMPLAINTS TAB */}
      {activeTab === "complaints" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Filters and Search */}
          <div className="p-4 rounded-xl shadow-md border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3" style={{ color: '#9CA3AF' }} />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: colors.lightBg, 
                    borderColor: colors.border,
                    color: colors.text
                  }}
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.lightBg, 
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.lightBg, 
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => window.location.href = "/report-complaint"}
                className="px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition hover:shadow-md"
                style={{ backgroundColor: colors.primary, color: 'white' }}
              >
                <FontAwesomeIcon icon={faPlus} />
                New Complaint
              </button>
            </div>
          </div>

          {/* Complaints List */}
          <div className="space-y-3">
            {currentComplaints.length === 0 ? (
              <div className="p-8 rounded-xl text-center border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <p style={{ color: '#6B7280' }}>No complaints found</p>
              </div>
            ) : (
              currentComplaints.map(complaint => (
                <motion.div
                  key={complaint.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-xl shadow-md border hover:shadow-lg transition"
                  style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold" style={{ color: colors.text }}>
                          {complaint.title}
                        </h3>
                        {getPriorityBadge(complaint.priority)}
                        {getStatusBadge(complaint.status)}
                      </div>
                      <p className="text-sm mb-2" style={{ color: '#4B5563' }}>
                        {complaint.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span style={{ color: '#6B7280' }}>
                          📍 {complaint.location}
                        </span>
                        <span style={{ color: '#6B7280' }}>
                          📅 {new Date(complaint.created_at).toLocaleDateString()}
                        </span>
                        {complaint.assigned_to && (
                          <span style={{ color: '#6B7280' }}>
                            👤 Assigned: {complaint.assigned_to}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowAssignModal(true);
                        }}
                        className="px-3 py-1 rounded-lg text-sm transition hover:shadow"
                        style={{ backgroundColor: colors.mediumBg, color: colors.primary }}
                        disabled={complaint.status === "resolved"}
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowResolveModal(true);
                        }}
                        className="px-3 py-1 rounded-lg text-sm transition hover:shadow"
                        style={{ backgroundColor: colors.primary, color: 'white' }}
                        disabled={complaint.status === "resolved"}
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleDeleteComplaint(complaint.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm transition"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredComplaints.length > complaintsPerPage && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 transition"
                style={{ borderColor: colors.border, color: colors.text }}
              >
                Previous
              </button>
              <span className="px-3 py-1" style={{ color: colors.text }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 transition"
                style={{ borderColor: colors.border, color: colors.text }}
              >
                Next
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* PROGRAMS TAB */}
      {activeTab === "programs" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map(program => (
              <div
                key={program.id}
                className="p-6 rounded-xl shadow-md border hover:shadow-lg transition"
                style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
              >
                <h3 className="font-semibold text-lg mb-2" style={{ color: colors.text }}>
                  {program.name}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#6B7280' }}>Farmers:</span>
                    <span className="font-medium" style={{ color: colors.text }}>
                      {program.farmers}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#6B7280' }}>Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                      program.active 
                        ? "bg-green-100 text-green-800 border-green-200" 
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }`}>
                      {program.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: '#6B7280' }}>Progress</span>
                      <span style={{ color: colors.text }}>{program.progress || 0}%</span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ backgroundColor: colors.mediumBg }}>
                      <div
                        className="rounded-full h-2 transition-all duration-500"
                        style={{ width: `${program.progress || 0}%`, backgroundColor: colors.primary }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Seasonal Tasks Chart */}
          <div className="p-4 rounded-xl shadow-md border mt-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
              Monthly Progress
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis dataKey="month" stroke={colors.text} />
                <YAxis stroke={colors.text} />
                <Tooltip contentStyle={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }} />
                <Legend />
                <Bar dataKey="tasks" fill={colors.primary} name="Tasks" />
                <Bar dataKey="complaints" fill={colors.secondary} name="Complaints" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* ASSIGN MODAL */}
      <AnimatePresence>
        {showAssignModal && selectedComplaint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAssignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="p-6 rounded-xl w-full max-w-md border shadow-xl"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Assign Complaint</h2>
              <p className="mb-4" style={{ color: '#6B7280' }}>
                Assigning: <span className="font-semibold" style={{ color: colors.text }}>{selectedComplaint.title}</span>
              </p>
              <select
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.lightBg, 
                  borderColor: colors.border,
                  color: colors.text
                }}
              >
                <option value="">Select agronomist</option>
                {agronomists.map(a => (
                  <option key={a.id} value={a.name}>
                    {a.name} - {a.expertise}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-lg transition"
                  style={{ backgroundColor: colors.mediumBg, color: colors.text }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignComplaint}
                  disabled={!assignTo}
                  className="px-4 py-2 text-white rounded-lg transition disabled:opacity-50"
                  style={{ backgroundColor: colors.primary }}
                >
                  Assign
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESOLVE MODAL */}
      <AnimatePresence>
        {showResolveModal && selectedComplaint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowResolveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="p-6 rounded-xl w-full max-w-md border shadow-xl"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Resolve Complaint</h2>
              <p className="mb-4" style={{ color: '#6B7280' }}>
                Resolving: <span className="font-semibold" style={{ color: colors.text }}>{selectedComplaint.title}</span>
              </p>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Add resolution notes..."
                rows="4"
                className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.lightBg, 
                  borderColor: colors.border,
                  color: colors.text
                }}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 rounded-lg transition"
                  style={{ backgroundColor: colors.mediumBg, color: colors.text }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveComplaint}
                  className="px-4 py-2 text-white rounded-lg transition"
                  style={{ backgroundColor: colors.primary }}
                >
                  Resolve
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Stats Card Component
function StatsCard({ label, value, icon, color, bgColor, trend }) {
  return (
    <div className="rounded-xl shadow-md p-6 hover:shadow-lg transition border" style={{ backgroundColor: bgColor, borderColor: '#B7D7B7' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
          <FontAwesomeIcon icon={icon} style={{ color }} className="text-xl" />
        </div>
        <span className="text-2xl font-bold" style={{ color: '#1B3B2F' }}>{value}</span>
      </div>
      <h3 className="text-sm" style={{ color: '#4B5563' }}>{label}</h3>
      <p className="text-xs mt-1" style={{ color: '#6B7280' }}>{trend}</p>
    </div>
  );
}