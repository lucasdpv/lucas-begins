import React from "react";
import Image from "next/image";
import {
  Check,
  X,
  Award,
  Quote,
} from "lucide-react";
import { cn, splitTitle } from "../../../../lib/utils";
import { Post } from "../../schemas";
import { resolvePostProsCons } from "../../utils/reviewVerdictHelper";

interface PostVerdictProps {
  post: Post;
  isDark: boolean;
}

/**
 * Barra de 10 Segmentos Horizontais (HUD de Pontuação)
 */
function ScoreSegments({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1.5 w-full">
      {Array.from({ length: 10 }).map((_, idx) => {
        const isFilled = idx + 1 <= Math.floor(score);
        const isPartial = !isFilled && idx < score;
        return (
          <div
            key={idx}
            className={cn(
              "h-2 flex-1 rounded-sm transition-all duration-500",
              isFilled
                ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                : isPartial
                ? "bg-amber-400/50"
                : "bg-white/[0.12]"
            )}
          />
        );
      })}
    </div>
  );
}

export default function PostVerdict({ post, isDark }: PostVerdictProps) {
  if (!post.score) return null;

  const numScore =
    typeof post.score === "number"
      ? post.score
      : parseFloat(String(post.score).replace(",", ".")) || 8.5;

  const { pros: cleanPros, cons: cleanCons } = resolvePostProsCons(post);
  const hasProsOrCons = cleanPros.length > 0 || cleanCons.length > 0;

  const { mainTitle, subtitle } = splitTitle(post.title);
  const gameTitle = mainTitle || post.title;
  const verdictText = post.verdict?.trim() || "";

  // No topo do banner:
  // - Se já tem Prós/Contras (formato novo): mostra frase curta se houver (<= 140 chars) ou o subtítulo da matéria
  // - Se é review antiga (sem Prós/Contras): mostra o subtítulo da matéria no topo, pois o verdictText completo vai brilhar na base!
  const topBannerLine = hasProsOrCons
    ? verdictText && verdictText.length <= 140
      ? verdictText
      : subtitle || ""
    : subtitle || "";

  const tierLabel =
    numScore >= 9.0
      ? "Obra-Prima"
      : numScore >= 8.0
      ? "Excelente"
      : numScore >= 7.0
      ? "Recomendado"
      : "Regular";

  return (
    <section className="relative my-12 clear-both">
      {/* Etiqueta Cravada na Borda Superior Esquerda (Mesmo padrão do Box "Os Segredos Escondidos no Cartucho") */}
      <div className="absolute -top-4 left-6 z-30 bg-black text-white px-4 py-1 font-retro text-xs font-bold uppercase border-2 border-white shadow-[3px_3px_0px_#6b21a8]">
        Veredito Begins
      </div>

      <div
        className={cn(
          "rounded-2xl sm:rounded-3xl border overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]",
          isDark ? "border-white/15 bg-[#0d0b1a]" : "border-slate-800 bg-[#0d0b1a]"
        )}
      >
        {/* =====================================================================
            PARTE SUPERIOR: HERO BANNER REFINADO + COLUNA ARQUITETÔNICA DA NOTA
            ===================================================================== */}
        <div
          className={cn(
            "relative grid grid-cols-1 lg:grid-cols-12 overflow-hidden",
            (hasProsOrCons || verdictText) && "border-b border-white/10"
          )}
        >
          {/* Luz Ambiental Difusa da Arte no Topo */}
          {post.imageUrl && (
            <div className="hidden lg:block absolute inset-y-0 right-0 w-2/5 opacity-25 pointer-events-none">
              <Image
                src={post.imageUrl}
                alt=""
                fill
                sizes="300px"
                className="object-cover object-right blur-2xl scale-110 saturate-150"
              />
            </div>
          )}

          {/* Esquerda (9 cols): Banner com Tipografia Refinada e Arte Livre */}
          <div className="lg:col-span-9 relative px-6 pt-9 pb-7 sm:px-8 sm:pt-10 sm:pb-8 lg:px-10 lg:py-10 overflow-hidden flex flex-col justify-center min-h-[160px] sm:min-h-[180px]">
            {post.imageUrl && (
              <div className="absolute inset-0 pointer-events-none">
                <Image
                  src={post.imageUrl}
                  alt={gameTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 750px"
                  className="object-cover object-center opacity-35 lg:opacity-70"
                />
                {/* Vinheta lateral suave que protege o texto na esquerda e deixa os personagens nítidos no centro/direita */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d0b1a] via-[#0d0b1a]/75 to-transparent" />
                <div className="hidden lg:block absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#0d0b1a] via-[#0d0b1a]/65 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b1a] via-transparent to-[#0d0b1a]/35" />
              </div>
            )}

            {/* Bloco do Título: Limpo, Elegante e Sem Invadir o Meio da Arte */}
            <div className="relative z-10 max-w-md space-y-1.5">
              <h3 className="font-retro font-bold text-xl sm:text-2xl lg:text-[26px] text-white tracking-tight leading-snug drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] m-0">
                {gameTitle}
              </h3>

              {topBannerLine && (
                <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed m-0 font-normal line-clamp-2">
                  {topBannerLine}
                </p>
              )}
            </div>
          </div>

          {/* Direita (3 cols): Coluna Arquitetônica da Nota com Glassmorphism */}
          <div className="lg:col-span-3 relative z-10 p-6 sm:p-7 bg-gradient-to-b from-amber-500/[0.1] via-[#131026]/85 to-[#0d0b1a]/95 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/10 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 lg:gap-5 text-center">
            <div className="text-left lg:text-center">
              <span className="text-[10px] font-retro font-bold uppercase tracking-[0.22em] text-amber-400/90 block mb-1">
                Nota Final
              </span>
              <div className="flex items-baseline lg:justify-center gap-1">
                <span className="font-retro font-black text-5xl sm:text-6xl text-white tracking-tighter leading-none drop-shadow-[0_0_24px_rgba(251,191,36,0.35)]">
                  {numScore.toFixed(1)}
                </span>
                <span className="font-retro font-bold text-sm text-amber-400">
                  /10
                </span>
              </div>
            </div>

            <div className="w-48 sm:w-56 lg:w-full flex flex-col items-end lg:items-center gap-3">
              {/* Insígnia Refinada */}
              <div className="inline-flex items-center justify-center gap-1.5 px-4 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 font-retro font-black text-[11px] uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                {tierLabel}
              </div>

              {/* Medidor de 10 Segmentos */}
              <ScoreSegments score={numScore} />
            </div>
          </div>
        </div>

        {/* =====================================================================
            PARTE INFERIOR (MODO HÍBRIDO INTELIGENTE):
            - CASO 1: Se tem Prós ou Contras -> Exibe a tabela dividida de Prós e Contras
            - CASO 2: Review Antiga (sem Prós/Contras, mas com texto de veredito) -> Exibe a Síntese Original
            ===================================================================== */}
        {hasProsOrCons ? (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] bg-[#110e22]">
            {/* O Que Brilha (Prós) */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-emerald-500/25">
                <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                  +
                </span>
                <h4 className="font-retro font-black text-sm sm:text-base uppercase tracking-widest text-emerald-400 m-0">
                  O Que Brilha (Prós)
                </h4>
              </div>
              {cleanPros.length > 0 ? (
                <ul className="space-y-3">
                  {cleanPros.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-100 font-medium leading-snug"
                    >
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic m-0">Nenhum ponto positivo listado.</p>
              )}
            </div>

            {/* O Que Pesa (Contras) */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-rose-500/25">
                <span className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-[0_0_12px_rgba(244,63,94,0.4)]">
                  −
                </span>
                <h4 className="font-retro font-black text-sm sm:text-base uppercase tracking-widest text-rose-400 m-0">
                  O Que Pesa (Contras)
                </h4>
              </div>
              {cleanCons.length > 0 ? (
                <ul className="space-y-3">
                  {cleanCons.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-200 font-medium leading-snug"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic m-0">Nenhum ponto negativo listado.</p>
              )}
            </div>
          </div>
        ) : verdictText ? (
          /* MODO RETROCOMPATÍVEL PARA REVIEWS ANTIGAS: Exibe o seu texto original de veredito com elegância */
          <div className="p-6 sm:p-8 bg-[#110e22] relative overflow-hidden">
            <Quote className="w-10 h-10 text-amber-400/10 absolute right-6 top-5 pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/30 font-retro font-bold text-[10px] uppercase tracking-widest text-amber-400 shrink-0 self-start mt-0.5">
                Síntese
              </span>
              <p className="text-[15px] sm:text-base text-slate-200 italic leading-relaxed m-0 font-medium">
                "{verdictText}"
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
