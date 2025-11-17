import { toggleArticleLikeAPI } from "../../repositories/articleRepository";
import type {
  ToggleArticleLikeInput,
  ToggleArticleLikeResult,
} from "../../domain/article/types";

export async function toggleArticleLike(
  data: ToggleArticleLikeInput
): Promise<ToggleArticleLikeResult> {
  return toggleArticleLikeAPI(data);
}
