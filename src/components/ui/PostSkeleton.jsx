import React from "react";
import { cn } from "../../lib/utils";

export default function PostSkeleton({ isDark }) {
  return (
    <div className={cn("p-6 rounded-2xl border-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row gap-6 h-full transition-colors", isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300")}>
      {/* Cover Skeleton */}
      <div className="w-full sm:w-48 h-48 sm:h-auto rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse shrink-0" />
      
      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
        
        <div className="w-3/4 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse mb-4" />
        <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse mb-2" />
        <div className="w-5/6 h-4 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse mb-6" />
        
        <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="w-16 h-4 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
