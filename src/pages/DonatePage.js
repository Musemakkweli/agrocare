// src/pages/DonatePage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, 
  faHome, 
  faSun, 
  faMoon,
  faUser,
  faShieldAlt 
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import BASE_URL from "../config";
import visaLogo from "../assets/visa.png";
import mastercardLogo from "../assets/mastercard.png";
import paypalLogo from "../assets/paypal.jpg";
import mtnLogo from "../assets/mtn.jpg";
import airtelLogo from "../assets/airtel.png";
import bankLogo from "../assets/bank.jpg";
import NavLayout from "./NavLayout";
import AdminLayout from "./AdminLayout";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default function DonatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [donorName, setDonorName] = useState("");
  const [cardInfo, setCardInfo] = useState({ 
    card_number: "", 
    card_holder: "", 
    expiry_date: "", 
    cvv: ""
  });
  const [mobileNumber, setMobileNumber] = useState("");
  const [bankDetails, setBankDetails] = useState({ 
    bank_name: "", 
    account_number: "",
    account_holder: ""
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
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

  useEffect(() => {
    try {
      if (user?.full_name || user?.name) {
        setDonorName(user.full_name || user.name);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, [user]);

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

  const calculateProgress = () => {
    if (!program) return 0;
    return Math.min(Math.round((program.raised / program.goal) * 100), 100);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!donation || parseFloat(donation) <= 0) {
      errors.donation = "Please enter a valid donation amount";
    }
    
    if (!paymentMethod) {
      errors.paymentMethod = "Please select a payment method";
    }
    
    if (paymentMethod === "Visa" || paymentMethod === "Mastercard") {
      if (!cardInfo.card_holder) errors.card_holder = "Cardholder name is required";
      if (!cardInfo.card_number) errors.card_number = "Card number is required";
      if (!cardInfo.expiry_date) errors.expiry_date = "Expiry date is required";
      if (!cardInfo.cvv) errors.cvv = "CVV is required";
    }
    
    if (paymentMethod === "MTN" || paymentMethod === "Airtel") {
      if (!mobileNumber) errors.mobileNumber = "Phone number is required";
    }
    
    if (paymentMethod === "Bank") {
      if (!bankDetails.bank_name) errors.bank_name = "Bank name is required";
      if (!bankDetails.account_number) errors.account_number = "Account number is required";
      if (!bankDetails.account_holder) errors.account_holder = "Account holder name is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setProcessing(true);
    setError(null);
    setValidationErrors({});

    try {
      const donationAmount = parseFloat(donation);
      
      const donationData = {
        program_id: parseInt(id),
        donor_name: donorName || "Anonymous Donor",
        amount: donationAmount,
        user_id: user?.id || null
      };

      let response;

      switch(paymentMethod) {
        case "Visa":
        case "Mastercard":
          response = await api.post("/api/donations/card", {
            ...donationData,
            card_info: {
              number: cardInfo.card_number.replace(/\s/g, ''),
              name: cardInfo.card_holder,
              expiry: cardInfo.expiry_date,
              card_type: paymentMethod.toLowerCase()
            }
          });
          break;

        case "MTN":
        case "Airtel":
          response = await api.post("/api/donations/mobile", {
            ...donationData,
            mobile_number: mobileNumber
          });
          break;

        case "Bank":
          response = await api.post("/api/donations/bank", {
            ...donationData,
            bank_details: {
              bank_name: bankDetails.bank_name,
              account_number: bankDetails.account_number,
              account_holder: bankDetails.account_holder
            }
          });
          break;

        case "PayPal":
          response = await api.post("/api/donations/card", {
            ...donationData,
            card_info: {
              number: "PAYPAL",
              name: donorName || "Anonymous Donor",
              expiry: "12/99",
              card_type: "paypal"
            }
          });
          break;
          
        default:
          throw new Error("Unsupported payment method");
      }

      if (response.data) {
        setSuccess(true);
        
        const donations = JSON.parse(localStorage.getItem("donations") || "[]");
        donations.push({
          ...response.data,
          program_title: program.title,
          date: new Date().toISOString()
        });
        localStorage.setItem("donations", JSON.stringify(donations));

        setTimeout(() => {
          navigate(`/donation-success/${response.data.id}`);
        }, 2000);
      }

    } catch (err) {
      console.error("Donation error:", err);
      
      if (err.response) {
        if (err.response.status === 422) {
          const backendErrors = err.response.data;
          let errorMessage = "Validation failed: ";
          if (typeof backendErrors === 'object') {
            errorMessage += JSON.stringify(backendErrors, null, 2);
          } else {
            errorMessage += backendErrors;
          }
          setError(errorMessage);
        } else {
          setError(
            err.response?.data?.detail || 
            "Failed to process donation. Please try again."
          );
        }
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 0) {
      value = value.match(/.{1,4}/g)?.join(' ') || value;
    }
    setCardInfo({ ...cardInfo, card_number: value });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\//g, '');
    if (value.length >= 2) {
      value = value.slice(0,2) + '/' + value.slice(2,4);
    }
    setCardInfo({ ...cardInfo, expiry_date: value });
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
  if (error && !program) {
    return (
      <div className="min-h-screen bg-[#E8F3E8] dark:bg-gray-900 py-12 px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate("/programs")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-[#E8F3E8] dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Donation Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for supporting {program?.title}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            Redirecting to receipt...
          </p>
        </div>
      </div>
    );
  }

  // Determine which layout to use based on user role
  const DonationContent = () => (
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

      {/* Admin badge for logged-in users */}
      {user && user.role === "admin" && (
        <div className="bg-blue-600 text-white py-1 px-4 text-center text-sm">
          <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
          Admin Access - You're viewing as administrator
        </div>
      )}

      {/* Main Content */}
      <div className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Program Summary Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 sm:p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
                  {program?.title}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                  {program?.description}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg min-w-[180px]">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Program Status</p>
                <p className="text-base sm:text-lg font-semibold text-green-700 dark:text-green-400">
                  {program?.status || "Funding Open"}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs sm:text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(program?.raised || 0)} of {formatCurrency(program?.goal || 0)}
                </span>
              </div>
              <div className="w-full h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <p className="text-right text-xs sm:text-sm mt-1 text-gray-600 dark:text-gray-400">
                {calculateProgress()}% funded
              </p>
            </div>
          </div>

          {/* Donation Form Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Make a Donation
            </h2>

            {error && (
              <div className="mb-6 p-3 sm:p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm sm:text-base text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Donor Name */}
              <div>
                <label className="block mb-2 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
                  Your Name <span className="text-gray-400 text-xs sm:text-sm">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Enter your name or leave anonymous"
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Donation Amount */}
              <div>
                <label className="block mb-2 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
                  Donation Amount (RWF)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 sm:top-3 text-xs sm:text-sm text-gray-500">RWF</span>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={donation}
                    onChange={(e) => setDonation(e.target.value)}
                    placeholder="1000"
                    required
                    className={`w-full pl-12 sm:pl-14 p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border ${
                      validationErrors.donation ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                </div>
                {validationErrors.donation && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{validationErrors.donation}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {[5000, 10000, 25000, 50000, 100000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setDonation(amount)}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      {amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block mb-3 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
                  Select Payment Method
                </label>
                {validationErrors.paymentMethod && (
                  <p className="text-red-500 text-xs sm:text-sm mb-2">{validationErrors.paymentMethod}</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                  {[
                    { name: "Visa", logo: visaLogo },
                    { name: "Mastercard", logo: mastercardLogo },
                    { name: "PayPal", logo: paypalLogo },
                    { name: "MTN", logo: mtnLogo },
                    { name: "Airtel", logo: airtelLogo },
                    { name: "Bank", logo: bankLogo },
                  ].map((method) => (
                    <button
                      key={method.name}
                      type="button"
                      onClick={() => setPaymentMethod(method.name)}
                      className={`flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 border-2 rounded-lg transition-all ${
                        paymentMethod === method.name 
                          ? "border-green-600 bg-green-50 dark:bg-green-900/20" 
                          : "border-gray-200 dark:border-gray-700 hover:border-green-400"
                      }`}
                    >
                      <img src={method.logo} alt={method.name} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                        {method.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Specific Forms */}
              {(paymentMethod === "Visa" || paymentMethod === "Mastercard") && (
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white">Card Details</h3>
                  
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardInfo.card_holder}
                      onChange={(e) => setCardInfo({ ...cardInfo, card_holder: e.target.value })}
                      required
                      className={`w-full p-2.5 sm:p-3 text-sm rounded-lg border ${
                        validationErrors.card_holder ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 dark:text-white`}
                      placeholder="John Doe"
                    />
                    {validationErrors.card_holder && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.card_holder}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardInfo.card_number}
                      onChange={handleCardNumberChange}
                      required
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={`w-full p-2.5 sm:p-3 text-sm rounded-lg border ${
                        validationErrors.card_number ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 dark:text-white`}
                    />
                    {validationErrors.card_number && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.card_number}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardInfo.expiry_date}
                        onChange={handleExpiryChange}
                        required
                        placeholder="MM/YY"
                        maxLength="5"
                        className={`w-full p-2.5 sm:p-3 text-sm rounded-lg border ${
                          validationErrors.expiry_date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 dark:text-white`}
                      />
                      {validationErrors.expiry_date && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.expiry_date}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                        required
                        placeholder="***"
                        maxLength="3"
                        className={`w-full p-2.5 sm:p-3 text-sm rounded-lg border ${
                          validationErrors.cvv ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 dark:text-white`}
                      />
                      {validationErrors.cvv && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.cvv}</p>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    🔒 Your payment information is secure and encrypted
                  </p>
                </div>
              )}

              {paymentMethod === "PayPal" && (
                <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3">
                    You'll be redirected to PayPal to complete your donation.
                  </p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure payment via PayPal</span>
                  </div>
                </div>
              )}

              {(paymentMethod === "MTN" || paymentMethod === "Airtel") && (
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white">
                    {paymentMethod} Mobile Money
                  </h3>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                      placeholder="078X XXX XXX"
                      className={`w-full p-2.5 sm:p-3 text-sm rounded-lg border ${
                        validationErrors.mobileNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 dark:text-white`}
                    />
                    {validationErrors.mobileNumber && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.mobileNumber}</p>
                    )}
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 sm:p-3 rounded-lg">
                    <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
                      📱 You'll receive a prompt on your phone to confirm the payment
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === "Bank" && (
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white">Bank Transfer</h3>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                      Transfer to:
                    </p>
                    <ul className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li><span className="font-medium">Bank:</span> Bank of Kigali</li>
                      <li><span className="font-medium">Account Name:</span> AgroCare Foundation</li>
                      <li><span className="font-medium">Account Number:</span> 4001122334455</li>
                      <li><span className="font-medium">Branch:</span> Kigali Main</li>
                      <li><span className="font-medium">Swift Code:</span> BKGIRWRW</li>
                    </ul>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Your Bank Name
                    </label>
                    <input
                      type="text"
                      value={bankDetails.bank_name}
                      onChange={(e) => setBankDetails({ ...bankDetails, bank_name: e.target.value })}
                      required
                      placeholder="e.g., Bank of Kigali"
                      className={`w-full p-2.5 sm:p-3 text-sm rounded-lg border ${
                        validationErrors.bank_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 dark:text-white`}
                    />
                    {validationErrors.bank_name && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.bank_name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.account_number}
                      onChange={(e) => setBankDetails({ ...bankDetails, account_number: e.target.value })}
                      required
                      placeholder="Your account number"
                      className={`w-full p-2.5 sm:p-3 text-sm rounded-lg border ${
                        validationErrors.account_number ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 dark:text-white`}
                    />
                    {validationErrors.account_number && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.account_number}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={bankDetails.account_holder}
                      onChange={(e) => setBankDetails({ ...bankDetails, account_holder: e.target.value })}
                      required
                      placeholder="Name on the account"
                      className={`w-full p-2.5 sm:p-3 text-sm rounded-lg border ${
                        validationErrors.account_holder ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 dark:text-white`}
                    />
                    {validationErrors.account_holder && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.account_holder}</p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ⏱️ Bank transfers may take 1-2 business days to process
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 transition font-semibold text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!paymentMethod || !donation || processing}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Donate {donation && formatCurrency(parseFloat(donation))}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
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
          <DonationContent />
        </AdminLayout>
      );
    } else {
      return (
        <NavLayout user={user}>
          <DonationContent />
        </NavLayout>
      );
    }
  }

  // No user logged in
  return <DonationContent />;
}