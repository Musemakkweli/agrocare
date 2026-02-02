import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown, faSeedling, faTasks } from "@fortawesome/free-solid-svg-icons";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function LeaderDashboardUnique() {
  const [stats, setStats] = useState({
    totalPrograms: 0,
    activePrograms: 0,
    farmersEngaged: 0,
    seasonalTasksCompleted: 0
  });

  const [programs, setPrograms] = useState([]);
  const [seasonalData, setSeasonalData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  const recentActivities = [
    { text: 'Started "Soil Enrichment" program', type: "program" },
    { text: "Completed seasonal irrigation checks", type: "task" },
    { text: 'Farmers trained on "Crop Rotation Awareness"', type: "training" },
    { text: "Pest monitoring reports submitted", type: "task" },
    { text: "Seedling distribution finished", type: "program" }
  ];

  // Colors green & yellow for pie chart
  const COLORS = ["#16a34a", "#eab308"]; // green & yellow

  useEffect(() => {
    const samplePrograms = [
      { id: 1, name: "Soil Enrichment", farmers: 35, active: true },
      { id: 2, name: "Crop Rotation Awareness", farmers: 25, active: false },
      { id: 3, name: "Irrigation Check", farmers: 40, active: true },
      { id: 4, name: "Pest Monitoring", farmers: 30, active: true },
      { id: 5, name: "Seedling Distribution", farmers: 20, active: false }
    ];

    setPrograms(samplePrograms);

    setStats({
      totalPrograms: samplePrograms.length,
      activePrograms: samplePrograms.filter(p => p.active).length,
      farmersEngaged: samplePrograms.reduce((a, b) => a + b.farmers, 0),
      seasonalTasksCompleted: 8
    });

    setStatusData([
      { name: "High Farmers", value: samplePrograms.filter(p => p.farmers >= 30).length },
      { name: "Low Farmers", value: samplePrograms.filter(p => p.farmers < 30).length }
    ]);

    setSeasonalData([
      { month: "Jan", tasks: 3 },
      { month: "Feb", tasks: 5 },
      { month: "Mar", tasks: 4 },
      { month: "Apr", tasks: 6 },
      { month: "May", tasks: 2 },
      { month: "Jun", tasks: 7 }
    ]);
  }, []);

  const renderActivity = (activity, idx) => {
    let typeColor = "bg-gray-200 text-gray-800";
    if (activity.type === "task") typeColor = "bg-green-200 text-green-800";
    if (activity.type === "program") typeColor = "bg-yellow-200 text-yellow-800";
    if (activity.type === "training") typeColor = "bg-green-100 text-green-900";

    return (
      <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
        <div className="w-12 h-12 rounded-full bg-green-500 dark:bg-green-600 text-white flex items-center justify-center font-bold text-lg">
          {activity.type[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800 dark:text-gray-100">{activity.text}</p>
          <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeColor} mt-1 inline-block`}>
            {activity.type.toUpperCase()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen space-y-8 bg-gray-50 dark:bg-slate-900">

      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Leader Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Programs", value: stats.totalPrograms, icon: faSeedling, color: "text-green-700", extra: "Programs available" },
          { label: "High Farmers Programs", value: stats.activePrograms, icon: faArrowUp, color: "text-yellow-600", extra: "Active programs" },
          { label: "Farmers Engaged", value: stats.farmersEngaged, icon: faTasks, color: "text-green-600", extra: "Total participants" },
          { label: "Seasonal Tasks Completed", value: stats.seasonalTasksCompleted, icon: faArrowDown, color: "text-yellow-700", extra: "Tasks finished" }
        ].map((card) => (
          <div key={card.label} className="bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl p-4 shadow-md flex flex-col items-center hover:shadow-lg transition cursor-pointer">
            <FontAwesomeIcon icon={card.icon} className={`text-2xl mb-2 ${card.color}`} />
            <span className="text-sm text-gray-500 dark:text-gray-300">{card.label}</span>
            <span className={`text-xl font-bold ${card.color}`}>{card.value}</span>
            <span className="text-xs text-gray-400 mt-1">{card.extra}</span>
          </div>
        ))}
      </div>

      {/* Donut Chart: High vs Low Farmers */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-gray-300 dark:border-slate-700">
        <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Programs by Farmers Count</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="30%"  // Move chart to the right to leave labels on left
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend verticalAlign="middle" align="left" layout="vertical" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Seasonal Tasks Bar Chart */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-gray-300 dark:border-slate-700">
        <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Seasonal Tasks Completed</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={seasonalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="month" stroke="#4b5563" />
            <YAxis stroke="#4b5563" />
            <Tooltip contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px", border: "none" }} />
            <Bar dataKey="tasks" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Programs List */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-gray-300 dark:border-slate-700">
        <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">My Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((p) => (
            <div key={p.id} className="flex justify-between items-center p-4 border rounded-lg border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900 transition w-full">
              <span className="font-medium text-gray-800 dark:text-gray-200">{p.name}</span>
              <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                <FontAwesomeIcon
                  icon={p.farmers >= 30 ? faArrowUp : faArrowDown}
                  className={p.farmers >= 30 ? "text-green-500" : "text-yellow-500"}
                />
                {p.farmers} farmers
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-gray-300 dark:border-slate-700 max-h-[500px] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Recent Activities</h2>
        <div className="space-y-3">{recentActivities.map(renderActivity)}</div>
      </div>

    </div>
  );
}
