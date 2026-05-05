import React from "react";
import { cn } from "../../lib/utils";

export default function PostDetailSkeleton({ isDark }) {
  const skeletonColor = isDark ? "bg-gray-800" : "bg-gray-200";
  const accentColor = isDark ? "bg-gray-700" : "bg-gray-300";

  return (
    <div role="status" aria-busy="true" aria-label="Carregando artigo..." className="animate-pulse w-full">
      {/* Voltar Skeleton */}
      <div className={cn("w-40 h-6 mb-8 rounded-lg", accentColor)} />

      {/* Hero Image Skeleton - Full Width */}
      <div className={cn("w-full h-[350px] md:h-[550px] mb-12 rounded-3xl relative overflow-hidden flex items-end p-8 md:p-16", skeletonColor)}>
        <div className="w-full max-w-2xl space-y-4">
          <div className="flex gap-4">
             <div className={cn("w-24 h-8 rounded-xl", accentColor)} />
             <div className={cn("w-16 h-8 rounded-xl", accentColor)} />
          </div>
          <div className={cn("w-full h-12 md:h-16 rounded-xl", accentColor)} />
          <div className={cn("w-2/3 h-12 md:h-16 rounded-xl", accentColor)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
        {/* Coluna Principal */}
        <div className="lg:col-span-3 space-y-10">
          
          {/* Author/Actions Bar */}
          <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b-4", isDark ? "border-gray-800" : "border-gray-100")}>
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-2xl", skeletonColor)} />
              <div className="space-y-2">
                <div className={cn("w-32 h-5 rounded", accentColor)} />
                <div className={cn("w-48 h-3 rounded", skeletonColor)} />
              </div>
            </div>
            <div className="flex gap-3">
              <div className={cn("w-12 h-12 rounded-xl", skeletonColor)} />
              <div className={cn("w-24 h-12 rounded-xl", skeletonColor)} />
            </div>
          </div>

          {/* Synopsis Skeleton */}
          <div className={cn("p-8 rounded-3xl border-4", isDark ? "bg-gray-800/40 border-purple-500/20" : "bg-gray-50 border-gray-100")}>
             <div className={cn("w-32 h-6 mb-4 rounded-lg", accentColor)} />
             <div className="space-y-2">
                <div className={cn("w-full h-4 rounded", accentColor)} />
                <div className={cn("w-full h-4 rounded", accentColor)} />
                <div className={cn("w-2/3 h-4 rounded", accentColor)} />
             </div>
          </div>

          {/* Content Body Skeleton */}
          <div className="space-y-6 pt-4">
            <div className={cn("w-full h-5 rounded", accentColor)} />
            <div className={cn("w-full h-5 rounded", accentColor)} />
            <div className={cn("w-5/6 h-5 rounded", accentColor)} />
            <div className={cn("w-full h-5 rounded", accentColor)} />
            <div className={cn("w-4/6 h-5 rounded", accentColor)} />
            
            <div className="pt-8 space-y-6">
              <div className={cn("w-full h-[300px] rounded-2xl", skeletonColor)} />
              <div className={cn("w-full h-5 rounded", accentColor)} />
              <div className={cn("w-full h-5 rounded", accentColor)} />
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="hidden lg:block space-y-8">
           <div className={cn("p-6 rounded-3xl", isDark ? "bg-gray-800" : "bg-gray-100")}>
              <div className={cn("w-32 h-6 mb-6 rounded", accentColor)} />
              <div className="space-y-6">
                 {[1,2,3].map(i => (
                   <div key={i} className="space-y-3">
                      <div className={cn("h-28 w-full rounded-xl", skeletonColor)} />
                      <div className={cn("w-full h-4 rounded", accentColor)} />
                      <div className={cn("w-2/3 h-3 rounded", skeletonColor)} />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <p className="font-retro text-xl opacity-20 uppercase tracking-[0.3em]">
           Loading Content...
        </p>
      </div>
    </div>
  );
}
