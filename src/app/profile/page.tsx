"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "@/infrastructure/axios";
import { Mail, Edit, Package, Heart, FileText, LogOut } from "lucide-react";
import type { User as UserType } from "@/domain/user/types";
import { showToast } from "@/lib/toast";
import ProfileImageUpload from "@/app/components/ProfileImageUpload";
import { getErrorStatus } from "@/lib/errorHandler";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const hasShownError = useRef(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("/users/profile");
        setUser(res.data.data);
      } catch (err) {
        const status = getErrorStatus(err);
        if (status === 401 && !hasShownError.current) {
          hasShownError.current = true;

          setTimeout(() => {
            router.push("/login");
          }, 800);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      showToast.success("로그아웃되었습니다.");

      setUser(null);
      router.push("/");
    } catch (err) {
      console.error(err);
      showToast.error("로그아웃에 실패했습니다.");
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    try {
      await axios.put("/users/profile", {
        image: imageUrl,
      });

      // 프로필 다시 가져오기
      const res = await axios.get("/users/profile");
      setUser(res.data.data);
      showToast.success("프로필 이미지가 변경되었습니다!");
    } catch (err) {
      console.error(err);
      showToast.error("프로필 이미지 변경에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <p className="text-sm text-gray-500">
            잠시 후 로그인 페이지로 이동합니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end -mt-16 mb-4">
              <ProfileImageUpload
                currentImage={user.image}
                onUploadComplete={handleImageUpload}
              />
              <div className="ml-6 mb-2">
                <h1 className="text-[1.3rem] font-bold text-gray-900">
                  {user.nickname}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/profile/edit")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit size={18} />
                <span>프로필 수정</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut size={18} />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>

        {/* 메뉴 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 내 상품 */}
          <div
            onClick={() => router.push("/profile/my-products")}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  내가 등록한 상품
                </h3>
                <p className="text-sm text-gray-600">등록한 상품 목록 보기</p>
              </div>
            </div>
          </div>

          {/* 좋아요한 상품 */}
          <div
            onClick={() => router.push("/profile/liked-products")}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  좋아요한 상품
                </h3>
                <p className="text-sm text-gray-600">관심 상품 목록 보기</p>
              </div>
            </div>
          </div>

          {/* 좋아요한 게시글 */}
          <div
            onClick={() => router.push("/profile/liked-articles")}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  좋아요한 게시글
                </h3>
                <p className="text-sm text-gray-600">관심 게시글 목록 보기</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
