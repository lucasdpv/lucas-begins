import React from "react";
import { cn } from "../../lib/utils";

export default function FormSkeleton({ isDark }) {
  const skeletonColor = isDark ? "bg-gray-800" : "bg-gray-200";
  const accentColor = isDark ? "bg-gray-700" : "bg-gray-300";

  return (
    <div className="max-w-4xl mx-auto animate-pulse py-10">
      {/* Header Skeleton */}
      <div className="mb-10">
        <div className={cn("w-48 h-8 mb-4 rounded", skeletonColor)} />
        <div className={cn("w-full h-4 rounded", accentColor)} />
      </div>

      {/* Form Fields Skeleton */}
      <div className={cn("p-8 rounded-3xl border-4 mb-8", isDark ? "bg-gray-800/40 border-purple-500/30" : "bg-white border-gray-100")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className={cn("w-32 h-4 rounded", accentColor)} />
            <div className={cn("w-full h-12 rounded-xl", skeletonColor)} />
          </div>
          <div className="space-y-3">
            <div className={cn("w-32 h-4 rounded", accentColor)} />
            <div className={cn("w-full h-12 rounded-xl", skeletonColor)} />
          </div>
          <div className="space-y-3 md:col-span-2">
            <div className={cn("w-40 h-4 rounded", accentColor)} />
            <div className={cn("w-full h-32 rounded-xl", skeletonColor)} />
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <div className={cn("w-48 h-14 rounded-xl", skeletonColor)} />
        </div>
      </div>

      {/* Footer Info Skeleton */}
      <div className="flex flex-col items-center">
         <div className={cn("w-64 h-3 rounded", accentColor)} />
      </div>
      
      <div className="mt-12 text-center">
        <p className="font-retro text-xl opacity-40 uppercase tracking-widest">
           Sincronizando banco de dados...
        </p>
      </div>
    </div>
  );
}
