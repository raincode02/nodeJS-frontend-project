"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  text?: string;
}

export default function RetryButton({
  onRetry,
  text = "다시 시도",
}: RetryButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onRetry();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
      <span>{loading ? "재시도 중..." : text}</span>
    </button>
  );
}
