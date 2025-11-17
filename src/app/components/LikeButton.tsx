"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onToggle: () => Promise<void>;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function LikeButton({
  isLiked,
  likeCount,
  onToggle,
  disabled = false,
  size = "md",
}: LikeButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const sizes = {
    sm: { button: "px-3 py-1.5", icon: 14, text: "text-sm" },
    md: { button: "px-4 py-2", icon: 18, text: "text-base" },
    lg: { button: "px-6 py-3", icon: 24, text: "text-lg" },
  };

  const handleClick = async () => {
    if (disabled || isAnimating) return;

    setIsAnimating(true);

    // 파티클 효과
    if (!isLiked) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.cos((i * Math.PI * 2) / 8) * 30,
        y: Math.sin((i * Math.PI * 2) / 8) * 30,
      }));
      setParticles(newParticles);

      setTimeout(() => setParticles([]), 600);
    }

    try {
      await onToggle();
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        disabled={disabled || isAnimating}
        className={`
          flex items-center gap-2 rounded-lg font-medium transition-all duration-300
          ${sizes[size].button} ${sizes[size].text}
          ${
            isLiked
              ? "bg-red-500 text-white hover:bg-red-600 scale-100"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }
          ${isAnimating ? "scale-95" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {/* 하트 아이콘 */}
        <Heart
          size={sizes[size].icon}
          fill={isLiked ? "white" : "none"}
          className={`
            transition-all duration-300
            ${isAnimating && isLiked ? "animate-heartBeat" : ""}
            ${isAnimating && !isLiked ? "animate-heartBreak" : ""}
          `}
        />

        {/* 좋아요 카운트 */}
        <span
          className={`
            font-semibold transition-all duration-300
            ${isAnimating ? "scale-125" : "scale-100"}
          `}
        >
          {likeCount.toLocaleString()}
        </span>
      </button>

      {/* 파티클 효과 */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute top-1/2 left-1/2 pointer-events-none"
          style={{
            transform: `translate(-50%, -50%) translate(${particle.x}px, ${particle.y}px)`,
            animation: "particleFade 0.6s ease-out forwards",
          }}
        >
          <Heart size={12} fill="red" className="text-red-500" />
        </div>
      ))}
    </div>
  );
}
