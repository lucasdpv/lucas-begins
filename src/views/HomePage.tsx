"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import {
  Gamepad2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Sparkles,
  Eye,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "@/lib/router-compat";
import { motion, AnimatePresence } from "framer-motion";
import Carousel from "../features/posts/components/Carousel";
import PostCard from "../features/posts/components/PostCard";
import PostSkeleton from "../features/posts/components/PostSkeleton";
import CarouselSkeleton from "../features/posts/components/CarouselSkeleton";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import {
  useAllPosts,
  useFeaturedPosts,
  useMostViewedPosts,
  usePostsByCategory,
  useLatestPosts,
} from "../features/posts/hooks/usePostsQuery";
import { usePostsFilter } from "../hooks/usePostsFilter";
import { getCategoryDescription } from "../features/posts/utils/categoryInfo";
import { getCategoryIcon } from "../features/posts/utils/categoryIcons";
import MagazineBackdrop from "../components/home/MagazineBackdrop";
import {
  cn,
  slugify,
  formatNumber,
  formatDate,
  calculateReadingTime,
  splitTitle,
} from "../lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { PostService } from "../services/postService";
import { Post } from "../features/posts/schemas";

let sharedAudioContext: AudioContext | null = null;

// Um único AudioContext, criado só depois da primeira interação do visitante:
// antes disso o navegador bloqueia o áudio e registra um aviso a cada tentativa.
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return null;
  if (!sharedAudioContext) {
    const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtor) return null;
    sharedAudioContext = new AudioCtor();
  }
  if (sharedAudioContext.state === "suspended") sharedAudioContext.resume().catch(() => {});
  return sharedAudioContext;
}

