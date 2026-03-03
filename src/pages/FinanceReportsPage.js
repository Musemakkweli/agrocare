// FinanceReportsPage.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faFilePdf,
  faFileExcel,
  faFileCsv,
  faPrint,
  faEnvelope,
  faChartLine,
  faChartPie,
  faChartBar,
  faEye,
  faSync,
  faFileInvoice,
  faUsers,
  faDollarSign,
  faTractor,
  faSeedling,
  faWater,
  faShoppingCart,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";

export default function FinanceReportsPage() {
  const [activeTab, setActiveTab] = useState("summary");
  const [dateRange, setDateRange] = useState({
    start: "2026-01-01",
    end: "2026-03-31"
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState("monthly");

  // Mock report data
  const reports = [
    {
      id: 1,
      name: "Monthly Financial Summary",
      type: "summary",
      period: "Monthly",
      lastGenerated: "2026-03-15",
      description: "Overview of all financial activities including income, expenses, and balances",
      icon: faChartLine,
      color: "green"
    },
    {
      id: 2,
      name: "Fund Utilization Report",
      type: "utilization",
      period: "Quarterly",
      lastGenerated: "2026-03-10",
      description: "Detailed analysis of how funds are being utilized across different programs",
      icon: faChartPie,
      color: "blue"
    },
    {
      id: 3,
      name: "Disbursement Analysis",
      type: "disbursement",
      period: "Monthly",
      lastGenerated: "2026-03-12",
      description: "Breakdown of all disbursements by category, farmer, and program",
      icon: faChartBar,
      color: "purple"
    },
    {
      id: 4,
      name: "Farmer Transaction History",
      type: "farmer",
      period: "Custom",
      lastGenerated: "2026-03-14",
      description: "Complete transaction history for individual farmers",
      icon: faUsers,
      color: "orange"
    },
    {
      id: 5,
      name: "Budget vs Actual",
      type: "budget",
      period: "Yearly",
      lastGenerated: "2026-01-05",
      description: "Compare budgeted amounts against actual expenditures",
      icon: faFileInvoice,
      color: "red"
    },
    {
      id: 6,
      name: "Donor Contribution Report",
      type: "donor",
      period: "Quarterly",
      lastGenerated: "2026-03-01",
      description: "Summary of contributions from various donors and funding sources",
      icon: faDollarSign,
      color: "emerald"
    }
  ];

  // Mock chart data
  const monthlyData = [
    { month: "Jan", income: 8500000, expenses: 4200000, balance: 4300000 },
    { month: "Feb", income: 9200000, expenses: 5100000, balance: 4100000 },
    { month: "Mar", income: 7800000, expenses: 4800000, balance: 3000000 },
    { month: "Apr", income: 8900000, expenses: 5300000, balance: 3600000 },
    { month: "May", income: 9400000, expenses: 5900000, balance: 3500000 },
    { month: "Jun", income: 10200000, expenses: 6100000, balance: 4100000 }
  ];

  const categoryData = [
    { name: "Farm Inputs", value: 3500000, color: "#22c55e" },
    { name: "Equipment", value: 2800000, color: "#3b82f6" },
    { name: "Irrigation", value: 1500000, color: "#06b6d4" },
    { name: "Training", value: 950000, color: "#a855f7" },
    { name: "Emergency", value: 2100000, color: "#ef4444" }
  ];

  const fundUtilizationData = [
    { fund: "Input Subsidy", allocated: 5000000, utilized: 4200000, remaining: 800000 },
    { fund: "Irrigation", allocated: 3000000, utilized: 2100000, remaining: 900000 },
    { fund: "Training", allocated: 1500000, utilized: 950000, remaining: 550000 },
    { fund: "Emergency", allocated: 4000000, utilized: 3100000, remaining: 900000 },
    { fund: "Livestock", allocated: 2000000, utilized: 850000, remaining: 1150000 }
  ];

  const donorData = [
    { donor: "World Bank", amount: 8500000, percentage: 35 },
    { donor: "African Dev Bank", amount: 5200000, percentage: 21 },
    { donor: "FAO", amount: 3800000, percentage: 15 },
    { donor: "UNDP", amount: 4200000, percentage: 17 },
    { donor: "Government", amount: 3000000, percentage: 12 }
  ];

  const farmerActivityData = [
    { farmer: "John Nkurunziza", transactions: 8, total: 850000, average: 106250 },
    { farmer: "Mary Uwimana", transactions: 6, total: 720000, average: 120000 },
    { farmer: "Alex Habimana", transactions: 5, total: 480000, average: 96000 },
    { farmer: "Jean Mutoni", transactions: 7, total: 650000, average: 92857 },
    { farmer: "Alice Uwase", transactions: 4, total: 380000, average: 95000 }
  ];

  // Colors for pie chart
 // const PIE_COLORS = ['#22c55e', '#3b82f6', '#06b6d4', '#a855f7', '#ef4444'];

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

  // Handle report generation
  const generateReport = (report) => {
    setGenerating(true);
    setSelectedReport(report);
    
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      setShowPreviewModal(true);
    }, 2000);
  };

  // Calculate summary stats
  const totalIncome = monthlyData.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
  const currentBalance = monthlyData[monthlyData.length - 1].balance;
  const avgUtilization = (fundUtilizationData.reduce((sum, fund) => sum + (fund.utilized / fund.allocated * 100), 0) / fundUtilizationData.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Financial Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Generate and download comprehensive financial reports
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setGenerating(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSync} className={generating ? "animate-spin" : ""} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-green-600 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Income (YTD)</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalIncome)}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 12% from last year</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-red-600 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses (YTD)</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalExpenses)}</p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">↓ 8% from last year</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-blue-600 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(currentBalance)}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">As of {formatDate(dateRange.end)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-purple-600 hover:shadow-lg transition">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Fund Utilization</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{avgUtilization}%</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">Across all programs</p>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Report Period</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom Range</option>
              </select>
              
              {reportType === "custom" && (
                <>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <span className="text-gray-500 self-center">to</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab("summary")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === "summary"
                  ? "border-green-600 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Summary Reports
            </button>
            <button
              onClick={() => setActiveTab("financial")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === "financial"
                  ? "border-green-600 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Financial Analysis
            </button>
            <button
              onClick={() => setActiveTab("utilization")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === "utilization"
                  ? "border-green-600 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Fund Utilization
            </button>
            <button
              onClick={() => setActiveTab("farmer")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === "farmer"
                  ? "border-green-600 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Farmer Activity
            </button>
          </nav>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports
            .filter(report => 
              activeTab === "summary" ? report.type === "summary" :
              activeTab === "financial" ? ["disbursement", "budget", "donor"].includes(report.type) :
              activeTab === "utilization" ? report.type === "utilization" :
              activeTab === "farmer" ? report.type === "farmer" : true
            )
            .map((report) => (
              <div
                key={report.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition p-5 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-lg bg-${report.color}-100 dark:bg-${report.color}-900/20 flex items-center justify-center`}>
                    <FontAwesomeIcon icon={report.icon} className={`text-2xl text-${report.color}-600 dark:text-${report.color}-400`} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {report.period}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {report.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {report.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>Last generated: {formatDate(report.lastGenerated)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => generateReport(report)}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    Preview
                  </button>
                  <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition">
                    <FontAwesomeIcon icon={faFilePdf} />
                  </button>
                  <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition">
                    <FontAwesomeIcon icon={faFileExcel} />
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Income vs Expenses */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              <FontAwesomeIcon icon={faChartLine} className="mr-2 text-green-600" />
              Monthly Income vs Expenses
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `${value/1000}K`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Area type="monotone" dataKey="income" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              <FontAwesomeIcon icon={faChartPie} className="mr-2 text-green-600" />
              Expenses by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Fund Utilization */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              <FontAwesomeIcon icon={faChartBar} className="mr-2 text-green-600" />
              Fund Utilization
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fundUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="fund" stroke="#666" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#666" tickFormatter={(value) => `${value/1000}K`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="utilized" stackId="a" fill="#22c55e" />
                <Bar dataKey="remaining" stackId="a" fill="#d1d5db" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donor Contributions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-green-600" />
              Donor Contributions
            </h2>
            <div className="space-y-4">
              {donorData.map((donor, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {donor.donor}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(donor.amount)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: `${donor.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {donor.percentage}% of total
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Farmer Activity Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            <FontAwesomeIcon icon={faUsers} className="mr-2 text-green-600" />
            Top Farmers by Transaction Volume
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Farmer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Transactions</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Total Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {farmerActivityData.map((farmer, index) => (
                  <tr key={index} className="hover:bg-green-50 dark:hover:bg-green-900/20 transition">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{farmer.farmer}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{farmer.transactions}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{formatCurrency(farmer.total)}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatCurrency(farmer.average)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Program Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <FontAwesomeIcon icon={faSeedling} className="text-3xl opacity-80" />
              <span className="text-sm bg-white/20 px-2 py-1 rounded">Inputs</span>
            </div>
            <p className="text-2xl font-bold">3.5M RWF</p>
            <p className="text-sm text-green-100">75% utilized</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <FontAwesomeIcon icon={faTractor} className="text-3xl opacity-80" />
              <span className="text-sm bg-white/20 px-2 py-1 rounded">Equipment</span>
            </div>
            <p className="text-2xl font-bold">2.8M RWF</p>
            <p className="text-sm text-blue-100">62% utilized</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-600 to-cyan-500 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <FontAwesomeIcon icon={faWater} className="text-3xl opacity-80" />
              <span className="text-sm bg-white/20 px-2 py-1 rounded">Irrigation</span>
            </div>
            <p className="text-2xl font-bold">1.5M RWF</p>
            <p className="text-sm text-cyan-100">48% utilized</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <FontAwesomeIcon icon={faShoppingCart} className="text-3xl opacity-80" />
              <span className="text-sm bg-white/20 px-2 py-1 rounded">Emergency</span>
            </div>
            <p className="text-2xl font-bold">2.1M RWF</p>
            <p className="text-sm text-purple-100">82% utilized</p>
          </div>
        </div>
      </div>

      {/* Report Preview Modal */}
      {showPreviewModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedReport.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Period: {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setSelectedReport(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              {/* Report Preview Content */}
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalIncome)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalExpenses)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Net Balance</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(currentBalance)}</p>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Description</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Category</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">2026-03-15</td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">Farm Input Subsidy</td>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Inputs</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-white">250,000 RWF</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">2026-03-14</td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">Irrigation Equipment</td>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Equipment</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-white">500,000 RWF</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">2026-03-13</td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">Training Program</td>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Training</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-900 dark:text-white">150,000 RWF</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <td colSpan="3" className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Total</td>
                        <td className="px-4 py-2 text-sm font-bold text-right text-green-600">900,000 RWF</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Download Options */}
                <div className="flex flex-wrap gap-2 justify-end">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                    <FontAwesomeIcon icon={faFilePdf} />
                    PDF
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                    <FontAwesomeIcon icon={faFileExcel} />
                    Excel
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                    <FontAwesomeIcon icon={faFileCsv} />
                    CSV
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition flex items-center gap-2">
                    <FontAwesomeIcon icon={faPrint} />
                    Print
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition flex items-center gap-2">
                    <FontAwesomeIcon icon={faEnvelope} />
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {generating && !showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-900 dark:text-white font-medium">Generating Report...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please wait while we prepare your report</p>
          </div>
        </div>
      )}
    </div>
  );
}