import axios from "axios";
import { showToast } from "@/lib/toast";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
  timeout: 10000, // 10초 타임아웃
});

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    // 요청 전 처리 (로딩 표시 등)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 네트워크 에러
    if (!error.response) {
      showToast.error("네트워크 연결을 확인해주세요.");
      return Promise.reject(error);
    }

    const status = error.response?.status;

    // ✅ 401 에러 처리 개선
    if (status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          );
          return instance(originalRequest);
        } catch (refreshError) {
          // ✅ 토스트 메시지를 한 번만 표시
          if (!originalRequest._authErrorShown) {
            originalRequest._authErrorShown = true;
          }

          // ✅ 특정 경로에서만 리다이렉트 (2초 딜레이)
          if (typeof window !== "undefined") {
            const protectedRoutes = [
              "/profile",
              "/products/new",
              "/articles/new",
            ];
            const currentPath = window.location.pathname;

            if (
              protectedRoutes.some((route) => currentPath.startsWith(route))
            ) {
              setTimeout(() => {
                window.location.href = "/login";
              }, 1500);
            }
          }
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }

    switch (status) {
      case 400:
        // Bad Request
        showToast.error(error.response?.data?.message || "잘못된 요청입니다.");
        break;

      case 403:
        // Forbidden
        if (!originalRequest._errorShown) {
          originalRequest._errorShown = true;
          showToast.error(
            error.response?.data?.message || "접근 권한이 없습니다."
          );
        }
        break;

      case 404:
        // Not Found
        showToast.error("요청한 리소스를 찾을 수 없습니다.");
        break;

      case 409:
        // Conflict
        showToast.error(
          error.response?.data?.message || "이미 존재하는 데이터입니다."
        );
        break;

      case 429:
        // Too Many Requests
        showToast.error("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
        break;

      case 500:
      case 502:
      case 503:
        // Server Error
        showToast.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        break;

      default:
        showToast.error("알 수 없는 오류가 발생했습니다.");
    }

    return Promise.reject(error);
  }
);

export default instance;
