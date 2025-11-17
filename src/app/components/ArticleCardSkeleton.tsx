"use client";

import Skeleton from "./Skeleton";

export default function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* 제목 */}
      <Skeleton className="h-8 w-3/4 mb-4" />

      {/* 내용 미리보기 */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* 하단 메타 정보 */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
    </div>
  );
}
