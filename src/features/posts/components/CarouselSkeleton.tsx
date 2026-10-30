import React from "react";
import { cn } from "../../../lib/utils";

interface CarouselSkeletonProps {
  isDark?: boolean;
}

/**
 * Skeleton do Billboard Hero Panorâmico (Estilo Streaming):
 * - 100% full-width com cantos arredondados (rounded-2xl md:rounded-3xl)
 * - Borda translúcida sutil (border-white/[0.08])
 * - Placeholders de badges, título, sinopse, botão CTA e strip de miniaturas no canto inferior direito
 */
export default function CarouselSkeleton({ isDark = true }: CarouselSkeletonProps) {
  const shimmer = isDark ? "bg-white/[0.07]" : "bg-slate-200";
  const shimmerDim = isDark ? "bg-white/[0.04]" : "bg-slate-100";

  return (
    <section className="w-full" role="status" aria-busy="true" aria-label="Carregando destaque...">
      <div
        className={cn(
          "relative rounded-2xl md:rounded-3xl overflow-hidden border",
          isDark
            ? "bg-[#0d0b1a] border-white/[0.1] shadow-[0_28px_70px_-15px_rgba(0,0,0,0.85)]"
            : "bg-white border-slate-200 shadow-xl"
        )}
      >
        <div className="relative w-full h-[400px] sm:h-[460px] md:h-[560px] lg:h-[600px] xl:h-[640px] 2xl:h-[680px] overflow-hidden bg-[#090812]">
          {/* Shimmer sweep */}
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer-sweep_2s_ease-in-out_infinite]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.06), transparent)",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#090812] via-[#090812]/55 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090812]/90 via-[#090812]/40 to-transparent pointer-events-none" />

          {/* Bottom Content + Thumbnail Rail */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 lg:p-14 z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl w-full flex flex-col items-start gap-4">
              {/* Badges */}
              <div className="flex items-center gap-2.5">
                <div className={cn("w-28 h-6 rounded-full animate-pulse", shimmer)} />
                <div className={cn("w-20 h-6 rounded-full animate-pulse", shimmerDim)} />
              </div>

              {/* Title & Subtitle */}
              <div className="w-full space-y-2.5">
                <div className={cn("w-4/5 h-10 md:h-12 rounded-xl animate-pulse", shimmer)} />
                <div className={cn("w-3/5 h-6 md:h-7 rounded-lg animate-pulse", shimmerDim)} />
              </div>

              {/* Excerpt */}
              <div className="w-full space-y-2">
                <div className={cn("w-full h-3.5 rounded-md animate-pulse", shimmerDim)} />
                <div className={cn("w-2/3 h-3.5 rounded-md animate-pulse", shimmerDim)} />
              </div>

              {/* CTA & Meta */}
              <div className="flex items-center gap-4 pt-2">
                <div className={cn("w-36 h-11 rounded-xl animate-pulse", shimmer)} />
                <div className={cn("w-40 h-11 rounded-xl animate-pulse", shimmerDim)} />
              </div>
            </div>

            {/* Thumbnail Strip (Desktop) */}
            <div className="hidden lg:flex items-center gap-2.5 bg-black/45 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-28 xl:w-36 h-16 xl:h-20 rounded-xl animate-pulse",
                    i === 1 ? shimmer : shimmerDim
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
