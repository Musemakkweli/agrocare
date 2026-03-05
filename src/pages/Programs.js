// src/pages/Programs.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSeedling, 
  faWater, 
  faBug, 
  faHandHoldingHeart, 
  faTractor, 
  faLeaf,
  faArrowLeft,
  faHome,
  faUser,
  faSun,
  faMoon
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import NavLayout from "./NavLayout";

// Map icon strings from backend to FontAwesome icons
const iconMap = {
  seedling: faSeedling,
  water: faWater,
  bug: faBug,
  tractor: faTractor,
  leaf: faLeaf,
  default: faSeedling
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function Programs() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [user, setUser] = useState(null);

  // Check for logged in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }, []);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/programs");
      console.log("Fetched programs:", response.data);
      setPrograms(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching programs:", err);
      setError("Failed to load programs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // Get the appropriate icon based on program.icon string
  const getProgramIcon = (iconName) => {
    return iconMap[iconName?.toLowerCase()] || iconMap.default;
  };

  // Get status color class
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("open") || statusLower.includes("funding")) {
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    } else if (statusLower.includes("ongoing")) {
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    } else if (statusLower.includes("seeking") || statusLower.includes("donors")) {
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    } else if (statusLower.includes("completed")) {
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    } else {
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8F3E8] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading programs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#E8F3E8] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchPrograms}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If user is logged in, wrap with NavLayout
  if (user) {
    return (
      <NavLayout user={user}>
        <ProgramsContent 
          programs={programs}
          theme={theme}
          handleThemeToggle={handleThemeToggle}
          handleGoBack={handleGoBack}
          handleGoHome={handleGoHome}
          getProgramIcon={getProgramIcon}
          getStatusColor={getStatusColor}
          navigate={navigate}
          user={user}
        />
      </NavLayout>
    );
  }

  // If not logged in, show standalone page with navigation buttons
  return (
    <ProgramsContent 
      programs={programs}
      theme={theme}
      handleThemeToggle={handleThemeToggle}
      handleGoBack={handleGoBack}
      handleGoHome={handleGoHome}
      getProgramIcon={getProgramIcon}
      getStatusColor={getStatusColor}
      navigate={navigate}
      user={null}
    />
  );
}

// Separate component for the actual content (used by both logged-in and non-logged-in views)
function ProgramsContent({ 
  programs, 
  theme, 
  handleThemeToggle, 
  handleGoBack, 
  handleGoHome, 
  getProgramIcon, 
  getStatusColor, 
  navigate,
  user 
}) {
  return (
    <div className="min-h-screen bg-[#E8F3E8] dark:bg-gray-900 transition-all duration-300">
      
      {/* Custom Header for non-logged-in users */}
      {!user && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-green-100 dark:border-gray-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition flex items-center gap-1 text-gray-700 dark:text-gray-300"
                aria-label="Go back"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-green-600" />
                <span className="text-sm hidden sm:inline">Back</span>
              </button>
              
              <button
                onClick={handleGoHome}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition flex items-center gap-1 text-gray-700 dark:text-gray-300"
                aria-label="Go home"
              >
                <FontAwesomeIcon icon={faHome} className="text-green-600" />
                <span className="text-sm hidden sm:inline">Home</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleThemeToggle}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <FontAwesomeIcon icon={faSun} className="text-yellow-500" />
                ) : (
                  <FontAwesomeIcon icon={faMoon} className="text-gray-700" />
                )}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="hidden sm:inline">Login</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE HEADER */}
      <section className="bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-700 py-8 sm:py-10 text-center text-white shadow-md">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 px-4">Agricultural Programs</h1>
        <p className="text-green-100 text-sm sm:text-base px-4">Explore ongoing initiatives supporting farmers across Rwanda</p>
      </section>

      {/* PROGRAM LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">No programs available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate(`/programs/${program.id}`)}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 rounded-lg flex-shrink-0">
                    <FontAwesomeIcon 
                      icon={getProgramIcon(program.icon)} 
                      className="text-green-600 dark:text-green-400 text-xl sm:text-2xl" 
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-green-800 dark:text-green-300 flex-1 line-clamp-2">
                    {program.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span className="font-semibold">Location:</span> {program.location || "Rwanda"}
                </p>

                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 mb-4 line-clamp-3">
                  {program.description}
                </p>

                {/* Progress Bar (if goal and raised exist) */}
                {program.goal && program.raised !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {Math.min(Math.round((program.raised / program.goal) * 100), 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600 rounded-full"
                        style={{ width: `${Math.min((program.raised / program.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <span className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-semibold ${getStatusColor(program.status)}`}>
                    {program.status || "Funding Open"}
                  </span>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/programs/${program.id}`);
                    }}
                    className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-green-600 text-white text-xs sm:text-sm font-semibold shadow hover:bg-green-700 transition transform hover:scale-105"
                  >
                    <FontAwesomeIcon icon={faHandHoldingHeart} className="text-xs" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Mobile-friendly bottom navigation for non-logged-in users */}
      {!user && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-green-100 dark:border-gray-700 py-2 px-4 flex justify-around z-40">
          <button
            onClick={handleGoBack}
            className="flex flex-col items-center text-gray-600 dark:text-gray-400"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-green-600 text-lg" />
            <span className="text-[10px]">Back</span>
          </button>
          <button
            onClick={handleGoHome}
            className="flex flex-col items-center text-gray-600 dark:text-gray-400"
          >
            <FontAwesomeIcon icon={faHome} className="text-green-600 text-lg" />
            <span className="text-[10px]">Home</span>
          </button>
          <button
            onClick={handleThemeToggle}
            className="flex flex-col items-center text-gray-600 dark:text-gray-400"
          >
            {theme === "dark" ? (
              <FontAwesomeIcon icon={faSun} className="text-yellow-500 text-lg" />
            ) : (
              <FontAwesomeIcon icon={faMoon} className="text-gray-700 text-lg" />
            )}
            <span className="text-[10px]">Theme</span>
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex flex-col items-center text-gray-600 dark:text-gray-400"
          >
            <FontAwesomeIcon icon={faUser} className="text-green-600 text-lg" />
            <span className="text-[10px]">Login</span>
          </button>
        </div>
      )}

      {/* Add bottom padding for mobile when bottom nav is shown */}
      {!user && <div className="h-16 sm:h-0"></div>}
    </div>
  );
}