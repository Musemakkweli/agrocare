import React, { useEffect, useState } from "react";
import NavLayout from "./NavLayout";
import BASE_URL from "../config";

export default function WeatherPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Optional: filter by region
  const [region, setRegion] = useState("");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        let url = `${BASE_URL}/weather-alerts`;
        if (region.trim() !== "") {
          url = `${BASE_URL}/weather-alerts/region/${region.trim()}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setAlerts(data || []);
      } catch (err) {
        console.error("Failed to load weather alerts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [region]);

  return (
    <NavLayout>
      <div className="min-h-screen bg-blue-50 dark:bg-gray-900 p-6">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-6">
          Weather Alerts 🌤️
        </h1>

        {/* Optional region filter */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Filter by region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="p-2 border rounded w-64"
          />
          <button
            onClick={() => setLoading(true)} // triggers useEffect reload
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          >
            Filter
          </button>
        </div>

        {loading ? (
          <p className="text-blue-800 dark:text-blue-200">Loading alerts...</p>
        ) : alerts.length === 0 ? (
          <p className="text-blue-800 dark:text-blue-200">No weather alerts found.</p>
        ) : (
          <div className="grid gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-blue-100 dark:bg-gray-800 p-4 rounded shadow border border-blue-200 dark:border-gray-700"
              >
                <p><strong>Region:</strong> {alert.region}</p>
                <p><strong>Type:</strong> {alert.type}</p>
                <p><strong>Severity:</strong> {alert.severity}</p>
                <p><strong>Description:</strong> {alert.description}</p>
                <p><strong>Date:</strong> {new Date(alert.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </NavLayout>
  );
}
