import { getArticlesAPI } from "../../repositories/articleRepository";
import type { Article } from "../../domain/article/types";

export async function getArticles(): Promise<Article[]> {
  return getArticlesAPI();
}
