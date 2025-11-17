"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/infrastructure/axios";
import { Heart, User, Calendar } from "lucide-react";
import type { Article } from "@/domain/article/types";
import { showToast } from "@/lib/toast";
import { getErrorStatus } from "@/lib/errorHandler";

export default function LikedArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLikedArticles() {
      try {
        const res = await axios.get("/users/likes/articles");
        setArticles(res.data.data);
      } catch (err) {
        const status = getErrorStatus(err);
        if (status === 401) {
          showToast.error("로그인이 필요합니다.");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchLikedArticles();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 mb-4"
          >
            ← 뒤로가기
          </button>
          <div className="flex items-center gap-3">
            <Heart size={32} className="text-red-500" fill="currentColor" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                좋아요한 게시글
              </h1>
              <p className="text-gray-600 mt-2">총 {articles.length}개</p>
            </div>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">좋아요한 게시글이 없습니다.</p>
            <button
              onClick={() => router.push("/articles")}
              className="mt-4 text-blue-600 hover:underline"
            >
              게시글 둘러보기
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => router.push(`/articles/${article.id}`)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {article.content}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{article.user?.nickname ?? "익명"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-red-500">
                      <Heart size={16} fill="currentColor" />
                      <span>{article.likeCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
