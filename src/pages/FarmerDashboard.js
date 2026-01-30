import React from "react"; 
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import NavLayout from "./NavLayout";

export default function FarmerDashboard() {
  const farmStats = [
    { title: "Total Fields", value: 5 },
    { title: "Upcoming Harvests", value: 3 },
    { title: "Pest Alerts", value: 2 },
    { title: "Weather Alerts", value: 1 }
  ];

  const cropHealthData = [
    { week: "W1", health: 65 },
    { week: "W2", health: 72 },
    { week: "W3", health: 60 },
    { week: "W4", health: 78 },
    { week: "W5", health: 85 }
  ];

  const complaints = [
    { id: 1, type: "Animal Damage", status: "Pending", date: "2026-01-25", description: "Goats destroyed maize field." },
    { id: 2, type: "Robbery", status: "Resolved", date: "2026-01-20", description: "Tools stolen from storage." },
    { id: 3, type: "Flooded Field", status: "In Progress", date: "2026-01-28", description: "Heavy rain flooded lower field." }
  ];

  return (
    <NavLayout>
      {/* DASHBOARD HEADER */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Farmer Dashboard</h1>
        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
          Overview of your farm activities and current complaints
        </p>
      </section>

      {/* MINI CARDS */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {farmStats.map((s, i) => (
            <div
              key={i}
              className="bg-green-200 dark:bg-green-800 rounded-2xl p-5 shadow transition transform hover:-translate-y-1 cursor-pointer flex flex-col items-center"
            >
              {/* Title */}
              <span className="text-lg font-semibold text-green-900 dark:text-green-50">{s.title}</span>

              {/* Number/Value */}
              <p className="text-3xl font-bold text-green-900 dark:text-green-50 mt-2">{s.value}</p>
            </div>
          ))}
        </div>
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
              <Line type="monotone" dataKey="health" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* USER COMPLAINTS */}
      <section>
        <h2 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-3">
          My Complaints
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {complaints.map(c => (
            <div
              key={c.id}
              className="bg-green-100 dark:bg-green-900 rounded-2xl p-5 shadow flex flex-col gap-2 transition hover:-translate-y-1"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-green-900 dark:text-green-50">{c.type}</span>
                <span
                  className={`font-semibold ${
                    c.status === "Resolved"
                      ? "text-green-600 dark:text-green-300"
                      : c.status === "Pending"
                      ? "text-red-500 dark:text-red-400"
                      : "text-yellow-500 dark:text-yellow-400"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <p className="text-sm text-green-800 dark:text-green-200">{c.description}</p>
              <span className="text-xs text-gray-600 dark:text-gray-400">Submitted: {c.date}</span>
            </div>
          ))}
        </div>
      </section>
    </NavLayout>
  );
}
