"use client";

import Skeleton from "./Skeleton";

export default function CommentSkeleton() {
  return (
    <div className="border-b border-gray-200 pb-4">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={32} height={32} />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>

      {/* 내용 */}
      <div className="ml-10 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
