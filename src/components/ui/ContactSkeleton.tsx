import React from "react";
import { cn } from "../../lib/utils";

interface ContactSkeletonProps {
  isDark?: boolean;
}

export default function ContactSkeleton({ isDark }: ContactSkeletonProps) {
  const skeletonColor = isDark ? "bg-gray-800" : "bg-gray-200";
  const accentColor = isDark ? "bg-gray-700" : "bg-gray-300";

  return (
    <div className="max-w-4xl mx-auto py-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center mb-12">
        <div className={cn(
          "inline-block w-64 h-16 border-4 border-black mb-6 shadow-[6px_6px_0px_rgba(0,0,0,0.1)]",
          isDark ? "bg-purple-900/30" : "bg-gray-200"
        )} />
        <div className={cn("w-48 h-3 mx-auto rounded", accentColor)} />
      </div>

      {/* Form Skeleton (Estilo Caixa de Diálogo SNES) */}
      <div className={cn(
        "p-8 md:p-10 border-[6px] shadow-[12px_12px_0px_rgba(0,0,0,0.1)]",
        isDark ? "bg-gray-800 border-purple-600/30" : "bg-white border-snes-dark/20"
      )}>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className={cn("w-32 h-3 rounded", accentColor)} />
              <div className={cn("w-full h-12 border-4", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100")} />
            </div>
            <div className="space-y-3">
              <div className={cn("w-32 h-3 rounded", accentColor)} />
              <div className={cn("w-full h-12 border-4", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100")} />
            </div>
          </div>
          <div className="space-y-3">
            <div className={cn("w-40 h-3 rounded", accentColor)} />
            <div className={cn("w-full h-40 border-4", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100")} />
          </div>
          <div className={cn("w-full h-16 border-4 shadow-[6px_6px_0px_rgba(0,0,0,0.1)]", isDark ? "bg-purple-900/20" : "bg-gray-200")} />
        </div>
      </div>
    </div>
  );
}
