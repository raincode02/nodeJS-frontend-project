import { getLikedArticlesAPI } from "../../repositories/userRepository";
import type { Article } from "../../domain/article/entities";

export type GetLikedArticlesResult = Article[];

export async function getLikedArticles(): Promise<GetLikedArticlesResult> {
  return getLikedArticlesAPI();
}
