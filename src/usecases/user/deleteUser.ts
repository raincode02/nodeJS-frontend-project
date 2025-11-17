import { deleteUserAPI } from "../../repositories/userRepository";

export async function deleteUser(): Promise<void> {
  return deleteUserAPI();
}
