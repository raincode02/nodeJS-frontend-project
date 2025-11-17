import { getLikedProductsAPI } from "../../repositories/userRepository";
import type { Product } from "../../domain/product/entities";

export type GetLikedProductsResult = Product[];

export async function getLikedProducts(): Promise<GetLikedProductsResult> {
  return getLikedProductsAPI();
}
