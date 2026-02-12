import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import NavLayout from "./NavLayout";
import BASE_URL from "../config"; // your config file with backend URL

export default function FarmerDashboard() {
  const [farmStats, setFarmStats] = useState([]);
  const [cropHealthData, setCropHealthData] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const user_id = user?.id;
        if (!user_id) return;

        // Fetch farm stats
        const statsRes = await fetch(`${BASE_URL}/farmer/${user_id}/stats`);
        if (statsRes.ok) {
          const data = await statsRes.json();
          if (mounted) {
            setFarmStats([
              { title: "Total Fields", value: data.total_fields ?? 0 },
              { title: "Upcoming Harvests", value: data.upcoming_harvests ?? 0 },
              { title: "Pest Alerts", value: data.pest_alerts ?? 0 },
              { title: "Weather Alerts", value: data.weather_alerts ?? 0 },
            ]);
          }
        }

        // Fetch crop health
        const cropRes = await fetch(`${BASE_URL}/farmer/${user_id}/crop-health`);
        if (cropRes.ok) {
          const data = await cropRes.json();
          if (mounted) setCropHealthData(data);
        }

        // Fetch user complaints
        const compRes = await fetch(`${BASE_URL}/complaints/user/${user_id}`);
        if (compRes.ok) {
          const data = await compRes.json();
          if (mounted) {
            const mapped = data.map((c) => ({
              id: c.id,
              type: c.type,
              status: c.status,
              date: c.created_at ? new Date(c.created_at).toLocaleDateString() : "",
              description: c.description,
            }));
            setComplaints(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <NavLayout>
        <div className="text-center py-20 text-gray-700 dark:text-gray-300">
          Loading dashboard...
        </div>
      </NavLayout>
    );
  }

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
              <span className="text-lg font-semibold text-green-900 dark:text-green-50">{s.title}</span>
              <p className="text-3xl font-bold text-green-900 dark:text-green-50 mt-2">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CROP HEALTH TREND */}
      <section className="bg-gray-100 dark:bg-slate-800 rounded-2xl p-4 shadow mb-8">
        <h2 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-3">Crop Health Trend</h2>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cropHealthData}>
              <XAxis dataKey="week" stroke="#374151" />
              <YAxis stroke="#374151" />
              <Tooltip />
              <Line type="monotone" dataKey="health" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* USER COMPLAINTS */}
      <section>
        <h2 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-3">My Complaints</h2>
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