export default function HomePage() {
  const { isDark } = useThemeStore();
  const queryClient = useQueryClient();
  const [isSecondarySectionsReady, setIsSecondarySectionsReady] = useState(false);

  const handlePrefetch = useCallback(
    (slug: string) => {
      queryClient.prefetchQuery({
        queryKey: ["postBySlug", slug],
        queryFn: () => PostService.getPostBySlug(slug),
        staleTime: 1000 * 60 * 10,
      });
    },
    [queryClient]
  );

  const playEjectSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.setValueAtTime(987.77, now + 0.04);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // ignore audio block
    }
  };

  const retrocafeRef = useRef<HTMLDivElement>(null);
  const dossieRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const mostViewedRef = useRef<HTMLDivElement>(null);

  const [retrocafeScroll, setRetrocafeScroll] = useState({ left: false, right: true });
  const [dossieScroll, setDossieScroll] = useState({ left: false, right: true });
  const [reviewsScroll, setReviewsScroll] = useState({ left: false, right: true });
  const [mostViewedScroll, setMostViewedScroll] = useState({ left: false, right: true });
  const [hoveredRetrocafeIndex, setHoveredRetrocafeIndex] = useState<number | null>(null);
  const [hoveredDossieIndex, setHoveredDossieIndex] = useState<number | null>(null);
  const [hoveredReviewsIndex, setHoveredReviewsIndex] = useState<number | null>(null);

  const playClickSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // ignore
    }
  }, []);

  const updateScrollState = useCallback(
    (
      ref: React.RefObject<HTMLDivElement | null>,
      setScroll: React.Dispatch<React.SetStateAction<{ left: boolean; right: boolean }>>
    ) => {
      if (ref.current) {
        const { scrollLeft, scrollWidth, clientWidth } = ref.current;
        setScroll({
          left: scrollLeft > 5,
          right: scrollLeft < scrollWidth - clientWidth - 10,
        });
      }
    },
    []
  );

  const scrollContainer = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
      if (ref.current) {
        const scrollAmount = ref.current.clientWidth * 0.85;
        ref.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    },
    []
  );

  const { activeCategory, searchQuery, setActiveCategory, setSearchQuery } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isDefaultView = activeCategory === "Todos" && searchQuery === "";

  useEffect(() => {
    let cancelled = false;
    const markReady = () => {
      if (!cancelled) setIsSecondarySectionsReady(true);
    };
    if (typeof window === "undefined") return;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(markReady, { timeout: 900 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const timer = setTimeout(markReady, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const shouldLoadSecondary = isDefaultView && isSecondarySectionsReady;

  useEffect(() => {
    if ((location.state as any)?.resetCategory) {
      setActiveCategory("Todos");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToCategory = useCallback(
    (category: string) => {
      navigate(`/archive?categoria=${encodeURIComponent(category)}`);
    },
    [navigate]
  );

  const { data: featuredPosts = [], isLoading: isLoadingFeatured } = useFeaturedPosts(isDefaultView);
  const { data: mostViewedPosts = [] } = useMostViewedPosts(5, shouldLoadSecondary);
  const { data: reviewPosts = [], isLoading: isLoadingReviews } = usePostsByCategory(
    "Reviews",
    5,
    shouldLoadSecondary
  );
  const { data: dossiePosts = [], isLoading: isLoadingDossies } = usePostsByCategory(
    "Dossiês",
    3,
    shouldLoadSecondary
  );
  const { data: retrocafePosts = [], isLoading: isLoadingRetrocafe } = usePostsByCategory(
    "RetroCafé",
    3,
    shouldLoadSecondary
  );
  const { data: latestPosts = [], isLoading: isLoadingLatest } = useLatestPosts(4, isDefaultView);

  const isSearching = searchQuery.trim() !== "";
  const isLocalMode = isSearching || activeCategory !== "Todos";
  const { data: allPosts = [], isLoading: isLoadingAll } = useAllPosts(isLocalMode);

  const posts = allPosts as Post[];

  // Só rola para o topo quando a categoria/busca muda; no carregamento (ex.: "voltar" do navegador)
  // a posição de rolagem anterior é preservada.
  const lastView = useRef(`${activeCategory}|${searchQuery}`);
  useEffect(() => {
    const view = `${activeCategory}|${searchQuery}`;
    if (view === lastView.current) return;
    lastView.current = view;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory, searchQuery]);

  const { filteredPosts } = usePostsFilter(posts, activeCategory, searchQuery);

  const carouselPosts = featuredPosts.slice(0, 5);
  const displayRetrocafe = retrocafePosts.slice(0, 3);
  const displayDossie = dossiePosts.slice(0, 3);
  const displayReviews = reviewPosts.slice(0, 5);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateScrollState(retrocafeRef, setRetrocafeScroll);
      updateScrollState(dossieRef, setDossieScroll);
      updateScrollState(reviewsRef, setReviewsScroll);
      updateScrollState(mostViewedRef, setMostViewedScroll);
    }, 400);
    return () => clearTimeout(timer);
  }, [displayRetrocafe, displayDossie, displayReviews, mostViewedPosts, updateScrollState]);

  useEffect(() => {
    const handleResize = () => {
      updateScrollState(retrocafeRef, setRetrocafeScroll);
      updateScrollState(dossieRef, setDossieScroll);
      updateScrollState(reviewsRef, setReviewsScroll);
      updateScrollState(mostViewedRef, setMostViewedScroll);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateScrollState]);

  const gridPosts = isLocalMode ? filteredPosts.slice(0, 8) : latestPosts.slice(0, 4);
  const isLoadingPosts = isLocalMode ? isLoadingAll : isLoadingLatest;

  return (
    <div className="flex flex-col gap-10 md:gap-14 relative">
      {/* ── 1. BILLBOARD HERO PANORÂMICO (NETFLIX / CRUNCHYROLL STYLE) ── */}
      {isLoadingFeatured && isDefaultView ? (
        <CarouselSkeleton isDark={isDark} />
      ) : isDefaultView && carouselPosts.length > 0 ? (
        <section className="w-full">
          <Carousel posts={carouselPosts} isDark={isDark} />
        </section>
      ) : null}

      {/* ── 2. TOP 5 EM ALTA HOJE (NETFLIX TOP 10 RAIL) ── */}
      {isDefaultView && (
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <h2 className="font-retro text-xl md:text-2xl font-black uppercase tracking-wide leading-none">
                  Top 5 Em Alta Hoje
                </h2>
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] mt-1 pl-12 text-slate-400">
                Os títulos mais acessados pela comunidade
              </p>
            </div>
          </div>

          <div className="relative group/scroll-container w-full">
            <div
              ref={mostViewedRef}
              onScroll={() => updateScrollState(mostViewedRef, setMostViewedScroll)}
              className="flex lg:grid lg:grid-cols-5 overflow-x-auto lg:overflow-visible gap-4 pb-3 lg:pb-0 scrollbar-hide snap-x snap-mandatory w-full rail-edge-fade"
            >
              {mostViewedPosts.length === 0
                ? [1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-[185px] rounded-2xl border animate-pulse w-[250px] lg:w-auto shrink-0 snap-start",
                        isDark ? "bg-white/[0.03] border-white/[0.06]" : "bg-slate-200/60 border-slate-200"
                      )}
                    />
                  ))
                : mostViewedPosts.slice(0, 5).map((post, idx) => {
                    const targetSlug = post.slug || slugify(post.title);
                    const { mainTitle, subtitle } = splitTitle(post.title);
                    return (
                      <Link
                        key={post.id}
                        to={`/post/${targetSlug}`}
                        onMouseEnter={() => handlePrefetch(targetSlug)}
                        className="group relative flex items-end w-[255px] sm:w-[270px] lg:w-auto h-[190px] xl:h-[215px] shrink-0 snap-start snap-always focus:outline-none pl-7"
                      >
                        {/* Giant Netflix-Style Rank Number on Left */}
                        <span className="netflix-rank absolute left-0 bottom-1 text-[105px] sm:text-[118px] z-20 pointer-events-none select-none">
                          {idx + 1}
                        </span>

                        {/* Poster Card */}
                        <div
                          className={cn(
                            "relative w-full h-full rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-end p-4 z-10 group-hover:-translate-y-1.5",
                            isDark
                              ? "bg-[#141226] border-white/[0.1] group-hover:border-amber-400/50 shadow-[0_14px_32px_-10px_rgba(0,0,0,0.8)] group-hover:shadow-[0_18px_40px_-10px_rgba(245,158,11,0.3)]"
                              : "bg-slate-900 border-slate-200 group-hover:border-amber-500 shadow-md"
                          )}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/75 via-[#181336] to-[#090812]" />
                          {post.imageUrl ? (
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-slate-950" />
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-[#090812] via-[#090812]/55 to-transparent" />

                          {/* Category Top Tag */}
                          <div className="absolute top-3 right-3 z-20">
                            <span className="text-[8px] font-retro font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/65 text-amber-300 border border-white/10 backdrop-blur-md">
                              {post.category}
                            </span>
                          </div>

                          <div className="relative z-20 space-y-1 pl-3">
                            <h3 className="font-retro font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors leading-snug uppercase">
                              {mainTitle || subtitle}
                            </h3>
                            <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-wider text-slate-300/80">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3 text-amber-400" />
                                {formatNumber(post.views || 0)}
                              </span>
                              <span>·</span>
                              <span>
                                {calculateReadingTime(post.content || "").replace(
                                  " min de leitura",
                                  " min"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
            </div>

            {mostViewedScroll.left && (
              <button
                onClick={() => scrollContainer(mostViewedRef, "left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 flex lg:hidden items-center justify-center w-9 h-9 rounded-full bg-black/75 text-white border border-white/15 backdrop-blur-md"
                aria-label="Deslizar esquerda"
              >
                <ChevronLeft className="w-5 h-5 text-amber-400" />
              </button>
            )}
            {mostViewedScroll.right && (
              <button
                onClick={() => scrollContainer(mostViewedRef, "right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex lg:hidden items-center justify-center w-9 h-9 rounded-full bg-black/75 text-white border border-white/15 backdrop-blur-md"
                aria-label="Deslizar direita"
              >
                <ChevronRight className="w-5 h-5 text-amber-400" />
              </button>
            )}
          </div>
        </section>
      )}

      {/* ── 4. RECÉM-ADICIONADOS AO CATÁLOGO (ÚLTIMAS NOTÍCIAS) ── */}
      <section className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)] shrink-0">
                {!searchQuery && activeCategory !== "Todos" ? (
                  getCategoryIcon(activeCategory, 18)
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </div>
              <h2 className="font-retro text-lg sm:text-xl md:text-2xl font-black uppercase tracking-wide leading-tight [overflow-wrap:anywhere]">
                {isLoadingPosts
                  ? "Sincronizando Catálogo..."
                  : searchQuery
                  ? `Resultados: "${searchQuery}"`
                  : activeCategory !== "Todos"
                  ? activeCategory
                  : "Recém-Adicionados"}
              </h2>
            </div>
            {!searchQuery && activeCategory !== "Todos" && getCategoryDescription(activeCategory) ? (
              <p
                className={cn(
                  "text-sm leading-relaxed mt-2 pl-12 max-w-3xl",
                  isDark ? "text-slate-300" : "text-slate-600"
                )}
              >
                {getCategoryDescription(activeCategory)}
              </p>
            ) : (
              <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.14em] sm:tracking-[0.25em] mt-1 pl-12 text-slate-400">
                Novos lançamentos, análises e especiais do portal
              </p>
            )}
          </div>

          {!isLoadingPosts && (
            <Link
              to={activeCategory !== "Todos" ? `/archive?categoria=${encodeURIComponent(activeCategory)}` : "/archive"}
              className={cn(
                "flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 font-retro font-bold text-[10px] uppercase tracking-widest border rounded-full transition-all duration-200 hover:translate-x-0.5 shrink-0",
                isDark
                  ? "border-white/10 text-slate-300 hover:border-purple-400/50 hover:text-white bg-white/[0.03]"
                  : "border-slate-200 text-slate-700 hover:border-purple-500 hover:text-purple-700 bg-white"
              )}
            >
              Explorar Tudo <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {isLoadingPosts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <PostSkeleton key={i} isDark={isDark} variant="compact" />
            ))}
          </div>
        ) : gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            {gridPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 110 }}
              >
                <PostCard post={post} variant="vintage" priority={i < 2} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "p-12 text-center rounded-2xl border border-dashed",
              isDark ? "border-white/10 bg-white/[0.02]" : "border-slate-300 bg-white"
            )}
          >
            <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-purple-500 animate-pulse" />
            <p className="font-retro font-bold uppercase text-sm">Nenhum título encontrado neste setor.</p>
          </div>
        )}
      </section>

      {/* ── 5. SÉRIES & COLEÇÕES ORIGINAIS (RETROCAFÉ / DOSSIÊS / REVIEWS) ── */}
      {isDefaultView && (
        <section className="flex flex-col gap-10 deferred-below-fold">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-7 text-left lg:items-stretch">
            {/* ── ESQUERDA (2/3): RetroCafé + Dossiês ── */}
            <div className="contents lg:col-span-2 lg:flex lg:flex-col lg:gap-8 lg:flex-1">
              {/* ── COLEÇÃO 1: RETROCAFÉ (POSTERS VERTICAIS ESTILO STREAMING / REVISTA) ── */}
              <div
                className={cn(
                  "order-2 lg:order-none p-4 sm:p-6 rounded-2xl sm:rounded-3xl border relative overflow-hidden transition-all duration-300 flex flex-col gap-4 sm:gap-5 z-10",
                  isDark
                    ? "bg-[#110f22]/90 border-white/[0.08] text-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.75)]"
                    : "bg-white border-slate-200/80 text-slate-900 shadow-lg"
                )}
                onMouseLeave={() => setHoveredRetrocafeIndex(null)}
              >
                <MagazineBackdrop tone="orange" />

                {/* Ambient Hover Backdrop */}
                <AnimatePresence>
                  {hoveredRetrocafeIndex !== null && displayRetrocafe[hoveredRetrocafeIndex] && (
                    <motion.div
                      key={displayRetrocafe[hoveredRetrocafeIndex].id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 z-0 pointer-events-none"
                    >
                      <div
                        className={cn(
                          "absolute inset-0 bg-cover bg-center blur-2xl scale-110 transition-all duration-700",
                          isDark ? "opacity-25" : "opacity-10"
                        )}
                        style={{
                          backgroundImage: `url(${displayRetrocafe[hoveredRetrocafeIndex].imageUrl})`,
                        }}
                      />
                      <div
                        className={cn(
                          "absolute inset-0",
                          isDark
                            ? "bg-gradient-to-t from-[#110f22] via-[#110f22]/80 to-[#110f22]/60"
                            : "bg-gradient-to-t from-white via-white/85 to-white/70"
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Header */}
                <div className="flex items-start justify-between relative z-10 gap-2 sm:gap-3">
                  <div
                    className="cursor-pointer group/title min-w-0 flex-1"
                    onClick={() => goToCategory("RetroCafé")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                        {getCategoryIcon("RetroCafé", 20)}
                      </div>
                      <h2 className="mag-title mag-title-orange font-retro text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wide leading-none group-hover/title:text-orange-200 transition-colors">
                        RetroCafé
                      </h2>
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.14em] sm:tracking-[0.2em] mt-1 pl-12 sm:pl-[52px] text-slate-400">
                      Crônicas & Memórias Geek
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => goToCategory("RetroCafé")}
                    className="mt-1 sm:mt-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/25 text-[10px] font-retro font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer shrink-0 transition-all"
                  >
                    Ver todos <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Cards RetroCafé (Vertical Streaming Posters) */}
                <div className="relative group/scroll-container w-full z-10">
                  <div
                    ref={retrocafeRef}
                    onScroll={() => updateScrollState(retrocafeRef, setRetrocafeScroll)}
                    className="flex lg:grid overflow-x-auto lg:overflow-x-visible lg:grid-cols-3 gap-3.5 sm:gap-4 pb-1 lg:pb-0 scrollbar-hide snap-x snap-mandatory w-full"
                  >
                    {isLoadingRetrocafe ? (
                      [1, 2, 3].map((idx) => (
                        <PostSkeleton key={idx} isDark={isDark} variant="compact" />
                      ))
                    ) : displayRetrocafe.length > 0 ? (
                      displayRetrocafe.map((post, i) => {
                        const targetSlug = post.slug || slugify(post.title);
                        const { mainTitle, subtitle } = splitTitle(post.title);
                        return (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                            className={cn(
                              "w-[255px] sm:w-[265px] lg:w-auto shrink-0 snap-start snap-always transition-all duration-300",
                              hoveredRetrocafeIndex !== null && hoveredRetrocafeIndex !== i
                                ? "opacity-65 scale-[0.98]"
                                : hoveredRetrocafeIndex === i
                                ? "scale-[1.02] z-10"
                                : ""
                            )}
                            onMouseEnter={() => {
                              setHoveredRetrocafeIndex(i);
                              playClickSound();
                              handlePrefetch(targetSlug);
                            }}
                          >
                            <Link
                              to={`/post/${targetSlug}`}
                              className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl border border-white/10 hover:border-orange-400/60 flex flex-col justify-between overflow-hidden cursor-pointer group transition-all duration-300 bg-slate-950 shadow-[0_14px_34px_-10px_rgba(0,0,0,0.75)] hover:shadow-[0_18px_40px_-10px_rgba(249,115,22,0.35)]"
                            >
                              {post.imageUrl && (
                                <img
                                  src={post.imageUrl}
                                  alt={post.title}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#090812] via-[#090812]/55 to-black/35 z-10" />

                              {/* Top Glass Pill Bar */}
                              <div className="relative z-20 p-3.5 flex justify-between items-center">
                                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-retro font-black uppercase tracking-wider bg-orange-500 text-slate-950 shadow">
                                  EPISÓDIO #0{i + 1}
                                </span>
                                <span className="text-[9px] font-mono text-slate-200 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/10">
                                  {calculateReadingTime(post.content || "").replace(
                                    " min de leitura",
                                    " MIN"
                                  )}
                                </span>
                              </div>

                              {/* Bottom Poster Content */}
                              <div className="relative z-20 p-4 mt-auto flex flex-col gap-1.5">
                                <span className="text-[10px] font-mono text-orange-300/90 uppercase tracking-wider">
                                  {formatDate(post.createdAt, post.date ?? undefined)}
                                </span>

                                {mainTitle ? (
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-retro font-black uppercase text-[10px] sm:text-[11px] tracking-wider text-orange-400 drop-shadow">
                                      {mainTitle}
                                    </span>
                                    <h3 className="font-retro font-bold uppercase text-xs sm:text-[13px] text-white leading-snug [text-wrap:balance] group-hover:text-orange-200 transition-colors drop-shadow">
                                      {subtitle}
                                    </h3>
                                  </div>
                                ) : (
                                  <h3 className="font-retro font-bold uppercase text-xs sm:text-[13px] text-white leading-snug [text-wrap:balance] group-hover:text-orange-200 transition-colors drop-shadow">
                                    {subtitle}
                                  </h3>
                                )}

                                <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-white/10 text-[10px] font-mono text-slate-300">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3 text-orange-400" />
                                    {formatNumber(post.views || 0)} views
                                  </span>
                                  <span className="text-orange-400 font-retro font-bold group-hover:translate-x-0.5 transition-transform">
                                    LER →
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })
                    ) : null}
                  </div>
                </div>
              </div>

              {/* ── COLEÇÃO 2: DOSSIÊS (ARQUIVOS CONFIDENCIAIS CYBER-EDITORIAL) ── */}
              <div
                className={cn(
                  "order-3 lg:order-none p-4 sm:p-6 rounded-2xl sm:rounded-3xl border relative overflow-hidden transition-all duration-300 flex flex-col gap-4 sm:gap-5 z-10 lg:flex-1",
                  isDark
                    ? "bg-[#110f22]/90 border-white/[0.08] text-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.75)]"
                    : "bg-white border-slate-200/80 text-slate-900 shadow-lg"
                )}
                onMouseLeave={() => setHoveredDossieIndex(null)}
              >
                <MagazineBackdrop tone="sky" />

                {/* Header */}
                <div className="flex items-start justify-between relative z-10 gap-2 sm:gap-3">
                  <div
                    className="cursor-pointer group/title min-w-0 flex-1"
                    onClick={() => goToCategory("Dossiê")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 shadow-[0_0_20px_rgba(56,189,248,0.15)]">
                        {getCategoryIcon("Dossiê", 20)}
                      </div>
                      <h2 className="mag-title mag-title-sky font-retro text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wide leading-none group-hover/title:text-sky-200 transition-colors">
                        Dossiês
                      </h2>
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.14em] sm:tracking-[0.2em] mt-1 pl-12 sm:pl-[52px] text-slate-400">
                      Documentários & Lore de Franquias
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => goToCategory("Dossiê")}
                    className="mt-1 sm:mt-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/25 text-[10px] font-retro font-bold uppercase tracking-wider text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer shrink-0 transition-all"
                  >
                    Ver todos <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Cards Dossiês */}
                <div className="relative group/scroll-container w-full z-10">
                  <div
                    ref={dossieRef}
                    onScroll={() => updateScrollState(dossieRef, setDossieScroll)}
                    className="flex lg:grid overflow-x-auto lg:overflow-x-visible lg:grid-cols-3 gap-3.5 sm:gap-4 pb-1 lg:pb-0 scrollbar-hide snap-x snap-mandatory w-full"
                  >
                    {isLoadingDossies ? (
                      [1, 2, 3].map((idx) => (
                        <PostSkeleton key={idx} isDark={isDark} variant="compact" />
                      ))
                    ) : displayDossie.length > 0 ? (
                      displayDossie.map((post, i) => {
                        const targetSlug = post.slug || slugify(post.title);
                        const { mainTitle, subtitle } = splitTitle(post.title);
                        return (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                            className={cn(
                              "w-[255px] sm:w-[265px] lg:w-auto shrink-0 snap-start snap-always transition-all duration-300",
                              hoveredDossieIndex !== null && hoveredDossieIndex !== i
                                ? "opacity-65 scale-[0.98]"
                                : hoveredDossieIndex === i
                                ? "scale-[1.02] z-10"
                                : ""
                            )}
                            onMouseEnter={() => {
                              setHoveredDossieIndex(i);
                              playClickSound();
                              handlePrefetch(targetSlug);
                            }}
                          >
                            <Link
                              to={`/post/${targetSlug}`}
                              className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl border border-white/10 hover:border-sky-400/60 flex flex-col justify-between overflow-hidden cursor-pointer group transition-all duration-300 bg-slate-950 shadow-[0_14px_34px_-10px_rgba(0,0,0,0.75)] hover:shadow-[0_18px_40px_-10px_rgba(56,189,248,0.35)]"
                            >
                              {post.imageUrl && (
                                <img
                                  src={post.imageUrl}
                                  alt={post.title}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#090812] via-[#090812]/55 to-black/35 z-10" />

                              <div className="relative z-20 p-3.5 flex justify-end items-center">
                                <span className="text-[9px] font-mono text-slate-200 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/10">
                                  {calculateReadingTime(post.content || "").replace(
                                    " min de leitura",
                                    " MIN"
                                  )}
                                </span>
                              </div>

                              <div className="relative z-20 p-4 mt-auto flex flex-col gap-1.5">
                                <span className="text-[10px] font-mono text-sky-300/90 uppercase tracking-wider">
                                  {formatDate(post.createdAt, post.date ?? undefined)}
                                </span>

                                {mainTitle ? (
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-retro font-black uppercase text-[10px] sm:text-[11px] tracking-wider text-sky-400 drop-shadow">
                                      {mainTitle}
                                    </span>
                                    <h3 className="font-retro font-bold uppercase text-xs sm:text-[13px] text-white leading-snug [text-wrap:balance] group-hover:text-sky-200 transition-colors drop-shadow">
                                      {subtitle}
                                    </h3>
                                  </div>
                                ) : (
                                  <h3 className="font-retro font-bold uppercase text-xs sm:text-[13px] text-white leading-snug [text-wrap:balance] group-hover:text-sky-200 transition-colors drop-shadow">
                                    {subtitle}
                                  </h3>
                                )}

                                <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-white/10 text-[10px] font-mono text-slate-300">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3 text-sky-400" />
                                    {formatNumber(post.views || 0)} views
                                  </span>
                                  <span className="text-sky-400 font-retro font-bold group-hover:translate-x-0.5 transition-transform">
                                    LER →
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* ── DIREITA (1/3): VEREDITO / REVIEWS ── */}
            <div className="order-1 lg:order-none flex flex-col gap-5 lg:contents">
              <div
                className={cn(
                  "p-4 sm:p-6 rounded-2xl sm:rounded-3xl border relative overflow-hidden transition-all duration-300 flex flex-col gap-4 sm:gap-5 z-10 lg:col-span-1 lg:h-full",
                  isDark
                    ? "bg-[#110f22]/90 border-white/[0.08] text-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.75)]"
                    : "bg-white border-slate-200/80 text-slate-900 shadow-lg"
                )}
                onMouseLeave={() => setHoveredReviewsIndex(null)}
              >
                <MagazineBackdrop tone="amber" />

                {/* Header */}
                <div className="flex items-start justify-between relative z-10 gap-2 sm:gap-3">
                  <div
                    className="cursor-pointer group/title min-w-0 flex-1"
                    onClick={() => goToCategory("Reviews")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                        {getCategoryIcon("Reviews", 20)}
                      </div>
                      <h2 className="mag-title mag-title-amber font-retro text-xl sm:text-2xl md:text-3xl lg:max-xl:text-2xl font-black uppercase tracking-wide leading-none group-hover/title:text-amber-200 transition-colors">
                        Reviews
                      </h2>
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.14em] sm:tracking-[0.2em] lg:max-xl:tracking-[0.12em] mt-1 pl-12 sm:pl-[52px] text-slate-400">
                      Vereditos & Notas Oficiais
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => goToCategory("Reviews")}
                    title="Ver todas as reviews"
                    className="mt-1 sm:mt-1.5 px-3 py-1.5 lg:max-xl:p-0 lg:max-xl:w-8 lg:max-xl:h-8 lg:max-xl:justify-center rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-[10px] font-retro font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer shrink-0 transition-all"
                  >
                    <span className="lg:max-xl:sr-only">Ver todos</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Cards Reviews — Full-Bleed Cinematic Banners */}
                <div className="relative group/scroll-container w-full lg:flex-1 lg:flex lg:flex-col z-10">
                  <div
                    ref={reviewsRef}
                    onScroll={() => updateScrollState(reviewsRef, setReviewsScroll)}
                    className="flex lg:flex lg:flex-col gap-3.5 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0 snap-x snap-mandatory scrollbar-hide w-full lg:flex-1"
                  >
                    {isLoadingReviews ? (
                      [1, 2, 3, 4, 5].map((idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "w-full h-[112px] animate-pulse rounded-2xl border shrink-0",
                            isDark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-slate-100"
                          )}
                        />
                      ))
                    ) : displayReviews.length > 0 ? (
                      displayReviews.map((post, i) => {
                        const targetSlug = post.slug || slugify(post.title);
                        const isHovered = hoveredReviewsIndex === i;
                        const { mainTitle, subtitle } = splitTitle(post.title);

                        return (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                            className="w-[270px] sm:w-[300px] lg:w-full h-[152px] lg:h-0 lg:flex-1 lg:min-h-[112px] shrink-0 snap-start snap-always transition-all duration-300 relative"
                            onMouseEnter={() => {
                              setHoveredReviewsIndex(i);
                              playEjectSound();
                              handlePrefetch(targetSlug);
                            }}
                          >
                            <Link
                              to={`/post/${targetSlug}`}
                              className={cn(
                                "relative w-full h-full flex flex-col justify-between p-3.5 sm:p-4 overflow-hidden cursor-pointer rounded-2xl border transition-all duration-300 group bg-[#141226]",
                                isDark ? "border-white/[0.1]" : "border-slate-200/90",
                                isHovered
                                  ? "border-amber-400/60 shadow-[0_14px_34px_-8px_rgba(245,158,11,0.35)] -translate-y-0.5"
                                  : "shadow-[0_10px_26px_-10px_rgba(0,0,0,0.75)]"
                              )}
                            >
                              {/* Full-Bleed Artwork with Rich Cinematic Vignette */}
                              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-[#16142b] to-[#090812]" />
                              {post.imageUrl && (
                                <img
                                  src={post.imageUrl}
                                  alt={post.title}
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#090812] via-[#090812]/70 to-black/30 z-10" />
                              <div className="absolute inset-0 bg-gradient-to-r from-[#090812]/90 via-[#090812]/45 to-transparent z-10" />

                              {/* Top Row: Veredito Pill + Score Badge */}
                              <div className="relative z-20 flex items-center justify-between gap-2 w-full">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[8px] font-mono font-bold uppercase tracking-widest text-amber-300">
                                  <span
                                    className={cn(
                                      "w-1.5 h-1.5 rounded-full",
                                      isHovered ? "bg-amber-400 animate-ping" : "bg-amber-400"
                                    )}
                                  />
                                  Veredito Begins
                                </span>

                                {post.score && (
                                  <div
                                    className={cn(
                                      "inline-flex items-center gap-1 text-slate-950 px-2.5 py-0.5 rounded-full font-retro font-black text-xs bg-gradient-to-r from-amber-300 to-yellow-400 shadow-[0_4px_14px_rgba(0,0,0,0.6)] transition-transform duration-300 shrink-0",
                                      isHovered ? "scale-105" : ""
                                    )}
                                  >
                                    ★ {post.score}
                                  </div>
                                )}
                              </div>

                              {/* Bottom Row: Full-Width Title & Subtitle */}
                              <div className="relative z-20 mt-auto w-full pt-2">
                                {mainTitle ? (
                                  <div className="flex flex-col gap-0.5">
                                    <h4 className="font-retro font-black text-xs sm:text-sm leading-tight uppercase text-amber-300 group-hover:text-amber-200 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                                      {mainTitle}
                                    </h4>
                                    <span className="font-sans font-semibold text-xs leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                                      {subtitle}
                                    </span>
                                  </div>
                                ) : (
                                  <h4 className="font-retro font-bold text-xs sm:text-sm leading-snug uppercase text-white group-hover:text-amber-300 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                                    {subtitle}
                                  </h4>
                                )}
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
