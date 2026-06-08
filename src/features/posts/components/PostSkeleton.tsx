import React from "react";
import { cn } from "../../../lib/utils";

interface PostSkeletonProps {
  isDark?: boolean;
  variant?: "default" | "compact" | "vintage";
}

/**
 * Skeleton do PostCard refatorado para espelhar fielmente cada variante:
 * - vintage: horizontal card com color strip, thumbnail, content block
 * - default: vertical card com aspect-video thumb + conteúdo
 * - compact: vertical menor com thumb 32/40 de altura
 */
export default function PostSkeleton({ isDark, variant = "default" }: PostSkeletonProps) {
  const cardBg    = isDark ? "bg-[#1f1d35]" : "bg-white";
  const shimmer   = isDark ? "bg-gray-700/70" : "bg-gray-200";
  const shimmerDim = isDark ? "bg-gray-800/80" : "bg-gray-100";
  const border    = "border-2 border-black";

  // ── VINTAGE variant ─────────────────────────────────────────
  if (variant === "vintage") {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Carregando artigo..."
        className={cn(
          "flex items-stretch h-[170px] sm:h-[185px] md:h-[195px] rounded-none",
          border,
          "shadow-[4px_4px_0px_rgba(0,0,0,1)]",
          cardBg
        )}
      >
        {/* Category color strip — same w-3 as PostCard */}
        <div className={cn("w-3 shrink-0 border-r-2 border-black animate-pulse", shimmer)} />

        {/* Thumbnail — same sizes as PostCard w-32 sm:w-40 md:w-48 */}
        <div className={cn(
          "w-32 sm:w-40 md:w-48 h-full relative overflow-hidden border-r-2 border-black shrink-0 animate-pulse",
          isDark ? "bg-gray-900" : "bg-gray-300"
        )}>
          {/* Scanline overlay to match real card */}
          <div className="absolute inset-0 scanline-overlay opacity-[0.06] pointer-events-none" />
        </div>

        {/* Content block — mimics the p-3 sm:py-3 sm:px-4 layout */}
        <div className="flex flex-col flex-grow py-2 px-3 sm:py-3 sm:px-4 min-w-0">
          {/* Header row: category badge + date (left) | reading-time (right) */}
          <div className="flex items-center justify-between mb-1 shrink-0">
            <div className="flex items-center gap-2">
              {/* Category badge — same border+shadow style */}
              <div className={cn(
                "w-14 h-4 rounded-none border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] animate-pulse",
                shimmer
              )} />
              <div className={cn("w-16 h-3 rounded-none animate-pulse", shimmerDim)} />
            </div>
            <div className={cn("w-10 h-3 rounded-none animate-pulse", shimmerDim)} />
          </div>

          {/* Title — 2 lines, font-retro */}
          <div className="space-y-1.5 mb-1 shrink-0">
            <div className={cn("w-full h-4 rounded-none animate-pulse", shimmer)} />
            <div className={cn("w-4/5 h-4 rounded-none animate-pulse", shimmer)} />
          </div>

          {/* Excerpt — hidden on mobile, visible sm+ */}
          <div className="hidden sm:block mb-1.5 sm:mb-2 shrink-0">
            <div className={cn("w-full h-3 rounded-none animate-pulse", shimmerDim)} />
          </div>

          {/* Footer: views/comments (left) | action buttons (right) */}
          <div className={cn(
            "mt-auto pt-2 border-t flex items-center justify-between shrink-0",
            isDark ? "border-white/5" : "border-black/5"
          )}>
            <div className="flex items-center gap-2.5">
              <div className={cn("w-8 h-3.5 rounded-none animate-pulse", shimmerDim)} />
              <div className={cn("w-8 h-3.5 rounded-none animate-pulse", shimmerDim)} />
            </div>
            <div className="flex gap-1.5">
              {/* Action icon buttons — same w-6 h-6 border as PostCard */}
              <div className={cn(
                "w-6 h-6 rounded-none border border-black/20 dark:border-white/20 animate-pulse",
                shimmerDim
              )} />
              <div className={cn(
                "w-6 h-6 rounded-none border border-black/20 dark:border-white/20 animate-pulse",
                shimmerDim
              )} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── COMPACT variant ──────────────────────────────────────────
  if (variant === "compact") {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Carregando artigo..."
        className={cn(
          "flex flex-col h-full rounded-none",
          border,
          "shadow-[4px_4px_0px_rgba(0,0,0,1)]",
          cardBg
        )}
      >
        {/* Thumbnail */}
        <div className={cn(
          "w-full h-32 sm:h-40 relative overflow-hidden border-b border-black/10 dark:border-white/5 shrink-0 animate-pulse",
          isDark ? "bg-gray-900" : "bg-gray-300"
        )}>
          <div className="absolute inset-0 scanline-overlay opacity-[0.06] pointer-events-none" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-3">
          <div className="space-y-1.5 mb-2">
            <div className={cn("w-full h-3.5 rounded-none animate-pulse", shimmer)} />
            <div className={cn("w-3/4 h-3.5 rounded-none animate-pulse", shimmer)} />
          </div>
          <div className={cn(
            "mt-auto pt-2 border-t flex items-center justify-between",
            isDark ? "border-white/5" : "border-black/5"
          )}>
            <div className={cn("w-16 h-2.5 rounded-none animate-pulse", shimmerDim)} />
            <div className={cn("w-8 h-3 rounded-none animate-pulse", shimmerDim)} />
          </div>
        </div>
      </div>
    );
  }

  // ── DEFAULT variant ──────────────────────────────────────────
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando artigo..."
      className={cn(
        "flex flex-col h-full rounded-none",
        border,
        "shadow-[6px_6px_0px_rgba(0,0,0,1)]",
        cardBg
      )}
    >
      {/* Thumbnail — aspect-video like the real card */}
      <div className={cn(
        "w-full aspect-video relative overflow-hidden shrink-0 animate-pulse",
        isDark ? "bg-gray-900" : "bg-gray-300"
      )}>
        <div className="absolute inset-0 scanline-overlay opacity-20 pointer-events-none" />
        {/* Category pill placeholder — bottom-left */}
        <div className="absolute bottom-3 left-3">
          <div className={cn(
            "w-20 h-5 rounded-none border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] animate-pulse",
            isDark ? "bg-gray-700" : "bg-gray-400"
          )} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4">
        {/* Date */}
        <div className={cn("w-24 h-2.5 rounded-none mb-2 animate-pulse", shimmerDim)} />

        {/* Title — 2 lines */}
        <div className="space-y-2 mb-2.5">
          <div className={cn("w-full h-5 rounded-none animate-pulse", shimmer)} />
          <div className={cn("w-3/4 h-5 rounded-none animate-pulse", shimmer)} />
        </div>

        {/* Excerpt */}
        <div className="space-y-1.5 mb-4">
          <div className={cn("w-full h-3 rounded-none animate-pulse", shimmerDim)} />
          <div className={cn("w-5/6 h-3 rounded-none animate-pulse", shimmerDim)} />
        </div>

        {/* Footer */}
        <div className={cn(
          "mt-auto pt-3 border-t flex items-center justify-between",
          isDark ? "border-white/5" : "border-black/5"
        )}>
          <div className={cn("w-14 h-3 rounded-none animate-pulse", shimmerDim)} />
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-3 rounded-none animate-pulse", shimmerDim)} />
            <div className={cn("w-8 h-3 rounded-none animate-pulse", shimmerDim)} />
            <div className={cn("w-8 h-3 rounded-none animate-pulse", shimmerDim)} />
          </div>
        </div>
      </div>
    </div>
  );
}
