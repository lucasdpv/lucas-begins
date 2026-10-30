import React from "react";
import { cn } from "../../../lib/utils";

export default function PostDetailSkeleton() {
  const shimmer = "bg-white/[0.07]";
  const shimmerDim = "bg-white/[0.04]";

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando artigo..."
      className="animate-pulse w-full max-w-[1520px] mx-auto"
    >
      {/* Botão Voltar */}
      <div className={cn("w-36 h-4 mb-8 rounded-md", shimmerDim)} />

      {/* Hero Image Cyber-Editorial */}
      <div className="w-full h-[360px] md:h-[560px] rounded-2xl md:rounded-3xl border border-white/[0.1] bg-[#0d0b1a] relative overflow-hidden flex items-end shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-[#090812] via-[#090812]/50 to-transparent" />
        <div className="relative z-10 p-8 md:p-12 w-full space-y-4">
          <div className="flex items-center gap-3">
            <div className={cn("w-24 h-6 rounded-full", shimmer)} />
            <div className={cn("w-16 h-6 rounded-full", shimmerDim)} />
          </div>
          <div className={cn("w-3/4 md:w-2/3 h-10 md:h-14 rounded-xl", shimmer)} />
          <div className={cn("w-1/2 h-6 md:h-8 rounded-lg", shimmerDim)} />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="space-y-10 mt-10">
        {/* Barra Autor + Ações */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-2xl border border-white/10", shimmer)} />
            <div className="space-y-2">
              <div className={cn("w-36 h-5 rounded-md", shimmer)} />
              <div className={cn("w-48 h-3 rounded-md", shimmerDim)} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn("w-12 h-12 rounded-2xl border border-white/10", shimmerDim)} />
            <div className={cn("w-20 h-12 rounded-2xl border border-white/10", shimmerDim)} />
            <div className={cn("w-24 h-12 rounded-2xl border border-white/10", shimmer)} />
            <div className={cn("w-28 h-12 rounded-2xl border border-white/10", shimmer)} />
          </div>
        </div>

        {/* Sinopse Box */}
        <div className="relative p-8 pt-10 rounded-2xl border border-white/[0.08] bg-[#121024]/90">
          <div className="absolute -top-3.5 left-6">
            <div className="w-28 h-7 rounded-full bg-purple-600/50 border border-purple-400/30" />
          </div>
          <div className="space-y-3">
            <div className={cn("w-full h-4 rounded-md", shimmer)} />
            <div className={cn("w-4/5 h-4 rounded-md", shimmerDim)} />
          </div>
        </div>

        {/* Corpo do Artigo */}
        <div className="space-y-4 pt-2">
          {[100, 96, 88, 100, 82, 95, 76, 100, 85, 60].map((w, i) => (
            <div key={i} className={cn("h-4 rounded-md", shimmerDim)} style={{ width: `${w}%` }} />
          ))}
          <div className={cn("w-full h-[320px] rounded-2xl mt-8 mb-4 border border-white/10", shimmerDim)} />
        </div>
      </div>
    </div>
  );
}
