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
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import NavLayout from "./NavLayout";
import BASE_URL from "../config";
import { useNavigate } from "react-router-dom";

// Green color palette for both light and dark modes
const GREEN_COLORS = {
  primary: "#16a34a",
  secondary: "#22c55e",
  light: "#86efac",
  lighter: "#bbf7d0",
  lightest: "#dcfce7",
  dark: "#166534",
  darker: "#14532d",
  darkest: "#052e16",
  bgLight: "#f0fdf4",
  bgMedium: "#dcfce7",
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  // Load dashboard data
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

  // Process data for charts
  const weeklyActivity = dailyActivity.map(d => ({ 
    week: d.day || d.week, 
    value: d.value || 0,
  }));

  const cropHealthTrend = cropHealth.map(c => ({
    week: c.week,
    health: c.health || 0,
  }));

  // Mini card values
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

  // Navigate on mini card click
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

  // Quick action handlers
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

  // Loading skeleton with mobile optimization
  if (loading) {
    return (
      <NavLayout>
        <div className="min-h-screen bg-green-100 dark:bg-green-950 p-4 sm:p-8">
          <div className="animate-pulse">
            <div className="h-8 sm:h-10 w-48 sm:w-64 bg-green-200 dark:bg-green-800 rounded-lg mb-6 sm:mb-8"></div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 sm:h-32 bg-green-200 dark:bg-green-800 rounded-xl sm:rounded-2xl"></div>
              ))}
            </div>
            <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 gap-8 mb-8">
              <div className="h-72 sm:h-96 bg-green-200 dark:bg-green-800 rounded-xl sm:rounded-2xl"></div>
              <div className="h-72 sm:h-96 bg-green-200 dark:bg-green-800 rounded-xl sm:rounded-2xl"></div>
            </div>
          </div>
        </div>
      </NavLayout>
    );
  }

  return (
    <NavLayout>
      <div className="min-h-screen bg-green-100 dark:bg-green-950 transition-colors duration-300">
        {/* Header with mobile optimization */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 dark:from-green-950 dark:to-green-900 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1"
              >
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                  Welcome back, {userName}!
                </h1>
                <p className="text-green-200 dark:text-green-300 text-sm sm:text-base hidden sm:block">
                  Here's what's happening with your farm today
                </p>
              </motion.div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-white hover:bg-green-700 dark:hover:bg-green-800 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={showMobileMenu ? faTimes : faBars} className="text-xl" />
              </button>

              {/* Desktop search */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:block"
              >
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

              {/* Mobile search toggle */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="lg:hidden p-2 text-white hover:bg-green-700 dark:hover:bg-green-800 rounded-lg transition-colors ml-2"
              >
                <FontAwesomeIcon icon={faSearch} className="text-xl" />
              </button>
            </div>

            {/* Mobile search bar */}
            <AnimatePresence>
              {showMobileSearch && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mt-4"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-10 bg-white/20 dark:bg-green-900/50 backdrop-blur-sm border border-white/30 dark:border-green-700 rounded-xl text-white placeholder-white/70 dark:placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-green-500"
                      autoFocus
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3.5 text-white/70 dark:text-green-300" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="lg:hidden mb-6 bg-green-50 dark:bg-green-900 rounded-xl shadow-lg border border-green-200 dark:border-green-700 overflow-hidden"
              >
                <div className="p-4 space-y-2">
                  {["overview", "analytics", "reports"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg capitalize font-medium transition-all duration-200 ${
                        activeTab === tab
                          ? "bg-green-600 text-white"
                          : "text-green-800 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-800"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Navigation - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block mb-8 border-b border-green-300 dark:border-green-800">
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

          {/* MINI CARDS - Mobile optimized grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-10"
          >
            {cards.map((card, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(card.title)}
                className="cursor-pointer bg-green-50 dark:bg-green-900 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-200 dark:border-green-700 overflow-hidden group"
              >
                <div className="p-3 sm:p-5 group-hover:bg-green-100 dark:group-hover:bg-green-800 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center group-hover:bg-green-300 dark:group-hover:bg-green-700 transition-colors duration-300">
                      <FontAwesomeIcon icon={card.icon} className="text-green-700 dark:text-green-300 text-sm sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 truncate">{card.title}</p>
                      <p className="text-lg sm:text-2xl font-semibold text-green-900 dark:text-white">{card.value ?? 0}</p>
                    </div>
                  </div>
                </div>
                <div className="h-1 w-full bg-green-200 dark:bg-green-700">
                  <div className="h-full w-2/3 bg-green-600 dark:bg-green-500 rounded-r-full group-hover:w-full transition-all duration-500"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CHARTS SECTION - Stack on mobile */}
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 gap-8 mb-6 sm:mb-10">
            {/* Crop Health Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 dark:bg-green-900 rounded-xl shadow-md border border-green-200 dark:border-green-700 overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-green-200 dark:border-green-700 bg-green-100/50 dark:bg-green-800/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faChartLine} className="text-green-700 dark:text-green-300 text-sm sm:text-base" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold text-green-900 dark:text-white truncate">Crop Health</h2>
                      <p className="text-xs sm:text-sm text-green-700 dark:text-green-400">Weekly monitoring</p>
                    </div>
                  </div>
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 bg-green-100 dark:bg-green-800 border border-green-300 dark:border-green-600 rounded-lg text-sm text-green-800 dark:text-green-200 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                  >
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="quarter">Last 90 days</option>
                  </select>
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-green-50 dark:bg-green-900">
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cropHealthTrend}>
                      <defs>
                        <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={GREEN_COLORS.primary} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={GREEN_COLORS.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="week" 
                        stroke="#166534" 
                        className="dark:stroke-green-300"
                        tick={{ fontSize: 10 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        stroke="#166534" 
                        className="dark:stroke-green-300"
                        tick={{ fontSize: 10 }}
                        width={30}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#f0fdf4', 
                          borderRadius: '8px',
                          border: '1px solid #86efac',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          fontSize: '12px'
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
              <div className="p-4 sm:p-6 border-b border-green-200 dark:border-green-700 bg-green-100/50 dark:bg-green-800/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faHistory} className="text-green-700 dark:text-green-300 text-sm sm:text-base" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-semibold text-green-900 dark:text-white truncate">Weekly Activity</h2>
                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-400">Farm operations</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-green-50 dark:bg-green-900">
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyActivity} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                      <XAxis 
                        dataKey="week" 
                        stroke="#166534" 
                        className="dark:stroke-green-300"
                        tick={{ fontSize: 10 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        stroke="#166534" 
                        className="dark:stroke-green-300"
                        tick={{ fontSize: 10 }}
                        width={30}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#f0fdf4', 
                          borderRadius: '8px',
                          border: '1px solid #86efac',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          fontSize: '12px'
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

          {/* RECENT COMPLAINTS - Mobile optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-green-50 dark:bg-green-900 rounded-xl shadow-md border border-green-200 dark:border-green-700 overflow-hidden mb-6 sm:mb-10"
          >
            <div className="p-4 sm:p-6 border-b border-green-200 dark:border-green-700 bg-green-100/50 dark:bg-green-800/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-green-700 dark:text-green-300 text-sm sm:text-base" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-green-900 dark:text-white">Recent Complaints</h2>
                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-400">Latest issues reported</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors">
                    <FontAwesomeIcon icon={faFilter} className="text-green-700 dark:text-green-300 text-sm sm:text-base" />
                  </button>
                  <button className="p-2 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors">
                    <FontAwesomeIcon icon={faDownload} className="text-green-700 dark:text-green-300 text-sm sm:text-base" />
                  </button>
                  <button
                    onClick={() => navigate("/report-complaint")}
                    className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 text-xs sm:text-sm"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-xs sm:text-sm" />
                    <span className="hidden sm:inline">New</span>
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
                  className="p-3 sm:p-4 hover:bg-green-100 dark:hover:bg-green-800 transition-colors duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
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
                              ? "text-green-700 dark:text-green-400 text-xs sm:text-sm"
                              : complaint.status === "Pending"
                              ? "text-yellow-700 dark:text-yellow-400 text-xs sm:text-sm"
                              : "text-red-700 dark:text-red-400 text-xs sm:text-sm"
                          }
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm font-medium text-green-900 dark:text-white truncate">{complaint.type}</h3>
                        <p className="text-xs text-green-700 dark:text-green-400 truncate">
                          {complaint.description?.substring(0, 40)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 ml-2">
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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
            <div className="p-3 sm:p-4 bg-green-100/50 dark:bg-green-800/50 border-t border-green-200 dark:border-green-700">
              <button
                onClick={() => navigate("/report-complaint")}
                className="text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 w-full"
              >
                <span>View All Complaints</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs sm:text-sm" />
              </button>
            </div>
          </motion.div>

          {/* QUICK ACTIONS - Mobile optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-green-50 dark:bg-green-900 rounded-xl shadow-md border border-green-200 dark:border-green-700 overflow-hidden mb-6"
          >
            <div className="p-4 sm:p-6 border-b border-green-200 dark:border-green-700 bg-green-100/50 dark:bg-green-800/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faPlus} className="text-green-700 dark:text-green-300 text-sm sm:text-base" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-green-900 dark:text-white">Quick Actions</h2>
                  <p className="text-xs sm:text-sm text-green-700 dark:text-green-400">Manage your farm</p>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                {[
                  { label: "Add Field", icon: faSeedling, form: "field" },
                  { label: "Schedule", icon: faCalendarCheck, form: "harvest" },
                  { label: "Report Pest", icon: faBug, form: "pest" },
                  { label: "Complaint", icon: faTriangleExclamation, form: "complaint" },
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
                    className="p-2 sm:p-4 bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 rounded-lg sm:rounded-xl transition-colors duration-200 group"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-200 dark:bg-green-700 rounded-lg flex items-center justify-center mb-1 sm:mb-2 mx-auto group-hover:scale-110 group-hover:bg-green-300 dark:group-hover:bg-green-600 transition-all duration-200">
                      <FontAwesomeIcon icon={action.icon} className="text-green-700 dark:text-green-300 text-xs sm:text-lg" />
                    </div>
                    <p className="text-center text-xs sm:text-sm font-medium text-green-800 dark:text-green-200">{action.label}</p>
                  </motion.button>
                ))}
              </div>

              {/* FORMS - Mobile optimized */}
              <AnimatePresence>
                {showFieldForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={submitField}
                    className="mt-4 sm:mt-6 bg-green-100 dark:bg-green-800 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-green-300 dark:border-green-700"
                  >
                    <h3 className="text-sm sm:text-md font-semibold text-green-900 dark:text-white mb-3 sm:mb-4">Add New Field</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <input
                        placeholder="Field Name"
                        value={fieldForm.name}
                        onChange={e => setFieldForm({...fieldForm, name: e.target.value})}
                        className="w-full p-2 sm:p-3 text-sm border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      />
                      <input
                        placeholder="Area (hectares)"
                        value={fieldForm.area}
                        onChange={e => setFieldForm({...fieldForm, area: e.target.value})}
                        className="w-full p-2 sm:p-3 text-sm border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      />
                      <input
                        placeholder="Crop Type"
                        value={fieldForm.crop_type}
                        onChange={e => setFieldForm({...fieldForm, crop_type: e.target.value})}
                        className="w-full p-2 sm:p-3 text-sm border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      />
                      <input
                        placeholder="Location"
                        value={fieldForm.location}
                        onChange={e => setFieldForm({...fieldForm, location: e.target.value})}
                        className="w-full p-2 sm:p-3 text-sm border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowFieldForm(false)}
                        className="w-full sm:w-auto px-4 py-2 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-300 dark:hover:bg-green-600 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-200 text-sm"
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
                    className="mt-4 sm:mt-6 bg-green-100 dark:bg-green-800 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-green-300 dark:border-green-700"
                  >
                    <h3 className="text-sm sm:text-md font-semibold text-green-900 dark:text-white mb-3 sm:mb-4">Schedule Harvest</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <select
                        value={harvestForm.field_id}
                        onChange={e => setHarvestForm({...harvestForm, field_id: e.target.value})}
                        className="w-full p-2 sm:p-3 text-sm border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
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
                        className="w-full p-2 sm:p-3 text-sm border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      />
                      <input
                        type="date"
                        value={harvestForm.harvest_date}
                        onChange={e => setHarvestForm({...harvestForm, harvest_date: e.target.value})}
                        className="w-full p-2 sm:p-3 text-sm border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowHarvestForm(false)}
                        className="w-full sm:w-auto px-4 py-2 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-300 dark:hover:bg-green-600 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-200 text-sm"
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
                    className="mt-4 sm:mt-6 bg-green-100 dark:bg-green-800 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-green-300 dark:border-green-700"
                  >
                    <h3 className="text-sm sm:text-md font-semibold text-green-900 dark:text-white mb-3 sm:mb-4">Report Pest</h3>
                    <div className="space-y-3 sm:space-y-4">
                      <select
                        value={pestForm.field_id}
                        onChange={e => setPestForm({...pestForm, field_id: e.target.value})}
                        className="w-full p-2 sm:p-3 text-sm border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
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
                        className="w-full p-2 sm:p-3 text-sm border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                      />
                      <select
                        value={pestForm.severity}
                        onChange={e => setPestForm({...pestForm, severity: e.target.value})}
                        className="w-full p-2 sm:p-3 text-sm border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
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
                        className="w-full p-2 sm:p-3 text-sm border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900 text-green-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 outline-none transition-all"
                        rows="3"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowPestForm(false)}
                        className="w-full sm:w-auto px-4 py-2 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-300 dark:hover:bg-green-600 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-200 text-sm"
                      >
                        Report
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Weather Widget - Mobile optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-green-50 dark:bg-green-900 rounded-xl shadow-md border border-green-200 dark:border-green-700 overflow-hidden"
          >
            <div className="p-4 sm:p-6 bg-gradient-to-r from-green-100 to-green-50 dark:from-green-800 dark:to-green-900">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faCloudSun} className="text-green-700 dark:text-green-300 text-sm sm:text-base" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-green-900 dark:text-white">Weather</h3>
                </div>
                <span className="text-xs text-green-700 dark:text-green-400">Updated now</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div className="text-center p-2 sm:p-3 bg-green-100/50 dark:bg-green-800/50 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-400">Temp</p>
                  <p className="text-lg sm:text-2xl font-semibold text-green-900 dark:text-white">24°C</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-green-100/50 dark:bg-green-800/50 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-400">Humidity</p>
                  <p className="text-lg sm:text-2xl font-semibold text-green-900 dark:text-white">65%</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-green-100/50 dark:bg-green-800/50 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-400">Wind</p>
                  <p className="text-lg sm:text-2xl font-semibold text-green-900 dark:text-white">12</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-green-100/50 dark:bg-green-800/50 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-400">Rain</p>
                  <p className="text-lg sm:text-2xl font-semibold text-green-900 dark:text-white">30%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </NavLayout>
  );
}