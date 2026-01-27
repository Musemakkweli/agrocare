import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLeaf, faExclamationTriangle, faRobot, faComments, faGlobe, faBell, faHome
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [language, setLanguage] = useState("EN");

  const [alerts] = useState([
    { id: 1, message: "⚠️ Possible pest outbreak in Huye sector - maize crops" },
    { id: 2, message: "🌱 Fertilizer stock low in Nyamagabe district" }
  ]);

  const trendingPrograms = [
    { id: 1, title: "Maize Pest Control Fund", desc: "Support farmers in pest management.", color: "bg-yellow-200 dark:bg-yellow-700" },
    { id: 2, title: "Organic Fertilizer Initiative", desc: "Donate to supply eco-friendly fertilizers.", color: "bg-green-200 dark:bg-green-700" },
    { id: 3, title: "Irrigation Expansion", desc: "Help farmers access better water systems.", color: "bg-blue-200 dark:bg-blue-700" }
  ];

  useEffect(() => {
    const root = document.documentElement;
    theme === "dark" ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const goHome = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 transition-all duration-300">

      {/* =================== HEADER (FIXED) =================== */}
      <header className="bg-green-600 dark:bg-green-800 py-4 shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faLeaf} className="text-white text-2xl" />
            <span className="text-xl font-bold text-white">AgroCare</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Dark/Light Toggle */}
            <div 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-14 h-7 flex items-center bg-green-300 dark:bg-green-700 rounded-full p-1 cursor-pointer relative"
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${theme === "dark" ? "translate-x-7" : ""}`}></div>
            </div>

            {/* Home Icon */}
            <FontAwesomeIcon 
              icon={faHome} 
              className="text-white text-2xl hover:text-green-300 transition cursor-pointer"
              onClick={goHome} 
              title="Home"
            />

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(lang => lang === "EN" ? "RW" : lang === "RW" ? "FR" : "EN")}
              className="px-4 py-2 rounded-lg bg-white text-green-600 dark:bg-green-700 dark:text-white font-semibold shadow hover:shadow-lg transition"
            >
              {language}
            </button>

            {/* Login/Register */}
            <button 
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg bg-white text-green-600 font-semibold shadow hover:shadow-lg transition"
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      {/* =================== HERO SECTION =================== */}
      <section className="max-w-7xl mx-auto px-6 py-12 my-6 bg-gray-100 dark:bg-slate-800 rounded-2xl shadow-md">
        <h1 className="text-3xl md:text-5xl font-bold text-green-800 dark:text-green-400 mb-4">
          Welcome to AgroCare
        </h1>
        <p className="text-gray-700 dark:text-gray-200 text-lg max-w-3xl mb-6">
          Helping farmers protect crops, connect with agronomists, and attract donor support across Rwanda and beyond.
        </p>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mb-4">
          <button onClick={() => navigate("/login")} className="px-6 py-3 rounded-lg bg-green-600 dark:bg-green-500 text-white font-bold shadow hover:bg-green-700 hover:scale-105 transition transform duration-200">
            Report Crop Issue
          </button>
          <button
  onClick={() => navigate("/programs")}
  className="px-6 py-3 rounded-lg bg-blue-600 dark:bg-blue-500 text-white font-bold shadow hover:bg-blue-700 transition"
>
  Explore Programs
</button>
        </div>
      </section>

      {/* =================== ALERTS =================== */}
      <section className="px-6 pb-10 max-w-5xl mx-auto">
        <h2 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-3 flex items-center space-x-2">
          <FontAwesomeIcon icon={faBell} className="text-yellow-500" />
          <span>Alerts</span>
        </h2>
        <ul className="space-y-2">
          {alerts.map(alert => (
            <li
              key={alert.id}
              className="backdrop-blur-sm bg-yellow-100/60 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-200 rounded-lg px-4 py-2 text-sm shadow-sm hover:shadow-md transition"
            >
              {alert.message}
            </li>
          ))}
        </ul>
      </section>

      {/* =================== QUICK ACTIONS =================== */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: faExclamationTriangle, color: "text-red-500", title: "Report a Problem", desc: "Report crop damage or pest attacks." },
            { icon: faRobot, color: "text-blue-500", title: "AI Diagnosis", desc: "Detect crop diseases automatically." },
            { icon: faComments, color: "text-green-500", title: "Agronomist Chat", desc: "Talk directly with experts." },
            { icon: faGlobe, color: "text-yellow-500", title: "Donor Support", desc: "Support farmer programs and projects." }
          ].map((item, index) => (
            <div 
              key={index} 
              className="group bg-gray-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 dark:hover:border-green-700"
            >
              <div className="flex flex-col items-center text-center">
                <FontAwesomeIcon icon={item.icon} className={`${item.color} text-4xl mb-4 transition-transform duration-300 group-hover:scale-110`} />
                <h3 className="font-bold text-lg text-green-800 dark:text-green-200 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================== TRENDING PROGRAMS =================== */}
      <section className="px-6 pb-12 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-6">Trending Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingPrograms.map(program => (
            <div key={program.id} className={`${program.color} rounded-2xl p-6 shadow hover:shadow-xl transition transform hover:-translate-y-1`}>
              <h3 className="font-bold text-lg mb-2 text-green-800 dark:text-green-200">{program.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{program.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =================== HOW IT WORKS =================== */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-8 text-center">How AgroCare Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "Farmers report problems or upload plant images.",
            "Agronomists analyze and suggest solutions.",
            "Leaders and donors provide direct support.",
            "Track crop health on your dashboard."
          ].map((text, index) => (
            <div
              key={index}
              className="group bg-gray-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-6 shadow-md transition-all duration-300 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 dark:hover:border-green-700 hover:shadow-xl"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg shadow">{index + 1}</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================== FOOTER =================== */}
      <footer className="bg-green-700 dark:bg-green-900 py-6 text-center text-white font-semibold">
        &copy; {new Date().getFullYear()} AgroCare. All rights reserved.
      </footer>

    </div>
  );
}
