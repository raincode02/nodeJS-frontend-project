"use client";

import Skeleton from "./Skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 뒤로가기 버튼 */}
        <Skeleton className="h-6 w-24 mb-6" />

        {/* 메인 카드 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 이미지 */}
          <Skeleton className="w-full h-96" />

          {/* 헤더 */}
          <div className="border-b border-gray-200 p-6 space-y-4">
            {/* 상품명 */}
            <Skeleton className="h-8 w-2/3" />

            {/* 가격 */}
            <Skeleton className="h-8 w-40" />

            {/* 태그 */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" variant="text" />
              <Skeleton className="h-6 w-24" variant="text" />
              <Skeleton className="h-6 w-16" variant="text" />
            </div>

            {/* 메타 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
              </div>
            </div>
          </div>

          {/* 상품 설명 */}
          <div className="p-6 space-y-3">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
