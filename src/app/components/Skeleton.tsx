"use client";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  const baseClass = "animate-pulse bg-gray-200";

  const variantClass = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  }[variant];

  const style: React.CSSProperties = {
    width: width || "100%",
    height: height || (variant === "text" ? "1em" : "100%"),
  };

  return (
    <div
      className={`${baseClass} ${variantClass} ${className}`}
      style={style}
    />
  );
}
