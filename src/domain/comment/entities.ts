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

export class CommentEntity {
  constructor(private comment: Comment) {}

  getId() {
    return this.comment.id;
  }

  getContent() {
    return this.comment.content;
  }

  getUserId() {
    return this.comment.userId;
  }

  getUser() {
    return this.comment.user;
  }

  toJSON() {
    return { ...this.comment };
  }
}
