"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/infrastructure/axios";
import Image from "next/image";
import type { Product } from "@/domain/product/types";
import { Edit, Trash2, User, Calendar, Tag, DollarSign } from "lucide-react";
import { showToast } from "@/lib/toast";
import ConfirmModal from "@/app/components/ConfirmModal";
import { useModal } from "@/hooks/useModal";
import Comments from "@/app/components/Comments";
import ProductDetailSkeleton from "@/app/components/ProductDetailSkeleton";
import LikeButton from "@/app/components/LikeButton";
import { getErrorStatus } from "@/lib/errorHandler";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteModal = useModal();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleLike = async () => {
    if (!product || isLiking) return;
    setIsLiking(true);
    try {
      const res = await axios.post(`/products/${id}/like`);
      setProduct({
        ...product,
        isLiked: res.data.isLiked,
        likeCount: res.data.likeCount,
      });

      if (res.data.isLiked) {
        showToast.success("좋아요를 눌렀습니다!");
      } else {
        showToast.custom("좋아요를 취소했습니다.");
      }
    } catch (err) {
      const status = getErrorStatus(err);
      if (status === 401) {
        showToast.error("로그인이 필요합니다.");
        router.push("/login");
      } else {
        showToast.error("오류가 발생했습니다.");
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleEdit = () => {
    router.push(`/products/${id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/products/${id}`);
      showToast.success("상품글이 삭제되었습니다.");
      router.push("/products");
    } catch (err) {
      const status = getErrorStatus(err);

      deleteModal.closeModal();

      // 401 에러일 때만 추가 처리
      if (status === 401) {
        showToast.error("로그인이 필요합니다.");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            상품을 찾을 수 없습니다
          </h2>
          <button
            onClick={() => router.push("/products")}
            className="text-blue-600 hover:underline"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← 뒤로가기
          </button>

          {/* 메인 카드 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 이미지 갤러리 섹션 */}
            {product.productImages && product.productImages.length > 0 && (
              <div className="p-6 border-b border-gray-200">
                {/* 메인 이미지 */}
                <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
                  <Image
                    src={product.productImages[0].image.url}
                    alt={product.name}
                    fill
                    className="object-contain"
                    onError={() => {
                      console.error(
                        "이미지 로드 실패:",
                        product.productImages![0].image.url
                      );
                    }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>

                {/* 모든 이미지 표시 (2개 이상일 때만 표시) */}
                {product.productImages.length > 1 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {product.productImages
                      .slice(1)
                      .map((productImage, index) => (
                        <div
                          key={index + 1}
                          className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity border-2 border-gray-300 hover:border-blue-500 relative"
                        >
                          <Image
                            src={productImage.image.url}
                            alt={`${product.name} - ${index + 2}`}
                            fill
                            className="object-cover"
                            onError={() => {
                              console.error(
                                "이미지 로드 실패:",
                                productImage.image.url
                              );
                            }}
                            sizes="100px"
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* 헤더 */}
            <div className="border-b border-gray-200 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* 가격 */}
              <div className="flex items-center gap-2 text-2xl font-bold text-blue-600 mb-4">
                <DollarSign size={24} />
                <span>{product.price.toLocaleString()}원</span>
              </div>

              {/* 태그 */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      <Tag size={14} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 메타 정보 */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{product.user?.nickname ?? "익명"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      {new Date(product.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex items-center gap-2">
                  <LikeButton
                    isLiked={product.isLiked}
                    likeCount={product.likeCount}
                    onToggle={handleLike}
                    disabled={isLiking}
                    size="md"
                  />

                  <button
                    onClick={handleEdit}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="수정"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={deleteModal.openModal}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="삭제"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* 상품 설명 */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                상품 설명
              </h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {product.description}
              </div>
            </div>
          </div>

          {/* 댓글 컴포넌트 */}
          <div className="mt-8">
            {id && (
              <Comments
                resourceType="product"
                resourceId={id}
                showCount={true}
              />
            )}
          </div>

          {/* 하단 네비게이션 */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push("/products")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              목록으로
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDelete}
        title="상품 삭제"
        message="정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        type="danger"
        loading={isDeleting}
      />
    </>
  );
}
