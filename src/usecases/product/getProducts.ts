import { getProductsAPI } from "../../repositories/productRepository";
import type { Product } from "../../domain/product/types";

export async function getProducts(): Promise<Product[]> {
  return getProductsAPI();
}
