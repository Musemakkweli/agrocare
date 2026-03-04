// src/pages/DonorTransactions.js
import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFilter,
  faSearch,
  faFileInvoice,
  faReceipt,
  faCheckCircle,
  faClock,
  faSpinner,
  faTimesCircle,
  faPrint,
  faEnvelope,
  faChevronLeft,
  faChevronRight,
  faSort,
  faSortUp,
  faSortDown,
  faFilePdf,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
//import { Link } from "react-router-dom";

export default function DonorTransactions() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [stats, setStats] = useState({
    totalDonated: 0,
    totalTransactions: 0,
    averageDonation: 0,
    mostFrequentProgram: "",
    lastDonation: null,
    successRate: 0
  });

  // Define fetchTransactions using useCallback to memoize it
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      setTimeout(() => {
        const mockTransactions = [
          {
            id: "TXN-2026-001",
            date: "2026-03-15",
            program: "Farm Input Subsidy Program",
            programId: 1,
            amount: 2500000,
            currency: "RWF",
            status: "completed",
            paymentMethod: "Mobile Money",
            reference: "MM-2026-03-15-001",
            receipt: true,
            taxDeductible: true,
            description: "Support for 50 farmers with seeds and fertilizers",
            impact: {
              farmers: 50,
              acres: 75,
              expectedYield: "+85%"
            }
          },
          {
            id: "TXN-2026-002",
            date: "2026-03-10",
            program: "Irrigation Equipment Fund",
            programId: 2,
            amount: 1800000,
            currency: "RWF",
            status: "completed",
            paymentMethod: "Bank Transfer",
            reference: "BT-2026-03-10-002",
            receipt: true,
            taxDeductible: true,
            description: "Water pumps for 15 farming families",
            impact: {
              farmers: 15,
              acres: 30,
              expectedYield: "+40%"
            }
          },
          {
            id: "TXN-2026-003",
            date: "2026-03-05",
            program: "Training Program",
            programId: 3,
            amount: 950000,
            currency: "RWF",
            status: "completed",
            paymentMethod: "Credit Card",
            reference: "CC-2026-03-05-003",
            receipt: true,
            taxDeductible: true,
            description: "Workshop for 40 farmers on modern techniques",
            impact: {
              farmers: 40,
              training: "3 days",
              certification: true
            }
          },
          {
            id: "TXN-2026-004",
            date: "2026-02-28",
            program: "Emergency Relief",
            programId: 4,
            amount: 3000000,
            currency: "RWF",
            status: "completed",
            paymentMethod: "Bank Transfer",
            reference: "BT-2026-02-28-004",
            receipt: true,
            taxDeductible: true,
            description: "Emergency support for flood-affected farmers",
            impact: {
              farmers: 120,
              households: 85,
              emergency: "Food & seeds"
            }
          },
          {
            id: "TXN-2026-005",
            date: "2026-02-20",
            program: "Livestock Support",
            programId: 5,
            amount: 1200000,
            currency: "RWF",
            status: "pending",
            paymentMethod: "Mobile Money",
            reference: "MM-2026-02-20-005",
            receipt: false,
            taxDeductible: true,
            description: "Goats and chickens for 25 families",
            impact: {
              families: 25,
              livestock: "50 goats, 100 chickens"
            }
          },
          {
            id: "TXN-2026-006",
            date: "2026-02-15",
            program: "Farm Input Subsidy Program",
            programId: 1,
            amount: 1500000,
            currency: "RWF",
            status: "completed",
            paymentMethod: "Mobile Money",
            reference: "MM-2026-02-15-006",
            receipt: true,
            taxDeductible: true,
            description: "Additional fertilizer support",
            impact: {
              farmers: 30,
              acres: 45
            }
          },
          {
            id: "TXN-2026-007",
            date: "2026-02-10",
            program: "Training Program",
            programId: 3,
            amount: 500000,
            currency: "RWF",
            status: "failed",
            paymentMethod: "Credit Card",
            reference: "CC-2026-02-10-007",
            receipt: false,
            taxDeductible: true,
            description: "Workshop materials",
            failureReason: "Insufficient funds"
          },
          {
            id: "TXN-2026-008",
            date: "2026-02-05",
            program: "Irrigation Equipment Fund",
            programId: 2,
            amount: 2200000,
            currency: "RWF",
            status: "completed",
            paymentMethod: "Bank Transfer",
            reference: "BT-2026-02-05-008",
            receipt: true,
            taxDeductible: true,
            description: "Drip irrigation systems",
            impact: {
              farmers: 20,
              acres: 40,
              waterSaving: "40%"
            }
          },
          {
            id: "TXN-2026-009",
            date: "2026-01-28",
            program: "Emergency Relief",
            programId: 4,
            amount: 1000000,
            currency: "RWF",
            status: "completed",
            paymentMethod: "Mobile Money",
            reference: "MM-2026-01-28-009",
            receipt: true,
            taxDeductible: true,
            description: "Emergency seeds",
            impact: {
              farmers: 45,
              acres: 60
            }
          },
          {
            id: "TXN-2026-010",
            date: "2026-01-20",
            program: "Farm Input Subsidy Program",
            programId: 1,
            amount: 3500000,
            currency: "RWF",
            status: "processing",
            paymentMethod: "Bank Transfer",
            reference: "BT-2026-01-20-010",
            receipt: false,
            taxDeductible: true,
            description: "Bulk fertilizer purchase",
            impact: {
              farmers: 70,
              acres: 105
            }
          },
          {
            id: "TXN-2026-011",
            date: "2026-01-15",
            program: "Livestock Support",
            programId: 5,
            amount: 800000,
            currency: "RWF",
            status: "completed",
            paymentMethod: "Mobile Money",
            reference: "MM-2026-01-15-011",
            receipt: true,
            taxDeductible: true,
            description: "Vaccinations and feed",
            impact: {
              animals: 150,
              farmers: 20
            }
          },
          {
            id: "TXN-2026-012",
            date: "2026-01-10",
            program: "Training Program",
            programId: 3,
            amount: 600000,
            currency: "RWF",
            status: "completed",
            paymentMethod: "Credit Card",
            reference: "CC-2026-01-10-012",
            receipt: true,
            taxDeductible: true,
            description: "Advanced farming techniques",
            impact: {
              farmers: 25,
              certification: true
            }
          }
        ];

        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
        calculateStats(mockTransactions);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  }, []);

  // Call fetchTransactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const calculateStats = (transactions) => {
    const completed = transactions.filter(t => t.status === "completed");
    const totalDonated = completed.reduce((sum, t) => sum + t.amount, 0);
    const totalTransactions = transactions.length;
    const averageDonation = completed.length > 0 ? totalDonated / completed.length : 0;
    
    // Most frequent program
    const programCount = {};
    transactions.forEach(t => {
      programCount[t.program] = (programCount[t.program] || 0) + 1;
    });
    const mostFrequentProgram = Object.keys(programCount).reduce((a, b) => 
      programCount[a] > programCount[b] ? a : b, "");

    // Last donation
    const sortedByDate = [...transactions].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    const lastDonation = sortedByDate.find(t => t.status === "completed") || null;

    // Success rate
    const successRate = (completed.length / totalTransactions) * 100;

    setStats({
      totalDonated,
      totalTransactions,
      averageDonation,
      mostFrequentProgram,
      lastDonation,
      successRate
    });
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = [...transactions];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch(dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(t => new Date(t.date) >= filterDate);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(t => new Date(t.date) >= filterDate);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(t => new Date(t.date) >= filterDate);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          filtered = filtered.filter(t => new Date(t.date) >= filterDate);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          filtered = filtered.filter(t => new Date(t.date) >= filterDate);
          break;
        default:
          break;
      }
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Program filter
    if (programFilter !== "all") {
      filtered = filtered.filter(t => t.programId === parseInt(programFilter));
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortConfig.key === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (sortConfig.key === "amount") {
        return sortConfig.direction === "asc" 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      }
      return 0;
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchTerm, dateRange, statusFilter, programFilter, sortConfig, transactions]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} className="text-gray-400" />;
    return sortConfig.direction === "asc" 
      ? <FontAwesomeIcon icon={faSortUp} className="text-green-600" />
      : <FontAwesomeIcon icon={faSortDown} className="text-green-600" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return {
          bg: 'bg-green-100 dark:bg-green-900',
          text: 'text-green-800 dark:text-green-200',
          icon: faCheckCircle,
          label: 'Completed'
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900',
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: faClock,
          label: 'Pending'
        };
      case 'processing':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900',
          text: 'text-blue-800 dark:text-blue-200',
          icon: faSpinner,
          label: 'Processing'
        };
      case 'failed':
        return {
          bg: 'bg-red-100 dark:bg-red-900',
          text: 'text-red-800 dark:text-red-200',
          icon: faTimesCircle,
          label: 'Failed'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-800 dark:text-gray-200',
          icon: faClock,
          label: status
        };
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Unique programs for filter
  const programs = [...new Map(transactions.map(t => [t.programId, { id: t.programId, name: t.program }])).values()];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faFileInvoice} className="text-2xl text-green-200" />
                <span className="text-green-200 font-medium">Transaction History</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Donations</h1>
              <p className="text-green-100 text-lg">
                Track and manage all your contributions
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2">
                <FontAwesomeIcon icon={faDownload} />
                Export All
              </button>
              <button className="px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-green-50 transition flex items-center gap-2">
                <FontAwesomeIcon icon={faFilePdf} />
                Tax Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Donated</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalDonated)}</p>
            <p className="text-xs text-green-600 mt-1">Across {stats.totalTransactions} transactions</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Donation</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.averageDonation)}</p>
            <p className="text-xs text-gray-500 mt-1">Per completed transaction</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.successRate.toFixed(1)}%</p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-green-600 rounded-full" style={{ width: `${stats.successRate}%` }}></div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-400">Most Supported</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white truncate">{stats.mostFrequentProgram}</p>
            <p className="text-xs text-gray-500 mt-1">Favorite program</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-400">Last Donation</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.lastDonation ? formatDate(stats.lastDonation.date) : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stats.lastDonation?.program || ''}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by program, ID, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faFilter} />
                <span className="hidden md:inline">More Filters</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilterPanel && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Program
                  </label>
                  <select
                    value={programFilter}
                    onChange={(e) => setProgramFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Programs</option>
                    {programs.map(program => (
                      <option key={program.id} value={program.id}>{program.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>All Methods</option>
                    <option>Mobile Money</option>
                    <option>Bank Transfer</option>
                    <option>Credit Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date {getSortIcon("date")}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Program
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("amount")}
                  >
                    <div className="flex items-center gap-1">
                      Amount {getSortIcon("amount")}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentItems.map((transaction) => {
                  const status = getStatusBadge(transaction.status);
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{transaction.id}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Ref: {transaction.reference}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.program}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.description.substring(0, 30)}...</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                          <FontAwesomeIcon icon={status.icon} className="text-xs" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {transaction.paymentMethod}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowReceiptModal(true);
                            }}
                            className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            title="View Receipt"
                          >
                            <FontAwesomeIcon icon={faReceipt} />
                          </button>
                          <button
                            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Print"
                          >
                            <FontAwesomeIcon icon={faPrint} />
                          </button>
                          <button
                            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            title="Email Receipt"
                          >
                            <FontAwesomeIcon icon={faEnvelope} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredTransactions.length)}
              </span>{' '}
              of <span className="font-medium">{filteredTransactions.length}</span> transactions
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <span className="px-3 py-1 bg-green-600 text-white rounded-lg">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            <FontAwesomeIcon icon={faChartLine} className="mr-2 text-green-600" />
            Your Impact Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Farmers Supported</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,250+</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Programs Supported</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8 Programs</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tax Deductible Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalDonated)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receipts Available</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {transactions.filter(t => t.receipt).length}/{transactions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Donation Receipt</h2>
                <button
                  onClick={() => {
                    setShowReceiptModal(false);
                    setSelectedTransaction(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6">
                {/* Receipt Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">Donor Portal</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Official Donation Receipt</p>
                </div>

                {/* Receipt Details */}
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Receipt Number:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">RCP-{selectedTransaction.id}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.id}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(selectedTransaction.date)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Program:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.program}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(selectedTransaction.amount)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.paymentMethod}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Reference:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.reference}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Tax Deductible:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {selectedTransaction.taxDeductible ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                {/* Impact Summary */}
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Impact Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(selectedTransaction.impact || {}).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{key}: </span>
                        <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                  <p>This is an electronically generated receipt and is valid without signature.</p>
                  <p className="mt-1">For any queries, contact support@donorportal.com</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faDownload} />
                  Download PDF
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faPrint} />
                  Print
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
                  <FontAwesomeIcon icon={faEnvelope} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}