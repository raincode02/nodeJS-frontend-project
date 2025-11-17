"use client";

import { useState, useEffect } from "react";
import axios from "@/infrastructure/axios";
import { showToast } from "@/lib/toast";
import { MessageSquare, Send, Edit2, Trash2, User } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import ConfirmModal from "./ConfirmModal";
import type { Comment, CommentListResponse } from "@/domain/comment/types";
import CommentSkeleton from "./CommentSkeleton";
import { getErrorStatus } from "@/lib/errorHandler";

interface CommentsProps {
  resourceType: "article" | "product";
  resourceId: string | string[];
  showCount?: boolean;
}

export default function Comments({ resourceType, resourceId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null
  );

  const deleteModal = useModal();
  const [commentIdToDelete, setCommentIdToDelete] = useState<number | null>(
    null
  );

  const normalizedResourceId = Array.isArray(resourceId)
    ? resourceId[0]
    : resourceId;

  // 댓글 목록 조회
  const loadComments = async (cursor?: string, append: boolean = false) => {
    try {
      const url =
        resourceType === "article"
          ? `/articles/${normalizedResourceId}/comments`
          : `/products/${normalizedResourceId}/comments`;

      const params: { limit: number; cursor?: string } = { limit: 10 };
      if (cursor) {
        params.cursor = cursor;
      }

      const res = await axios.get<CommentListResponse>(url, { params });

      if (append) {
        setComments((prev) => [...prev, ...res.data.comments]);
      } else {
        setComments(res.data.comments);
      }
      setNextCursor(res.data.nextCursor);
    } catch (err) {
      console.error("댓글 로드 에러:", err);
      showToast.error("댓글을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedResourceId, resourceType]);

  // 댓글 작성
  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) {
      showToast.error("댓글 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const url =
        resourceType === "article"
          ? `/articles/${resourceId}/comments`
          : `/products/${resourceId}/comments`;

      const res = await axios.post(url, { content: newCommentContent });

      setComments([res.data, ...comments]);

      setNewCommentContent("");
      showToast.success("댓글이 등록되었습니다!");
    } catch (err) {
      const status = getErrorStatus(err);
      if (status === 401) {
        showToast.error("로그인이 필요합니다.");
      } else {
        showToast.error("댓글 등록에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 수정
  const startEditingComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const updateComment = async (commentId: number) => {
    if (!editingCommentContent.trim()) {
      showToast.error("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      const url =
        resourceType === "article"
          ? `/articles/${resourceId}/comments/${commentId}`
          : `/products/${resourceId}/comments/${commentId}`;

      const res = await axios.patch(url, { content: editingCommentContent });
      setComments(comments.map((c) => (c.id === commentId ? res.data : c)));
      setEditingCommentId(null);
      setEditingCommentContent("");
      showToast.success("댓글이 수정되었습니다!");
    } catch (err) {
      const status = getErrorStatus(err);
      if (status === 401) {
        showToast.error("로그인이 필요합니다.");
      } else if (status === 403) {
        showToast.error("수정 권한이 없습니다.");
      } else {
        showToast.error("댓글 수정에 실패했습니다.");
      }
    }
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  // 댓글 삭제
  const confirmDeleteComment = (commentId: number) => {
    setCommentIdToDelete(commentId);
    deleteModal.openModal();
  };

  const deleteComment = async () => {
    if (!commentIdToDelete) return;

    setDeletingCommentId(commentIdToDelete);
    try {
      const url =
        resourceType === "article"
          ? `/articles/${resourceId}/comments/${commentIdToDelete}`
          : `/products/${resourceId}/comments/${commentIdToDelete}`;

      await axios.delete(url);

      const updatedComments = comments.filter(
        (c) => c.id !== commentIdToDelete
      );
      setComments(updatedComments);

      if (updatedComments.length < 10 && nextCursor) {
        setIsLoadingMore(true);
        loadComments(nextCursor, true);
      }

      showToast.success("댓글이 삭제되었습니다!");
      setCommentIdToDelete(null);
    } catch (err) {
      const status = getErrorStatus(err);
      if (status === 401) {
        showToast.error("로그인이 필요합니다.");
      } else if (status === 403) {
        showToast.error("삭제 권한이 없습니다.");
      } else {
        showToast.error("댓글 삭제에 실패했습니다.");
      }
    } finally {
      setDeletingCommentId(null);
      deleteModal.closeModal();
    }
  };

  // 더보기
  const loadMoreComments = () => {
    if (nextCursor && !isLoadingMore) {
      setIsLoadingMore(true);
      loadComments(nextCursor, true);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={20} />
          <h3 className="text-lg font-semibold">댓글</h3>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <CommentSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            댓글 {comments.length}
          </h3>
        </div>

        {/* 댓글 작성 폼 */}
        <form onSubmit={submitComment} className="mb-6">
          <div className="flex gap-3">
            <textarea
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="댓글을 작성해주세요..."
              rows={3}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newCommentContent.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-fit"
            >
              <Send size={18} />
              <span>등록</span>
            </button>
          </div>
        </form>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
              <p>첫 번째 댓글을 작성해보세요!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                {/* 댓글 헤더 */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {comment.user?.nickname || "익명"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* 수정/삭제 버튼 */}
                  <div className="flex gap-2">
                    {editingCommentId !== comment.id && (
                      <>
                        <button
                          onClick={() => startEditingComment(comment)}
                          className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                          title="수정"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => confirmDeleteComment(comment.id)}
                          className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* 댓글 내용 / 수정 폼 */}
                {editingCommentId === comment.id ? (
                  <div className="ml-10">
                    <textarea
                      value={editingCommentContent}
                      onChange={(e) => setEditingCommentContent(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateComment(comment.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={cancelEditingComment}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 ml-10 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* 더보기 버튼 */}
        {nextCursor && comments.length > 10 && (
          <div className="mt-6 text-center">
            <button
              onClick={loadMoreComments}
              disabled={isLoadingMore}
              className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              {isLoadingMore ? "불러오는 중..." : "댓글 더보기"}
            </button>
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={deleteComment}
        title="댓글 삭제"
        message="정말로 이 댓글을 삭제하시겠습니까?"
        confirmText="삭제"
        type="danger"
        loading={deletingCommentId !== null}
      />
    </>
  );
}
