export function removeSensitiveFields<T extends { password?: string }>(
  obj: T
): Omit<T, "password"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...rest } = obj; // password는 선언만, 반환 안 됨
  return rest;
}
