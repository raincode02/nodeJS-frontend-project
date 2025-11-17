"use client";
import { useEffect, useState } from "react";
import axios from "@/infrastructure/axios";
import { Heart, User, Calendar, Plus, MessageSquare } from "lucide-react";
import type { Article } from "@/domain/article/types";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "../components/Pagination";
import PageInfo from "../components/PageInfo";
import SearchBar from "../components/SearchBar";
import ArticleCardSkeleton from "../components/ArticleCardSkeleton";

interface ArticlesQuery {
  page: number;
  pageSize: number;
  keyword?: string;
}

export default function ArticlesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [meta, setMeta] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
  });

  const searchKeyword = searchParams.get("keyword") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      setError(null);

      try {
        const params: ArticlesQuery = {
          page: currentPage,
          pageSize: 10,
        };

        if (searchKeyword.trim()) {
          params.keyword = searchKeyword.trim();
        }

        const res = await axios.get("/articles", { params });
        setArticles(res.data.data);
        setMeta(res.data.meta);
      } catch (err) {
        console.error(err);
        setError("게시글을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [currentPage, searchKeyword]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (searchKeyword) {
      params.set("keyword", searchKeyword);
    }

    router.push(`/articles?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (keyword: string) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (keyword.trim()) {
      params.set("keyword", keyword.trim());
    }

    router.push(`/articles?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">게시글</h1>
          </div>
          <div className="mb-6">
            <SearchBar
              onSearch={handleSearch}
              placeholder="제목, 내용으로 검색..."
              defaultValue={searchKeyword}
            />
          </div>
          <div className="grid gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">게시글</h1>
            {/* ✅ 검색 결과 표시 */}
            <p className="text-gray-600 mt-2">
              {searchKeyword ? (
                <>
                  <span className="font-semibold text-blue-600">
                    {searchKeyword}
                  </span>{" "}
                  검색 결과: 총 {meta?.total ?? 0}개
                </>
              ) : (
                <>
                  전체 {meta?.total ?? 0}개 (페이지 {meta?.page ?? 1}/
                  {meta?.totalPages ?? 1})
                </>
              )}
            </p>
          </div>

          <button
            onClick={() => router.push("/articles/new")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus size={20} />
            <span>새 게시글</span>
          </button>
        </div>

        {/* 검색바 */}
        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="제목, 내용으로 검색..."
            defaultValue={searchKeyword}
          />
        </div>

        {/* ✅ 에러 또는 검색 결과 없음 */}
        {error || articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">
              {searchKeyword
                ? `"${searchKeyword}"에 대한 검색 결과가 없습니다.`
                : "게시글이 없습니다."}
            </p>
            {!searchKeyword && (
              <button
                onClick={() => router.push("/articles/new")}
                className="text-blue-600 hover:underline"
              >
                첫 번째 게시글을 작성해보세요!
              </button>
            )}
          </div>
        ) : (
          <>
            {/* 게시글 목록 */}
            <div className="grid gap-6">
              {articles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => router.push(`/articles/${article.id}`)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                >
                  <div className="p-6">
                    {/* 제목 */}
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-1">
                      {article.title}
                    </h2>

                    {/* 내용 미리보기 */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.content}
                    </p>

                    {/* 메타 정보 */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>{article.user?.nickname || "익명"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-red-500">
                        <Heart
                          size={16}
                          fill={article.likeCount > 0 ? "currentColor" : "none"}
                          className={
                            article.likeCount > 0 ? "animate-pulse" : ""
                          }
                        />
                        <span className="font-semibold">
                          {article.likeCount || 0}
                        </span>
                        <div className="flex items-center gap-1 text-gray-500">
                          <MessageSquare size={14} />
                          <span>{article.commentCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지 정보 추가 */}
            {meta && (
              <div className="mt-4">
                <PageInfo
                  currentPage={meta.page}
                  pageSize={meta.pageSize}
                  total={meta.total}
                />
              </div>
            )}

            {/* 페이지네이션 */}
            {meta && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
