import React from "react";
import { cn } from "../../lib/utils";
import SkeletonItem from "./SkeletonItem";

interface ContactSkeletonProps {
  isDark?: boolean;
}

export default function ContactSkeleton({ isDark }: ContactSkeletonProps) {
  const skeletonColor = isDark ? "bg-gray-800" : "bg-gray-200";
  const accentColor = isDark ? "bg-gray-700" : "bg-gray-300";

  return (
    <div className="w-full max-w-4xl mx-auto py-12 space-y-12 animate-pulse">
      {/* RPG Dialogue Box Skeleton */}
      <div 
        className={cn(
          "p-6 md:p-8 border-[6px] border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-6 relative",
          isDark ? "bg-blue-900/20" : "bg-blue-50"
        )}
      >
        {/* Avatar NPC Skeleton */}
        <div className="shrink-0 flex flex-col items-center gap-2">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-700 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center p-1" />
          <div className="w-16 h-6 border-2 border-black bg-yellow-500/60" />
        </div>

        {/* Dialogue Text Skeleton */}
        <div className="flex-1 bg-black/45 border-4 border-black/20 p-4 md:p-6 min-h-[120px] space-y-3">
          <SkeletonItem height="h-4" isDark={true} />
          <SkeletonItem height="h-4" isDark={true} />
          <SkeletonItem width="w-2/3" height="h-4" isDark={true} />
        </div>
      </div>

      {/* Quest Input Card Skeleton */}
      <div className={cn(
        "p-8 md:p-12 border-[8px] border-black shadow-[15px_15px_0px_rgba(0,0,0,1)] relative overflow-hidden",
        isDark ? "bg-gray-800" : "bg-snes-surface"
      )}>
        {/* Badge corner skeleton */}
        <div className="absolute -top-1 -right-1 bg-yellow-400 border-b-4 border-l-4 border-black w-48 h-10" />

        <div className="space-y-8 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Nome */}
            <div className="space-y-3">
              <SkeletonItem width="w-28" height="h-3.5" isDark={isDark} />
              <div className={cn("w-full h-14 border-4", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100")} />
            </div>
            {/* Input Email */}
            <div className="space-y-3">
              <SkeletonItem width="w-36" height="h-3.5" isDark={isDark} />
              <div className={cn("w-full h-14 border-4", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100")} />
            </div>
          </div>

          {/* Textarea Mensagem */}
          <div className="space-y-3">
            <SkeletonItem width="w-40" height="h-3.5" isDark={isDark} />
            <div className={cn("w-full h-40 border-4", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100")} />
          </div>

          {/* Button skeleton */}
          <div className="pt-4">
            <div className={cn("w-full h-16 border-[6px] border-black shadow-[10px_10px_0px_rgba(0,0,0,1)]", isDark ? "bg-purple-900/30" : "bg-purple-500/30")} />
          </div>
        </div>
      </div>
    </div>
  );
}
