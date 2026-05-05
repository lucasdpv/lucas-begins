import React from "react";
import { cn } from "../../lib/utils";

export default function AboutSkeleton({ isDark }) {
  const skeletonColor = isDark ? "bg-gray-800" : "bg-gray-200";
  const accentColor = isDark ? "bg-gray-700" : "bg-gray-300";

  return (
    <div className="max-w-4xl mx-auto py-8 animate-pulse">
      {/* Hero Skeleton */}
      <div className={cn("w-full h-64 rounded-2xl mb-12 flex flex-col items-center justify-center gap-4", skeletonColor)}>
        <div className={cn("w-20 h-20 rounded-2xl", accentColor)} />
        <div className={cn("w-64 h-12 rounded-xl", accentColor)} />
      </div>

      {/* Main Content Box Skeleton */}
      <div className={cn("p-8 md:p-12 rounded-2xl mb-16", isDark ? "bg-gray-800/40" : "bg-gray-50")}>
        <div className={cn("w-40 h-8 mb-8 rounded", accentColor)} />
        <div className="space-y-4">
          <div className={cn("w-full h-4 rounded", accentColor)} />
          <div className={cn("w-full h-4 rounded", accentColor)} />
          <div className={cn("w-5/6 h-4 rounded", accentColor)} />
          <div className={cn("w-full h-4 rounded", accentColor)} />
          <div className={cn("w-4/6 h-4 rounded", accentColor)} />
        </div>
      </div>

      {/* Player 1 Section Skeleton */}
      <div className={cn("w-48 h-8 mb-8 rounded", accentColor)} />
      <div className={cn("p-6 md:p-10 rounded-2xl border-2", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100")}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className={cn("w-32 h-32 shrink-0 rounded-2xl", skeletonColor)} />
          <div className="flex-1 w-full space-y-4">
            <div className={cn("w-64 h-10 rounded-xl", accentColor)} />
            <div className={cn("w-40 h-4 rounded", skeletonColor)} />
            <div className="space-y-3 pt-4">
              <div className={cn("w-full h-3 rounded", skeletonColor)} />
              <div className={cn("w-full h-3 rounded", skeletonColor)} />
              <div className={cn("w-full h-3 rounded", skeletonColor)} />
              <div className={cn("w-2/3 h-3 rounded", skeletonColor)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
