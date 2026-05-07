import React from "react";
import { cn } from "../../lib/utils";

export default function AboutSkeleton({ isDark }) {
  const skeletonColor = isDark ? "bg-gray-800" : "bg-gray-200";
  const accentColor = isDark ? "bg-gray-700" : "bg-gray-300";

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando página..."
      className="min-h-[85vh] flex items-center justify-center py-6 md:py-12 px-4 animate-pulse"
    >
      <div className="w-full max-w-4xl">

        {/* Hero / Título retro */}
        <div className="text-center mb-8 md:mb-12">
          <div className={cn(
            "inline-block px-6 md:px-10 py-3 md:py-4 border-4 md:border-[6px] border-black mb-6 md:mb-8",
            isDark ? "bg-purple-800/50" : "bg-purple-600/40"
          )}>
            {/* Título */}
            <div className={cn("w-48 md:w-72 h-8 md:h-14 mx-auto rounded", accentColor)} />
          </div>
          {/* Subtítulo "Player 1 has entered..." */}
          <div className={cn("w-56 h-3 mx-auto rounded", skeletonColor)} />
        </div>

        {/* Card principal — borda + sombra brutalist */}
        <div className={cn(
          "p-6 md:p-16 border-4 md:border-[8px] shadow-[10px_10px_0px_rgba(0,0,0,1)] md:shadow-[20px_20px_0px_rgba(0,0,0,1)]",
          isDark ? "bg-gray-900/80 border-purple-600" : "bg-gray-100 border-gray-900"
        )}>

          {/* — Seção A Origem — */}
          <div className="mb-10 md:mb-14">
            {/* Título da seção com underline */}
            <div className={cn("w-32 md:w-40 h-6 md:h-8 mb-5 md:mb-7 rounded", accentColor)} />
            {/* Parágrafos */}
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-3">
                <div className={cn("w-full h-4 rounded", skeletonColor)} />
                <div className={cn("w-full h-4 rounded", skeletonColor)} />
                <div className={cn("w-5/6 h-4 rounded", skeletonColor)} />
              </div>
              <div className="space-y-3">
                <div className={cn("w-full h-4 rounded", skeletonColor)} />
                <div className={cn("w-4/5 h-4 rounded", skeletonColor)} />
              </div>
            </div>
          </div>

          {/* — Separador "Player 1" — */}
          <div className="flex items-center gap-4 mb-10 md:mb-14">
            <div className={cn("flex-1 h-1 rounded", skeletonColor)} />
            <div className={cn("w-28 md:w-36 h-6 md:h-8 rounded", accentColor)} />
            <div className={cn("flex-1 h-1 rounded", skeletonColor)} />
          </div>

          {/* — Card de Perfil — */}
          <div className={cn(
            "p-6 md:p-12 border-4 md:border-[6px] shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_rgba(0,0,0,1)] relative overflow-hidden",
            isDark ? "bg-gray-800/60 border-gray-700" : "bg-white border-gray-400"
          )}>
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 md:gap-14">

              {/* Avatar quadrado com badge */}
              <div className="relative shrink-0">
                <div className={cn(
                  "w-32 h-32 md:w-44 md:h-44 border-4 md:border-[6px] border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_rgba(0,0,0,1)] -rotate-3",
                  accentColor
                )} />
                {/* Level Badge */}
                <div className={cn(
                  "absolute -bottom-4 -right-4 w-16 h-7 border-4 border-black rotate-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]",
                  isDark ? "bg-yellow-500/60" : "bg-yellow-400"
                )} />
              </div>

              {/* Bio */}
              <div className="flex-1 w-full text-center lg:text-left">
                {/* Nome */}
                <div className={cn("w-48 md:w-64 h-8 md:h-12 mb-3 mx-auto lg:mx-0 rounded", accentColor)} />
                {/* A.K.A. / Online */}
                <div className={cn("w-40 h-3 mb-6 md:mb-8 mx-auto lg:mx-0 rounded", skeletonColor)} />

                {/* Parágrafos da bio */}
                <div className="space-y-4 md:space-y-5 text-left">
                  <div className="space-y-2">
                    <div className={cn("w-full h-3 rounded", skeletonColor)} />
                    <div className={cn("w-full h-3 rounded", skeletonColor)} />
                    <div className={cn("w-4/5 h-3 rounded", skeletonColor)} />
                  </div>
                  <div className="space-y-2">
                    <div className={cn("w-full h-3 rounded", skeletonColor)} />
                    <div className={cn("w-3/4 h-3 rounded", skeletonColor)} />
                  </div>
                  {/* Blockquote / destaque */}
                  <div className={cn(
                    "p-4 md:p-5 border-l-8",
                    isDark ? "border-purple-600 bg-purple-900/10" : "border-purple-400 bg-purple-50"
                  )}>
                    <div className="space-y-2">
                      <div className={cn("w-full h-3 rounded", accentColor)} />
                      <div className={cn("w-5/6 h-3 rounded", accentColor)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className={cn("w-full h-3 rounded", skeletonColor)} />
                    <div className={cn("w-2/3 h-3 rounded", skeletonColor)} />
                  </div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {[80, 64, 72, 88, 96].map((w, i) => (
                      <div
                        key={i}
                        className={cn("h-6 rounded border-2", skeletonColor, isDark ? "border-gray-700" : "border-gray-300")}
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
