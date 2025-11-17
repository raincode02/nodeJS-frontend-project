import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "**", // 모든 외부 이미지 허용 (프로덕션에서는 특정 도메인만 허용 권장)
      },
    ],
  },
};

export default nextConfig;
