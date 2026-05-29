import React from "react";
import { cn } from "../../../lib/utils";
import { BRUTAL_DESIGN } from "../../../constants";
import SkeletonItem from "../../../components/ui/SkeletonItem";

interface PostSkeletonProps {
  isDark?: boolean;
  variant?: "default" | "compact" | "vintage";
}

/**
 * Skeleton do PostCard refatorado para usar SkeletonItem e BRUTAL_DESIGN.
 */
export default function PostSkeleton({ isDark, variant = "default" }: PostSkeletonProps) {
  const { BORDER, SHADOW, TRANSITION } = BRUTAL_DESIGN;
  const isVintage = variant === "vintage";

  if (isVintage) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Carregando artigo..."
        className={cn(
          "flex items-stretch h-[150px] sm:h-[165px] md:h-[180px] rounded-none border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]",
          isDark ? "bg-[#1f1d35]" : "bg-white"
        )}
      >
        {/* Category color strip skeleton */}
        <div className="w-3 shrink-0 border-r-2 border-black bg-gray-300 dark:bg-gray-700" />

        {/* Thumbnail skeleton */}
        <div className="w-32 sm:w-40 md:w-48 h-full relative overflow-hidden border-r-2 border-black bg-gray-950 flex items-center justify-center shrink-0">
          <SkeletonItem width="w-full" height="h-full" isDark={isDark} className="opacity-10" />
        </div>

        {/* Content block skeleton */}
        <div className="flex flex-col flex-grow p-3 sm:py-3 sm:px-4 min-w-0">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-1 shrink-0">
            <div className="flex items-center gap-2">
              <SkeletonItem width="w-14" height="h-4" isDark={isDark} className="opacity-50" />
              <SkeletonItem width="w-16" height="h-3" isDark={isDark} className="opacity-30" />
            </div>
            <SkeletonItem width="w-10" height="h-3" isDark={isDark} className="opacity-30" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-1.5 mb-1.5 shrink-0">
            <SkeletonItem height="h-4" isDark={isDark} />
            <SkeletonItem width="w-4/5" height="h-4" isDark={isDark} />
          </div>

          {/* Excerpt skeleton */}
          <div className="hidden sm:block space-y-1 mb-2 shrink-0">
            <SkeletonItem height="h-3" isDark={isDark} className="opacity-30" />
          </div>

          {/* Footer skeleton */}
          <div className="mt-auto pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between shrink-0">
            <div className="flex gap-2">
              <SkeletonItem width="w-8" height="h-3.5" isDark={isDark} className="opacity-30" />
              <SkeletonItem width="w-8" height="h-3.5" isDark={isDark} className="opacity-30" />
            </div>
            <div className="flex gap-1.5">
              <SkeletonItem width="w-6" height="h-6" isDark={isDark} className="opacity-30" />
              <SkeletonItem width="w-6" height="h-6" isDark={isDark} className="opacity-30" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando artigo..."
      className={cn(
        "flex flex-col h-full rounded-none border-2 border-black transition-all duration-300 shadow-[6px_6px_0px_rgba(0,0,0,1)]",
        isDark ? "bg-[#1f1d35] text-gray-100" : "bg-white text-gray-900"
      )}
    >
      {/* Thumb */}
      <div className={cn(
        "w-full aspect-video relative overflow-hidden bg-gray-900 z-10 pointer-events-none shrink-0",
        isDark ? "bg-gray-900" : "bg-gray-250"
      )}>
        {/* Badge de categoria */}
        <div className="absolute top-4 left-4 flex gap-2">
          <SkeletonItem 
            width="w-20" 
            height="h-6" 
            isDark={isDark} 
            className={cn("border-2 border-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)]")} 
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Título */}
        <div className="mb-3 space-y-2">
          <SkeletonItem height="h-5" isDark={isDark} />
          <SkeletonItem width="w-3/4" height="h-5" isDark={isDark} />
        </div>

        {/* Excerpt */}
        <div className="space-y-2 mb-6 flex-grow">
          <SkeletonItem height="h-3" isDark={isDark} className="opacity-60" />
          <SkeletonItem width="w-5/6" height="h-3" isDark={isDark} className="opacity-60" />
          <SkeletonItem width="w-4/5" height="h-3" isDark={isDark} className="opacity-60" />
        </div>

        {/* Footer */}
        <div className={cn(
          "mt-auto pt-4 border-t-2 flex items-center justify-between",
          isDark ? "border-gray-700" : "border-gray-300"
        )}>
          <div className="flex flex-col gap-1.5">
            <SkeletonItem width="w-20" height="h-2.5" isDark={isDark} className="opacity-40" />
            <SkeletonItem width="w-16" height="h-2.5" isDark={isDark} className="opacity-40" />
          </div>
          <div className="flex items-center gap-4">
            <SkeletonItem width="w-8" height="h-3" isDark={isDark} className="opacity-40" />
            <SkeletonItem width="w-8" height="h-3" isDark={isDark} className="opacity-40" />
            <SkeletonItem width="w-8" height="h-3" isDark={isDark} className="opacity-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
