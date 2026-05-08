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
          {/* A Origem */}
          <div className="mb-10 md:mb-14">
            <SkeletonItem width="w-32 md:w-40" height="h-6 md:h-8" className="mb-5 md:mb-7" isDark={isDark} />
            <div className="space-y-6">
              <div className="space-y-3">
                <SkeletonItem isDark={isDark} />
                <SkeletonItem isDark={isDark} />
                <SkeletonItem width="w-5/6" isDark={isDark} />
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="flex items-center gap-4 mb-10 md:mb-14">
            <SkeletonItem height="h-1" isDark={isDark} className="flex-1" />
            <SkeletonItem width="w-28 md:w-36" height="h-6 md:h-8" isDark={isDark} />
            <SkeletonItem height="h-1" isDark={isDark} className="flex-1" />
          </div>

          {/* Card de Perfil */}
          <div className={cn(
            "p-6 md:p-12 border-4 md:border-[6px]",
            SHADOW_XL,
            isDark ? "bg-gray-800/60 border-gray-700 backdrop-blur-sm" : "bg-white border-gray-400"
          )}>
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 md:gap-14">
              <div className="relative shrink-0">
                <SkeletonItem 
                  width="w-32 md:w-44" 
                  height="h-32 md:h-44" 
                  className={cn("border-4 md:border-[6px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] -rotate-3")}
                  isDark={isDark} 
                />
                <SkeletonItem 
                  width="w-16" 
                  height="h-7" 
                  isDark={isDark}
                  className={cn("absolute -bottom-4 -right-4 border-4 border-black rotate-6", SHADOW, isDark ? "bg-yellow-500/60" : "bg-yellow-400")}
                />
              </div>

              <div className="flex-1 w-full text-center lg:text-left">
                <SkeletonItem width="w-48 md:w-64" height="h-8 md:h-12" className="mb-3 mx-auto lg:mx-0" isDark={isDark} />
                <SkeletonItem width="w-40" height="h-3" className="mb-6 md:mb-8 mx-auto lg:mx-0" isDark={isDark} />

                <div className="space-y-5">
                  <div className="space-y-2">
                    <SkeletonItem height="h-3" isDark={isDark} />
                    <SkeletonItem width="w-4/5" height="h-3" isDark={isDark} />
                  </div>
                  <div className={cn("p-4 md:p-5 border-l-8", isDark ? "border-purple-600 bg-purple-900/10" : "border-purple-400 bg-purple-50")}>
                    <SkeletonItem height="h-3" className="mb-2" isDark={isDark} />
                    <SkeletonItem width="w-5/6" height="h-3" isDark={isDark} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
