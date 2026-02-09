// src/components/InputField.js
import React from "react";

export default function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-green-700 dark:text-green-300">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-slate-600
        dark:bg-slate-700 dark:text-white focus:ring-1 focus:ring-green-400"
      />
    </div>
  );
}
