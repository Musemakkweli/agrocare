import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Card({ icon, title, desc }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded shadow hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer">
      <FontAwesomeIcon icon={icon} className="text-3xl mb-2 text-green-600 dark:text-green-300" />
      <h5 className="font-bold mb-1 text-slate-800 dark:text-slate-200">{title}</h5>
      <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
    </div>
  );
}
