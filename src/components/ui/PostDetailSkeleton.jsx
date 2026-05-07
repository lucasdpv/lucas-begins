import React from "react";
import { cn } from "../../lib/utils";

export default function PostDetailSkeleton({ isDark }) {
  const skeletonColor = isDark ? "bg-gray-800" : "bg-gray-200";
  const accentColor = isDark ? "bg-gray-700" : "bg-gray-300";

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando artigo..."
      className="animate-pulse w-full"
    >
      {/* Botão Voltar */}
      <div className={cn("w-36 h-5 mb-8 rounded", accentColor)} />

      {/* Hero Image — sem bordas arredondadas, igual ao layout real */}
      <div className={cn(
        "w-full h-[350px] md:h-[550px] rounded-none border-2 border-black relative overflow-hidden flex items-end",
        skeletonColor
      )}>
        {/* Gradiente overlay simulado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Badges + título no rodapé do hero */}
        <div className="relative z-10 p-8 md:p-12 w-full space-y-4">
          <div className="flex items-center gap-4">
            <div className={cn("w-24 h-7 rounded-none border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]", accentColor)} />
            <div className={cn("w-16 h-7 rounded-none border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]", accentColor)} />
          </div>
          <div className={cn("w-3/4 md:w-2/3 h-10 md:h-14 rounded", accentColor)} />
          <div className={cn("w-1/2 h-10 md:h-14 rounded", accentColor)} />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="space-y-12 mt-12">

        {/* — Barra Autor + Ações — */}
        <div className={cn(
          "flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b-4",
          isDark ? "border-gray-800" : "border-gray-200"
        )}>
          {/* Autor */}
          <div className="flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-2xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]", skeletonColor)} />
            <div className="space-y-2">
              <div className={cn("w-36 h-5 rounded", accentColor)} />
              <div className={cn("w-48 h-3 rounded", skeletonColor)} />
            </div>
          </div>
          {/* Ações (share, like, views, login) */}
          <div className="flex items-center gap-3">
            <div className={cn("w-12 h-12 rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]", skeletonColor)} />
            <div className={cn("w-24 h-12 rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]", skeletonColor)} />
            <div className={cn("w-20 h-12 rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]", skeletonColor)} />
            <div className={cn("w-24 h-12 rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]", skeletonColor)} />
          </div>
        </div>

        {/* — SYNOPSIS box com label flutuante — */}
        <div className={cn(
          "relative p-8 pt-12 rounded-none border-4",
          isDark ? "bg-gray-800/40 border-purple-500 shadow-[4px_4px_0_rgba(168,85,247,0.4)]" : "bg-white border-purple-400 shadow-[4px_4px_0_rgba(168,85,247,0.4)]"
        )}>
          {/* Label flutuante */}
          <div className="absolute -top-6 left-8">
            <div className={cn(
              "w-32 h-9 border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]",
              isDark ? "bg-purple-700" : "bg-purple-500"
            )} />
          </div>
          {/* Linhas do excerpt */}
          <div className="space-y-3">
            <div className={cn("w-full h-5 rounded", accentColor)} />
            <div className={cn("w-full h-5 rounded", accentColor)} />
            <div className={cn("w-2/3 h-5 rounded", accentColor)} />
          </div>
        </div>

        {/* — Corpo do Artigo — */}
        <div className="space-y-5 pt-4">
          {[100, 100, 90, 100, 80, 100, 75, 100, 85, 60].map((w, i) => (
            <div
              key={i}
              className={cn("h-4 rounded", accentColor)}
              style={{ width: `${w}%` }}
            />
          ))}
          {/* Imagem inline */}
          <div className={cn("w-full h-[280px] md:h-[360px] rounded-none mt-8 mb-4 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]", skeletonColor)} />
          {[100, 100, 70].map((w, i) => (
            <div
              key={`post-${i}`}
              className={cn("h-4 rounded", accentColor)}
              style={{ width: `${w}%` }}
            />
          ))}
        </div>

        {/* — Separador ● ● ● — */}
        <div className="flex items-center gap-4 py-2">
          <div className={cn("flex-1 border-t-4 border-dashed", isDark ? "border-gray-700" : "border-gray-300")} />
          <div className={cn("w-12 h-5 rounded border-2", skeletonColor, isDark ? "border-gray-700" : "border-gray-300")} />
          <div className={cn("flex-1 border-t-4 border-dashed", isDark ? "border-gray-700" : "border-gray-300")} />
        </div>

        {/* — Próximas Fases — */}
        <div>
          {/* Título da seção */}
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className={cn("w-6 h-6 md:w-7 md:h-7 rounded", isDark ? "bg-yellow-600/40" : "bg-yellow-400")} />
            <div className={cn("w-44 h-6 md:h-8 rounded", accentColor)} />
            <div className={cn("w-24 h-5 rounded border", skeletonColor, isDark ? "border-purple-700" : "border-purple-300")} />
          </div>
          {/* Grid de 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className={cn(
                  "h-36 md:h-40 w-full mb-3 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]",
                  skeletonColor
                )} />
                <div className={cn("w-full h-4 rounded mb-2", accentColor)} />
                <div className={cn("w-2/3 h-3 rounded", skeletonColor)} />
              </div>
            ))}
          </div>
        </div>

        {/* — Seção Comunidade (Comentários) — */}
        <div className={cn("pt-12 border-t-4", isDark ? "border-gray-800" : "border-gray-300")}>
          {/* Título */}
          <div className="flex items-center gap-3 mb-10">
            <div className={cn("w-8 h-8 rounded", isDark ? "bg-purple-700/40" : "bg-purple-200")} />
            <div className={cn("w-48 h-8 rounded", accentColor)} />
          </div>
          {/* Formulário de comentário */}
          <div className={cn(
            "mb-12 p-8 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]",
            isDark ? "bg-gray-800" : "bg-gray-100"
          )}>
            <div className={cn("w-full h-28 mb-5 rounded-none border-2", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300")} />
            <div className="flex justify-end">
              <div className={cn("w-28 h-12 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]", isDark ? "bg-purple-700/40" : "bg-purple-400/40")} />
            </div>
          </div>
          {/* Lista de comentários */}
          <div className="space-y-5">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "p-6 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]",
                  isDark ? "bg-gray-800" : "bg-gray-100"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("w-24 h-4 rounded", accentColor)} />
                  <div className={cn("w-20 h-3 ml-auto rounded", skeletonColor)} />
                </div>
                <div className="space-y-2">
                  <div className={cn("w-full h-3 rounded", skeletonColor)} />
                  <div className={cn("w-4/5 h-3 rounded", skeletonColor)} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
