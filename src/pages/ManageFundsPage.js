// ManageFundsPage.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faFilter,
  faDownload,
  faEdit,
  faTrash,
  faEye,
  faCalendar,
  faArrowUp,
  faArrowDown,
  faSort,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faEllipsisV
} from "@fortawesome/free-solid-svg-icons";

export default function ManageFundsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  // Mock funds data
  const [funds] = useState([
    {
      id: 1,
      name: "Farm Input Subsidy Program",
      description: "Providing seeds, fertilizers and farming inputs to smallholder farmers",
      amount: 2500000,
      allocated: 1850000,
      remaining: 650000,
      status: "active",
      category: "Inputs",
      startDate: "2026-01-15",
      endDate: "2026-12-31",
      beneficiaries: 85,
      donor: "World Bank",
      createdAt: "2026-01-10"
    },
    {
      id: 2,
      name: "Irrigation Equipment Fund",
      description: "Supporting farmers with water pumps and irrigation systems",
      amount: 1800000,
      allocated: 920000,
      remaining: 880000,
      status: "active",
      category: "Equipment",
      startDate: "2026-02-01",
      endDate: "2026-11-30",
      beneficiaries: 42,
      donor: "African Development Bank",
      createdAt: "2026-01-25"
    },
    {
      id: 3,
      name: "Training & Capacity Building",
      description: "Agricultural training programs for modern farming techniques",
      amount: 800000,
      allocated: 350000,
      remaining: 450000,
      status: "active",
      category: "Training",
      startDate: "2026-03-01",
      endDate: "2026-10-31",
      beneficiaries: 120,
      donor: "FAO",
      createdAt: "2026-02-15"
    },
    {
      id: 4,
      name: "Emergency Relief Fund",
      description: "Immediate support for farmers affected by drought and pests",
      amount: 3500000,
      allocated: 2800000,
      remaining: 700000,
      status: "active",
      category: "Emergency",
      startDate: "2026-01-05",
      endDate: "2026-06-30",
      beneficiaries: 210,
      donor: "UNDP",
      createdAt: "2026-01-02"
    },
    {
      id: 5,
      name: "Livestock Support Program",
      description: "Providing livestock and veterinary services",
      amount: 1200000,
      allocated: 450000,
      remaining: 750000,
      status: "pending",
      category: "Livestock",
      startDate: "2026-04-01",
      endDate: "2026-09-30",
      beneficiaries: 35,
      donor: "IFAD",
      createdAt: "2026-03-10"
    },
    {
      id: 6,
      name: "Post-Harvest Facilities",
      description: "Construction of storage facilities and processing centers",
      amount: 4200000,
      allocated: 0,
      remaining: 4200000,
      status: "draft",
      category: "Infrastructure",
      startDate: "2026-05-01",
      endDate: "2026-12-31",
      beneficiaries: 0,
      donor: "European Union",
      createdAt: "2026-03-15"
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
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch(category) {
      case 'Inputs':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'Equipment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Training':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Emergency':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Livestock':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'Infrastructure':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Filter and search funds
  const filteredFunds = funds.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fund.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fund.donor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || fund.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Sort funds
  const sortedFunds = [...filteredFunds].sort((a, b) => {
    if (sortConfig.key === "name") {
      return sortConfig.direction === "asc" 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortConfig.key === "amount") {
      return sortConfig.direction === "asc" 
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    if (sortConfig.key === "date") {
      return sortConfig.direction === "asc"
        ? new Date(a.startDate) - new Date(b.startDate)
        : new Date(b.startDate) - new Date(a.startDate);
    }
    if (sortConfig.key === "remaining") {
      return sortConfig.direction === "asc"
        ? a.remaining - b.remaining
        : b.remaining - a.remaining;
    }
    return 0;
  });

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedFunds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFunds = sortedFunds.slice(startIndex, startIndex + itemsPerPage);

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

  // Calculate summary stats
  const totalFunds = funds.reduce((sum, fund) => sum + fund.amount, 0);
  const totalAllocated = funds.reduce((sum, fund) => sum + fund.allocated, 0);
  const totalRemaining = funds.reduce((sum, fund) => sum + fund.remaining, 0);
  const activeFunds = funds.filter(f => f.status === "active").length;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Manage Funds
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and manage funding programs for farmers
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
          >
            <FontAwesomeIcon icon={faPlus} />
            Create New Fund
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-green-600 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Funds</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalFunds)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{funds.length} programs</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-blue-600 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-400">Allocated</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalAllocated)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{((totalAllocated/totalFunds)*100).toFixed(1)}% of total</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-emerald-600 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalRemaining)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{((totalRemaining/totalFunds)*100).toFixed(1)}% available</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-purple-600 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Programs</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{activeFunds}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Currently running</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search funds by name, description or donor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>
                <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition">
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          </div>
        </div>

        {/* Funds Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => requestSort("name")}
                      className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition"
                    >
                      Fund Name
                      <FontAwesomeIcon icon={getSortIcon("name")} size="sm" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => requestSort("amount")}
                      className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition"
                    >
                      Total Amount
                      <FontAwesomeIcon icon={getSortIcon("amount")} size="sm" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => requestSort("remaining")}
                      className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition"
                    >
                      Remaining
                      <FontAwesomeIcon icon={getSortIcon("remaining")} size="sm" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => requestSort("date")}
                      className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition"
                    >
                      Start Date
                      <FontAwesomeIcon icon={getSortIcon("date")} size="sm" />
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
                {paginatedFunds.map((fund) => (
                  <tr 
                    key={fund.id} 
                    className="hover:bg-green-50 dark:hover:bg-green-900/20 transition cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{fund.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Donor: {fund.donor}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(fund.category)}`}>
                        {fund.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(fund.amount)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{fund.beneficiaries} beneficiaries</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(fund.remaining)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-600 rounded-full"
                            style={{ width: `${(fund.allocated / fund.amount) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {((fund.allocated / fund.amount) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <FontAwesomeIcon icon={faCalendar} size="sm" className="text-gray-500" />
                        {formatDate(fund.startDate)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(fund.status)}`}>
                        {fund.status.charAt(0).toUpperCase() + fund.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 relative">
                      <button
                        onClick={() => toggleMenu(fund.id)}
                        className="p-2 hover:bg-green-100 dark:hover:bg-green-800 rounded-lg transition"
                      >
                        <FontAwesomeIcon icon={faEllipsisV} className="text-gray-600 dark:text-gray-400" />
                      </button>

                      {openMenuId === fund.id && (
                        <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => {
                              setSelectedFund(fund);
                              setShowViewModal(true);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 text-sm transition"
                          >
                            <FontAwesomeIcon icon={faEye} className="text-green-600" />
                            View
                          </button>
                          <button
                            onClick={() => {
                              // Handle edit
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 text-sm transition"
                          >
                            <FontAwesomeIcon icon={faEdit} className="text-green-600" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedFund(fund);
                              setShowDeleteModal(true);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-sm text-red-600 transition"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            Delete
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedFunds.length)} of {sortedFunds.length} funds
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

      {/* Add Fund Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Fund</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fund Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter fund name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter fund description"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Total Amount (RWF)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500">
                      <option>Select category</option>
                      <option>Inputs</option>
                      <option>Equipment</option>
                      <option>Training</option>
                      <option>Emergency</option>
                      <option>Livestock</option>
                      <option>Infrastructure</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Donor / Source
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter donor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500">
                    <option>Draft</option>
                    <option>Pending</option>
                    <option>Active</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Create Fund
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Fund Modal */}
      {showViewModal && selectedFund && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fund Details</h2>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedFund(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{selectedFund.name}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedFund.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(selectedFund.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(selectedFund.remaining)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                    <p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedFund.category)}`}>
                        {selectedFund.category}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedFund.status)}`}>
                        {selectedFund.status.charAt(0).toUpperCase() + selectedFund.status.slice(1)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedFund.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedFund.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Donor</p>
                    <p className="text-gray-900 dark:text-white">{selectedFund.donor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Beneficiaries</p>
                    <p className="text-gray-900 dark:text-white">{selectedFund.beneficiaries} farmers</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600 rounded-full"
                        style={{ width: `${(selectedFund.allocated / selectedFund.amount) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {((selectedFund.allocated / selectedFund.amount) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatCurrency(selectedFund.allocated)} allocated of {formatCurrency(selectedFund.amount)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedFund(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Edit Fund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedFund && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faTrash} className="text-red-600 text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Fund</h2>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Are you sure you want to delete <span className="font-semibold">{selectedFund.name}</span>?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                This action cannot be undone. All data associated with this fund will be permanently removed.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedFund(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle delete
                    setShowDeleteModal(false);
                    setSelectedFund(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete Fund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}