import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import NavLayout from "./NavLayout";

export default function FarmerDashboard() {
  const farmStats = [
    { title: "Total Fields", value: 5, bg: "bg-pink-200 dark:bg-pink-800", hover: "hover:bg-pink-300 dark:hover:bg-pink-700" },
    { title: "Upcoming Harvests", value: 3, bg: "bg-blue-200 dark:bg-blue-800", hover: "hover:bg-blue-300 dark:hover:bg-blue-700" },
    { title: "Pest Alerts", value: 2, bg: "bg-pink-200 dark:bg-pink-800", hover: "hover:bg-pink-300 dark:hover:bg-pink-700" },
    { title: "Weather Alerts", value: 1, bg: "bg-blue-200 dark:bg-blue-800", hover: "hover:bg-blue-300 dark:hover:bg-blue-700" }
  ];

  const cropHealthData = [
    { week: "W1", health: 65 },
    { week: "W2", health: 72 },
    { week: "W3", health: 60 },
    { week: "W4", health: 78 },
    { week: "W5", health: 85 }
  ];

  const complaints = [
    { id: 1, type: "Animal Damage", status: "Pending" },
    { id: 2, type: "Robbery", status: "Resolved" }
  ];

  return (
    <NavLayout>
      {/* MINI CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {farmStats.map((s, i) => (
          <div key={i} className={`${s.bg} ${s.hover} rounded-2xl p-5 shadow transition transform hover:-translate-y-1 cursor-pointer`}>
            <h3 className="font-semibold text-gray-900 dark:text-white">{s.title}</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
          </div>
        ))}
      </section>

      {/* CROP HEALTH TREND */}
      <section className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-4 shadow mb-8">
        <h2 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-3">
          Crop Health Trend
        </h2>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cropHealthData}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="health" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* COMPLAINTS */}
      <section>
        <h2 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-3">
          My Complaints
        </h2>
        <ul className="space-y-2">
          {complaints.map(c => (
            <li key={c.id} className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow flex justify-between text-gray-800 dark:text-gray-200">
              <span>{c.type}</span>
              <span className={`font-semibold ${c.status === "Resolved" ? "text-green-600" : "text-red-500"}`}>
                {c.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </NavLayout>
  );
}
