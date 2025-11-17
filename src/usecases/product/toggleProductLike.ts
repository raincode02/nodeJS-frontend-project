import { toggleProductLikeAPI } from "../../repositories/productRepository";
import type {
  ToggleProductLikeInput,
  ToggleProductLikeResult,
} from "../../domain/product/types";

export async function toggleProductLike(
  data: ToggleProductLikeInput
): Promise<ToggleProductLikeResult> {
  return toggleProductLikeAPI(data);
}
