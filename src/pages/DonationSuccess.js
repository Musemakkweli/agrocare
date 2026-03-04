// src/pages/DonationSuccess.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../config";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function DonationSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        setLoading(true);
        console.log("Fetching donation with ID:", id);
        
        // Only use API - no localStorage fallback
        const response = await api.get(`/api/donations/${id}`);
        console.log("API Response:", response.data);
        
        setDonation(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching donation:", err);
        if (err.response) {
          console.log("Error status:", err.response.status);
          console.log("Error data:", err.response.data);
          setError(`Server error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
        } else if (err.request) {
          setError("No response from server. Please check your connection.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDonation();
    }
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-200 dark:bg-slate-900 py-12 px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Donation</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Donation ID: {id}</p>
          <button
            onClick={() => navigate("/programs")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Browse Programs
          </button>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-gray-200 dark:bg-slate-900 py-12 px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Donation Not Found</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">No donation found with ID: {id}</p>
          <button
            onClick={() => navigate("/programs")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Browse Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You for Your Donation!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your generosity is making a difference in farmers' lives.
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg inline-block">
            <p className="text-sm text-gray-600 dark:text-gray-400">Donation Amount</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(donation.amount)}
            </p>
          </div>
        </div>

        {/* Receipt Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Donation Receipt
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
              <span className="font-mono font-semibold text-gray-900 dark:text-white">
                {donation.id}
              </span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Date:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatDate(donation.created_at || donation.date)}
              </span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Program ID:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                #{donation.program_id}
              </span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Donor Name:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {donation.donor_name || 'Anonymous'}
              </span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
              <span className="font-semibold text-gray-900 dark:text-white capitalize">
                {donation.payment_method || 'Unknown'}
              </span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              const text = `DONATION RECEIPT
========================
Transaction ID: ${donation.id}
Date: ${formatDate(donation.created_at || donation.date)}
Amount: ${formatCurrency(donation.amount)}
Donor: ${donation.donor_name || 'Anonymous'}
Program: #${donation.program_id}
Payment Method: ${donation.payment_method || 'Unknown'}
Status: Completed
========================
Thank you for your support!`;
              
              const blob = new Blob([text], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `receipt-${donation.id}.txt`;
              a.click();
            }}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Download Receipt
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
          >
            Print
          </button>
          
          <button
            onClick={() => navigate("/programs")}
            className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg"
          >
            Programs
          </button>
        </div>
      </div>
    </div>
  );
}