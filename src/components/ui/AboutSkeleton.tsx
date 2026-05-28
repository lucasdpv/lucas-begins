import React from "react";
import { cn } from "../../lib/utils";
import { BRUTAL_DESIGN } from "../../constants";
import SkeletonItem from "./SkeletonItem";

interface AboutSkeletonProps {
  isDark?: boolean;
}

export default function AboutSkeleton({ isDark }: AboutSkeletonProps) {
  const { BORDER, BORDER_HEAVY, SHADOW, SHADOW_XL, SHADOW_XXL } = BRUTAL_DESIGN;

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando página..."
      className="min-h-[85vh] flex items-center justify-center py-6 md:py-12 px-4"
    >
      <div className="w-full max-w-4xl">
        {/* Hero / Título retro */}
        <div className="text-center mb-8 md:mb-12">
          <div className={cn(
            "inline-block px-6 md:px-10 py-3 md:py-4 border-4 md:border-[6px] border-black mb-6 md:mb-8",
            isDark ? "bg-purple-800/50" : "bg-purple-600/40"
          )}>
            <SkeletonItem width="w-48 md:w-72" height="h-8 md:h-14" isDark={isDark} />
          </div>
          <SkeletonItem width="w-56" height="h-3" isDark={isDark} className="mx-auto" />
        </div>

        {/* Card principal */}
        <div className={cn(
          "p-6 md:p-16",
          BORDER_HEAVY, SHADOW_XXL,
          isDark ? "bg-gray-900/80 backdrop-blur-sm border-purple-600" : "bg-gray-100 border-gray-900"
        )}>
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-12 pb-10 border-b-2 border-black/10">
            <div className="relative shrink-0">
              <div className="w-40 h-40 md:w-56 md:h-56 border-4 md:border-[6px] border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_rgba(0,0,0,1)] relative overflow-hidden rotate-1">
                <SkeletonItem width="w-full" height="h-full" isDark={isDark} />
              </div>
            </div>

            <div className="flex-1 w-full text-center md:text-left flex flex-col justify-between py-2 gap-4">
              <div>
                <SkeletonItem width="w-48 md:w-64" height="h-8 md:h-12" className="mb-3 mx-auto md:mx-0" isDark={isDark} />
                <SkeletonItem width="w-40" height="h-4" className="mx-auto md:mx-0" isDark={isDark} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className={cn("p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-2", isDark ? "bg-purple-900/10" : "bg-purple-50")}>
                  <SkeletonItem width="w-10" height="h-2.5" isDark={isDark} />
                  <SkeletonItem width="w-20" height="h-4" isDark={isDark} />
                </div>
                <div className={cn("p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-2", isDark ? "bg-blue-900/10" : "bg-blue-50")}>
                  <SkeletonItem width="w-10" height="h-2.5" isDark={isDark} />
                  <SkeletonItem width="w-20" height="h-4" isDark={isDark} />
                </div>
                <div className={cn("p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-2", isDark ? "bg-green-900/10" : "bg-green-50")}>
                  <SkeletonItem width="w-10" height="h-2.5" isDark={isDark} />
                  <SkeletonItem width="w-20" height="h-4" isDark={isDark} />
                </div>
              </div>
            </div>
          </div>

          {/* Bio Body */}
          <div className="space-y-6 pt-10">
            <div className="space-y-3">
              <SkeletonItem isDark={isDark} height="h-4" />
              <SkeletonItem isDark={isDark} height="h-4" />
              <SkeletonItem width="w-5/6" isDark={isDark} height="h-4" />
            </div>

            {/* Blockquote simulation */}
            <div className={cn(
              "relative p-6 md:p-10 rounded-none border-4 space-y-3",
              isDark ? "bg-purple-900/10 border-purple-600 shadow-[4px_4px_0_rgba(168,85,247,0.2)]" : "bg-purple-50 border-purple-550 shadow-[4px_4px_0_rgba(168,85,247,0.25)]"
            )}>
              <SkeletonItem isDark={isDark} height="h-5" className="mx-auto w-11/12" />
              <SkeletonItem isDark={isDark} height="h-5" className="mx-auto w-3/4" />
            </div>

            <div className="space-y-3">
              <SkeletonItem isDark={isDark} height="h-4" />
              <SkeletonItem width="w-4/5" isDark={isDark} height="h-4" />
            </div>

            {/* Tags simulation */}
            <div className="flex flex-wrap gap-3 pt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={cn("w-20 h-8 border-2 border-purple-500/20 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]", isDark ? "bg-black/10" : "bg-gray-200")} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
