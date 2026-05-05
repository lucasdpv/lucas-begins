import React from "react";
import { cn } from "../../lib/utils";

export default function ContactSkeleton({ isDark }) {
  const skeletonColor = isDark ? "bg-gray-800" : "bg-gray-200";
  const accentColor = isDark ? "bg-gray-700" : "bg-gray-300";

  return (
    <div className="max-w-5xl mx-auto py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center mb-16">
        <div className={cn("w-80 h-16 mx-auto mb-4 rounded-2xl", skeletonColor)} />
        <div className={cn("w-full max-w-xl mx-auto h-4 rounded", accentColor)} />
        <div className={cn("w-64 mx-auto h-4 mt-2 rounded", accentColor)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Email Card Skeleton */}
        <div className="md:col-span-1">
          <div className={cn("p-8 rounded-2xl h-56", isDark ? "bg-gray-800" : "bg-gray-100")}>
            <div className={cn("w-14 h-14 mb-6 rounded-xl", accentColor)} />
            <div className={cn("w-24 h-6 mb-2 rounded", accentColor)} />
            <div className={cn("w-full h-4 rounded", skeletonColor)} />
          </div>
        </div>

        {/* Form Skeleton */}
        <div className={cn("md:col-span-2 p-8 md:p-10 rounded-2xl", isDark ? "bg-gray-800" : "bg-gray-100")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className={cn("w-32 h-4 rounded", accentColor)} />
              <div className={cn("w-full h-12 rounded-xl", skeletonColor)} />
            </div>
            <div className="space-y-3">
              <div className={cn("w-32 h-4 rounded", accentColor)} />
              <div className={cn("w-full h-12 rounded-xl", skeletonColor)} />
            </div>
          </div>
          <div className="space-y-3 mb-8">
            <div className={cn("w-40 h-4 rounded", accentColor)} />
            <div className={cn("w-full h-40 rounded-xl", skeletonColor)} />
          </div>
          <div className="flex justify-end">
             <div className={cn("w-48 h-14 rounded-xl", accentColor)} />
          </div>
        </div>
      </div>
    </div>
  );
}
