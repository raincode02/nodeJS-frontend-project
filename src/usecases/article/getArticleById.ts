import { getArticleByIdAPI } from "../../repositories/articleRepository";
import type {
  GetArticleByIdInput,
  GetArticleByIdResult,
} from "../../domain/article/types";

export async function getArticleById(
  data: GetArticleByIdInput
): Promise<GetArticleByIdResult> {
  return getArticleByIdAPI(data.id);
}
