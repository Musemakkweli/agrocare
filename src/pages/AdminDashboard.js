import React from "react";
import AdminLayout from "./AdminLayout"; // Make sure this has dark mode toggle
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

export default function AdminDashboard() {
  // Summary data
  const summaryData = {
    farmers: 120,
    complaints: 45,
    resolved: 30,
    pending: 15,
    programs: 10,
    donations: 2500
  };

  // Complaints per month (bar chart)
  const complaintsData = [
    { month: "Jan", complaints: 5 },
    { month: "Feb", complaints: 8 },
    { month: "Mar", complaints: 12 },
    { month: "Apr", complaints: 7 },
    { month: "May", complaints: 10 },
    { month: "Jun", complaints: 3 }
  ];

  // Complaints status (pie chart)
  const statusData = [
    { name: "Resolved", value: summaryData.resolved },
    { name: "Pending", value: summaryData.pending }
  ];
  const COLORS = ["#8BC34A", "#FFB74D"]; // soft green and soft orange

  // Program contributions (bar chart)
  const programData = [
    { name: "Program A", contributions: 500 },
    { name: "Program B", contributions: 1200 },
    { name: "Program C", contributions: 800 },
    { name: "Program D", contributions: 300 }
  ];

  // Recent activities feed
  const recentActivities = [
    "John Doe submitted a new complaint",
    'New program "Community Farming" created',
    "Jane Smith resolved a complaint",
    "Donation of $50 received"
  ];

  return (
    <AdminLayout user={{ name: "Admin User", role: "Administrator" }}>
      <div className="p-6 min-h-screen space-y-8 bg-gray-50 dark:bg-slate-900">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Admin Dashboard
        </h1>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Farmers", value: summaryData.farmers, color: "text-green-700 dark:text-green-400" },
            { label: "Complaints", value: summaryData.complaints, color: "text-orange-500 dark:text-orange-400" },
            { label: "Resolved", value: summaryData.resolved, color: "text-green-400 dark:text-green-300" },
            { label: "Pending", value: summaryData.pending, color: "text-yellow-400 dark:text-yellow-300" },
            { label: "Programs", value: summaryData.programs, color: "text-teal-500 dark:text-teal-400" },
            { label: "Donations ($)", value: summaryData.donations, color: "text-green-600 dark:text-green-300" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow flex flex-col items-center cursor-pointer transform transition-all duration-200 hover:bg-green-100 dark:hover:bg-green-700 hover:scale-105"
            >
              <span className="text-gray-500 dark:text-gray-300 text-sm">{item.label}</span>
              <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Complaints Bar Chart */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Complaints per Month</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={complaintsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="month" stroke="#4b5563" />
                <YAxis stroke="#4b5563" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px", border: "none" }}
                />
                <Bar dataKey="complaints" fill="#8BC34A" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Complaints Status Pie Chart */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Complaints Status</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Program Contributions Bar Chart */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Program Contributions</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={programData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="name" stroke="#4b5563" />
                <YAxis stroke="#4b5563" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px", border: "none" }}
                />
                <Bar dataKey="contributions" fill="#FFB74D" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Recent Activities</h2>
          <ul className="space-y-2">
            {recentActivities.map((activity, idx) => (
              <li
                key={idx}
                className="p-2 bg-gray-50 dark:bg-slate-700 rounded hover:bg-green-100 dark:hover:bg-green-700 transition cursor-pointer"
              >
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
