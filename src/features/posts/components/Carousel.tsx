import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Clock, Play, Sparkles } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { AnimatePresence, motion } from "framer-motion";
import { calculateReadingTime, cn, formatNumber, slugify, splitTitle } from "../../../lib/utils";
import { CategoryBadge, ScoreBadge } from "../../../components/ui/Badge";
import { Post } from "../schemas";
import { useThemeStore } from "../../../store/useThemeStore";

interface CarouselProps {
  posts: Post[];
  isDark?: boolean;
}

const AUTOPLAY_INTERVAL = 7000;

/**
 * Billboard Hero Estilo Streaming (Netflix / Apple TV+ / Crunchyroll):
 * - Crossfade cinematográfico ultra-suave entre artes (camadas pré-montadas sem flash)
 * - Ken Burns sutil na imagem ativa + transição suave de texto com leve blur
 * - Dock de miniaturas (thumbnails) fixo e estável no canto inferior direito
 */
export default function Carousel({ posts }: CarouselProps) {
  const { isDark } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [hoveredThumbIndex, setHoveredThumbIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === currentIndex) return;
      setPreviousIndex(currentIndex);
      setCurrentIndex(idx);
    },
    [currentIndex]
  );

  // Só ficam montados o slide atual, o anterior (fade-out), o próximo (pré-carregado)
  // e a miniatura sob o mouse — evita decodificar e desfocar todas as artes ao mesmo tempo.
  const isSlideMounted = (idx: number) =>
    idx === currentIndex ||
    idx === previousIndex ||
    idx === (currentIndex + 1) % posts.length ||
    idx === hoveredThumbIndex;

  const next = useCallback(() => {
    const nextIdx = (currentIndex + 1) % posts.length;
    goTo(nextIdx);
  }, [currentIndex, posts.length, goTo]);

  const prev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + posts.length) % posts.length;
    goTo(prevIdx);
  }, [currentIndex, posts.length, goTo]);

  // Autoplay: a barra de progresso é uma animação CSS pura (sem setState a cada frame).
  // O avanço de slide acontece no `onAnimationEnd` da barra visível. Isso evita
  // re-renderizar o carrossel 20x/s, o que conflitava com o Google Translate
  // (texto piscando entre PT e o idioma traduzido).
  const progressStyle: React.CSSProperties = {
    animation: `carousel-progress ${AUTOPLAY_INTERVAL}ms linear forwards`,
    animationPlayState: isPaused ? "paused" : "running",
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchEndY.current = null;
    touchStart.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };
  const onTouchEnd = () => {
    if (touchStart.current === null || touchEnd.current === null) return;
    const diffX = touchStart.current - touchEnd.current;
    const diffY = (touchStartY.current ?? 0) - (touchEndY.current ?? 0);
    // Só avança se o movimento foi predominantemente horizontal e superior a 45px,
    // evitando conflito com a rolagem vertical de página no mobile.
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
      if (diffX > 0) next();
      else prev();
    }
    touchStart.current = null;
    touchEnd.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
  };

  const currentPost = posts[currentIndex];
  const { mainTitle, subtitle } = splitTitle(currentPost?.title);
  if (!currentPost) return null;

  const targetUrl = `/post/${currentPost.slug || slugify(currentPost.title)}`;

  return (
    <div className="relative group/carousel select-none">
      {/* TV Ambilight / Scene Light Extension — Projeção Difusa no Desktop (desativado no mobile para máxima fluidez a 120Hz) */}
      {isDark && (
        <div className="hidden md:block absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
          {posts.map((post, idx) => {
            if (!post.imageUrl || !isSlideMounted(idx)) return null;
            const isActive = idx === currentIndex;
            const glowImage = (
              <Image
                src={post.imageUrl}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
                style={{ objectPosition: post.imagePosition || "center" }}
              />
            );
            return (
              <div
                key={`ambilight-${post.id}`}
                className={cn(
                  "absolute -inset-4 md:-inset-8 rounded-[3rem] overflow-hidden blur-2xl md:blur-3xl saturate-150 scale-105 transition-opacity duration-1000 ease-out transform-gpu",
                  isActive ? "opacity-40" : "opacity-0"
                )}
              >
                {glowImage}
              </div>
            );
          })}
        </div>
      )}

      <div
        className={cn(
          "relative rounded-2xl md:rounded-3xl overflow-hidden border transition-all duration-500",
          isDark
            ? "bg-[#0d0b1a] border-white/[0.1] shadow-xl md:shadow-[0_28px_70px_-15px_rgba(0,0,0,0.85)]"
            : "bg-slate-950 border-slate-200/80 shadow-md md:shadow-[0_24px_50px_-12px_rgba(15,23,42,0.25)]"
        )}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Main Billboard Stage */}
        <div className="relative w-full h-[400px] sm:h-[460px] md:h-[560px] lg:h-[600px] xl:h-[640px] 2xl:h-[680px] overflow-hidden bg-[#090812]">
          {/* 1. Camadas de Imagem Pré-Montadas (Crossfade leve no mobile, Ken Burns no Desktop) */}
          {posts.map((post, idx) => {
            if (!isSlideMounted(idx)) return null;
            const isActive = idx === currentIndex;
            return (
              <div
                key={post.id}
                aria-hidden={!isActive}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 md:transition-[opacity,transform] md:duration-[1100ms] md:ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu",
                  isActive ? "opacity-100 scale-100 z-[1]" : "opacity-0 md:scale-[1.04] z-0 pointer-events-none"
                )}
              >
                {post.imageUrl && (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    className="object-cover"
                    style={{ objectPosition: post.imagePosition || "center" }}
                    fill
                    priority={idx === 0}
                    loading={idx === 0 ? "eager" : undefined}
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1400px"
                  />
                )}
              </div>
            );
          })}

          {/* 2. Link Esticado para o Slide Atual */}
          <Link
            to={targetUrl}
            className="absolute inset-0 z-10"
            aria-label={`Ler matéria: ${currentPost.title}`}
          />

          {/* 3. Vinhetas Cinematográficas Suaves (Protegem a leitura do texto sem apagar a arte) */}
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#090812]/90 via-[#090812]/35 to-transparent pointer-events-none z-[5]" />
          <div className="hidden sm:block absolute inset-y-0 left-0 w-3/4 max-w-2xl bg-gradient-to-r from-[#090812]/85 via-[#090812]/30 to-transparent pointer-events-none z-[5]" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#090812]/30 to-transparent pointer-events-none z-[5]" />

          {/* 4. Conteúdo Inferior: Texto Animado + Strip de Miniaturas Estável */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12 lg:p-14 z-[15] pointer-events-none flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            {/* Bloco de Texto com Transição Suave (Fade + Glide Vertical Otimizado sem repaints de blur) */}
            <div className="max-w-2xl flex-1 min-w-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentPost.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex flex-col items-start"
                >
                  {/* Top Streaming Badges Row */}
                  <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-retro font-black uppercase tracking-widest bg-purple-600/90 text-white border border-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.5)] backdrop-blur-md">
                      <Sparkles className="w-3 h-3 text-purple-200" />
                      Destaque #{currentIndex + 1}
                    </span>

                    <CategoryBadge size="sm" className="rounded-full px-3 py-1 border-white/15 backdrop-blur-md">
                      {currentPost.category}
                    </CategoryBadge>

                    {currentPost.score && (
                      <ScoreBadge score={currentPost.score} size="sm" className="rounded-full shrink-0" />
                    )}
                  </div>

                  {/* Dramatic Title & Colored Subtitle */}
                  {mainTitle ? (
                    <div className="flex flex-col gap-1.5 mb-3.5">
                      <h2 className="font-retro font-black text-2xl sm:text-3xl md:text-5xl lg:text-4xl xl:text-[52px] leading-[1.05] text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                        {mainTitle}
                      </h2>
                      <span
                        className={cn(
                          "font-sans text-sm sm:text-base md:text-lg lg:text-base xl:text-xl leading-snug font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]",
                          currentPost.category.toLowerCase().includes("reviews")
                            ? "text-amber-300"
                            : currentPost.category.toLowerCase().includes("dossi")
                            ? "text-sky-300"
                            : currentPost.category.toLowerCase().includes("retro")
                            ? "text-orange-300"
                            : currentPost.category.toLowerCase().includes("anime")
                            ? "text-pink-300"
                            : "text-purple-300"
                        )}
                      >
                        {subtitle}
                      </span>
                    </div>
                  ) : (
                    <h2 className="font-retro font-black text-2xl sm:text-3xl md:text-5xl lg:text-4xl xl:text-[52px] leading-[1.05] text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] mb-3.5">
                      {subtitle}
                    </h2>
                  )}

                  {/* Excerpt */}
                  {currentPost.excerpt && (
                    <p className="text-xs sm:text-sm md:text-base text-slate-200/85 leading-relaxed line-clamp-4 h-[6.5rem] mb-6 max-w-2xl drop-shadow max-xl:hidden">
                      {currentPost.excerpt}
                    </p>
                  )}

                  {/* Action Buttons + Streaming Metadata */}
                  <div className="flex flex-wrap items-center gap-4 pointer-events-auto">
                    <Link
                      to={targetUrl}
                      className="inline-flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white text-slate-950 hover:bg-purple-500 hover:text-white font-retro font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_10px_30px_rgba(168,85,247,0.5)] hover:scale-[1.03] active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Ler Matéria
                    </Link>

                    <div className="hidden sm:flex lg:max-xl:hidden items-center gap-3 px-4 py-2.5 rounded-xl bg-black/45 border border-white/10 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-slate-200">
                      <span className="flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" fill="currentColor" />
                        {formatNumber(currentPost.likes || 0)}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-white/30 shrink-0" />
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                        {calculateReadingTime(currentPost.content || "")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop Streaming Thumbnail Rail — Estável no Canto Inferior Direito */}
            {posts.length > 1 && (
              <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 pointer-events-auto shrink-0 bg-black/45 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
                {posts.map((post, idx) => {
                  const isActive = idx === currentIndex;
                  const thumbTitle = splitTitle(post.title).mainTitle || post.title;
                  return (
                    <button
                      key={post.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goTo(idx);
                      }}
                      onMouseEnter={() => setHoveredThumbIndex(idx)}
                      onMouseLeave={() => setHoveredThumbIndex(null)}
                      className={cn(
                        "relative w-24 h-14 xl:w-28 xl:h-16 2xl:w-36 2xl:h-20 rounded-xl overflow-hidden transition-all duration-500 ease-out cursor-pointer group/thumb focus:outline-none text-left bg-purple-950/60",
                        isActive
                          ? "ring-2 ring-purple-400 scale-[1.04] shadow-[0_0_20px_rgba(168,85,247,0.45)] opacity-100"
                          : "opacity-55 hover:opacity-95 hover:scale-[1.02]"
                      )}
                      aria-label={`Selecionar destaque: ${post.title}`}
                    >
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          sizes="144px"
                          className="object-cover transition-transform duration-700 ease-out group-hover/thumb:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-950" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <span className="absolute bottom-2 left-2 right-2 font-retro font-bold text-[9px] text-white uppercase truncate leading-tight">
                        {thumbTitle}
                      </span>
                      {isActive && (
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/25">
                          <div
                            key={`thumb-progress-${currentIndex}`}
                            className="h-full w-0 bg-gradient-to-r from-purple-400 to-amber-300"
                            style={progressStyle}
                            onAnimationEnd={next}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Left/Right Navigation Controls */}
          {posts.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 text-white border border-white/15 backdrop-blur-xl z-30 transition-all duration-300 hover:bg-purple-600 hover:border-purple-400 active:scale-90 hidden sm:flex opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 text-white border border-white/15 backdrop-blur-xl z-30 transition-all duration-300 hover:bg-purple-600 hover:border-purple-400 active:scale-90 hidden sm:flex opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
                aria-label="Próximo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Mobile/Tablet Segmented Progress Indicators */}
          {posts.length > 1 && (
            <div className="lg:hidden absolute bottom-4 right-4 z-30 flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
              {posts.map((post, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={post.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(idx);
                    }}
                    className={cn(
                      "relative h-1.5 rounded-full overflow-hidden transition-all duration-500 focus:outline-none cursor-pointer",
                      isActive ? "w-7 bg-white/25" : "w-2 bg-white/40 hover:bg-white/60"
                    )}
                    aria-label={`Ir para slide ${idx + 1}`}
                  >
                    {isActive && (
                      <div
                        key={`dot-progress-${currentIndex}`}
                        className="absolute inset-y-0 left-0 w-0 bg-purple-400"
                        style={progressStyle}
                        onAnimationEnd={next}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
