// FinanceTransactions.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faDownload,
  faEye,
  faCalendar,
  faArrowUp,
  faArrowDown,
  faSort,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faEllipsisV,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faUser,
  faDollarSign,
  faFileInvoice,
  faPrint,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";

export default function FinanceTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Mock transactions data
  const [transactions] = useState([
    {
      id: "TRX-001",
      date: "2026-03-15",
      description: "Farm Input Subsidy Payment",
      farmer: "John Nkurunziza",
      farmerId: "F-1024",
      fund: "Input Subsidy Program",
      amount: 250000,
      type: "disbursement",
      status: "completed",
      paymentMethod: "Bank Transfer",
      reference: "REF-2026-001",
      notes: "Payment for maize seeds and fertilizers"
    },
    {
      id: "TRX-002",
      date: "2026-03-14",
      description: "Irrigation Equipment Purchase",
      farmer: "Mary Uwimana",
      farmerId: "F-1025",
      fund: "Irrigation Fund",
      amount: 500000,
      type: "disbursement",
      status: "pending",
      paymentMethod: "Bank Transfer",
      reference: "REF-2026-002",
      notes: "Water pump and drip irrigation system"
    },
    {
      id: "TRX-003",
      date: "2026-03-14",
      description: "Training Program Fee",
      farmer: "Alex Habimana",
      farmerId: "F-1026",
      fund: "Training Fund",
      amount: 150000,
      type: "disbursement",
      status: "completed",
      paymentMethod: "Mobile Money",
      reference: "REF-2026-003",
      notes: "Modern farming techniques workshop"
    },
    {
      id: "TRX-004",
      date: "2026-03-13",
      description: "Emergency Relief Fund",
      farmer: "Jean Mutoni",
      farmerId: "F-1027",
      fund: "Emergency Fund",
      amount: 300000,
      type: "disbursement",
      status: "completed",
      paymentMethod: "Cash",
      reference: "REF-2026-004",
      notes: "Drought relief assistance"
    },
    {
      id: "TRX-005",
      date: "2026-03-13",
      description: "Donor Contribution - World Bank",
      farmer: "-",
      farmerId: "-",
      fund: "Input Subsidy Program",
      amount: 5000000,
      type: "receipt",
      status: "completed",
      paymentMethod: "Bank Transfer",
      reference: "DON-2026-001",
      notes: "Quarterly disbursement from World Bank"
    },
    {
      id: "TRX-006",
      date: "2026-03-12",
      description: "Pest Control Support",
      farmer: "Alice Uwase",
      farmerId: "F-1028",
      fund: "Emergency Fund",
      amount: 180000,
      type: "disbursement",
      status: "failed",
      paymentMethod: "Mobile Money",
      reference: "REF-2026-005",
      notes: "Payment for pest control chemicals"
    },
    {
      id: "TRX-007",
      date: "2026-03-11",
      description: "Livestock Support",
      farmer: "Peter Manzi",
      farmerId: "F-1029",
      fund: "Livestock Fund",
      amount: 350000,
      type: "disbursement",
      status: "pending",
      paymentMethod: "Bank Transfer",
      reference: "REF-2026-006",
      notes: "Purchase of 2 goats"
    },
    {
      id: "TRX-008",
      date: "2026-03-10",
      description: "Government Subsidy",
      farmer: "-",
      farmerId: "-",
      fund: "Input Subsidy Program",
      amount: 2500000,
      type: "receipt",
      status: "completed",
      paymentMethod: "Bank Transfer",
      reference: "GOV-2026-001",
      notes: "Monthly government subsidy allocation"
    }
  ]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Toggle action menu
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return faCheckCircle;
      case 'pending':
        return faClock;
      case 'failed':
        return faTimesCircle;
      default:
        return faClock;
    }
  };

  // Get transaction type badge
  const getTypeBadge = (type) => {
    switch(type) {
      case 'disbursement':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'receipt':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;
    
    // Type filter
    const matchesType = filterType === "all" || transaction.type === filterType;
    
    // Date range filter
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDate = transactionDate >= startDate && transactionDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // Calculate totals
  const totalDisbursed = filteredTransactions
    .filter(t => t.type === "disbursement" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalReceived = filteredTransactions
    .filter(t => t.type === "receipt" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const pendingAmount = filteredTransactions
    .filter(t => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortConfig.key === "date") {
      return sortConfig.direction === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    if (sortConfig.key === "amount") {
      return sortConfig.direction === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    if (sortConfig.key === "farmer") {
      return sortConfig.direction === "asc"
        ? a.farmer.localeCompare(b.farmer)
        : b.farmer.localeCompare(a.farmer);
    }
    return 0;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Handle sort
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return faSort;
    return sortConfig.direction === "asc" ? faArrowUp : faArrowDown;
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterType("all");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Transactions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and manage all financial transactions
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition flex items-center gap-2">
              <FontAwesomeIcon icon={faDownload} />
              Export
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition flex items-center gap-2">
              <FontAwesomeIcon icon={faPrint} />
              Print
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-green-600 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{filteredTransactions.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">In current view</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-blue-600 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Disbursed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalDisbursed)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Completed payments</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-purple-600 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Received</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalReceived)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">From donors/government</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-yellow-600 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending Amount</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(pendingAmount)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Awaiting processing</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, description, farmer or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faFilter} />
              Filters
              {(filterStatus !== "all" || filterType !== "all" || dateRange.start || dateRange.end) && (
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Types</option>
                    <option value="disbursement">Disbursement</option>
                    <option value="receipt">Receipt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {(filterStatus !== "all" || filterType !== "all" || dateRange.start || dateRange.end || searchTerm) && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => requestSort("date")}
                      className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition"
                    >
                      Date
                      <FontAwesomeIcon icon={getSortIcon("date")} size="sm" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => requestSort("farmer")}
                      className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition"
                    >
                      Farmer
                      <FontAwesomeIcon icon={getSortIcon("farmer")} size="sm" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Fund
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => requestSort("amount")}
                      className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition"
                    >
                      Amount
                      <FontAwesomeIcon icon={getSortIcon("amount")} size="sm" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedTransactions.map((transaction) => (
                  <tr 
                    key={transaction.id} 
                    className="hover:bg-green-50 dark:hover:bg-green-900/20 transition cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <FontAwesomeIcon icon={faCalendar} size="sm" className="text-gray-500" />
                        {formatDate(transaction.date)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-gray-900 dark:text-white">{transaction.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ref: {transaction.reference}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400 text-sm" />
                        <span className="text-sm text-gray-900 dark:text-white">{transaction.farmer}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{transaction.fund}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(transaction.type)}`}>
                        {transaction.type === "disbursement" ? "Payment" : "Receipt"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faDollarSign} className="text-gray-400 text-sm" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon 
                          icon={getStatusIcon(transaction.status)} 
                          className={`text-sm ${
                            transaction.status === "completed" ? "text-green-600" :
                            transaction.status === "pending" ? "text-yellow-600" :
                            "text-red-600"
                          }`}
                        />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 relative">
                      <button
                        onClick={() => toggleMenu(transaction.id)}
                        className="p-2 hover:bg-green-100 dark:hover:bg-green-800 rounded-lg transition"
                      >
                        <FontAwesomeIcon icon={faEllipsisV} className="text-gray-600 dark:text-gray-400" />
                      </button>

                      {openMenuId === transaction.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowViewModal(true);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 text-sm transition"
                          >
                            <FontAwesomeIcon icon={faEye} className="text-green-600" />
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              // Handle receipt
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 text-sm transition"
                          >
                            <FontAwesomeIcon icon={faFileInvoice} className="text-blue-600" />
                            Receipt
                          </button>
                          <button
                            onClick={() => {
                              // Handle email
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 text-sm transition"
                          >
                            <FontAwesomeIcon icon={faEnvelope} className="text-purple-600" />
                            Email
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedTransactions.length)} of {sortedTransactions.length} transactions
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <span className="px-3 py-1 bg-green-600 text-white rounded shadow-sm">
                    {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition"
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Transaction Modal */}
      {showViewModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction Details</h2>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedTransaction(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Status Banner */}
                <div className={`p-4 rounded-lg ${
                  selectedTransaction.status === "completed" ? "bg-green-50 dark:bg-green-900/20" :
                  selectedTransaction.status === "pending" ? "bg-yellow-50 dark:bg-yellow-900/20" :
                  "bg-red-50 dark:bg-red-900/20"
                }`}>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon 
                      icon={getStatusIcon(selectedTransaction.status)} 
                      className={`text-xl ${
                        selectedTransaction.status === "completed" ? "text-green-600" :
                        selectedTransaction.status === "pending" ? "text-yellow-600" :
                        "text-red-600"
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Transaction {selectedTransaction.status}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedTransaction.status === "completed" ? "This transaction has been processed successfully" :
                         selectedTransaction.status === "pending" ? "This transaction is awaiting processing" :
                         "This transaction failed to process"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transaction Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
                    <p className="font-mono text-gray-900 dark:text-white">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedTransaction.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                    <p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(selectedTransaction.type)}`}>
                        {selectedTransaction.type === "disbursement" ? "Disbursement" : "Receipt"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(selectedTransaction.amount)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                    <p className="text-gray-900 dark:text-white">{selectedTransaction.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Farmer</p>
                    <p className="text-gray-900 dark:text-white">{selectedTransaction.farmer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Farmer ID</p>
                    <p className="text-gray-900 dark:text-white">{selectedTransaction.farmerId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fund</p>
                    <p className="text-gray-900 dark:text-white">{selectedTransaction.fund}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                    <p className="text-gray-900 dark:text-white">{selectedTransaction.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reference</p>
                    <p className="font-mono text-gray-900 dark:text-white">{selectedTransaction.reference}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Notes</p>
                    <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {selectedTransaction.notes}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedTransaction(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                  <FontAwesomeIcon icon={faDownload} />
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}