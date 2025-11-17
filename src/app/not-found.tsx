"use client";

import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 일러스트 */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <FileQuestion size={64} className="text-white" />
          </div>
          <div className="text-8xl font-bold text-blue-600 mb-2">404</div>
        </div>

        {/* 메시지 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-gray-600 mb-8">
          요청하신 페이지가 삭제되었거나 주소가 변경되었습니다.
          <br />
          주소를 다시 확인해주세요.
        </p>

        {/* 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Home size={20} />
            <span>홈으로</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>이전 페이지</span>
          </button>
        </div>

        {/* 추천 링크 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">추천 페이지</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/products"
              className="px-4 py-2 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              상품 보기
            </Link>
            <Link
              href="/articles"
              className="px-4 py-2 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              게시글 보기
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              내 프로필
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
