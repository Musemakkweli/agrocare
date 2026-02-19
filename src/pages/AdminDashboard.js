import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCommentDots,
  faCheckCircle,
  faClock,
  faSeedling,
  faHandHoldingHeart,
  faChartLine,
  faLeaf,
  faTractor,
  faWater,
  faExclamationTriangle,
  faArrowUp,
  faArrowDown,
  faMapMarkerAlt,
  faDownload,
  faSync,
  faFilter
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
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("month");
  const [refreshing, setRefreshing] = useState(false);

  // Farming-focused color palette
  const colors = {
    primary: "#16A34A", // Green
    secondary: "#B45309", // Earth brown
    accent: "#CA8A04", // Gold/amber
    light: "#86EFAC", // Light green
    dark: "#14532D", // Dark green
    background: "#F0FDF4" // Very light green
  };

  const summaryData = {
    farmers: 1248,
    complaints: 156,
    resolved: 98,
    pending: 58,
    programs: 24,
    donations: 84500,
    avgResponseTime: "2.5 days",
    satisfaction: "94%"
  };

  const complaintsData = [
    { month: "Jan", complaints: 42, resolved: 38 },
    { month: "Feb", complaints: 48, resolved: 42 },
    { month: "Mar", complaints: 55, resolved: 48 },
    { month: "Apr", complaints: 52, resolved: 50 },
    { month: "May", complaints: 58, resolved: 52 },
    { month: "Jun", complaints: 56, resolved: 53 }
  ];

  const statusData = [
    { name: "Resolved", value: summaryData.resolved, color: colors.primary },
    { name: "Pending", value: summaryData.pending, color: colors.secondary },
    { name: "In Progress", value: 32, color: colors.accent }
  ];

  const programData = [
    { name: "Irrigation Support", contributions: 24500, farmers: 320, icon: faWater },
    { name: "Seed Distribution", contributions: 18200, farmers: 450, icon: faSeedling },
    { name: "Training Program", contributions: 15800, farmers: 280, icon: faUsers },
    { name: "Equipment Fund", contributions: 26000, farmers: 190, icon: faTractor }
  ];

  const recentActivities = [
    { 
      user: "John Farmer", 
      action: "submitted a new complaint", 
      type: "complaint",
      time: "5 minutes ago",
      avatar: "JF",
      details: "Pest infestation in maize field"
    },
    { 
      user: "Admin Team", 
      action: "created new program", 
      type: "program",
      time: "1 hour ago",
      avatar: "AT",
      details: "Community Farming Initiative"
    },
    { 
      user: "Jane Smith", 
      action: "resolved a complaint", 
      type: "complaint",
      time: "3 hours ago",
      avatar: "JS",
      details: "Irrigation issue resolved"
    },
    { 
      user: "Green Foundation", 
      action: "donated", 
      type: "donation",
      time: "5 hours ago",
      avatar: "GF",
      details: "$5,000 for seed program"
    },
    { 
      user: "Peter Mwangi", 
      action: "registered as farmer", 
      type: "farmer",
      time: "1 day ago",
      avatar: "PM",
      details: "New farmer from Huye district"
    }
  ];

  const districtData = [
    { district: "Huye", farmers: 320, complaints: 45, resolved: 38 },
    { district: "Nyamagabe", farmers: 280, complaints: 38, resolved: 32 },
    { district: "Gisagara", farmers: 245, complaints: 32, resolved: 28 },
    { district: "Nyanza", farmers: 210, complaints: 28, resolved: 24 },
    { district: "Ruhango", farmers: 193, complaints: 23, resolved: 20 }
  ];

  const cropData = [
    { subject: 'Maize', A: 120, B: 110, fullMark: 150 },
    { subject: 'Beans', A: 98, B: 130, fullMark: 150 },
    { subject: 'Coffee', A: 86, B: 130, fullMark: 150 },
    { subject: 'Bananas', A: 99, B: 100, fullMark: 150 },
    { subject: 'Vegetables', A: 85, B: 90, fullMark: 150 },
    { subject: 'Fruits', A: 65, B: 85, fullMark: 150 }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getMetricTrend = (current, previous) => {
    const change = ((current - previous) / previous * 100).toFixed(1);
    return {
      value: change,
      positive: change > 0,
      icon: change > 0 ? faArrowUp : faArrowDown
    };
  };

  const renderActivity = (activity, idx) => {
    const typeColors = {
      complaint: `bg-red-50 text-red-700 border-l-4 border-red-500`,
      program: `bg-blue-50 text-blue-700 border-l-4 border-blue-500`,
      donation: `bg-green-50 text-green-700 border-l-4 border-green-600`,
      farmer: `bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600`
    };

    const typeIcons = {
      complaint: faExclamationTriangle,
      program: faSeedling,
      donation: faHandHoldingHeart,
      farmer: faUsers
    };

    return (
      <motion.div
        key={idx}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.1 }}
        className={`flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 dark:border-gray-700 ${typeColors[activity.type]}`}
        whileHover={{ scale: 1.02 }}
      >
        {/* Avatar with Icon */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white flex items-center justify-center font-bold text-lg shadow-lg">
            {activity.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
            <FontAwesomeIcon 
              icon={typeIcons[activity.type]} 
              className={`text-xs ${
                activity.type === "complaint" ? "text-red-500" :
                activity.type === "program" ? "text-blue-500" :
                activity.type === "donation" ? "text-green-600" :
                "text-emerald-600"
              }`} 
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-900 dark:text-gray-100">
              <span className="font-semibold text-green-700 dark:text-green-400">{activity.user}</span>{" "}
              <span className="text-gray-600 dark:text-gray-300">{activity.action}</span>
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.details}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              activity.type === "complaint" ? "bg-red-100 text-red-700" :
              activity.type === "program" ? "bg-blue-100 text-blue-700" :
              activity.type === "donation" ? "bg-green-100 text-green-700" :
              "bg-emerald-100 text-emerald-700"
            }`}>
              {activity.type.toUpperCase()}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AdminLayout user={{ name: "Admin User", role: "Administrator" }}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 p-6">
        {/* Header with Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <FontAwesomeIcon icon={faLeaf} className="text-green-600" />
              Farm Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Welcome back! Here's your farm community overview
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 90 days</option>
              <option value="year">This year</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="p-2 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <FontAwesomeIcon icon={faSync} spin={refreshing} className="text-gray-600 dark:text-gray-300" />
            </button>

            {/* Download Report */}
            <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl flex items-center gap-2 hover:from-green-700 hover:to-green-800 transition shadow-lg">
              <FontAwesomeIcon icon={faDownload} />
              Export Report
            </button>
          </div>
        </motion.div>

        {/* Summary Cards with Farming Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: "Total Farmers", 
              value: summaryData.farmers, 
              icon: faUsers,
              color: "from-green-600 to-green-700",
              bgColor: "bg-green-100",
              trend: getMetricTrend(1248, 1200)
            },
            { 
              label: "Active Complaints", 
              value: summaryData.complaints, 
              icon: faCommentDots,
              color: "from-amber-600 to-amber-700",
              bgColor: "bg-amber-100",
              trend: getMetricTrend(156, 142)
            },
            { 
              label: "Resolution Rate", 
              value: "63%", 
              icon: faCheckCircle,
              color: "from-emerald-600 to-emerald-700",
              bgColor: "bg-emerald-100",
              trend: { value: "5.2", positive: true, icon: faArrowUp }
            },
            { 
              label: "Total Donations", 
              value: `$${(summaryData.donations / 1000).toFixed(1)}K`, 
              icon: faHandHoldingHeart,
              color: "from-teal-600 to-teal-700",
              bgColor: "bg-teal-100",
              trend: getMetricTrend(84500, 79000)
            }
          ].map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-r ${item.color} p-3 rounded-xl text-white shadow-lg group-hover:scale-110 transition`}>
                    <FontAwesomeIcon icon={item.icon} className="text-xl" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                    item.trend.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    <FontAwesomeIcon icon={item.trend.icon} className="text-xs" />
                    <span className="text-xs font-medium">{item.trend.value}%</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{item.label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{item.value}</p>
              </div>
              <div className="h-1 w-full bg-gray-100 dark:bg-gray-700">
                <div className={`h-full bg-gradient-to-r ${item.color} w-2/3 group-hover:w-full transition-all duration-500`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section - Using only green and brown tones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Complaints Trend */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-green-600" />
                Complaints Trend
              </h2>
              <button className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={complaintsData}>
                <defs>
                  <linearGradient id="complaintsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(255,255,255,0.9)", 
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="complaints" 
                  stroke="#16A34A" 
                  fillOpacity={1} 
                  fill="url(#complaintsGradient)" 
                />
                <Area type="monotone" dataKey="resolved" stroke="#B45309" fillOpacity={0.3} fill="#B45309" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
              Complaint Status
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* District Performance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-600" />
              District Performance
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={districtData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis dataKey="district" type="category" stroke="#6B7280" width={80} />
                <Tooltip />
                <Bar dataKey="farmers" fill="#16A34A" />
                <Bar dataKey="complaints" fill="#B45309" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Crop Distribution Radar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faSeedling} className="text-green-600" />
              Crop Distribution
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={cropData}>
                <PolarGrid stroke="#374151" opacity={0.2} />
                <PolarAngleAxis dataKey="subject" stroke="#6B7280" />
                <PolarRadiusAxis stroke="#6B7280" />
                <Radar name="This Year" dataKey="A" stroke="#16A34A" fill="#16A34A" fillOpacity={0.6} />
                <Radar name="Last Year" dataKey="B" stroke="#B45309" fill="#B45309" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Program Contributions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 lg:col-span-2 xl:col-span-1"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faHandHoldingHeart} className="text-green-600" />
              Program Contributions
            </h2>
            <div className="space-y-3">
              {programData.map((program, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center text-white">
                      <FontAwesomeIcon icon={program.icon} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{program.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{program.farmers} farmers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700 dark:text-green-400">${(program.contributions / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-gray-400">raised</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-green-600" />
              Recent Activities
            </h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                View All
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {recentActivities.map(renderActivity)}
          </div>
        </motion.div>

        {/* Quick Stats Footer */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Avg. Response Time", value: summaryData.avgResponseTime, icon: faClock, bg: "bg-green-100", text: "text-green-700" },
            { label: "Satisfaction Rate", value: summaryData.satisfaction, icon: faCheckCircle, bg: "bg-emerald-100", text: "text-emerald-700" },
            { label: "Active Programs", value: summaryData.programs, icon: faSeedling, bg: "bg-green-100", text: "text-green-700" },
            { label: "Today's Donations", value: "$2,450", icon: faHandHoldingHeart, bg: "bg-amber-100", text: "text-amber-700" }
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.bg} dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center`}>
              <FontAwesomeIcon icon={stat.icon} className={`${stat.text} dark:text-green-400 mb-2`} />
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #16A34A;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #15803D;
        }
      `}</style>
    </AdminLayout>
  );
}