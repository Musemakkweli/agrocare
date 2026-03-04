// src/pages/ProgramDetails.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingHeart, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateProgress = () => {
    if (!program?.goal || !program?.raised) return 0;
    return Math.min(Math.round((program.raised / program.goal) * 100), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading program details...</p>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-gray-200 dark:bg-slate-900 py-12 px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Program Not Found</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error || `Program with ID ${id} not found`}</p>
          <button
            onClick={() => navigate("/programs")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/programs")}
          className="mb-4 px-4 py-2 bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition inline-flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Programs
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 space-y-6">
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">
            {program.title}
          </h1>

          <p className="text-gray-700 dark:text-gray-300">
            {program.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {program.location && (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <strong className="block text-gray-600 dark:text-gray-400 mb-1">Location</strong>
                <span className="text-gray-900 dark:text-white">{program.location}</span>
              </div>
            )}
            
            {program.goal && (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <strong className="block text-gray-600 dark:text-gray-400 mb-1">Funding Goal</strong>
                <span className="text-gray-900 dark:text-white">{formatCurrency(program.goal)}</span>
              </div>
            )}
            
            {program.raised !== undefined && (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <strong className="block text-gray-600 dark:text-gray-400 mb-1">Raised So Far</strong>
                <span className="text-green-600 dark:text-green-400 font-bold">{formatCurrency(program.raised)}</span>
              </div>
            )}
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <strong className="block text-gray-600 dark:text-gray-400 mb-1">Status</strong>
              <span className="px-3 py-1 inline-block rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-sm">
                {program.status || "Funding Open"}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          {program.goal && program.raised !== undefined && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
                <span className="font-bold text-green-600 dark:text-green-400">{calculateProgress()}%</span>
              </div>
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <p className="text-right text-sm mt-2 text-gray-600 dark:text-gray-400">
                {formatCurrency(program.raised)} raised of {formatCurrency(program.goal)} goal
              </p>
            </div>
          )}

          <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => navigate(`/donate/${program.id}`)}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faHandHoldingHeart} />
              Support This Program
            </button>

            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}