import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faCalendarCheck,
  faBug,
  faCloudSun,
  faTriangleExclamation,
  faPlus,
  faChartLine,
  faHistory,
  faCheckCircle,
  faExclamationTriangle,
  faSpinner,
  faSearch,
  faFilter,
  faDownload,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import NavLayout from "./NavLayout";
import BASE_URL from "../config";
import { useNavigate } from "react-router-dom";

// Green color palette for both light and dark modes
const GREEN_COLORS = {
  primary: "#16a34a", // green-600
  secondary: "#22c55e", // green-500
  light: "#86efac", // green-300
  lighter: "#bbf7d0", // green-200
  lightest: "#dcfce7", // green-100
  dark: "#166534", // green-800
  darker: "#14532d", // green-900
  darkest: "#052e16", // green-950
  bgLight: "#f0fdf4", // green-50
  bgMedium: "#dcfce7", // green-100
};

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function FarmerDashboard() {
  const [dailyActivity, setDailyActivity] = useState([]);
  const [cropHealth, setCropHealth] = useState([]);
  const [fields, setFields] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [pests, setPests] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [userName, setUserName] = useState("Farmer");

  // Form state variables
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [showHarvestForm, setShowHarvestForm] = useState(false);
  const [showPestForm, setShowPestForm] = useState(false);
  
  const [fieldForm, setFieldForm] = useState({ name: "", area: "", crop_type: "", location: "" });
  const [harvestForm, setHarvestForm] = useState({ field_id: "", crop_type: "", harvest_date: "" });
  const [pestForm, setPestForm] = useState({ field_id: "", pest_type: "", severity: "", description: "" });

  const navigate = useNavigate();
  
  // Get user from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || "Farmer");
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  // ---------------------------
  // Load dashboard data
  // ---------------------------
  useEffect(() => {
    const loadDashboard = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      
      const user = JSON.parse(userStr);
      if (!user?.id) return;

      setLoading(true);
      try {
        const [
          fieldsRes,
          harvestsRes,
          pestsRes,
          weatherRes,
          activityRes,
          cropRes,
          complaintsRes,
        ] = await Promise.all([
          fetch(`${BASE_URL}/fields/user/${user.id}`),
          fetch(`${BASE_URL}/harvests/user/${user.id}`),
          fetch(`${BASE_URL}/pest-alerts/user/${user.id}`),
          fetch(`${BASE_URL}/weather-alerts`),
          fetch(`${BASE_URL}/farmer/${user.id}/daily-activity`),
          fetch(`${BASE_URL}/farmer/${user.id}/crop-health`),
          fetch(`${BASE_URL}/complaints/user/${user.id}`),
        ]);

        const fieldsData = await fieldsRes.json();
        const harvestsData = await harvestsRes.json();
        const pestsData = await pestsRes.json();
        const weatherData = await weatherRes.json();
        const activityData = await activityRes.json();
        const cropData = await cropRes.json();
        const compData = await complaintsRes.json();

        setFields(Array.isArray(fieldsData) ? fieldsData : []);
        setHarvests(Array.isArray(harvestsData) ? harvestsData : []);
        setPests(Array.isArray(pestsData.data ?? pestsData) ? pestsData.data ?? pestsData : []);
        setWeatherAlerts(Array.isArray(weatherData.data ?? weatherData) ? weatherData.data ?? weatherData : []);
        setDailyActivity(Array.isArray(activityData.data ?? activityData) ? activityData.data ?? activityData : []);
        setCropHealth(Array.isArray(cropData.data ?? cropData) ? cropData.data ?? cropData : []);
        setComplaints(Array.isArray(compData) ? compData : []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ---------------------------
  // Process data for charts
  // ---------------------------
  const weeklyActivity = dailyActivity.map(d => ({ 
    week: d.day || d.week, 
    value: d.value || 0,
  }));

  const cropHealthTrend = cropHealth.map(c => ({
    week: c.week,
    health: c.health || 0,
  }));

  // ---------------------------
  // Mini card values
  // ---------------------------
  const cards = [
    { 
      title: "Fields", 
      value: fields.length, 
      icon: faSeedling,
    },
    { 
      title: "Harvests", 
      value: harvests.length, 
      icon: faCalendarCheck,
    },
    { 
      title: "Pests", 
      value: pests.length, 
      icon: faBug,
    },
    { 
      title: "Weather", 
      value: weatherAlerts.length, 
      icon: faCloudSun,
    },
    { 
      title: "Complaints", 
      value: complaints.length, 
      icon: faTriangleExclamation,
    },
  ];

  // ---------------------------
  // Navigate on mini card click
  // ---------------------------
  const handleCardClick = (title) => {
    const paths = {
      "Fields": "/farmer/fields",
      "Harvests": "/farmer/harvests",
      "Pests": "/farmer/pests",
      "Weather": "/farmer/weather",
      "Complaints": "/report-complaint"
    };
    navigate(paths[title] || "#");
  };

  // ---------------------------
  // Quick action handlers
  // ---------------------------
  const submitField = async (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    
    const user = JSON.parse(userStr);
    if (!user?.id) return;

    await fetch(`${BASE_URL}/fields`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fieldForm, user_id: user.id }),
    });
    setShowFieldForm(false);
    setFieldForm({ name: "", area: "", crop_type: "", location: "" });
  };

  const submitHarvest = async (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    
    const user = JSON.parse(userStr);
    if (!user?.id) return;

    await fetch(`${BASE_URL}/harvests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...harvestForm, farmer_id: user.id }),
    });
    setShowHarvestForm(false);
    setHarvestForm({ field_id: "", crop_type: "", harvest_date: "" });
  };

  const submitPest = async (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    
    const user = JSON.parse(userStr);
    if (!user?.id) return;

    await fetch(`${BASE_URL}/pest-alerts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...pestForm, farmer_id: user.id }),
    });
    setShowPestForm(false);
    setPestForm({ field_id: "", pest_type: "", severity: "", description: "" });
  };

  // Loading skeleton with dark mode support
  if (loading) {
    return (
      <NavLayout>
        <div className="min-h-screen bg-green-100 dark:bg-green-950 p-8">
          <div className="animate-pulse">
            <div className="h-10 w-64 bg-green-200 dark:bg-green-800 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-green-200 dark:bg-green-800 rounded-2xl"></div>
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="h-96 bg-green-200 dark:bg-green-800 rounded-2xl"></div>
              <div className="h-96 bg-green-200 dark:bg-green-800 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </NavLayout>
    );
  }

  return (
    <NavLayout>
      <div className="min-h-screen bg-green-100 dark:bg-green-950 transition-colors duration-300">
        {/* Header with green gradient - dark mode support */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 dark:from-green-950 dark:to-green-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {userName}! 🌱
                </h1>
                <p className="text-green-200 dark:text-green-300 text-lg">
                  Here's what's happening with your farm today
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-4 md:mt-0"
              >
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 px-4 py-2 pl-10 bg-white/20 dark:bg-green-900/50 backdrop-blur-sm border border-white/30 dark:border-green-700 rounded-xl text-white placeholder-white/70 dark:placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-green-500"
                  />
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-white/70 dark:text-green-300" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation - dark mode support */}
          <div className="mb-8 border-b border-green-300 dark:border-green-800">
            <nav className="flex space-x-8">
              {["overview", "analytics", "reports"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-1 capitalize font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? "text-green-800 dark:text-green-400 border-b-2 border-green-800 dark:border-green-400"
                      : "text-green-700 dark:text-green-500 hover:text-green-900 dark:hover:text-green-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* MINI CARDS - With green hover effect and dark mode */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10"
          >
            {cards.map((card, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(card.title)}
                className="cursor-pointer bg-green-50 dark:bg-green-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-200 dark:border-green-700 overflow-hidden group"
              >
                <div className="p-5 group-hover:bg-green-100 dark:group-hover:bg-green-800 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center group-hover:bg-green-300 dark:group-hover:bg-green-700 transition-colors duration-300">
                      <FontAwesomeIcon icon={card.icon} className="text-green-700 dark:text-green-300 text-xl group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-700 dark:text-green-400">{card.title}</p>
                      <p className="text-2xl font-semibold text-green-900 dark:text-white">{card.value ?? 0}</p>
                    </div>
                  </div>
                </div>
                <div className="h-1 w-full bg-green-200 dark:bg-green-700">
                  <div className="h-full w-2/3 bg-green-600 dark:bg-green-500 rounded-r-full group-hover:w-full transition-all duration-500"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CHARTS SECTION - dark mode support */}
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            {/* Crop Health Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 dark:bg-green-900 rounded-xl shadow-md border border-green-200 dark:border-green-700 overflow-hidden"
            >
              <div className="p-6 border-b border-green-200 dark:border-green-700 bg-green-100/50 dark:bg-green-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faChartLine} className="text-green-700 dark:text-green-300" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-green-900 dark:text-white">Crop Health Trend</h2>
                      <p className="text-sm text-green-700 dark:text-green-400">Weekly health monitoring</p>
                    </div>
                  </div>
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="px-3 py-2 bg-green-100 dark:bg-green-800 border border-green-300 dark:border-green-600 rounded-lg text-sm text-green-800 dark:text-green-200 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                  >
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="quarter">Last 90 days</option>
                  </select>
                </div>
              </div>
              <div className="p-6 bg-green-50 dark:bg-green-900">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cropHealthTrend}>
                      <defs>
                        <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={GREEN_COLORS.primary} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={GREEN_COLORS.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="week" stroke="#166534" className="dark:stroke-green-300" />
                      <YAxis stroke="#166534" className="dark:stroke-green-300" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#f0fdf4', 
                          borderRadius: '8px',
                          border: '1px solid #86efac',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                        labelStyle={{ color: '#166534' }}
                        itemStyle={{ color: '#16a34a' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="health" 
                        stroke={GREEN_COLORS.primary} 
                        strokeWidth={2}
                        fill="url(#healthGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Weekly Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-green-50 dark:bg-green-900 rounded-xl shadow-md border border-green-200 dark:border-green-700 overflow-hidden"
            >
              <div className="p-6 border-b border-green-200 dark:border-green-700 bg-green-100/50 dark:bg-green-800/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faHistory} className="text-green-700 dark:text-green-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-green-900 dark:text-white">Weekly Activity</h2>
                    <p className="text-sm text-green-700 dark:text-green-400">Farm operations overview</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-green-50 dark:bg-green-900">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyActivity} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="week" stroke="#166534" className="dark:stroke-green-300" />
                      <YAxis stroke="#166534" className="dark:stroke-green-300" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#f0fdf4', 
                          borderRadius: '8px',
                          border: '1px solid #86efac',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                        labelStyle={{ color: '#166534' }}
                        itemStyle={{ color: '#16a34a' }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill={GREEN_COLORS.primary}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RECENT COMPLAINTS - dark mode support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-green-50 dark:bg-green-900 rounded-xl shadow-md border border-green-200 dark:border-green-700 overflow-hidden mb-10"
          >
            <div className="p-6 border-b border-green-200 dark:border-green-700 bg-green-100/50 dark:bg-green-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-green-700 dark:text-green-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-green-900 dark:text-white">Recent Complaints</h2>
                    <p className="text-sm text-green-700 dark:text-green-400">Latest issues reported</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors">
                    <FontAwesomeIcon icon={faFilter} className="text-green-700 dark:text-green-300" />
                  </button>
                  <button className="p-2 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors">
                    <FontAwesomeIcon icon={faDownload} className="text-green-700 dark:text-green-300" />
                  </button>
                  <button
                    onClick={() => navigate("/report-complaint")}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 text-sm"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>New</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="divide-y divide-green-200 dark:divide-green-800">
              {complaints.slice(0, 5).map((complaint, index) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-green-100 dark:hover:bg-green-800 transition-colors duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        complaint.status === "Resolved" 
                          ? "bg-green-200 dark:bg-green-800" 
                          : complaint.status === "Pending"
                          ? "bg-yellow-100 dark:bg-yellow-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}>
                        <FontAwesomeIcon 
                          icon={
                            complaint.status === "Resolved" 
                              ? faCheckCircle 
                              : complaint.status === "Pending"
                              ? faSpinner
                              : faExclamationTriangle
                          } 
                          className={
                            complaint.status === "Resolved"
                              ? "text-green-700 dark:text-green-400"
                              : complaint.status === "Pending"
                              ? "text-yellow-700 dark:text-yellow-400"
                              : "text-red-700 dark:text-red-400"
                          }
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-green-900 dark:text-white">{complaint.type}</h3>
                        <p className="text-xs text-green-700 dark:text-green-400">
                          {complaint.description?.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        complaint.status === "Resolved"
                          ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                          : complaint.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-4 bg-green-100/50 dark:bg-green-800/50 border-t border-green-200 dark:border-green-700">
              <button
                onClick={() => navigate("/report-complaint")}
                className="text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium text-sm flex items-center justify-center space-x-2 w-full"
              >
                <span>View All Complaints</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </motion.div>

          {/* QUICK ACTIONS - dark mode support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-green-50 dark:bg-green-900 rounded-xl shadow-md border border-green-200 dark:border-green-700 overflow-hidden"
          >
            <div className="p-6 border-b border-green-200 dark:border-green-700 bg-green-100/50 dark:bg-green-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faPlus} className="text-green-700 dark:text-green-300" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-green-900 dark:text-white">Quick Actions</h2>
                  <p className="text-sm text-green-700 dark:text-green-400">Manage your farm efficiently</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Add Field", icon: faSeedling, form: "field" },
                  { label: "Schedule Harvest", icon: faCalendarCheck, form: "harvest" },
                  { label: "Report Pest", icon: faBug, form: "pest" },
                  { label: "New Complaint", icon: faTriangleExclamation, form: "complaint" },
                ].map((action, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (action.form === "complaint") {
                        navigate("/report-complaint");
                      } else if (action.form === "field") {
                        setShowFieldForm(!showFieldForm);
                      } else if (action.form === "harvest") {
                        setShowHarvestForm(!showHarvestForm);
                      } else if (action.form === "pest") {
                        setShowPestForm(!showPestForm);
                      }
                    }}
                    className="p-4 bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 rounded-xl transition-colors duration-200 group"
                  >
                    <div className="w-10 h-10 bg-green-200 dark:bg-green-700 rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:scale-110 group-hover:bg-green-300 dark:group-hover:bg-green-600 transition-all duration-200">
                      <FontAwesomeIcon icon={action.icon} className="text-green-700 dark:text-green-300 text-lg" />
                    </div>
                    <p className="text-center text-sm font-medium text-green-800 dark:text-green-200">{action.label}</p>
                  </motion.button>
                ))}
              </div>

              {/* FORMS - dark mode support */}
              <AnimatePresence>
                {showFieldForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={submitField}
                    className="mt-6 bg-green-100 dark:bg-green-800 p-6 rounded-xl border border-green-300 dark:border-green-700"
                  >
                    <h3 className="text-md font-semibold text-green-900 dark:text-white mb-4">Add New Field</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        placeholder="Field Name"
                        value={fieldForm.name}
                        onChange={e => setFieldForm({...fieldForm, name: e.target.value})}
                        className="p-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      />
                      <input
                        placeholder="Area (hectares)"
                        value={fieldForm.area}
                        onChange={e => setFieldForm({...fieldForm, area: e.target.value})}
                        className="p-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      />
                      <input
                        placeholder="Crop Type"
                        value={fieldForm.crop_type}
                        onChange={e => setFieldForm({...fieldForm, crop_type: e.target.value})}
                        className="p-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      />
                      <input
                        placeholder="Location"
                        value={fieldForm.location}
                        onChange={e => setFieldForm({...fieldForm, location: e.target.value})}
                        className="p-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowFieldForm(false)}
                        className="px-4 py-2 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-300 dark:hover:bg-green-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                      >
                        Add Field
                      </button>
                    </div>
                  </motion.form>
                )}

                {showHarvestForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={submitHarvest}
                    className="mt-6 bg-green-100 dark:bg-green-800 p-6 rounded-xl border border-green-300 dark:border-green-700"
                  >
                    <h3 className="text-md font-semibold text-green-900 dark:text-white mb-4">Schedule Harvest</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select
                        value={harvestForm.field_id}
                        onChange={e => setHarvestForm({...harvestForm, field_id: e.target.value})}
                        className="p-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      >
                        <option value="">Select Field</option>
                        {fields.map(field => (
                          <option key={field.id} value={field.id}>{field.name}</option>
                        ))}
                      </select>
                      <input
                        placeholder="Crop Type"
                        value={harvestForm.crop_type}
                        onChange={e => setHarvestForm({...harvestForm, crop_type: e.target.value})}
                        className="p-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      />
                      <input
                        type="date"
                        value={harvestForm.harvest_date}
                        onChange={e => setHarvestForm({...harvestForm, harvest_date: e.target.value})}
                        className="p-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowHarvestForm(false)}
                        className="px-4 py-2 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-300 dark:hover:bg-green-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                      >
                        Schedule
                      </button>
                    </div>
                  </motion.form>
                )}

                {showPestForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={submitPest}
                    className="mt-6 bg-green-100 dark:bg-green-800 p-6 rounded-xl border border-green-300 dark:border-green-700"
                  >
                    <h3 className="text-md font-semibold text-green-900 dark:text-white mb-4">Report Pest</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        value={pestForm.field_id}
                        onChange={e => setPestForm({...pestForm, field_id: e.target.value})}
                        className="p-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      >
                        <option value="">Select Field</option>
                        {fields.map(field => (
                          <option key={field.id} value={field.id}>{field.name}</option>
                        ))}
                      </select>
                      <input
                        placeholder="Pest Type"
                        value={pestForm.pest_type}
                        onChange={e => setPestForm({...pestForm, pest_type: e.target.value})}
                        className="p-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      />
                      <select
                        value={pestForm.severity}
                        onChange={e => setPestForm({...pestForm, severity: e.target.value})}
                        className="p-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      >
                        <option value="">Select Severity</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <textarea
                        placeholder="Description"
                        value={pestForm.description}
                        onChange={e => setPestForm({...pestForm, description: e.target.value})}
                        className="p-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all col-span-2"
                        rows="3"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowPestForm(false)}
                        className="px-4 py-2 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-300 dark:hover:bg-green-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                      >
                        Report
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Weather Widget - dark mode support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-green-50 dark:bg-green-900 rounded-xl shadow-md border border-green-200 dark:border-green-700 overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-green-100 to-green-50 dark:from-green-800 dark:to-green-900">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faCloudSun} className="text-green-700 dark:text-green-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900 dark:text-white">Weather Forecast</h3>
                </div>
                <span className="text-xs text-green-700 dark:text-green-400">Updated just now</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-100/50 dark:bg-green-800/50 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400">Temperature</p>
                  <p className="text-2xl font-semibold text-green-900 dark:text-white">24°C</p>
                </div>
                <div className="text-center p-3 bg-green-100/50 dark:bg-green-800/50 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400">Humidity</p>
                  <p className="text-2xl font-semibold text-green-900 dark:text-white">65%</p>
                </div>
                <div className="text-center p-3 bg-green-100/50 dark:bg-green-800/50 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400">Wind</p>
                  <p className="text-2xl font-semibold text-green-900 dark:text-white">12 km/h</p>
                </div>
                <div className="text-center p-3 bg-green-100/50 dark:bg-green-800/50 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400">Rain Chance</p>
                  <p className="text-2xl font-semibold text-green-900 dark:text-white">30%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </NavLayout>
  );
}