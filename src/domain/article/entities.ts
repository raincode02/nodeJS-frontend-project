// /domain/article/entities.ts
import { Article } from "./types";

export class ArticleEntity {
  constructor(private article: Article) {}

  getId() {
    return this.article.id;
  }

  getTitle() {
    return this.article.title;
  }

  getContent() {
    return this.article.content;
  }

  getLikeCount() {
    return this.article.likeCount;
  }

  isLikedByUser() {
    return this.article.isLiked ?? false;
  }

  toJSON() {
    return { ...this.article };
  }
}
export type { Article };
