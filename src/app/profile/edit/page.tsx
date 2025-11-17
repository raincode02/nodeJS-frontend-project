"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/infrastructure/axios";
import ProfileImageUpload from "@/app/components/ProfileImageUpload";
import { showToast } from "@/lib/toast";
import { getErrorStatus } from "@/lib/errorHandler";

export default function EditProfilePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("/users/profile");
        const fetchedNickname = res.data.data.nickname ?? "";
        const fetchedImage = res.data.data.image ?? null;

        setNickname(fetchedNickname);
        setOriginalNickname(fetchedNickname);
        setImageUrl(fetchedImage);
        setOriginalImageUrl(fetchedImage);
      } catch (err) {
        const status = getErrorStatus(err);
        if (status === 401) {
          showToast.error("로그인이 필요합니다.");
          router.push("/login");
        }
      } finally {
        setFetching(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      return;
    }

    // 닉네임이 변경되었는지 확인
    const isNicknameChanged = nickname !== originalNickname;
    const isImageChanged = imageUrl !== originalImageUrl;

    // 닉네임 변경 시 비밀번호 필수
    if (isNicknameChanged && !currentPassword) {
      showToast.error("닉네임 변경 시 현재 비밀번호가 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      const updateData: {
        nickname?: string;
        image?: string | null;
        currentPassword?: string;
      } = {};
      if (isImageChanged) {
        updateData.image =
          imageUrl === null || imageUrl?.trim() === "" ? null : imageUrl;
      }

      // 닉네임이 변경된 경우에만 포함
      if (isNicknameChanged && nickname.trim() !== "") {
        updateData.nickname = nickname;
        updateData.currentPassword = currentPassword;
      }

      await axios.put("/users/profile", updateData);

      const res = await axios.get("/users/profile");
      const fetchedNickname = res.data.data.nickname;
      const fetchedImage = res.data.data.image;

      setNickname(fetchedNickname ?? originalNickname);
      setOriginalNickname(fetchedNickname ?? originalNickname);
      setImageUrl(fetchedImage ?? null);
      setOriginalImageUrl(fetchedImage ?? null);

      // 이미지가 null/빈 문자열이 아니면 업데이트
      if (fetchedImage != null && fetchedImage !== "") {
        setImageUrl(fetchedImage);
      }

      showToast.success("프로필이 수정되었습니다!");
      router.push("/profile");
    } catch (err) {
      console.error(err);
      showToast.error("프로필 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (url: string) => {
    setImageUrl(url);

    try {
      await axios.put("/users/profile", { image: url });
      showToast.success("프로필 이미지가 변경되었습니다!");

      const res = await axios.get("/users/profile");
      setImageUrl(res.data.data.image ?? null);
    } catch (err) {
      console.error(err);
      showToast.error("프로필 이미지 저장에 실패했습니다.");
      setImageUrl(null); // 실패 시 원래대로
    }
  };

  const handleImageDelete = async () => {
    if (!confirm("프로필 이미지를 삭제하시겠습니까?")) {
      return;
    }

    try {
      setImageUrl(null);

      await axios.put("/users/profile", { image: null });
      showToast.success("프로필 이미지가 삭제되었습니다!");

      // 프로필 정보 다시 가져오기
      const res = await axios.get("/users/profile");
      setImageUrl(res.data.data.image ?? null);
    } catch (err) {
      console.error(err);
      showToast.error("프로필 이미지 삭제에 실패했습니다.");

      const res = await axios.get("/users/profile");
      setImageUrl(res.data.data.image ?? null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast.error("모든 비밀번호 필드를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast.error("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 8) {
      showToast.error("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    try {
      await axios.put("/users/password", {
        currentPassword,
        newPassword,
      });
      showToast.success("비밀번호가 변경되었습니다!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      showToast.error("비밀번호 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {/* 프로필 수정 */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">프로필 수정</h1>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* 프로필 이미지 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                프로필 이미지
              </label>
              <div className="flex justify-center">
                <ProfileImageUpload
                  currentImage={imageUrl}
                  onUploadComplete={handleImageUpload}
                  onDelete={handleImageDelete}
                />
              </div>
            </div>

            {/* 닉네임 */}
            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                닉네임
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname ?? ""}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="닉네임"
              />
              {nickname !== originalNickname && (
                <p className="mt-2 text-sm text-orange-600">
                  닉네임을 변경하면 다음 로그인부터 새 닉네임으로 로그인해야
                  합니다.
                </p>
              )}
            </div>

            {/* 닉네임 변경 시 비밀번호 필드 표시 */}
            {nickname !== originalNickname && (
              <div>
                <label
                  htmlFor="currentPasswordForNickname"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  현재 비밀번호 (닉네임 변경 확인용)
                </label>
                <input
                  id="currentPasswordForNickname"
                  type="password"
                  value={currentPassword ?? ""}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="현재 비밀번호"
                />
              </div>
            )}

            {/* 버튼들 */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "수정 중..." : "저장하기"}
              </button>
            </div>
          </form>
        </div>

        {/* 비밀번호 변경 */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            비밀번호 변경
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                현재 비밀번호
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="현재 비밀번호"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                새 비밀번호
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="새 비밀번호 (8자 이상)"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="비밀번호 확인"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "변경 중..." : "비밀번호 변경"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
