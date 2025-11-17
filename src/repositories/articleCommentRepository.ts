import axios from "@/infrastructure/axios";
import type { Comment } from "@/domain/comment/types";

// 댓글 전체 조회
export async function getArticleCommentsAPI(
  articleId: number
): Promise<Comment[]> {
  const { data } = await axios.get(`/articles/${articleId}/comments`);
  return data.data;
}

// 단일 댓글 조회
export async function getArticleCommentByIdAPI(
  articleId: number,
  commentId: number
): Promise<Comment> {
  const { data } = await axios.get(
    `/articles/${articleId}/comments/${commentId}`
  );
  return data.data;
}

// 댓글 생성
export async function createArticleCommentAPI(
  articleId: number,
  content: string
): Promise<Comment> {
  const { data } = await axios.post(`/articles/${articleId}/comments`, {
    content,
  });
  return data.data;
}

// 댓글 수정
export async function updateArticleCommentAPI(
  articleId: number,
  commentId: number,
  content: string
): Promise<Comment> {
  const { data } = await axios.patch(
    `/articles/${articleId}/comments/${commentId}`,
    { content }
  );
  return data.data;
}

// 댓글 삭제
export async function deleteArticleCommentAPI(
  articleId: number,
  commentId: number
): Promise<void> {
  await axios.delete(`/articles/${articleId}/comments/${commentId}`);
}
