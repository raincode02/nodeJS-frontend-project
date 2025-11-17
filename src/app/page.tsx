"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getArticles } from "@/usecases/article/getArticles";
import { getProducts } from "@/usecases/product/getProducts";
import type { Article } from "@/domain/article/types";
import type { Product } from "@/domain/product/types";
import {
  Heart,
  ArrowRight,
  FileText,
  Package,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getArticles().then((res) => setArticles(res.slice(0, 3)));
    getProducts().then((res) => setProducts(res.slice(0, 3)));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              마켓플레이스에 오신 것을 환영합니다
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              다양한 상품과 게시글을 한곳에서 만나보세요
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/products"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                상품 둘러보기
              </Link>
              <Link
                href="/articles"
                className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                게시글 보기
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 최근 게시글 섹션 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  최근 게시글
                </h2>
                <p className="text-gray-600">새로운 이야기를 확인해보세요</p>
              </div>
            </div>
            <Link
              href="/articles"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              전체 보기
              <ArrowRight size={20} />
            </Link>
          </div>

          {articles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500">아직 게시글이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 group"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {article.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.user?.nickname || "익명"}</span>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-red-500">
                        <Heart
                          size={14}
                          fill={article.likeCount > 0 ? "currentColor" : "none"}
                        />
                        <span>{article.likeCount || 0}</span>
                      </div>

                      <div className="flex items-center gap-1 text-gray-500">
                        <MessageSquare size={14} />
                        <span>{article.commentCount || 0}</span>
                      </div>

                      <span className="text-gray-400">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 최근 상품 섹션 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">인기 상품</h2>
                <p className="text-gray-600">지금 주목받는 상품들</p>
              </div>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              전체 보기
              <ArrowRight size={20} />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500">아직 상품이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
                    {product.productImages &&
                    product.productImages.length > 0 ? (
                      <Image
                        src={product.productImages[0].image.url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[1.2rem] font-bold text-blue-600 mb-2">
                      {product.price.toLocaleString()}원
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </p>

                    {/* 상품 카드 하단 */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{product.user?.nickname || "익명"}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-red-500">
                          <Heart
                            size={14}
                            fill={
                              product.likeCount > 0 ? "currentColor" : "none"
                            }
                          />
                          <span>{product.likeCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <MessageSquare size={14} />
                          <span>{product.commentCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white text-center">
          <TrendingUp size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-blue-100 mb-8 text-lg">
            상품을 등록하고 게시글을 작성해보세요
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/products/new"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              상품 등록하기
            </Link>
            <Link
              href="/articles/new"
              className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors border-2 border-white"
            >
              게시글 작성하기
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
