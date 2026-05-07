import React from "react";
import { cn } from "../../lib/utils";

/**
 * Skeleton do PostCard — espelha exatamente o layout do componente real:
 * - Thumb h-56/h-64 com border-b-2 e badge de categoria no canto
 * - Área de conteúdo p-7 com título, 3 linhas de excerpt
 * - Footer com border-t-2: data/leitura à esquerda + ícones à direita
 */
export default function PostSkeleton({ isDark }) {
  const skeletonBg  = isDark ? "bg-gray-700" : "bg-gray-300";
  const skeletonSub = isDark ? "bg-gray-800" : "bg-gray-200";

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando artigo..."
      className={cn(
        "flex flex-col h-full rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse",
        isDark ? "bg-gray-800" : "bg-snes-light"
      )}
    >
      {/* Thumb */}
      <div className={cn(
        "h-56 md:h-64 w-full relative overflow-hidden border-b-2 border-black",
        isDark ? "bg-gray-900" : "bg-gray-200"
      )}>
        {/* Badge de categoria — canto superior esquerdo */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className={cn("w-20 h-6 rounded-none border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]", skeletonBg)} />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-7 flex flex-col flex-grow">
        {/* Título — 2 linhas */}
        <div className="mb-3 space-y-2">
          <div className={cn("w-full h-5 rounded-none", skeletonBg)} />
          <div className={cn("w-3/4 h-5 rounded-none", skeletonBg)} />
        </div>

        {/* Excerpt — 3 linhas */}
        <div className="space-y-2 mb-6 flex-grow">
          <div className={cn("w-full h-3 rounded-none", skeletonSub)} />
          <div className={cn("w-5/6 h-3 rounded-none", skeletonSub)} />
          <div className={cn("w-4/5 h-3 rounded-none", skeletonSub)} />
        </div>

        {/* Footer */}
        <div className={cn(
          "mt-auto pt-4 border-t-2 flex items-center justify-between",
          isDark ? "border-gray-700" : "border-gray-300"
        )}>
          {/* Data + tempo de leitura */}
          <div className="flex flex-col gap-1.5">
            <div className={cn("w-20 h-2.5 rounded-none", skeletonSub)} />
            <div className={cn("w-16 h-2.5 rounded-none", skeletonSub)} />
          </div>
          {/* Ícones: ❤ / 💬 / 👁 */}
          <div className="flex items-center gap-4">
            <div className={cn("w-8 h-3 rounded-none", skeletonSub)} />
            <div className={cn("w-8 h-3 rounded-none", skeletonSub)} />
            <div className={cn("w-8 h-3 rounded-none", skeletonSub)} />
          </div>
        </div>
      </div>
    </div>
  );
}
