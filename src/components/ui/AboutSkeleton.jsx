import React from "react";
import { cn } from "../../lib/utils";

export default function AboutSkeleton({ isDark }) {
  const skeletonColor = isDark ? "bg-gray-800" : "bg-gray-200";
  const accentColor = isDark ? "bg-gray-700" : "bg-gray-300";

  return (
    <div className="max-w-7xl mx-auto py-8 animate-pulse px-4 md:px-0">
      {/* Hero Skeleton */}
      <div className={cn(
        "w-full h-72 rounded-[2.5rem] border-4 mb-12 flex flex-col items-center justify-center gap-6", 
        isDark ? "bg-gray-800/40 border-gray-700" : "bg-gray-100 border-gray-200"
      )}>
        <div className={cn("w-20 h-20 rounded-2xl", accentColor)} />
        <div className={cn("w-full max-w-md h-16 rounded-xl", accentColor)} />
      </div>

      {/* Main Content Box Skeleton */}
      <div className={cn(
        "p-10 md:p-16 rounded-[2.5rem] border-4 mb-16", 
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      )}>
        <div className={cn("w-40 h-10 mb-8 rounded", accentColor)} />
        <div className="space-y-6 mb-16">
          <div className={cn("w-full h-4 rounded", accentColor)} />
          <div className={cn("w-full h-4 rounded", accentColor)} />
          <div className={cn("w-5/6 h-4 rounded", accentColor)} />
        </div>

        <div className={cn("w-40 h-10 mb-10 rounded", accentColor)} />
        <div className={cn(
          "p-8 md:p-14 rounded-[2.5rem] border-4", 
          isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"
        )}>
          <div className="flex flex-col lg:row items-center lg:items-start gap-12">
            <div className={cn("w-40 h-40 shrink-0 rounded-3xl border-4", skeletonColor)} />
            <div className="flex-1 w-full space-y-6">
              <div className={cn("w-full max-w-xs h-12 rounded-xl", accentColor)} />
              <div className={cn("w-40 h-4 rounded", skeletonColor)} />
              <div className="space-y-4 pt-6">
                <div className={cn("w-full h-3 rounded", skeletonColor)} />
                <div className={cn("w-full h-3 rounded", skeletonColor)} />
                <div className={cn("w-2/3 h-3 rounded", skeletonColor)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
