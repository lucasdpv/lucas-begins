import React from "react";
import { cn } from "../../../lib/utils";

interface CarouselSkeletonProps {
  isDark?: boolean;
}

/**
 * Skeleton do bloco superior da HomePage:
 * - Grid 1 col (mobile) / 4 col (desktop)
 * - Col-span-3: Carrossel hero com overlay + badge + título + dots + setas
 * - Col-span-1: Sidebar "Em Alta" com tabs + lista de 5 itens
 * Espelha exatamente a estrutura de Carousel.jsx + sidebar da HomePage.
 */
export default function CarouselSkeleton({ isDark }: CarouselSkeletonProps) {
  const skeletonBg  = isDark ? "bg-gray-800" : "bg-gray-200";
  const skeletonAcc = isDark ? "bg-gray-700" : "bg-gray-300";

  return (
    <section className="animate-pulse">
      {/* Linha de títulos (mesmo grid da página real) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-6">
        {/* "Em Destaque" */}
        <div className="lg:col-span-3 flex items-center gap-3">
          <div className={cn("w-1.5 h-6 md:h-8 rounded-sm", isDark ? "bg-purple-800" : "bg-purple-300")} />
          <div className={cn("w-40 md:w-52 h-7 md:h-8 rounded", skeletonAcc)} />
        </div>
        {/* Tabs da sidebar (apenas desktop) */}
        <div className="hidden lg:flex items-center w-full">
          <div className={cn("flex w-full rounded-xl p-1 gap-1", isDark ? "bg-black/30" : "bg-gray-300")}>
            <div className={cn("flex-1 h-9 rounded-lg", isDark ? "bg-purple-700/40" : "bg-purple-400/40")} />
            <div className={cn("flex-1 h-9 rounded-lg", skeletonBg)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ── Carrossel (col-span-3) ── */}
        <div className="lg:col-span-3">
          <div className={cn(
            "relative rounded-none border-2 border-black overflow-hidden",
            skeletonBg
          )}>
            {/* Área da imagem principal */}
            <div className="w-full h-[400px] md:h-[560px] relative">
              {/* Overlay gradiente simulado */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Conteúdo no rodapé do slide */}
              <div className="absolute bottom-0 left-0 right-0 p-6 pb-16 md:p-12 z-10 flex md:block justify-center">
                <div className="max-w-[75%] md:max-w-3xl space-y-4 md:space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
                  {/* Badge categoria */}
                  <div className={cn("w-24 h-6 rounded-none border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]", skeletonAcc)} />
                  {/* Título — 2 linhas */}
                  <div className="w-full space-y-3">
                    <div className={cn("w-full h-8 md:h-10 rounded", skeletonAcc)} />
                    <div className={cn("w-3/4 h-8 md:h-10 rounded", skeletonAcc)} />
                  </div>
                  {/* Meta: score + likes + leitura */}
                  <div className="flex items-center gap-3">
                    <div className={cn("w-16 h-5 rounded", skeletonAcc)} />
                    <div className={cn("w-20 h-4 rounded", skeletonBg)} />
                    <div className={cn("w-20 h-4 rounded", skeletonBg)} />
                  </div>
                </div>
              </div>

              {/* Seta esquerda */}
              <div className={cn(
                "absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 border-white/20",
                "bg-black/40"
              )} />
              {/* Seta direita */}
              <div className={cn(
                "absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 border-white/20",
                "bg-black/40"
              )} />

              {/* Dots de navegação */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 flex items-center gap-3 z-10">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 md:h-2.5 rounded-full border border-white/30",
                      i === 0
                        ? cn("w-8 md:w-10", isDark ? "bg-purple-600/60" : "bg-purple-400/60")
                        : cn("w-2 md:w-2.5", "bg-white/40")
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar Em Alta (col-span-1) — apenas desktop ── */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className={cn(
            "h-full md:h-[560px] p-8 rounded-none flex flex-col justify-between overflow-hidden",
            isDark
              ? "bg-[#161b2c] border border-white/5"
              : "bg-snes-surface border-2 border-snes-dark shadow-[4px_4px_0px_0px_#2D1B69]"
          )}>
            {/* 5 itens da lista */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-5 py-3 border-b last:border-0",
                  isDark ? "border-white/5" : "border-gray-300/30"
                )}
              >
                {/* Número */}
                <div className={cn("min-w-[40px] h-7 rounded", skeletonBg)} />
                {/* Título + meta */}
                <div className="flex-1 space-y-2">
                  <div className={cn("w-full h-4 rounded", skeletonAcc)} />
                  <div className={cn("w-3/4 h-4 rounded", skeletonAcc)} />
                  <div className={cn("w-20 h-2.5 rounded", skeletonBg)} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
