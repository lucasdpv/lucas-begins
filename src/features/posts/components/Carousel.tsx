import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Clock, Play, Sparkles } from "lucide-react";
import { Link } from "@/lib/router-compat";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
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
 * Billboard Hero Estilo Streaming (Movido por Embla Carousel + Fade):
 * - Motor nativo leve (Embla Carousel) com física de swipe e crossfade acelerado por hardware
 * - Zero filtros de blur pesados (Ambilight substituído por radial-gradient estático de custo zero na GPU)
 * - Dock de miniaturas fixo e estável no canto inferior direito
 */
export default function Carousel({ posts }: CarouselProps) {
  const { isDark } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 24,
    },
    [Fade()]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const goTo = useCallback(
    (idx: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(idx);
    },
    [emblaApi]
  );

  const next = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const prev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

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

  const currentPost = posts[currentIndex] || posts[0];
  const { mainTitle, subtitle } = splitTitle(currentPost?.title);
  if (!currentPost) return null;

  const targetUrl = `/post/${currentPost.slug || slugify(currentPost.title)}`;

  return (
    <div className="relative group/carousel select-none">
      {/* Aura Ambiental Leve (Radial Gradient sem filter:blur — Custo Zero em GPUs Integradas) */}
      {isDark && (
        <div
          aria-hidden="true"
          className="hidden md:block absolute -inset-6 pointer-events-none -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.16)_0%,rgba(59,130,246,0.06)_45%,transparent_72%)]"
        />
      )}

      <div
        className={cn(
          "relative rounded-2xl md:rounded-3xl overflow-hidden border",
          isDark
            ? "bg-[#0d0b1a] border-white/[0.1] shadow-xl md:shadow-[0_24px_56px_-15px_rgba(0,0,0,0.85)]"
            : "bg-slate-950 border-slate-200/80 shadow-md md:shadow-[0_20px_44px_-12px_rgba(15,23,42,0.25)]"
        )}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Main Billboard Stage (Embla Viewport) */}
        <div className="relative w-full h-[400px] sm:h-[460px] md:h-[560px] lg:h-[600px] xl:h-[640px] 2xl:h-[680px] overflow-hidden bg-[#090812]">
          <div ref={emblaRef} className="w-full h-full overflow-hidden">
            <div className="flex w-full h-full">
              {posts.map((post, idx) => {
                const slideUrl = `/post/${post.slug || slugify(post.title)}`;
                // Monta imagem apenas para o slide atual, adjacentes ou primeiro slide
                const shouldRenderImage =
                  idx === 0 ||
                  idx === currentIndex ||
                  idx === (currentIndex + 1) % posts.length ||
                  idx === (currentIndex - 1 + posts.length) % posts.length;

                return (
                  <div
                    key={post.id}
                    className="relative flex-[0_0_100%] min-w-0 w-full h-full overflow-hidden"
                  >
                    {post.imageUrl && shouldRenderImage && (
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
                    <Link
                      to={slideUrl}
                      className="absolute inset-0 z-10"
                      aria-label={`Ler matéria: ${post.title}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vinhetas Cinematográficas Suaves */}
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#090812]/95 via-[#090812]/40 to-transparent pointer-events-none z-[5]" />
          <div className="hidden sm:block absolute inset-y-0 left-0 w-3/4 max-w-2xl bg-gradient-to-r from-[#090812]/85 via-[#090812]/30 to-transparent pointer-events-none z-[5]" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#090812]/30 to-transparent pointer-events-none z-[5]" />

          {/* Conteúdo Inferior: Texto + Strip de Miniaturas Estável */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12 lg:p-14 z-[15] pointer-events-none flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl flex-1 min-w-0">
              <div key={currentPost.id} className="flex flex-col items-start animate-bg-fade">
                {/* Top Streaming Badges Row */}
                <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-retro font-black uppercase tracking-widest bg-purple-600 text-white border border-purple-400/40 shadow-md">
                    <Sparkles className="w-3 h-3 text-purple-200" />
                    Destaque #{currentIndex + 1}
                  </span>

                  <CategoryBadge size="sm" className="rounded-full px-3 py-1 border-white/15 bg-[#090812]/85">
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
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white text-slate-950 hover:bg-purple-500 hover:text-white font-retro font-black text-xs uppercase tracking-widest transition-[background-color,color,transform] duration-200 shadow-lg hover:scale-[1.03] active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Ler Matéria
                  </Link>

                  <div className="hidden sm:flex lg:max-xl:hidden items-center gap-3 px-4 py-2.5 rounded-xl bg-[#090812]/85 border border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-200">
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
              </div>
            </div>

            {/* Desktop Streaming Thumbnail Rail — Estável no Canto Inferior Direito */}
            {posts.length > 1 && (
              <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 pointer-events-auto shrink-0 bg-[#090812]/90 p-2 rounded-2xl border border-white/10">
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
                      className={cn(
                        "relative w-24 h-14 xl:w-28 xl:h-16 2xl:w-36 2xl:h-20 rounded-xl overflow-hidden transition-[opacity,transform] duration-300 ease-out cursor-pointer group/thumb focus:outline-none text-left bg-purple-950/60",
                        isActive
                          ? "ring-2 ring-purple-400 scale-[1.03] opacity-100"
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
                          className="object-cover"
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
                className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#090812]/85 text-white border border-white/15 z-30 transition-opacity duration-200 hover:bg-purple-600 hover:border-purple-400 active:scale-90 hidden sm:flex opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
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
                className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#090812]/85 text-white border border-white/15 z-30 transition-opacity duration-200 hover:bg-purple-600 hover:border-purple-400 active:scale-90 hidden sm:flex opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
                aria-label="Próximo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Mobile/Tablet Segmented Progress Indicators */}
          {posts.length > 1 && (
            <div className="lg:hidden absolute bottom-4 right-4 z-30 flex items-center gap-1.5 bg-[#090812]/85 px-3 py-1.5 rounded-full border border-white/10">
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
                      "relative h-1.5 rounded-full overflow-hidden transition-all duration-300 focus:outline-none cursor-pointer",
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
