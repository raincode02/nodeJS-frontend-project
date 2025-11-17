import { changePasswordAPI } from "../../repositories/userRepository";
import type { ChangePasswordInput } from "../../domain/user/types";

// 반환값이 없으므로 Promise<void>
export async function changePassword(data: ChangePasswordInput): Promise<void> {
  const { currentPassword, newPassword } = data;
  return changePasswordAPI(currentPassword, newPassword);
}
