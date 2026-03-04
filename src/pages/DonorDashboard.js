// DonorDashboard.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingHeart,
  faUsers,
  faSeedling,
  faChartLine,
  faChartPie,
  faDownload,
  faCheckCircle,
  faClock,
  faDollarSign,
  faArrowUp,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { Link } from "react-router-dom";

export default function DonorDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalDonated: 0,
      projectsSupported: 0,
      farmersReached: 0,
      activePrograms: 0,
      impactScore: 0
    },
    recentDonations: [],
    supportedPrograms: [],
    impactMetrics: [],
    monthlyContributions: [],
    topFarmers: [],
    distributionByCategory: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Get logged-in user
  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Mock data for now - replace with actual API calls
        setTimeout(() => {
          setDashboardData({
            stats: {
              totalDonated: 15000000,
              projectsSupported: 8,
              farmersReached: 1250,
              activePrograms: 5,
              impactScore: 92
            },
            recentDonations: [
              { id: 1, program: "Farm Input Subsidy", amount: 2500000, date: "2026-03-15", status: "completed" },
              { id: 2, program: "Irrigation Equipment", amount: 1800000, date: "2026-03-10", status: "completed" },
              { id: 3, program: "Training Program", amount: 950000, date: "2026-03-05", status: "completed" },
              { id: 4, program: "Emergency Relief", amount: 3000000, date: "2026-02-28", status: "completed" },
              { id: 5, program: "Livestock Support", amount: 1200000, date: "2026-02-20", status: "pending" }
            ],
            supportedPrograms: [
              { 
                id: 1, 
                name: "Farm Input Subsidy Program", 
                description: "Providing seeds and fertilizers to smallholder farmers",
                amount: 5000000,
                utilized: 4200000,
                remaining: 800000,
                beneficiaries: 450,
                status: "active",
                impact: "85% yield increase",
                startDate: "2026-01-15",
                endDate: "2026-12-31"
              },
              { 
                id: 2, 
                name: "Irrigation Equipment Fund", 
                description: "Water pumps and irrigation systems for dry regions",
                amount: 3000000,
                utilized: 2100000,
                remaining: 900000,
                beneficiaries: 120,
                status: "active",
                impact: "40% water efficiency",
                startDate: "2026-02-01",
                endDate: "2026-11-30"
              },
              { 
                id: 3, 
                name: "Training & Capacity Building", 
                description: "Modern farming techniques workshops",
                amount: 1500000,
                utilized: 950000,
                remaining: 550000,
                beneficiaries: 380,
                status: "active",
                impact: "60% knowledge gain",
                startDate: "2026-03-01",
                endDate: "2026-10-31"
              }
            ],
            impactMetrics: [
              { metric: "Food Security", value: 85, change: "+12%" },
              { metric: "Income Growth", value: 72, change: "+18%" },
              { metric: "Sustainable Practices", value: 78, change: "+15%" },
              { metric: "Community Engagement", value: 91, change: "+8%" }
            ],
            monthlyContributions: [
              { month: "Jan", amount: 1200000 },
              { month: "Feb", amount: 1800000 },
              { month: "Mar", amount: 2500000 },
              { month: "Apr", amount: 2100000 },
              { month: "May", amount: 2800000 },
              { month: "Jun", amount: 3200000 }
            ],
            topFarmers: [
              { name: "John Nkurunziza", contributions: 850000, programs: 3, village: "Gitarama" },
              { name: "Mary Uwimana", contributions: 720000, programs: 4, village: "Muhanga" },
              { name: "Alex Habimana", contributions: 650000, programs: 3, village: "Ruhango" },
              { name: "Jean Mutoni", contributions: 580000, programs: 2, village: "Kamonyi" },
              { name: "Alice Uwase", contributions: 490000, programs: 2, village: "Bugesera" }
            ],
            distributionByCategory: [
              { name: "Farm Inputs", value: 42 },
              { name: "Equipment", value: 25 },
              { name: "Training", value: 15 },
              { name: "Emergency", value: 12 },
              { name: "Livestock", value: 6 }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Colors for charts - farm green palette
  const COLORS = ['#2E7D32', '#4CAF50', '#81C784', '#66BB6A', '#43A047', '#388E3C'];

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

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your impact dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Welcome */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {user?.full_name || user?.name || 'Donor'}! 👋
              </h1>
              <p className="text-green-100 text-lg">
                Here's the impact of your generous contributions.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2">
                <FontAwesomeIcon icon={faDownload} />
                Impact Report
              </button>
            </div>
          </div>
        </div>

        {/* Impact Score Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overall Impact Score</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
                {dashboardData.stats.impactScore}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Based on program effectiveness</p>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="3"
                  strokeDasharray={`${dashboardData.stats.impactScore}, 100`}
                />
                <text x="18" y="20.5" textAnchor="middle" className="text-xs font-bold fill-gray-900 dark:fill-white">
                  {dashboardData.stats.impactScore}%
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-green-600 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Donated</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(dashboardData.stats.totalDonated)}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <FontAwesomeIcon icon={faDollarSign} className="text-xl text-green-600 dark:text-green-300" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-green-600">
              <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
              <span>+15% from last year</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-blue-600 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Projects Supported</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {dashboardData.stats.projectsSupported}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <FontAwesomeIcon icon={faSeedling} className="text-xl text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Across 5 districts</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-purple-600 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Farmers Reached</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {dashboardData.stats.farmersReached.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <FontAwesomeIcon icon={faUsers} className="text-xl text-purple-600 dark:text-purple-300" />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">125 new this month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border-l-4 border-emerald-600 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Programs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {dashboardData.stats.activePrograms}
                </p>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full">
                <FontAwesomeIcon icon={faHandHoldingHeart} className="text-xl text-emerald-600 dark:text-emerald-300" />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">3 ongoing, 2 upcoming</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Contributions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                <FontAwesomeIcon icon={faChartLine} className="mr-2 text-green-600" />
                Monthly Contributions
              </h2>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              >
                <option value="year">This Year</option>
                <option value="quarter">Last Quarter</option>
                <option value="month">Last Month</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dashboardData.monthlyContributions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `${value/1000}K`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="amount" stroke="#2E7D32" fill="#4CAF50" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Distribution by Category */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              <FontAwesomeIcon icon={faChartPie} className="mr-2 text-green-600" />
              Distribution by Category
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dashboardData.distributionByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dashboardData.distributionByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            <FontAwesomeIcon icon={faChartLine} className="mr-2 text-green-600" />
            Impact Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData.impactMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">{metric.metric}</p>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}%</p>
                  <span className="text-sm text-green-600 flex items-center">
                    <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                    {metric.change}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Programs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              <FontAwesomeIcon icon={faSeedling} className="mr-2 text-green-600" />
              Your Supported Programs
            </h2>
            <Link to="/donor/programs" className="text-sm text-green-600 hover:text-green-700 flex items-center">
              View All <FontAwesomeIcon icon={faArrowUp} className="ml-1 rotate-45" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dashboardData.supportedPrograms.map((program) => (
              <div
                key={program.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-green-500 dark:hover:border-green-500 transition cursor-pointer"
                onClick={() => {
                  setSelectedProgram(program);
                  setShowImpactModal(true);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{program.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(program.status)}`}>
                    {program.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{program.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Your Contribution</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(program.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Beneficiaries</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {program.beneficiaries} farmers
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-gray-900 dark:text-white">
                      {((program.utilized / program.amount) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: `${(program.utilized / program.amount) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>Impact: {program.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Farmers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            <FontAwesomeIcon icon={faUsers} className="mr-2 text-green-600" />
            Top Beneficiary Farmers
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Farmer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Village</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Programs</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Total Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {dashboardData.topFarmers.map((farmer, index) => (
                  <tr key={index} className="hover:bg-green-50 dark:hover:bg-green-900/20 transition">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{farmer.name}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{farmer.village}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{farmer.programs}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{formatCurrency(farmer.contributions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              <FontAwesomeIcon icon={faClock} className="mr-2 text-green-600" />
              Recent Donations
            </h2>
            <Link to="/donor/transactions" className="text-sm text-green-600 hover:text-green-700">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Program</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {dashboardData.recentDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-green-50 dark:hover:bg-green-900/20 transition">
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{formatDate(donation.date)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{donation.program}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(donation.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(donation.status)}`}>
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Program Impact Modal */}
      {showImpactModal && selectedProgram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Program Impact Details</h2>
                <button
                  onClick={() => {
                    setShowImpactModal(false);
                    setSelectedProgram(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{selectedProgram.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedProgram.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your Contribution</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(selectedProgram.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Beneficiaries</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedProgram.beneficiaries} farmers</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedProgram.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedProgram.endDate)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600 rounded-full"
                        style={{ width: `${(selectedProgram.utilized / selectedProgram.amount) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {((selectedProgram.utilized / selectedProgram.amount) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatCurrency(selectedProgram.utilized)} utilized of {formatCurrency(selectedProgram.amount)}
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Impact Achieved</h4>
                  <p className="text-blue-700 dark:text-blue-300">{selectedProgram.impact}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">85%</p>
                    <p className="text-xs text-purple-700 dark:text-purple-400">Farmer Satisfaction</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">+45%</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">Yield Increase</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowImpactModal(false);
                    setSelectedProgram(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Download Impact Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}