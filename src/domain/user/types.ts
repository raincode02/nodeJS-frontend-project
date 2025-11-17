export interface User {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfilePayload {
  nickname?: string;
  image?: string | null;
  currentPassword?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type UpdateProfileInput = {
  nickname?: string;
  image?: string | null;
  currentPassword?: string;
};

export type UpdateProfileResult = User;
