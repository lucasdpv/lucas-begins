import React from "react";
import { cn } from "../../../lib/utils";

interface PostSkeletonProps {
  isDark?: boolean;
  variant?: "default" | "compact" | "vintage";
}

/**
 * Skeleton do PostCard no estilo Cyber-Editorial Streaming:
 * - rounded-2xl, border-white/[0.08], bg-[#121024]/90
 */
export default function PostSkeleton({ isDark = true, variant = "default" }: PostSkeletonProps) {
  const cardBg = isDark
    ? "bg-[#121024]/90 border-white/[0.08] shadow-[0_14px_34px_-12px_rgba(0,0,0,0.65)]"
    : "bg-white border-slate-200/80 shadow-sm";
  const shimmer = isDark ? "bg-white/[0.07]" : "bg-slate-200";
  const shimmerDim = isDark ? "bg-white/[0.04]" : "bg-slate-100";

  // ── VINTAGE variant (Horizontal Card em Recém-Adicionados) ──
  if (variant === "vintage") {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Carregando artigo..."
        className={cn(
          "flex items-stretch h-[180px] sm:h-[195px] md:h-[210px] rounded-2xl border overflow-hidden",
          cardBg
        )}
      >
        {/* Left Gradient Accent Bar */}
        <div className="w-1.5 shrink-0 bg-purple-500/40 animate-pulse" />

        {/* Thumbnail */}
        <div
          className={cn(
            "w-36 sm:w-44 md:w-52 xl:w-64 2xl:w-72 h-full shrink-0 animate-pulse",
            isDark ? "bg-white/[0.04]" : "bg-slate-200"
          )}
        />

        {/* Content */}
        <div className="flex flex-col flex-grow p-3.5 sm:p-4 md:p-5 min-w-0">
          <div className="flex items-center justify-between mb-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <div className={cn("w-16 h-4 rounded-full animate-pulse", shimmer)} />
              <div className={cn("w-20 h-3 rounded-md animate-pulse", shimmerDim)} />
            </div>
            <div className={cn("w-12 h-3 rounded-md animate-pulse", shimmerDim)} />
          </div>

          <div className="space-y-2 mb-2.5 shrink-0">
            <div className={cn("w-4/5 h-4 rounded-md animate-pulse", shimmer)} />
            <div className={cn("w-3/5 h-3.5 rounded-md animate-pulse", shimmerDim)} />
          </div>

          <div className="hidden lg:block space-y-1.5 mb-2 shrink-0">
            <div className={cn("w-full h-3 rounded-md animate-pulse", shimmerDim)} />
            <div className={cn("w-2/3 h-3 rounded-md animate-pulse", shimmerDim)} />
          </div>

          <div
            className={cn(
              "mt-auto pt-2.5 border-t flex items-center justify-between shrink-0",
              isDark ? "border-white/[0.06]" : "border-slate-100"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-9 h-3.5 rounded-md animate-pulse", shimmerDim)} />
              <div className={cn("w-9 h-3.5 rounded-md animate-pulse", shimmerDim)} />
            </div>
            <div className="flex gap-2">
              <div className={cn("w-7 h-7 rounded-lg animate-pulse", shimmerDim)} />
              <div className={cn("w-7 h-7 rounded-lg animate-pulse", shimmerDim)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── COMPACT variant ──
  if (variant === "compact") {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Carregando artigo..."
        className={cn("flex flex-col h-full rounded-2xl border overflow-hidden", cardBg)}
      >
        <div
          className={cn(
            "w-full h-36 sm:h-40 shrink-0 animate-pulse",
            isDark ? "bg-white/[0.04]" : "bg-slate-200"
          )}
        />
        <div className="flex flex-col flex-grow p-4">
          <div className="space-y-2 mb-3">
            <div className={cn("w-full h-4 rounded-md animate-pulse", shimmer)} />
            <div className={cn("w-3/4 h-3.5 rounded-md animate-pulse", shimmerDim)} />
          </div>
          <div
            className={cn(
              "mt-auto pt-2.5 border-t flex items-center justify-between",
              isDark ? "border-white/[0.06]" : "border-slate-100"
            )}
          >
            <div className={cn("w-16 h-3 rounded-md animate-pulse", shimmerDim)} />
            <div className={cn("w-10 h-3 rounded-md animate-pulse", shimmerDim)} />
          </div>
        </div>
      </div>
    );
  }

  // ── DEFAULT variant (Catálogo Completo) ──
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando artigo..."
      className={cn("flex flex-col h-full rounded-2xl border overflow-hidden", cardBg)}
    >
      <div
        className={cn(
          "w-full aspect-video relative overflow-hidden shrink-0 animate-pulse",
          isDark ? "bg-white/[0.04]" : "bg-slate-200"
        )}
      >
        <div className="absolute top-3.5 left-3.5">
          <div className={cn("w-20 h-5 rounded-full animate-pulse", shimmer)} />
        </div>
      </div>

      <div className="flex flex-col flex-grow p-5">
        <div className={cn("w-28 h-3 rounded-md mb-2.5 animate-pulse", shimmerDim)} />

        <div className="space-y-2 mb-3">
          <div className={cn("w-full h-5 rounded-md animate-pulse", shimmer)} />
          <div className={cn("w-3/4 h-4 rounded-md animate-pulse", shimmerDim)} />
        </div>

        <div className="space-y-1.5 mb-5">
          <div className={cn("w-full h-3 rounded-md animate-pulse", shimmerDim)} />
          <div className={cn("w-5/6 h-3 rounded-md animate-pulse", shimmerDim)} />
        </div>

        <div
          className={cn(
            "mt-auto pt-3.5 border-t flex items-center justify-between",
            isDark ? "border-white/[0.06]" : "border-slate-100"
          )}
        >
          <div className={cn("w-16 h-3 rounded-md animate-pulse", shimmerDim)} />
          <div className="flex items-center gap-2.5">
            <div className={cn("w-9 h-3.5 rounded-md animate-pulse", shimmerDim)} />
            <div className={cn("w-9 h-3.5 rounded-md animate-pulse", shimmerDim)} />
          </div>
        </div>
      </div>
    </div>
  );
}
