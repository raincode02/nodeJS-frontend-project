"use client";

import Link from "next/link";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "../../infrastructure/axios";

export const Header = () => {
  const router = useRouter();
  const { user, setUser, clearUser } = useUserStore();

  // 마운트 시 유저 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/user/profile", {
          withCredentials: true,
        });
        setUser(res.data.data);
      } catch {
        clearUser();
      }
    };
    fetchProfile();
  }, [setUser, clearUser]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      clearUser();
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-gray-100 p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link href="/">MyApp</Link>
      </div>
      <nav className="space-x-4">
        <Link href="/products">Products</Link>
        <Link href="/articles">Articles</Link>
        {user ? (
          <>
            <Link href="/profile">Profile</Link>
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};
