"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/infrastructure/axios";
import { showToast } from "@/lib/toast";
import { getErrorStatus } from "@/lib/errorHandler";

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast.error("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/articles", { title, content });
      showToast.success("게시글이 작성되었습니다!");
      router.push(`/articles/${res.data.id}`);
    } catch (err) {
      const status = getErrorStatus(err);
      if (status === 401) {
        showToast.error("로그인이 필요합니다.");
        router.push("/login");
      } else {
        showToast.error("게시글 작성에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            새 게시글 작성
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                제목
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="제목을 입력하세요"
              />
            </div>

            {/* 내용 */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                내용
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="내용을 입력하세요"
              />
            </div>

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
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "작성 중..." : "작성하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
