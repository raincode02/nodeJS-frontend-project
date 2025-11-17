import { AxiosError } from "axios";

/**
 * Axios 에러인지 확인하는 타입 가드
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

/**
 * 에러에서 HTTP 상태 코드 추출
 */
export function getErrorStatus(error: unknown): number | undefined {
  if (isAxiosError(error)) {
    return error.response?.status;
  }
  return undefined;
}

/**
 * 에러에서 메시지 추출
 */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string };
    return data?.error || data?.message || "오류가 발생했습니다.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "알 수 없는 오류가 발생했습니다.";
}
