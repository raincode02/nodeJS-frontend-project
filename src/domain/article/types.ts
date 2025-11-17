export interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: {
    id: number;
    nickname: string;
  } | null;
  commentCount: number;
  likeCount: number;
  isLiked: boolean;
}

export interface ToggleArticleLikePayload {
  articleId: number;
  userId: number;
}

export type GetArticleByIdInput = { id: number };
export type GetArticleByIdResult = Article;

export type ToggleArticleLikeInput = number;
export type ToggleArticleLikeResult = {
  isLiked: boolean;
  likeCount: number;
};

export type CreateArticleInput = {
  title: string;
  content: string;
};

export type UpdateArticleInput = {
  id: number;
  title: string;
  content: string;
};
