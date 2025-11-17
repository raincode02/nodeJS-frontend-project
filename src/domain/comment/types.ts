export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: {
    id: number;
    nickname: string;
  } | null;
}

export interface CommentListResponse {
  comments: Comment[];
  nextCursor: string | null;
}

export interface CreateCommentInput {
  content: string;
}

export interface UpdateCommentInput {
  id: number;
  content: string;
}

export interface GetCommentsResult {
  comments: Comment[];
}
