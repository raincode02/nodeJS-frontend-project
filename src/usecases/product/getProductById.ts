import { getProductByIdAPI } from "../../repositories/productRepository";
import type {
  GetProductByIdInput,
  GetProductByIdResult,
} from "../../domain/product/types";

export async function getProductById(
  data: GetProductByIdInput
): Promise<GetProductByIdResult> {
  return getProductByIdAPI(data.id);
}
