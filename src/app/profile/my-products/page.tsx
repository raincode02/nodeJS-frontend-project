"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/infrastructure/axios";
import { DollarSign, Heart, Tag, MessageSquare } from "lucide-react";
import type { Product } from "@/domain/product/types";
import { showToast } from "@/lib/toast";
import { getErrorStatus } from "@/lib/errorHandler";
import Image from "next/image";

export default function MyProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyProducts() {
      try {
        const res = await axios.get("/users/products");
        setProducts(res.data.data);
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
    fetchMyProducts();
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 mb-4"
          >
            ← 뒤로가기
          </button>
          <h1 className="text-4xl font-bold text-gray-900">내가 등록한 상품</h1>
          <p className="text-gray-600 mt-2">총 {products.length}개</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">등록한 상품이 없습니다.</p>
            <button
              onClick={() => router.push("/products/new")}
              className="mt-4 text-blue-600 hover:underline"
            >
              첫 번째 상품을 등록해보세요!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`/products/${product.id}`)}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group relative"
              >
                <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
                  {product.productImages && product.productImages.length > 0 ? (
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

                <div className="p-5 flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                  </h2>

                  <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-1 text-2xl font-bold text-blue-600 mb-3">
                    <DollarSign size={20} />
                    <span>{product.price.toLocaleString()}원</span>
                  </div>

                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {product.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                        >
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-5 right-5 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-red-500">
                    <Heart
                      size={14}
                      fill={product.likeCount > 0 ? "currentColor" : "none"}
                    />
                    <span className="ml-1">{product.likeCount}</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500">
                    <MessageSquare size={14} />
                    <span>{product.commentCount}</span>
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
