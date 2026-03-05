import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faExclamationCircle,
  faRobot,
  faComments,
  faGlobe,
  faTimes,
  faImage,
  faSpinner,
  faBug,
  faBars,
  faUser,
  faArrowRight,
  faSeedling,
  faWater,
  faTractor,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { sendMessageToAI } from "../services/aiService";
import axios from "axios";
import BASE_URL from "../config";

// Icon map (same as Programs page)
const iconMap = {
  seedling: faSeedling,
  water: faWater,
  bug: faBug,
  tractor: faTractor,
  leaf: faLeaf,
  default: faSeedling
};

export default function Home() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [language, setLanguage] = useState("EN");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Programs state
  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programsError, setProgramsError] = useState(null);

  /* ================= AI CHAT STATE ================= */
  const [openAI, setOpenAI] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "👋 Hi, I'm eLIMA AI. Ask me anything about your crops, or upload a photo of a plant for disease diagnosis." }
  ]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch trending programs
  const fetchTrendingPrograms = async () => {
    try {
      setProgramsLoading(true);
      const response = await axios.get(`${BASE_URL}/api/programs`);
      console.log("Fetched programs for home:", response.data);
      
      // Get first 3 programs or sort by some criteria for "trending"
      const trending = response.data.slice(0, 3);
      setPrograms(trending);
      setProgramsError(null);
    } catch (err) {
      console.error("Error fetching programs:", err);
      setProgramsError("Could not load programs");
      // Fallback to empty array
      setPrograms([]);
    } finally {
      setProgramsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingPrograms();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    setMessages(prev => [
      ...prev,
      { from: "user", text: `📎 Image ready for analysis: ${file.name}` }
    ]);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
  };

  const alerts = [
    { id: 1, message: "Possible pest outbreak in Huye sector affecting maize crops." },
    { id: 2, message: "Fertilizer stock is low in Nyamagabe district." }
  ];

  useEffect(() => {
    const root = document.documentElement;
    theme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  //const goHome = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || aiLoading) return;

    const userMessageText = input.trim() || (selectedImage ? "Analyzing plant image..." : "");
    
    setMessages(prev => [...prev, { from: "user", text: userMessageText }]);
    
    setInput("");
    setAiLoading(true);

    try {
      setMessages(prev => [...prev, { from: "ai", text: "🌱 Thinking...", isLoading: true }]);

      const aiResponse = await sendMessageToAI(userMessageText, selectedImage);
      
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, { from: "ai", text: aiResponse }];
      });

      if (selectedImage) {
        removeImage();
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }

    } catch (error) {
      console.error("Error sending message:", error);
      
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, { 
          from: "ai", 
          text: "🌱 Sorry, I encountered an error. Please try again later." 
        }];
      });
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleQuickComplaint = () => {
    navigate("/public-complaint");
  };

  // Get icon for program
  const getProgramIcon = (iconName) => {
    return iconMap[iconName?.toLowerCase()] || iconMap.default;
  };

  return (
    <div className="min-h-screen bg-[#E8F3E8] dark:bg-gray-900 transition-all">

      {/* ================= MOBILE-FIRST HEADER ================= */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 fixed top-0 w-full z-50 shadow-lg">
        <div className="px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <FontAwesomeIcon icon={faLeaf} className="text-white text-lg sm:text-xl" />
            </div>
            <span className="text-white font-bold text-base sm:text-lg">eLIMA</span>
          </div>

          {/* Desktop Menu - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-white/90 hover:text-white px-2 py-1 rounded-md text-sm transition"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>

            <button
              onClick={() =>
                setLanguage(l => l === "EN" ? "RW" : l === "RW" ? "FR" : "EN")
              }
              className="text-white border border-white/30 px-3 py-1 rounded-md text-sm hover:bg-white/10"
            >
              {language}
            </button>

            <button 
              onClick={() => navigate("/login")} 
              className="text-white hover:text-green-200 text-sm flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faUser} /> Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="bg-white text-green-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-green-50 transition shadow-md"
            >
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-white text-sm"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-1"
            >
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-green-100 dark:border-gray-700 shadow-lg">
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  setLanguage(l => l === "EN" ? "RW" : l === "RW" ? "FR" : "EN");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg"
              >
                Language: {language}
              </button>
              <button
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faUser} className="text-green-600" /> Login
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="h-14 sm:h-16"></div>

      {/* ================= MOBILE-FRIENDLY HERO ================= */}
      <section className="mx-4 sm:mx-6 lg:mx-8 px-4 sm:px-8 py-8 sm:py-12 lg:py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mt-4 sm:mt-8">
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-green-700 dark:text-green-400 mb-3 sm:mb-6">
          Welcome to eLIMA
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-10">
          Empowering farmers to report crop issues, access expert agronomists, and receive support.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition text-sm sm:text-base shadow-md"
          >
            Login / Register
          </button>

          <button
            onClick={() => navigate("/programs")}
            className="w-full sm:w-auto bg-blue-50 text-blue-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-100 transition text-sm sm:text-base border border-blue-200"
          >
            Explore Programs
          </button>

          <button
            onClick={handleQuickComplaint}
            className="w-full sm:w-auto bg-green-50 text-green-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-green-100 transition flex items-center justify-center gap-2 border border-green-200 text-sm sm:text-base"
          >
            <FontAwesomeIcon icon={faBug} className="text-green-600" />
            Report Issue
          </button>
        </div>
      </section>

      {/* ================= ALERTS ================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
        <h2 className="text-lg sm:text-xl font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-green-500 rounded-full"></span>
          Alerts
        </h2>
        <div className="space-y-2">
          {alerts.map(a => (
            <div
              key={a.id}
              className="bg-white dark:bg-gray-800 border-l-4 border-green-500 px-4 py-3 rounded-lg text-xs sm:text-sm shadow-sm"
            >
              {a.message}
            </div>
          ))}
        </div>
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <h2 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400 mb-6 sm:mb-8">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {[ 
            { icon: faExclamationCircle, title: "Report Problem", desc: "Report crop damage or pests." },
            { icon: faRobot, title: "AI Diagnosis", desc: "Ask eLIMA AI anytime." },
            { icon: faComments, title: "Agronomist Chat", desc: "Chat with experts." },
            { icon: faGlobe, title: "Donor Support", desc: "Support farming programs." }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 sm:p-6
                         hover:border-green-500 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => {
                if (i === 0) handleQuickComplaint();
                else if (i === 1) setOpenAI(true);
                else if (i === 2) navigate("/login");
                else if (i === 3) navigate("/programs");
              }}
            >
              <FontAwesomeIcon icon={item.icon} className="text-green-600 text-2xl sm:text-3xl mb-3" />
              <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-base sm:text-lg">{item.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TRENDING PROGRAMS - FETCHED FROM API ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 lg:pb-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">
            Trending Programs
          </h2>
          <button
            onClick={() => navigate("/programs")}
            className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>

        {programsLoading ? (
          <div className="flex justify-center items-center py-12">
            <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-green-600" />
          </div>
        ) : programsError ? (
          <div className="text-center py-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{programsError}</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No programs available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {programs.map(program => (
              <div
                key={program.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 sm:p-6
                           hover:border-green-500 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/programs/${program.id}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                    <FontAwesomeIcon 
                      icon={getProgramIcon(program.icon)} 
                      className="text-green-600 dark:text-green-400 text-xl" 
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white text-base sm:text-lg flex-1">
                    {program.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {program.description}
                </p>

                {/* Progress Bar (if goal and raised exist) */}
                {program.goal && program.raised !== undefined && (
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {Math.min(Math.round((program.raised / program.goal) * 100), 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600 rounded-full"
                        style={{ width: `${Math.min((program.raised / program.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                    {program.location || "Rwanda"}
                  </span>
                  <span className="text-green-600 text-xs sm:text-sm font-medium flex items-center gap-1">
                    Learn more <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= HOW E-LIMA WORKS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 lg:pb-24">
        <h2 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400 mb-8 text-center">
          How eLIMA Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {[
            "Farmers report crop problems or upload images.",
            "Agronomists analyze and give solutions.",
            "Leaders and donors provide support.",
            "Farmers track progress on dashboards."
          ].map((text, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 sm:p-6
                         hover:border-green-500 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center font-bold text-sm sm:text-base mb-3 shadow-md">
                  {index + 1}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gradient-to-r from-green-700 to-green-800 dark:from-green-900 dark:to-green-950 text-white text-center py-4 sm:py-5 text-xs sm:text-sm">
        <p>© {new Date().getFullYear()} eLIMA. Empowering farmers across Africa</p>
      </footer>

      {/* ================= AI FLOAT CHAT - Mobile Optimized ================= */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {!openAI && (
          <button
            onClick={() => setOpenAI(true)}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
          >
            <FontAwesomeIcon icon={faRobot} className="text-xl sm:text-2xl" />
          </button>
        )}

        {openAI && (
          <div className="w-[calc(100vw-2rem)] sm:w-96 max-w-[400px] h-[500px] sm:h-[32rem] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col border dark:border-gray-700 fixed bottom-4 right-4 sm:bottom-6 sm:right-6">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 flex justify-between items-center rounded-t-xl">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faRobot} />
                <span className="font-semibold text-sm sm:text-base">eLIMA AI</span>
              </div>
              <FontAwesomeIcon
                icon={faTimes}
                className="cursor-pointer hover:text-green-200 text-lg"
                onClick={() => setOpenAI(false)}
              />
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === "ai" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg max-w-[85%] sm:max-w-[80%] ${
                      m.from === "ai"
                        ? "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-100"
                        : "bg-blue-500 text-white ml-auto"
                    } ${m.isLoading ? "animate-pulse" : ""}`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="px-3 py-2 border-t dark:border-slate-700">
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-lg border"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-2 sm:p-3 border-t dark:border-slate-700">
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full flex-shrink-0 ${
                    selectedImage ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300 dark:bg-slate-700'
                  }`}
                  disabled={aiLoading}
                >
                  <FontAwesomeIcon icon={faImage} className="text-sm sm:text-base" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={aiLoading}
                />

                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === "Enter" && sendMessage()}
                  placeholder="Ask about your crop..."
                  className="flex-1 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg border focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-slate-700 dark:border-slate-600"
                  disabled={aiLoading}
                />

                <button
                  onClick={sendMessage}
                  disabled={(!input.trim() && !selectedImage) || aiLoading}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex-shrink-0 ${
                    (!input.trim() && !selectedImage) || aiLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {aiLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}