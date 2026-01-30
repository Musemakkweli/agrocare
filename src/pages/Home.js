import React, { useState, useEffect, useRef } from "react"; // added useRef
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faExclamationCircle,
  faRobot,
  faComments,
  faGlobe,
  faHome,
  faTimes,
  faPlus
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // ====== ADDED REF FOR FILE UPLOAD ======
  const fileInputRef = useRef(null);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [language, setLanguage] = useState("EN");

  /* ================= AI CHAT STATE ================= */
  const [openAI, setOpenAI] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "👋 Hi, I’m AgroCare AI. Ask me anything about your crops." }
  ]);
  const [input, setInput] = useState("");

  // ====== ADDED FILE UPLOAD HANDLER ======
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessages(prev => [
      ...prev,
      { from: "user", text: `📎 Uploaded: ${file.name}` }
    ]);
  };

  const alerts = [
    { id: 1, message: "Possible pest outbreak in Huye sector affecting maize crops." },
    { id: 2, message: "Fertilizer stock is low in Nyamagabe district." }
  ];

  const trendingPrograms = [
    { id: 1, title: "Maize Pest Control Fund", desc: "Support farmers in pest management." },
    { id: 2, title: "Organic Fertilizer Initiative", desc: "Donate eco-friendly fertilizers." },
    { id: 3, title: "Irrigation Expansion", desc: "Help farmers access irrigation systems." }
  ];

  useEffect(() => {
    const root = document.documentElement;
    theme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const goHome = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 transition-all">


      {/* ================= HEADER ================= */}
      <header className="bg-green-700 dark:bg-green-900 fixed top-0 w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faLeaf} className="text-white text-xl" />
            <span className="text-white font-semibold text-lg">AgroCare</span>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-white hover:text-green-200 transition"
            >
              {theme === "dark" ? "🌞" : "🌙"}
            </button>

            <FontAwesomeIcon
              icon={faHome}
              className="text-white cursor-pointer hover:text-green-200"
              onClick={goHome}
            />

            <button
              onClick={() =>
                setLanguage(l => l === "EN" ? "RW" : l === "RW" ? "FR" : "EN")
              }
              className="text-white border border-white/40 px-3 py-1 rounded-md hover:bg-white/10"
            >
              {language}
            </button>

            <button onClick={() => navigate("/login")} className="text-white hover:text-green-200">
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="border border-green-300 text-green-100 px-3 py-1 rounded-md hover:bg-green-600/20"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <div className="h-16"></div>

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-8 py-20 bg-gray-100 dark:bg-slate-800 rounded-2xl shadow mt-8">
        <h1 className="text-5xl font-bold text-green-800 dark:text-green-400 mb-6">
          Welcome to AgroCare
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg max-w-3xl mb-10">
          Empowering farmers to report crop issues, access expert agronomists, and receive
          support from leaders and donors.
        </p>

        <div className="flex gap-5">
          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition"
          >
            Report Crop Issue
          </button>

          <button
            onClick={() => navigate("/programs")}
            className="bg-blue-100 text-blue-700 px-6 py-3 rounded-md font-semibold hover:bg-blue-200 transition"
          >
            Explore Programs
          </button>
        </div>
      </section>

      {/* ================= ALERTS ================= */}
      <section className="max-w-5xl mx-auto px-6 mt-12">
        <h2 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-3">
          Alerts
        </h2>
        <ul className="space-y-2">
          {alerts.map(a => (
            <li
              key={a.id}
              className="bg-white dark:bg-slate-800 border-l-4 border-green-500 px-4 py-2 rounded-md text-sm"
            >
              {a.message}
            </li>
          ))}
        </ul>
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-8">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[ 
            { icon: faExclamationCircle, title: "Report Problem", desc: "Report crop damage or pests." },
            { icon: faRobot, title: "AI Diagnosis", desc: "Ask AgroCare AI anytime." },
            { icon: faComments, title: "Agronomist Chat", desc: "Chat with experts." },
            { icon: faGlobe, title: "Donor Support", desc: "Support farming programs." }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-6
                         hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition"
            >
              <FontAwesomeIcon icon={item.icon} className="text-green-600 text-3xl mb-3" />
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TRENDING PROGRAMS ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-6">
          Trending Programs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingPrograms.map(p => (
            <div
              key={p.id}
              className="bg-gray-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-6
                         hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
            >
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">{p.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW AGROCARE WORKS ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-10 text-center">
          How AgroCare Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "Farmers report crop problems or upload images.",
            "Agronomists analyze and give solutions.",
            "Leaders and donors provide support.",
            "Farmers track progress on dashboards."
          ].map((text, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-6
                         hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-green-800 dark:bg-green-950 text-white text-center py-5 text-sm">
        © {new Date().getFullYear()} AgroCare. All rights reserved.
      </footer>

      {/* ================= AI FLOAT CHAT ================= */}
      <div className="fixed bottom-6 right-6 z-50">
        {!openAI && (
          <button
            onClick={() => setOpenAI(true)}
            className="w-12 h-12 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center text-white shadow-lg"
          >
            <FontAwesomeIcon icon={faRobot} />
          </button>
        )}

        {openAI && (
          <div className="w-80 h-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl flex flex-col border">
            <div className="bg-green-600 text-white px-4 py-2 flex justify-between items-center rounded-t-xl">
              <span className="font-semibold text-sm">AgroCare AI</span>
              <FontAwesomeIcon
                icon={faTimes}
                className="cursor-pointer"
                onClick={() => setOpenAI(false)}
              />
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-lg max-w-[80%] ${
                    m.from === "ai"
                      ? "bg-green-100 text-green-900"
                      : "bg-blue-100 text-blue-900 ml-auto"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* INPUT + UPLOAD */}
            <div className="p-2 border-t flex gap-2 items-center">
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />

              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about your crop..."
                className="flex-1 px-3 py-2 text-sm rounded border focus:outline-none focus:ring-1 focus:ring-green-500"
              />

              <button
                onClick={sendMessage}
                className="bg-green-600 hover:bg-green-700 text-white px-3 rounded text-sm"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
