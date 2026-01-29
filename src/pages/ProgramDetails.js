import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProgramDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Temporary sample data (later fetch from backend)
  const programs = [
    {
      id: "1",
      title: "Maize Pest Control Fund",
      description:
        "This program helps farmers fight pest outbreaks by providing pesticides, training, and agronomist support.",
      district: "Huye",
      goal: "$10,000",
      raised: "$3,200"
    },
    {
      id: "2",
      title: "Organic Fertilizer Initiative",
      description:
        "Supporting eco-friendly fertilizer distribution for sustainable farming.",
      district: "Nyamagabe",
      goal: "$7,500",
      raised: "$2,100"
    },
    {
      id: "3",
      title: "Irrigation Expansion",
      description:
        "Helping farmers access irrigation systems to increase crop production.",
      district: "Gisagara",
      goal: "$15,000",
      raised: "$6,400"
    }
  ];

  // Ensure we compare as strings
  const program = programs.find((p) => String(p.id) === String(id));

  const handleSupport = () => {
    // Navigate to donate page for this program
    navigate(`/donate/${id}`);
  };

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Program not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">
          {program.title}
        </h1>

        <p className="text-gray-700 dark:text-gray-300">
          {program.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><strong>District:</strong> {program.district}</div>
          <div><strong>Goal:</strong> {program.goal}</div>
          <div><strong>Raised:</strong> {program.raised}</div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            onClick={handleSupport}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Support / Donate
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-300 dark:bg-slate-700 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
