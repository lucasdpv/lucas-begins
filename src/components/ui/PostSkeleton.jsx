import React from "react";
import { cn } from "../../lib/utils";

export default function PostSkeleton({ isDark }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando artigo..."
      className={cn(
        "flex flex-col h-full rounded-3xl overflow-hidden border-2 shadow-[4px_4px_0px_rgba(0,0,0,1)]",
        isDark ? "bg-gray-800 border-gray-700" : "bg-snes-surface border-snes-mid"
      )}
    >
      {/* Thumb Skeleton */}
      <div className={cn("h-56 md:h-64 w-full animate-pulse", isDark ? "bg-gray-700" : "bg-snes-mid")}>
        {/* Badge skeleton */}
        <div className="p-4">
          <div className={cn("w-20 h-6 rounded-lg animate-pulse", isDark ? "bg-gray-600" : "bg-snes-mid")} />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 md:p-7 flex flex-col flex-grow space-y-4">
        <div className={cn("w-4/5 h-7 rounded-lg animate-pulse", isDark ? "bg-gray-700" : "bg-snes-mid")} />
        <div className={cn("w-full h-4 rounded-lg animate-pulse", isDark ? "bg-gray-700" : "bg-snes-mid")} />
        <div className={cn("w-3/4 h-4 rounded-lg animate-pulse", isDark ? "bg-gray-700" : "bg-snes-mid")} />
        <div className={cn("w-5/6 h-4 rounded-lg animate-pulse", isDark ? "bg-gray-700" : "bg-snes-mid")} />

        <div className={cn("mt-auto pt-4 border-t-2 flex justify-between items-center", isDark ? "border-gray-700" : "border-snes-mid")}>
          <div className={cn("w-20 h-4 rounded-lg animate-pulse", isDark ? "bg-gray-700" : "bg-snes-mid")} />
          <div className="flex gap-3">
            <div className={cn("w-12 h-4 rounded-lg animate-pulse", isDark ? "bg-gray-700" : "bg-snes-mid")} />
            <div className={cn("w-12 h-4 rounded-lg animate-pulse", isDark ? "bg-gray-700" : "bg-snes-mid")} />
          </div>
        </div>
      </div>
    </div>
  );
}
