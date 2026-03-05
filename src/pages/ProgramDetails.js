// src/pages/ProgramDetails.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHandHoldingHeart, 
  faArrowLeft, 
  faHome, 
  faSun, 
  faMoon,
  faUser,
  faShieldAlt,
  faMapMarkerAlt,
  faCalendarAlt,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import BASE_URL from "../config";
import NavLayout from "./NavLayout";
import AdminLayout from "./AdminLayout";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function ProgramDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Theme and user state
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
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/programs/${id}`);
        console.log("Fetched program:", response.data);
        setProgram(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching program:", err);
        setError("Failed to load program details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProgram();
    }
  }, [id]);

  const handleThemeToggle = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Ongoing';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const calculateProgress = () => {
    if (!program?.goal || !program?.raised) return 0;
    return Math.min(Math.round((program.raised / program.goal) * 100), 100);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8F3E8] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading program details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !program) {
    return (
      <div className="min-h-screen bg-[#E8F3E8] dark:bg-gray-900 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">Program Not Found</h2>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6">
            {error || `Program with ID ${id} not found`}
          </p>
          <button
            onClick={() => navigate("/programs")}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2 text-sm sm:text-base"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  // Main content component
  const ProgramContent = () => (
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

              {!user && (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin badge for logged-in admin users */}
      {user && user.role === "admin" && (
        <div className="bg-blue-600 text-white py-1 px-4 text-center text-sm">
          <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
          Admin Access - Viewing program details
        </div>
      )}

      {/* Main Content */}
      <div className="py-6 sm:py-8 md:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Program Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6">
            {/* Program Image (if available) */}
            {program.image && (
              <div className="h-48 sm:h-64 md:h-80 w-full overflow-hidden">
                <img 
                  src={program.image} 
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-5 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 dark:text-green-400">
                  {program.title}
                </h1>
                
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs sm:text-sm font-semibold self-start">
                  {program.status || "Funding Open"}
                </span>
              </div>

              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {program.description}
              </p>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {program.location && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      <span className="text-xs sm:text-sm font-medium">Location</span>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      {program.location}
                    </p>
                  </div>
                )}
                
                {program.goal && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                      <span className="text-sm">💰</span>
                      <span className="text-xs sm:text-sm font-medium">Goal</span>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(program.goal)}
                    </p>
                  </div>
                )}
                
                {program.raised !== undefined && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                      <span className="text-sm">📊</span>
                      <span className="text-xs sm:text-sm font-medium">Raised</span>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(program.raised)}
                    </p>
                  </div>
                )}
                
                {program.participants && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                      <FontAwesomeIcon icon={faUsers} />
                      <span className="text-xs sm:text-sm font-medium">Participants</span>
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      {program.participants.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {program.goal && program.raised !== undefined && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{calculateProgress()}%</span>
                  </div>
                  <div className="w-full h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-xs sm:text-sm mt-2 text-gray-600 dark:text-gray-400">
                    {formatCurrency(program.raised)} raised of {formatCurrency(program.goal)} goal
                  </p>
                </div>
              )}

              {/* Additional Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-gray-200 dark:border-gray-700 pt-6">
                {program.start_date && (
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</span>
                    <span className="text-gray-900 dark:text-white flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600" />
                      {formatDate(program.start_date)}
                    </span>
                  </div>
                )}
                
                {program.end_date && (
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</span>
                    <span className="text-gray-900 dark:text-white flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600" />
                      {formatDate(program.end_date)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => navigate(`/donate/${program.id}`)}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition font-semibold flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg hover:shadow-xl"
            >
              <FontAwesomeIcon icon={faHandHoldingHeart} />
              Support This Program
            </button>

            <button
              onClick={() => navigate("/programs")}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-3.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold text-sm sm:text-base"
            >
              Browse More Programs
            </button>
          </div>

          {/* Back to top button for mobile */}
          <div className="mt-4 text-center sm:hidden">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-green-600 dark:text-green-400 text-sm"
            >
              ↑ Back to top
            </button>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation for non-logged-in users */}
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

  // Return with appropriate layout based on user role
  if (user) {
    if (user.role === "admin") {
      return (
        <AdminLayout user={user}>
          <ProgramContent />
        </AdminLayout>
      );
    } else {
      return (
        <NavLayout user={user}>
          <ProgramContent />
        </NavLayout>
      );
    }
  }

  // No user logged in
  return <ProgramContent />;
}