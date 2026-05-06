import React from "react";
import { cn } from "../../lib/utils";

export default function PostSkeleton({ isDark }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando artigo..."
      className={cn(
        "flex flex-col h-full rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all",
        isDark ? "bg-gray-800" : "bg-snes-light"
      )}
    >
      {/* Thumb Skeleton */}
      <div className={cn(
        "h-56 md:h-64 w-full relative overflow-hidden border-b-2 border-black flex items-center justify-center animate-pulse",
        isDark ? "bg-gray-900" : "bg-snes-mid"
      )}>
        {/* Badge skeleton */}
        <div className="absolute top-4 left-4">
          <div className={cn("w-20 h-6 rounded-none", isDark ? "bg-gray-700" : "bg-snes-dark")} />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-7 flex flex-col flex-grow space-y-4">
        <div className={cn("w-4/5 h-6 rounded-none animate-pulse", isDark ? "bg-gray-800" : "bg-snes-mid")} />
        <div className={cn("w-full h-3 rounded-none animate-pulse mt-2", isDark ? "bg-gray-800" : "bg-snes-mid")} />
        <div className={cn("w-3/4 h-3 rounded-none animate-pulse", isDark ? "bg-gray-800" : "bg-snes-mid")} />
        <div className={cn("w-5/6 h-3 rounded-none animate-pulse", isDark ? "bg-gray-800" : "bg-snes-mid")} />

        <div className={cn("mt-auto pt-4 border-t-2 flex justify-between items-center", isDark ? "border-gray-800" : "border-snes-mid")}>
          <div className={cn("w-20 h-3 rounded-none animate-pulse", isDark ? "bg-gray-800" : "bg-snes-mid")} />
          <div className="flex gap-3">
            <div className={cn("w-8 h-3 rounded-none animate-pulse", isDark ? "bg-gray-800" : "bg-snes-mid")} />
            <div className={cn("w-8 h-3 rounded-none animate-pulse", isDark ? "bg-gray-800" : "bg-snes-mid")} />
          </div>
        </div>
      </div>
    </div>
  );
}
