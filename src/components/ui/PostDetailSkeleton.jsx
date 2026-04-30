import React from "react";
import { cn } from "../../lib/utils";

export default function PostDetailSkeleton({ isDark }) {
  const skeletonColor = isDark ? "bg-gray-800" : "bg-gray-200";
  const accentColor = isDark ? "bg-gray-700" : "bg-gray-300";

  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      {/* Voltar Skeleton */}
      <div className={cn("w-32 h-4 mb-10 rounded", accentColor)} />

      {/* Header Skeleton */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className={cn("w-24 h-8 rounded border-2 border-black/10", skeletonColor)} />
          <div className={cn("w-40 h-4 rounded", accentColor)} />
        </div>
        
        <div className={cn("w-full h-12 md:h-20 mb-4 rounded", skeletonColor)} />
        <div className={cn("w-3/4 h-12 md:h-20 mb-8 rounded", skeletonColor)} />

        <div className="flex items-center justify-between py-8 border-y-2 border-black/5">
          <div className="flex items-center gap-4">
             <div className={cn("w-12 h-12 rounded border-2 border-black/10", skeletonColor)} />
             <div className="space-y-2">
               <div className={cn("w-24 h-4 rounded", skeletonColor)} />
               <div className={cn("w-32 h-3 rounded", accentColor)} />
             </div>
          </div>
          <div className="flex gap-3">
             <div className={cn("w-12 h-12 rounded", skeletonColor)} />
             <div className={cn("w-20 h-12 rounded", skeletonColor)} />
          </div>
        </div>
      </header>

      {/* Hero Image Skeleton */}
      <div className={cn("w-full h-[300px] md:h-[500px] mb-16 rounded border-2 border-black/10", skeletonColor)} />

      {/* Content Skeleton */}
      <div className="space-y-6">
        <div className={cn("w-full h-6 rounded", accentColor)} />
        <div className={cn("w-full h-6 rounded", accentColor)} />
        <div className={cn("w-5/6 h-6 rounded", accentColor)} />
        <div className={cn("w-full h-6 rounded", accentColor)} />
        <div className={cn("w-4/6 h-6 rounded", accentColor)} />
        
        <div className="pt-10 space-y-6">
           <div className={cn("w-full h-6 rounded", accentColor)} />
           <div className={cn("w-full h-6 rounded", accentColor)} />
           <div className={cn("w-3/4 h-6 rounded", accentColor)} />
        </div>
      </div>
      
      {/* Texto de carregamento estilizado */}
      <div className="mt-12 text-center">
        <p className="font-retro text-xl md:text-2xl opacity-40 uppercase tracking-widest">
           Carregando dados da fase...
        </p>
      </div>
    </div>
  );
}
