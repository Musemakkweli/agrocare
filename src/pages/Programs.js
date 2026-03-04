// src/pages/Programs.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling, faWater, faBug, faHandHoldingHeart, faTractor, faLeaf } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading programs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-200 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-md max-w-md">
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

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 transition-all duration-300">
      {/* PAGE HEADER */}
      <section className="bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-700 py-10 text-center text-white shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Agricultural Programs</h1>
        <p className="text-green-100">Explore ongoing initiatives supporting farmers across Rwanda</p>
      </section>

      {/* PROGRAM LIST */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No programs available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 transform hover:-translate-y-1"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                    <FontAwesomeIcon 
                      icon={getProgramIcon(program.icon)} 
                      className="text-green-600 dark:text-green-400 text-2xl" 
                    />
                  </div>
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-300 flex-1">
                    {program.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <strong>Location:</strong> {program.location || "Rwanda"}
                </p>

                <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">
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
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(program.status)}`}>
                    {program.status || "Funding Open"}
                  </span>

                  <button 
                    onClick={() => navigate(`/programs/${program.id}`)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold shadow hover:bg-green-700 transition transform hover:scale-105"
                  >
                    <FontAwesomeIcon icon={faHandHoldingHeart} />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}