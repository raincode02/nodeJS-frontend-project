import { User } from "./types";

export class UserEntity {
  constructor(private user: User) {}

  getId() {
    return this.user.id;
  }

  getNickname() {
    return this.user.nickname;
  }

  getEmail() {
    return this.user.email;
  }

  getImage() {
    return this.user.image;
  }

  toJSON() {
    const { id, email, nickname, image } = this.user;
    return { id, email, nickname, image };
  }
}
export type { User };
