import { getProfileAPI } from "../../repositories/userRepository";
import type { User } from "../../domain/user/types";

export type GetProfileResult = User;

export async function getProfile(): Promise<GetProfileResult> {
  return getProfileAPI();
}
