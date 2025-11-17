"use client";

interface PageInfoProps {
  currentPage: number;
  pageSize: number;
  total: number;
}

export default function PageInfo({
  currentPage,
  pageSize,
  total,
}: PageInfoProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <div className="text-sm text-gray-600 text-center">
      전체 <span className="font-semibold text-gray-900">{total}</span>개 중{" "}
      <span className="font-semibold text-gray-900">{start}</span>-
      <span className="font-semibold text-gray-900">{end}</span>번 표시
    </div>
  );
}
