import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faCheckCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function AgronomistDashboard() {
  // ================== STATS ==================
  const stats = [
    {
      title: "Assigned Complaints",
      value: 12,
      icon: faClipboardList,
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-700 dark:text-green-300",
    },
    {
      title: "Pending Responses",
      value: 5,
      icon: faClock,
      bg: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-700 dark:text-yellow-300",
    },
    {
      title: "Resolved Complaints",
      value: 7,
      icon: faCheckCircle,
      bg: "bg-emerald-100 dark:bg-emerald-900",
      text: "text-emerald-700 dark:text-emerald-300",
    },
  ];

  // ================== GRAPH DATA ==================
  const responseProgress = [
    { status: "Assigned", count: 12 },
    { status: "Pending", count: 5 },
    { status: "Resolved", count: 7 },
  ];

  // ================== RECENT COMPLAINTS ==================
  const recentComplaints = [
    {
      id: 1,
      title: "Pest infestation in maize",
      farmer: "John Nkurunziza",
      status: "Pending",
    },
    {
      id: 2,
      title: "Low crop yield",
      farmer: "Mary Uwimana",
      status: "Resolved",
    },
    {
      id: 3,
      title: "Soil fertility issue",
      farmer: "Alex Habimana",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Agronomist Dashboard 🌱
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor complaints and assist farmers effectively
        </p>
      </div>

      {/* MINI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.title}
            className={`rounded-xl p-4 shadow border border-gray-200 dark:border-slate-700 ${s.bg}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {s.title}
                </p>
                <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
              </div>
              <FontAwesomeIcon
                icon={s.icon}
                className={`text-3xl ${s.text}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* RESPONSE PROGRESS GRAPH */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Complaint Response Progress
        </h2>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={responseProgress}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
          Visual overview of how many complaints are assigned, pending, and resolved
        </p>
      </div>

      {/* RECENT ASSIGNED COMPLAINTS */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Recent Assigned Complaints
        </h2>

        <div className="space-y-3">
          {recentComplaints.map((c) => (
            <div
              key={c.id}
              className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-green-50 dark:hover:bg-green-900 transition"
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {c.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Farmer: {c.farmer}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  c.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                }`}
              >
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
