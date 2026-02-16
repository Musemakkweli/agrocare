import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faCalendarCheck,
  faBug,
  faCloudSun,
  faTriangleExclamation,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import NavLayout from "./NavLayout";
import BASE_URL from "../config";
import { useNavigate } from "react-router-dom";

export default function FarmerDashboard() {
  const [dailyActivity, setDailyActivity] = useState([]);
  const [cropHealth, setCropHealth] = useState([]);
  const [fields, setFields] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [pests, setPests] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Toggle states for forms
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [showHarvestForm, setShowHarvestForm] = useState(false);
  const [showPestForm, setShowPestForm] = useState(false);

  // Form states
  const [fieldForm, setFieldForm] = useState({ name: "", area: "", crop_type: "", location: "" });
  const [harvestForm, setHarvestForm] = useState({ field_id: "", crop_type: "", harvest_date: "" });
  const [pestForm, setPestForm] = useState({ field_id: "", pest_type: "", severity: "", description: "" });

  // ---------------------------
  // Load dashboard data
  // ---------------------------
  useEffect(() => {
    const loadDashboard = async () => {
      if (!user?.id) return;

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
      }
    };

    loadDashboard();
  }, [user?.id]);

  // ---------------------------
  // Mini card values
  // ---------------------------
  const cards = [
    { title: "Fields", value: fields.length, icon: faSeedling },
    { title: "Harvests", value: harvests.length, icon: faCalendarCheck },
    { title: "Pests", value: pests.length, icon: faBug },
    { title: "Weather", value: weatherAlerts.length, icon: faCloudSun },
    { title: "Complaints", value: complaints.length, icon: faTriangleExclamation },
  ];

  const weeklyActivity = dailyActivity.map(d => ({ week: d.day, value: d.value || 0 }));

  // ---------------------------
  // Navigate on mini card click
  // ---------------------------
  const handleCardClick = (title) => {
    switch (title) {
      case "Fields":
        navigate("/farmer/fields");
        break;
      case "Harvests":
        navigate("/farmer/harvests");
        break;
      case "Pests":
        navigate("/farmer/pests");
        break;
      case "Weather":
        navigate("/farmer/weather");
        break;
      case "Complaints":
        navigate("/report-complaint");
        break;
      default:
        alert(`${title} page is not available yet`);
    }
  };

  // ---------------------------
  // Quick action handlers
  // ---------------------------
  const submitField = async (e) => {
    e.preventDefault();
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
    if (!user?.id) return;

    await fetch(`${BASE_URL}/pest-alerts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...pestForm, farmer_id: user.id }),
    });
    setShowPestForm(false);
    setPestForm({ field_id: "", pest_type: "", severity: "", description: "" });
  };

return (
  <NavLayout>
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-8">
        Farmer Dashboard 🌱
      </h1>

      {/* MINI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        {cards.map((c, i) => (
          <div
            key={i}
            onClick={() => handleCardClick(c.title)}
            className="cursor-pointer bg-green-300 dark:bg-green-700 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col items-center justify-center"
          >
            <div className="bg-green-400 dark:bg-green-900 p-3 rounded-full mb-2">
              <FontAwesomeIcon
                icon={c.icon}
                className="text-green-900 dark:text-green-300 text-xl"
              />
            </div>
            <p className="text-sm font-semibold text-green-900 dark:text-green-200">{c.title}</p>
            <p className="text-2xl font-bold text-green-900 dark:text-white">{c.value ?? 0}</p>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-green-100 rounded-2xl p-6 shadow-md border border-green-200 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="font-semibold mb-4 dark:text-gray-200">Crop Health Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cropHealth}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="health" strokeWidth={3} stroke="#16a34a" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-green-100 rounded-2xl p-6 shadow-md border border-green-200 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="font-semibold mb-4 dark:text-gray-200">Weekly Activity</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT COMPLAINTS */}
      <div className="bg-green-200 rounded-2xl p-6 shadow-md border border-green-300 dark:bg-gray-800 dark:border-gray-700 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold dark:text-gray-200">Recent Complaints</h2>
          <button
            onClick={() => navigate("/report-complaint")}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All
          </button>
        </div>
        {complaints.slice(0, 5).map((c) => (
          <div
            key={c.id}
            className="border-b dark:border-gray-700 py-2 text-sm dark:text-gray-300 px-2 rounded transition"
          >
            {c.type} — {c.status}
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-green-200 rounded-2xl p-6 shadow-md border border-green-300 dark:bg-gray-800 dark:border-gray-700 mb-10">
        <h2 className="font-semibold mb-4 dark:text-gray-200">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowFieldForm(!showFieldForm)}
            className="bg-green-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 hover:scale-105 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faPlus} /> Add Field
          </button>
          <button
            onClick={() => setShowHarvestForm(!showHarvestForm)}
            className="bg-green-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 hover:scale-105 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faPlus} /> Schedule Harvest
          </button>
          <button
            onClick={() => setShowPestForm(!showPestForm)}
            className="bg-green-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 hover:scale-105 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faPlus} /> Report Pest
          </button>
         
  <button
    onClick={() => navigate("/report-complaint")}
    className="bg-green-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 hover:scale-105 transition-all duration-200"
  >
    <FontAwesomeIcon icon={faPlus} /> New Complaint
  </button>
        </div>

        {/* FORMS */}
        {showFieldForm && (
          <form onSubmit={submitField} className="bg-white p-6 rounded-2xl shadow space-y-3 mt-4">
            <h3 className="font-semibold">Add Field</h3>
            <input placeholder="Name" value={fieldForm.name} onChange={e => setFieldForm({...fieldForm, name: e.target.value})} className="w-full p-2 border rounded"/>
            <input placeholder="Area" value={fieldForm.area} onChange={e => setFieldForm({...fieldForm, area: e.target.value})} className="w-full p-2 border rounded"/>
            <input placeholder="Crop Type" value={fieldForm.crop_type} onChange={e => setFieldForm({...fieldForm, crop_type: e.target.value})} className="w-full p-2 border rounded"/>
            <input placeholder="Location" value={fieldForm.location} onChange={e => setFieldForm({...fieldForm, location: e.target.value})} className="w-full p-2 border rounded"/>
            <button className="bg-green-600 text-white p-2 rounded w-full"><FontAwesomeIcon icon={faPlus}/> Add</button>
          </form>
        )}

        {showHarvestForm && (
          <form onSubmit={submitHarvest} className="bg-white p-6 rounded-2xl shadow space-y-3 mt-4">
            <h3 className="font-semibold">Schedule Harvest</h3>
            <input placeholder="Field ID" onChange={e => setHarvestForm({...harvestForm, field_id: e.target.value})} className="w-full p-2 border rounded"/>
            <input placeholder="Crop Type" onChange={e => setHarvestForm({...harvestForm, crop_type: e.target.value})} className="w-full p-2 border rounded"/>
            <input type="date" onChange={e => setHarvestForm({...harvestForm, harvest_date: e.target.value})} className="w-full p-2 border rounded"/>
            <button className="bg-green-600 text-white p-2 rounded w-full">Save</button>
          </form>
        )}

        {showPestForm && (
          <form onSubmit={submitPest} className="bg-white p-6 rounded-2xl shadow space-y-3 mt-4">
            <h3 className="font-semibold">Report Pest</h3>
            <input placeholder="Field ID" onChange={e => setPestForm({...pestForm, field_id: e.target.value})} className="w-full p-2 border rounded"/>
            <input placeholder="Pest Type" onChange={e => setPestForm({...pestForm, pest_type: e.target.value})} className="w-full p-2 border rounded"/>
            <input placeholder="Severity" onChange={e => setPestForm({...pestForm, severity: e.target.value})} className="w-full p-2 border rounded"/>
            <textarea placeholder="Description" onChange={e => setPestForm({...pestForm, description: e.target.value})} className="w-full p-2 border rounded"/>
            <button className="bg-green-600 text-white p-2 rounded w-full">Report</button>
          </form>
        )}
      </div>
    </div>
  </NavLayout>
);
}