"use client";
import { useEffect, useState } from "react";
import axios from "@/infrastructure/axios";
import {
  Heart,
  User,
  DollarSign,
  Plus,
  Tag,
  MessageSquare,
} from "lucide-react";
import type { Product } from "@/domain/product/types";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "../components/Pagination";
import PageInfo from "../components/PageInfo";
import SearchBar from "../components/SearchBar";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import Image from "next/image";

interface ProductsQuery {
  page: number;
  pageSize: number;
  keyword?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
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
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const params: ProductsQuery = {
          page: currentPage,
          pageSize: 10,
        };

        if (searchKeyword.trim()) {
          params.keyword = searchKeyword.trim();
        }

        const res = await axios.get("/products", { params });
        setProducts(res.data.data);
        setMeta(res.data.meta);
      } catch (err) {
        console.error(err);
        setError("상품을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [currentPage, searchKeyword]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (searchKeyword) {
      params.set("keyword", searchKeyword);
    }

    router.push(`/products?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (keyword: string) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (keyword.trim()) {
      params.set("keyword", keyword.trim());
    }

    router.push(`/products?${params.toString()}`);
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
              placeholder="상품명, 설명으로 검색..."
              defaultValue={searchKeyword}
            />
          </div>
          <div className="grid gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">상품</h1>
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
            onClick={() => router.push("/products/new")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus size={20} />
            <span>새 상품 등록</span>
          </button>
        </div>

        {/* 검색바 */}
        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="상품명, 설명으로 검색..."
            defaultValue={searchKeyword}
          />
        </div>

        {/* ✅ 에러 또는 검색 결과 없음 */}
        {error || products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">
              {searchKeyword
                ? `"${searchKeyword}"에 대한 검색 결과가 없습니다.`
                : "상품이 없습니다."}
            </p>
            {!searchKeyword && (
              <button
                onClick={() => router.push("/products/new")}
                className="text-blue-600 hover:underline"
              >
                첫 번째 상품을 등록해보세요!
              </button>
            )}
          </div>
        ) : (
          <>
            {/* 상품 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group relative h-[28rem]"
                >
                  {/* 이미지 */}
                  <div className="w-full h-65 bg-gray-200 relative overflow-hidden">
                    {product.productImages &&
                    product.productImages.length > 0 ? (
                      <Image
                        src={product.productImages[0].image.url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => {
                          // ✅ 이미지 로드 실패 시 처리
                          console.error(
                            "이미지 로드 실패:",
                            product.productImages![0].image.url
                          );
                        }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="absolute top-67 left-5 right-5">
                    {/* 상품명 */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1 relative">
                      {product.name}
                    </h2>

                    {/* 설명 */}
                    <p className="text-gray-600 mb-2 line-clamp-1 text-sm">
                      {product.description}
                    </p>

                    {/* 가격 */}
                    <div className="flex items-center gap-1 text-[1.2rem] font-bold text-blue-600">
                      <DollarSign size={18} />
                      <span>{product.price.toLocaleString()}원</span>
                    </div>

                    {/* 태그 영역 - 없을 때도 최소 높이 유지 */}
                    <div className="absolute top-[6.5rem] left-1 right-1 flex flex-wrap gap-2">
                      {product.tags?.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                        >
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                      {product.tags && product.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{product.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* 메타 정보 */}
                    <div className="absolute top-[8.2rem] left-1 right-1 border-t pt-3">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          <span>{product.user?.nickname || "익명"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-5 right-5 flex items-center gap-2 text-red-500">
                    <Heart
                      size={16}
                      fill={
                        product.isLiked === true || product.likeCount > 0
                          ? "currentColor"
                          : "none"
                      }
                      className={
                        product.isLiked === true ? "animate-pulse" : ""
                      }
                    />
                    <span className="font-semibold">
                      {product.likeCount || 0}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MessageSquare size={14} />
                      <span>{product.commentCount || 0}</span>
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
