import axios from "@/infrastructure/axios";
import type { Article } from "@/domain/article/entities";
import type {
  CreateArticleInput,
  UpdateArticleInput,
} from "@/domain/article/types";

// 전체 조회
export async function getArticlesAPI(): Promise<Article[]> {
  const { data } = await axios.get("/articles");
  return data.data;
}

// 단일 조회
export async function getArticleByIdAPI(id: number): Promise<Article> {
  const { data } = await axios.get(`/articles/${id}`);
  return data.data;
}

// 좋아요 토글
export async function toggleArticleLikeAPI(id: number) {
  const { data } = await axios.post(`/articles/${id}/like`);
  return data;
}

// 게시글 생성
export async function createArticleAPI(
  data: CreateArticleInput
): Promise<Article> {
  const res = await axios.post("/articles", data);
  return res.data.data;
}

// 게시글 수정
export async function updateArticleAPI(
  id: number,
  data: UpdateArticleInput
): Promise<Article> {
  const res = await axios.patch(`/articles/${id}`, data);
  return res.data.data;
}

// 게시글 삭제
export async function deleteArticleAPI(id: number): Promise<void> {
  await axios.delete(`/articles/${id}`);
}
