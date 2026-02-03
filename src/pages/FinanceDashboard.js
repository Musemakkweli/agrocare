// FinanceDashboard.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faClock, faCheckCircle, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function FinanceDashboard() {
  // ===== SAMPLE DATA =====
  const funds = [
    { id: 1, donor: "Alice Uwase", program: "Maize Support", amount: 100, status: "Pending" },
    { id: 2, donor: "John Nkurunziza", program: "Soil Fertility", amount: 200, status: "Completed" },
    { id: 3, donor: "Mary Uwimana", program: "Irrigation", amount: 150, status: "Pending" },
    { id: 4, donor: "Alex Habimana", program: "Fertilizer Support", amount: 120, status: "Completed" },
    { id: 5, donor: "Jean Mutoni", program: "Goat Control", amount: 80, status: "Pending" },
    { id: 6, donor: "Paul Habumugisha", program: "Seed Distribution", amount: 90, status: "Completed" },
  ];

  // ===== SUMMARY METRICS =====
  const totalFunds = funds.reduce((sum, f) => sum + f.amount, 0);
  const pendingFunds = funds.filter(f => f.status === "Pending").reduce((sum, f) => sum + f.amount, 0);
  const completedFunds = funds.filter(f => f.status === "Completed").reduce((sum, f) => sum + f.amount, 0);
  const donorCount = new Set(funds.map(f => f.donor)).size;

  // ===== CHART DATA =====
  const programData = {
    labels: [...new Set(funds.map(f => f.program))],
    datasets: [
      {
        label: "Amount Raised",
        data: [...new Set(funds.map(f => f.program))].map(program =>
          funds.filter(f => f.program === program).reduce((sum, f) => sum + f.amount, 0)
        ),
        backgroundColor: "#16A34A", // green theme
      },
    ],
  };

  // Function to get card background for better light/dark visibility
  const getCardClasses = (color) => {
    switch (color) {
      case "green":
        return "bg-green-200 dark:bg-green-700 text-green-900 dark:text-white";
      case "yellow":
        return "bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-white";
      case "blue":
        return "bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-white";
      case "gray":
        return "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white";
      default:
        return "bg-white dark:bg-slate-800 text-gray-900 dark:text-white";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Finance Dashboard</h2>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`shadow rounded-xl p-5 flex items-center gap-4 hover:shadow-2xl transition ${getCardClasses("green")}`}>
          <FontAwesomeIcon icon={faDollarSign} className="text-3xl" />
          <div>
            <p className="text-sm font-medium">Total Funds</p>
            <p className="text-xl font-bold">${totalFunds}</p>
          </div>
        </div>

        <div className={`shadow rounded-xl p-5 flex items-center gap-4 hover:shadow-2xl transition ${getCardClasses("yellow")}`}>
          <FontAwesomeIcon icon={faClock} className="text-3xl" />
          <div>
            <p className="text-sm font-medium">Pending Funds</p>
            <p className="text-xl font-bold">${pendingFunds}</p>
          </div>
        </div>

        <div className={`shadow rounded-xl p-5 flex items-center gap-4 hover:shadow-2xl transition ${getCardClasses("green")}`}>
          <FontAwesomeIcon icon={faCheckCircle} className="text-3xl" />
          <div>
            <p className="text-sm font-medium">Completed Funds</p>
            <p className="text-xl font-bold">${completedFunds}</p>
          </div>
        </div>

        <div className={`shadow rounded-xl p-5 flex items-center gap-4 hover:shadow-2xl transition ${getCardClasses("blue")}`}>
          <FontAwesomeIcon icon={faUsers} className="text-3xl" />
          <div>
            <p className="text-sm font-medium">Number of Donors</p>
            <p className="text-xl font-bold">{donorCount}</p>
          </div>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4">
        <h3 className="text-gray-800 dark:text-gray-100 font-semibold mb-2">Funds by Program</h3>
        <Bar data={programData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
    </div>
  );
}
