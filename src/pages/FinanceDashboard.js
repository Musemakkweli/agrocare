// FinanceDashboard.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faArrowUp,
  faArrowDown,
  faMoneyBillWave,
  faChartLine,
  faChartPie,
  faHistory,
  faDownload,
  faCalendar,
  faClock,
  faUsers,
  faFileInvoice,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function FinanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [financeData, setFinanceData] = useState({
    summary: {
      totalFunds: 0,
      disbursed: 0,
      pending: 0,
      available: 0
    },
    recentTransactions: [],
    fundDistribution: [],
    monthlyTrends: [],
    topRecipients: []
  });

  // Get logged-in user
  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      setUser(savedUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, []);

  // Fetch finance data
  useEffect(() => {
    const fetchFinanceData = async () => {
      setLoading(true);
      try {
        // Mock data for now - replace with actual API calls
        setTimeout(() => {
          setFinanceData({
            summary: {
              totalFunds: 12500000,
              disbursed: 8750000,
              pending: 1250000,
              available: 2500000
            },
            recentTransactions: [
              { id: 1, description: "Farm Input Subsidy", farmer: "John Nkurunziza", amount: 250000, date: "2026-03-01", status: "completed" },
              { id: 2, description: "Irrigation Equipment", farmer: "Mary Uwimana", amount: 500000, date: "2026-02-28", status: "pending" },
              { id: 3, description: "Seed Purchase", farmer: "Alex Habimana", amount: 150000, date: "2026-02-27", status: "completed" },
              { id: 4, description: "Fertilizer Support", farmer: "Jean Mutoni", amount: 300000, date: "2026-02-26", status: "completed" },
              { id: 5, description: "Pest Control", farmer: "Alice Uwase", amount: 180000, date: "2026-02-25", status: "pending" }
            ],
            fundDistribution: [
              { name: "Farm Inputs", value: 3500000 },
              { name: "Equipment", value: 2800000 },
              { name: "Irrigation", value: 1500000 },
              { name: "Training", value: 950000 }
            ],
            monthlyTrends: [
              { month: "Jan", disbursed: 650000, allocated: 800000 },
              { month: "Feb", disbursed: 750000, allocated: 900000 },
              { month: "Mar", disbursed: 850000, allocated: 1000000 },
              { month: "Apr", disbursed: 700000, allocated: 850000 },
              { month: "May", disbursed: 900000, allocated: 1100000 },
              { month: "Jun", disbursed: 800000, allocated: 950000 }
            ],
            topRecipients: [
              { name: "John Nkurunziza", amount: 450000, count: 3 },
              { name: "Mary Uwimana", amount: 380000, count: 2 },
              { name: "Alex Habimana", amount: 320000, count: 2 },
              { name: "Jean Mutoni", amount: 280000, count: 2 }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching finance data:", error);
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Colors for pie chart - farm green palette
  const COLORS = ['#2E7D32', '#4CAF50', '#81C784', '#66BB6A', '#43A047'];

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your finance dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Finance Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, <span className="font-semibold text-green-600 dark:text-green-400">{user?.full_name || user?.name || "Finance Manager"}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
              <FontAwesomeIcon icon={faDownload} />
              Export Report
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Funds */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Funds</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {formatCurrency(financeData.summary.totalFunds)}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <FontAwesomeIcon icon={faWallet} className="text-xl text-green-600 dark:text-green-300" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-green-600 dark:text-green-400">
              <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
              <span>+12% from last month</span>
            </div>
          </div>

          {/* Disbursed */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Disbursed</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {formatCurrency(financeData.summary.disbursed)}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <FontAwesomeIcon icon={faArrowUp} className="text-xl text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-blue-600 dark:text-blue-400">
              <span>70% of total funds</span>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {formatCurrency(financeData.summary.pending)}
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                <FontAwesomeIcon icon={faClock} className="text-xl text-yellow-600 dark:text-yellow-300" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-yellow-600 dark:text-yellow-400">
              <span>Awaiting approval</span>
            </div>
          </div>

          {/* Available */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-l-4 border-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available Balance</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {formatCurrency(financeData.summary.available)}
                </p>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-xl text-emerald-600 dark:text-emerald-300" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-emerald-600 dark:text-emerald-400">
              <FontAwesomeIcon icon={faArrowDown} className="mr-1" />
              <span>20% of total funds</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends Line Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              <FontAwesomeIcon icon={faChartLine} className="mr-2 text-green-600" />
              Monthly Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={financeData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `${value/1000}K`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="allocated" stroke="#2E7D32" strokeWidth={2} />
                <Line type="monotone" dataKey="disbursed" stroke="#4CAF50" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Fund Distribution Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              <FontAwesomeIcon icon={faChartPie} className="mr-2 text-green-600" />
              Fund Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financeData.fundDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {financeData.fundDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              <FontAwesomeIcon icon={faHistory} className="mr-2 text-green-600" />
              Recent Transactions
            </h2>
            <button className="text-sm text-green-600 hover:text-green-700 flex items-center">
              View All <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Farmer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {financeData.recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-white">{transaction.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{transaction.farmer}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">{formatCurrency(transaction.amount)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{transaction.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                        {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Recipients */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            <FontAwesomeIcon icon={faUsers} className="mr-2 text-green-600" />
            Top Recipients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {financeData.topRecipients.map((recipient, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{recipient.name}</p>
                    <p className="text-sm text-green-600 dark:text-green-400">{formatCurrency(recipient.amount)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{recipient.count} transactions</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Average Transaction</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(185000)}</p>
              </div>
              <FontAwesomeIcon icon={faFileInvoice} className="text-3xl opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">This Month</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(2450000)}</p>
              </div>
              <FontAwesomeIcon icon={faCalendar} className="text-3xl opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">Beneficiaries</p>
                <p className="text-2xl font-bold mt-1">156</p>
              </div>
              <FontAwesomeIcon icon={faUsers} className="text-3xl opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}