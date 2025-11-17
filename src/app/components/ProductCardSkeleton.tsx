"use client";

import Skeleton from "./Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* 이미지 영역 */}
      <Skeleton className="w-full h-48" />

      <div className="p-5 space-y-3">
        {/* 상품명 */}
        <Skeleton className="h-6 w-3/4" />

        {/* 설명 */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        {/* 가격 */}
        <Skeleton className="h-8 w-32" />

        {/* 태그들 */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" variant="text" />
          <Skeleton className="h-6 w-20" variant="text" />
        </div>

        {/* 하단 정보 */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={14} height={14} />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={14} height={14} />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
