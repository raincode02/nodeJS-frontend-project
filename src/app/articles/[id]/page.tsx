"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/infrastructure/axios";
import type { Article } from "@/domain/article/types";
import { Edit, Trash2, User, Calendar } from "lucide-react";
import { showToast } from "@/lib/toast";
import ConfirmModal from "@/app/components/ConfirmModal";
import { useModal } from "@/hooks/useModal";
import Comments from "@/app/components/Comments";
import ArticleDetailSkeleton from "@/app/components/ArticleDetailSkeleton";
import LikeButton from "@/app/components/LikeButton";
import { getErrorStatus } from "@/lib/errorHandler";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteModal = useModal();

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await axios.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  const handleLike = async () => {
    if (!article || isLiking) return;
    setIsLiking(true);
    try {
      const res = await axios.post(`/articles/${id}/like`);
      setArticle({
        ...article,
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
    router.push(`/articles/${id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/articles/${id}`);
      showToast.success("게시글이 삭제되었습니다.");
      router.push("/articles");
    } catch (err) {
      deleteModal.closeModal();

      const status = getErrorStatus(err);
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
    return <ArticleDetailSkeleton />;
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            게시글을 찾을 수 없습니다
          </h2>
          <button
            onClick={() => router.push("/articles")}
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
          {/* 상단 네비게이션 */}
          <button
            onClick={() => router.back()}
            className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← 뒤로가기
          </button>

          {/* 메인 카드 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 헤더 */}
            <div className="border-b border-gray-200 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              {/* 메타 정보 */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{article.user?.nickname ?? "익명"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      {new Date(article.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex items-center gap-2">
                  <LikeButton
                    isLiked={article.isLiked}
                    likeCount={article.likeCount}
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

            {/* 본문 */}
            <div className="p-6">
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {article.content}
              </div>
            </div>
          </div>

          {/* 댓글 컴포넌트 */}
          <div className="mt-8">
            {id && (
              <Comments
                resourceType="article"
                resourceId={id}
                showCount={true}
              />
            )}
          </div>

          {/* 하단 네비게이션 */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push("/articles")}
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
        title="게시글 삭제"
        message="정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        type="danger"
        loading={isDeleting}
      />
    </>
  );
}
