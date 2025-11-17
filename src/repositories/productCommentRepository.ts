import axios from "../infrastructure/axios";
import type { Comment } from "@/domain/comment/types";

// 전체 조회
export async function getProductCommentsAPI(
  productId: number
): Promise<Comment[]> {
  const { data } = await axios.get(`/products/${productId}/comments`);
  return data.data;
}

// 단일 조회
export async function getProductCommentByIdAPI(
  productId: number,
  commentId: number
): Promise<Comment> {
  const { data } = await axios.get(
    `/products/${productId}/comments/${commentId}`
  );
  return data.data;
}

// 댓글 생성
export async function createProductCommentAPI(
  productId: number,
  content: string
): Promise<Comment> {
  const { data } = await axios.post(`/products/${productId}/comments`, {
    content,
  });
  return data.data;
}

// 댓글 수정
export async function updateProductCommentAPI(
  productId: number,
  commentId: number,
  content: string
): Promise<Comment> {
  const { data } = await axios.patch(
    `/products/${productId}/comments/${commentId}`,
    { content }
  );
  return data.data;
}

// 댓글 삭제
export async function deleteProductCommentAPI(
  productId: number,
  commentId: number
): Promise<void> {
  await axios.delete(`/products/${productId}/comments/${commentId}`);
}
