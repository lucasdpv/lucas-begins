import React from "react";
import { cn } from "../../lib/utils";

export default function FormSkeleton({ isDark }) {
  const skeletonColor = isDark ? "bg-gray-800" : "bg-gray-200";
  const accentColor = isDark ? "bg-gray-700" : "bg-gray-300";

  return (
    <div className="max-w-7xl mx-auto animate-pulse py-8 px-4 md:px-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-6">
          <div className={cn("w-16 h-16 rounded-2xl border-4", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-200 border-gray-300")} />
          <div className="space-y-3">
            <div className={cn("w-32 h-3 rounded", accentColor)} />
            <div className={cn("w-64 h-10 rounded", skeletonColor)} />
          </div>
        </div>
        <div className={cn("w-48 h-16 border-4", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-200 border-gray-300")} />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={cn(
            "p-6 rounded-[2.5rem] border-4 flex items-center gap-5",
            isDark ? "bg-gray-800/40 border-gray-700/50" : "bg-white border-gray-100"
          )}>
            <div className={cn("w-14 h-14 rounded-2xl", accentColor)} />
            <div className="space-y-2">
              <div className={cn("w-16 h-2 rounded", accentColor)} />
              <div className={cn("w-10 h-6 rounded", skeletonColor)} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className={cn(
        "p-2 rounded-[2.5rem] border-4 mb-10 flex gap-2",
        isDark ? "bg-gray-900/40 border-gray-800/50" : "bg-gray-100/60 border-gray-200"
      )}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={cn("w-32 h-14 rounded-[1.8rem]", i === 1 ? "bg-purple-600/30" : accentColor)} />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className={cn("rounded-2xl border-4 p-6", isDark ? "bg-gray-800/40 border-gray-700" : "bg-white border-gray-100")}>
        <div className="space-y-4">
          <div className={cn("w-full h-12 rounded-xl mb-6", accentColor)} />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={cn("w-full h-16 rounded-xl", i % 2 === 0 ? skeletonColor : accentColor)} />
          ))}
        </div>
      </div>
    </div>
  );
}
