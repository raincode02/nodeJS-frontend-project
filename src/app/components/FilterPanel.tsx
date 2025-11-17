"use client";

import { X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

type CheckboxFilter = {
  id: string;
  label: string;
  type: "checkbox";
  options: { value: string; label: string }[];
  value: string[];
};

type RangeFilter = {
  id: string;
  label: string;
  type: "range";
  min?: number;
  max?: number;
  value: { min?: number; max?: number };
};

type SelectFilter = {
  id: string;
  label: string;
  type: "select";
  options: { value: string; label: string }[];
  value: string;
};

export type FilterOption = CheckboxFilter | RangeFilter | SelectFilter;

interface FilterPanelProps {
  filters: FilterOption[];
  onFilterChange: (
    filterId: string,
    value: string[] | { min?: number; max?: number } | string
  ) => void;
  onReset: () => void;
}

export default function FilterPanel({
  filters,
  onFilterChange,
  onReset,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 필터 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <SlidersHorizontal size={18} />
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          필터
        </span>
      </button>

      {/* 필터 패널 */}
      {isOpen && (
        <>
          {/* 배경 오버레이 (모바일) */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* 필터 사이드바 */}
          <div className="fixed md:absolute right-0 top-0 md:top-full md:mt-2 w-80 max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 animate-slideUp">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                필터
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 필터 옵션들 */}
            <div className="p-4 space-y-6">
              {filters.map((filter) => (
                <div key={filter.id}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {filter.label}
                  </label>

                  {/* Checkbox 타입 */}
                  {filter.type === "checkbox" && filter.options && (
                    <div className="space-y-2">
                      {filter.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filter.value?.includes(option.value)}
                            onChange={(e) => {
                              const currentValue = filter.value || [];
                              const newValue = e.target.checked
                                ? [...currentValue, option.value]
                                : (currentValue as string[]).filter(
                                    (v) => v !== option.value
                                  );
                              onFilterChange(filter.id, newValue);
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Range 타입 */}
                  {filter.type === "range" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          placeholder="최소"
                          value={filter.value?.min || ""}
                          onChange={(e) =>
                            onFilterChange(filter.id, {
                              ...filter.value,
                              min: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-500">~</span>
                        <input
                          type="number"
                          placeholder="최대"
                          value={filter.value?.max || ""}
                          onChange={(e) =>
                            onFilterChange(filter.id, {
                              ...filter.value,
                              max: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Select 타입 */}
                  {filter.type === "select" && filter.options && (
                    <select
                      value={filter.value || ""}
                      onChange={(e) =>
                        onFilterChange(filter.id, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">전체</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>

            {/* 푸터 */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <button
                onClick={onReset}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                초기화
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                적용
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
