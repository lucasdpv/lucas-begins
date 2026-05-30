import React from "react";
import { cn } from "../../../lib/utils";

interface CarouselSkeletonProps {
  isDark?: boolean;
}

/**
 * Skeleton do bloco superior da HomePage.
 * Espelha fielmente o Carousel real + sidebar "Mais Lidos":
 * - Grid lg:3 cols (carousel col-span-2 + sidebar col-span-1)
 * - Carousel: imagem hero com gradiente, badge categoria, título, excerpt, meta, setas, dots
 * - Sidebar: 5 itens com número + título + views
 */
export default function CarouselSkeleton({ isDark }: CarouselSkeletonProps) {
  const cardBg    = isDark ? "bg-[#1f1d35]" : "bg-white";
  const shimmer   = isDark ? "bg-gray-700/60" : "bg-gray-200";
  const shimmerDim = isDark ? "bg-gray-800/80" : "bg-gray-100";
  const borderDivider = isDark ? "border-white/5" : "border-black/5";

  return (
    <section className="flex flex-col gap-6">
      {/* ── Section headers row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* "Em Destaque" header */}
        <div className="lg:col-span-2 flex items-center gap-3">
          <div className={cn(
            "w-1.5 h-8 rounded-none shrink-0",
            isDark ? "bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.7)]" : "bg-purple-400"
          )} />
          <div className="flex flex-col gap-1.5">
            <div className={cn("w-44 h-7 rounded-none animate-pulse", shimmer)} />
            <div className={cn("w-24 h-2.5 rounded-none animate-pulse", shimmerDim)} />
          </div>
        </div>
        {/* "Mais Lidos" header (desktop only) */}
        <div className="hidden lg:flex items-center gap-3">
          <div className={cn(
            "w-1.5 h-8 rounded-none shrink-0",
            isDark ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]" : "bg-amber-400"
          )} />
          <div className="flex flex-col gap-1.5">
            <div className={cn("w-32 h-7 rounded-none animate-pulse", shimmer)} />
            <div className={cn("w-20 h-2.5 rounded-none animate-pulse", shimmerDim)} />
          </div>
        </div>
      </div>

      {/* ── Main grid: Carousel + Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Carousel skeleton (col-span-2) ── */}
        <div className="lg:col-span-2">
          <div className={cn(
            "relative rounded-none overflow-hidden border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]",
            cardBg
          )}>
            {/* Hero image area */}
            <div className={cn(
              "relative w-full h-[360px] sm:h-[400px] md:h-[560px] overflow-hidden animate-pulse",
              isDark ? "bg-gray-900" : "bg-gray-300"
            )}>
              {/* Subtle shimmer sweep */}
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer-sweep_2s_ease-in-out_infinite]"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                }}
              />

              {/* Cinematic gradient — same as the real carousel */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/55 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Scanline overlay */}
              <div className="absolute inset-0 scanline-overlay opacity-20 pointer-events-none" />

              {/* Content placeholder — bottom-left, same layout as real */}
              <div className="absolute bottom-0 left-0 right-0 p-6 pb-5 md:p-10 md:pb-8 z-10 pointer-events-none">
                <div className="max-w-2xl flex flex-col items-start gap-3 pr-16 md:pr-0">
                  {/* Category badge */}
                  <div className={cn(
                    "w-20 h-5 rounded-none border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] animate-pulse",
                    isDark ? "bg-gray-700" : "bg-gray-400"
                  )} />

                  {/* Title — 2 lines like font-retro font-bold text-3xl */}
                  <div className="w-full space-y-2.5">
                    <div className={cn("w-full h-9 md:h-11 rounded-none animate-pulse", isDark ? "bg-gray-700/70" : "bg-gray-400/70")} />
                    <div className={cn("w-4/5 h-9 md:h-11 rounded-none animate-pulse", isDark ? "bg-gray-700/50" : "bg-gray-400/50")} />
                  </div>

                  {/* Excerpt — 2 lines */}
                  <div className="w-full space-y-1.5">
                    <div className={cn("w-full h-3.5 rounded-none animate-pulse", isDark ? "bg-gray-700/40" : "bg-gray-400/40")} />
                    <div className={cn("w-3/4 h-3.5 rounded-none animate-pulse", isDark ? "bg-gray-700/30" : "bg-gray-400/30")} />
                  </div>

                  {/* Meta row: ♥ likes · ⏱ read-time */}
                  <div className="flex items-center gap-3">
                    <div className={cn("w-12 h-3 rounded-none animate-pulse", isDark ? "bg-gray-700/50" : "bg-gray-400/50")} />
                    <div className={cn("w-1 h-1 rounded-full animate-pulse", isDark ? "bg-gray-700/50" : "bg-gray-400/50")} />
                    <div className={cn("w-16 h-3 rounded-none animate-pulse", isDark ? "bg-gray-700/50" : "bg-gray-400/50")} />
                  </div>
                </div>
              </div>

              {/* Nav arrow LEFT — same styling as real */}
              <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-2.5 rounded-xl bg-black/60 border border-white/20 hidden sm:flex z-20">
                <div className={cn("w-5 h-5 md:w-6 md:h-6 rounded-none animate-pulse", isDark ? "bg-gray-600" : "bg-gray-400")} />
              </div>
              {/* Nav arrow RIGHT */}
              <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-2.5 rounded-xl bg-black/60 border border-white/20 hidden sm:flex z-20">
                <div className={cn("w-5 h-5 md:w-6 md:h-6 rounded-none animate-pulse", isDark ? "bg-gray-600" : "bg-gray-400")} />
              </div>

              {/* Slide dots — bottom-right, same pill container as real */}
              <div className="absolute bottom-6 right-6 md:bottom-8 md:right-10 z-30 flex items-center gap-2.5 bg-black/40 px-3.5 py-2 rounded-2xl backdrop-blur-md border border-white/15">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full",
                      i === 0
                        ? cn("w-8", isDark ? "bg-purple-400/60" : "bg-purple-300")
                        : cn("w-3 bg-white/30")
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Absolute border overlay */}
            <div className="absolute inset-0 rounded-none border-2 border-black pointer-events-none z-[25]" />
          </div>
        </div>

        {/* ── Sidebar "Mais Lidos" (col-span-1, desktop only) ── */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className={cn(
            "h-full lg:h-[560px] p-6 rounded-none flex flex-col justify-between overflow-hidden border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]",
            cardBg
          )}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-4 py-2.5 border-b last:border-0 last:pb-0",
                  borderDivider
                )}
              >
                {/* Rank number placeholder — large like the real amber text-2xl */}
                <div className={cn("min-w-[32px] h-8 rounded-none animate-pulse shrink-0", isDark ? "bg-amber-400/20" : "bg-amber-200/60")} />

                {/* Title + views */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div className={cn("w-full h-3.5 rounded-none animate-pulse", shimmer)} />
                  <div className={cn("w-4/5 h-3.5 rounded-none animate-pulse", shimmer)} />
                  <div className={cn("w-20 h-2.5 rounded-none animate-pulse", shimmerDim)} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
