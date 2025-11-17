import axios from "../infrastructure/axios";
import type { Product } from "../domain/product/entities";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../domain/product/types";

// 전체 조회
export async function getProductsAPI(): Promise<Product[]> {
  const { data } = await axios.get("/products");
  return data.data;
}

// 단일 조회
export async function getProductByIdAPI(id: number): Promise<Product> {
  const { data } = await axios.get(`/products/${id}`);
  return data.data;
}

// 생성
export async function createProductAPI(
  input: CreateProductInput
): Promise<Product> {
  const { data } = await axios.post("/products", input);
  return data.data;
}

// 수정
export async function updateProductAPI(
  id: number,
  input: UpdateProductInput
): Promise<Product> {
  const { data } = await axios.patch(`/products/${id}`, input);
  return data.data;
}

// 삭제
export async function deleteProductAPI(id: number): Promise<void> {
  await axios.delete(`/products/${id}`);
}

// 좋아요 토글
export async function toggleProductLikeAPI(id: number): Promise<{
  isLiked: boolean;
  likeCount: number;
}> {
  const { data } = await axios.post(`/products/${id}/like`);
  return data;
}
