import axios from "../infrastructure/axios";
import type { User } from "../domain/user/entities";

// 프로필 조회
export async function getProfileAPI(): Promise<User> {
  const { data } = await axios.get("/users/profile");
  return data.data;
}

// 프로필 수정
export async function updateProfileAPI(
  updateData: Partial<User>
): Promise<User> {
  const { data } = await axios.put("/users/profile", updateData);
  return data.data;
}

// 비밀번호 변경
export async function changePasswordAPI(
  currentPassword: string,
  newPassword: string
) {
  await axios.put("/users/password", { currentPassword, newPassword });
}

// 회원 탈퇴
export async function deleteUserAPI(): Promise<void> {
  await axios.delete("/users/delete");
}

// 좋아요한 상품 목록 조회
export async function getLikedProductsAPI() {
  const { data } = await axios.get("/users/likes/products");
  return data.data;
}

// 좋아요한 게시글 목록 조회
export async function getLikedArticlesAPI() {
  const { data } = await axios.get("/users/likes/articles");
  return data.data;
}
