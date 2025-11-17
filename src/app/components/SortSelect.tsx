"use client";

import { ArrowUpDown } from "lucide-react";

export type SortOption = {
  value: string;
  label: string;
  icon?: React.ComponentType<{ size: number }>;
};

interface SortSelectProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function SortSelect({
  options,
  value,
  onChange,
}: SortSelectProps) {
  // const currentOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative inline-block">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        정렬
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent cursor-pointer transition-all"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* 아이콘 */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ArrowUpDown size={18} className="text-gray-400 dark:text-gray-500" />
        </div>

        {/* 화살표 */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400 dark:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
