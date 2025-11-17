"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    // 초기 상태 설정
    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 온라인으로 복구되면 3초 후 메시지 숨김
  useEffect(() => {
    if (isOnline && showOffline) {
      const timer = setTimeout(() => {
        setShowOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOffline]);

  if (!showOffline && isOnline) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideUp ${
        isOnline ? "bg-green-500" : "bg-red-500"
      } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}
    >
      {isOnline ? (
        <>
          <Wifi size={20} />
          <span className="font-medium">인터넷에 다시 연결되었습니다</span>
        </>
      ) : (
        <>
          <WifiOff size={20} />
          <span className="font-medium">인터넷 연결이 끊어졌습니다</span>
        </>
      )}
    </div>
  );
}
