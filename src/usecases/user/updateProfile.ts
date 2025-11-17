import { updateProfileAPI } from "../../repositories/userRepository";
import type {
  UpdateProfileInput,
  UpdateProfileResult,
} from "../../domain/user/types";

export async function updateProfile(
  data: UpdateProfileInput
): Promise<UpdateProfileResult> {
  return updateProfileAPI(data);
}
