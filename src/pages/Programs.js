import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling, faWater, faBug, faHandHoldingHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
export default function Programs() {
  const navigate = useNavigate();
  const programs = [
    {
      id: 1,
      title: "Maize Pest Control Fund",
      location: "Huye District",
      description: "Support farmers in fighting maize pests using safe and effective treatments.",
      icon: faBug,
      status: "Funding Open",
    },
    {
      id: 2,
      title: "Organic Fertilizer Initiative",
      location: "Nyamagabe District",
      description: "Provide eco‑friendly fertilizers to small‑scale farmers.",
      icon: faSeedling,
      status: "Ongoing",
    },
    {
      id: 3,
      title: "Irrigation Expansion Program",
      location: "Southern Province",
      description: "Help farmers access reliable irrigation systems for dry seasons.",
      icon: faWater,
      status: "Seeking Donors",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 transition-all duration-300">

      {/* PAGE HEADER */}
      <section className="bg-green-600 dark:bg-green-800 py-10 text-center text-white shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Agricultural Programs</h1>
        <p className="text-green-100">Explore ongoing initiatives supporting farmers across Rwanda</p>
      </section>

      {/* PROGRAM LIST */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map(program => (
            <div
              key={program.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FontAwesomeIcon icon={program.icon} className="text-green-600 text-3xl" />
                <h3 className="text-lg font-bold text-green-800 dark:text-green-300">
                  {program.title}
                </h3>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <strong>Location:</strong> {program.location}
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">
                {program.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 font-semibold">
                  {program.status}
                </span>

                <button onClick={() => navigate(`/programs/${program.id}`)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold shadow hover:bg-green-700 transition">
                  <FontAwesomeIcon icon={faHandHoldingHeart} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
