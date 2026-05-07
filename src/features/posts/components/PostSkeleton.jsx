import React from "react";
import { cn } from "../../../lib/utils";
import { BRUTAL_DESIGN } from "../../../constants";
import SkeletonItem from "../../../components/ui/SkeletonItem";

/**
 * Skeleton do PostCard refatorado para usar SkeletonItem e BRUTAL_DESIGN.
 */
export default function PostSkeleton({ isDark }) {
  const { BORDER, SHADOW, ROUNDED, TRANSITION } = BRUTAL_DESIGN;

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando artigo..."
      className={cn(
        "flex flex-col h-full",
        BORDER, SHADOW, ROUNDED, TRANSITION,
        isDark ? "bg-gray-800" : "bg-snes-light"
      )}
    >
      {/* Thumb */}
      <div className={cn(
        "h-56 md:h-64 w-full relative overflow-hidden border-b-2 border-black",
        isDark ? "bg-gray-900" : "bg-gray-200"
      )}>
        {/* Badge de categoria */}
        <div className="absolute top-4 left-4 flex gap-2">
          <SkeletonItem 
            width="w-20" 
            height="h-6" 
            isDark={isDark} 
            className={cn(BORDER, SHADOW.replace('4px', '2px'))} 
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-7 flex flex-col flex-grow">
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
