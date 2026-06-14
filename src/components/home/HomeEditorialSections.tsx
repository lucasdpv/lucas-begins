"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Coffee, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@/lib/router-compat";
import { usePostsByCategory } from "../../features/posts/hooks/usePostsQuery";
import { Post } from "../../features/posts/schemas";
import { PostService } from "../../services/postService";
import { cn, calculateReadingTime, formatDate, formatNumber, slugify, splitTitle } from "../../lib/utils";

type Props = {
  isDark: boolean;
};

type ScrollState = {
  left: boolean;
  right: boolean;
};

function CategoryCard({
  post,
  index,
  isDark,
  label,
  themeClass,
  onPrefetch,
}: {
  post: Post;
  index: number;
  isDark: boolean;
  label: string;
  themeClass: {
    card: string;
    accent: string;
    tag: string;
    glow: string;
    hoverShadow: string;
  };
  onPrefetch: (slug: string) => void;
}) {
  const targetSlug = post.slug || slugify(post.title);
  const { mainTitle, subtitle } = splitTitle(post.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
      className="w-[280px] sm:w-[260px] md:w-[280px] lg:w-auto shrink-0 snap-start snap-always"
      onMouseEnter={() => onPrefetch(targetSlug)}
    >
      <Link
        to={`/post/${targetSlug}`}
        className={cn(
          "relative h-[340px] overflow-hidden border-2 border-black flex flex-col justify-between rounded-none p-4 transition-all duration-300 text-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px]",
          themeClass.card,
          themeClass.hoverShadow
        )}
      >
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
        <div className="absolute inset-0 scanline-overlay opacity-20 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-white/75">
          <span>{label}</span>
          <span>{formatDate(post.createdAt, post.date ?? undefined)}</span>
        </div>

        <div className="relative z-10 mt-auto">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 border border-black bg-white/85 text-black text-[9px] font-black uppercase tracking-wider">
            {themeClass.tag}
          </div>

          <div className="mt-3">
            {mainTitle ? (
              <div className="flex flex-col gap-0.5">
                <span className={cn("text-[10px] font-black uppercase tracking-wider", themeClass.accent)}>
                  {mainTitle}
                </span>
                <h3 className="font-retro font-black uppercase text-base leading-tight line-clamp-3 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {subtitle}
                </h3>
              </div>
            ) : (
              <h3 className="font-retro font-black uppercase text-lg leading-tight line-clamp-3 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {subtitle}
              </h3>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-white/15 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-white/70">
            <span>{calculateReadingTime(post.content || "").replace(" min de leitura", " MIN")}</span>
            <span>{formatNumber(post.views || 0)} views</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SectionBlock({
  title,
  subtitle,
  accentClass,
  emptyLabel,
  posts,
  isLoading,
  isDark,
  scrollRef,
  scrollState,
  onScroll,
  onScrollContainer,
  onPrefetch,
  hoveredIndex,
  setHoveredIndex,
  themeClass,
}: {
  title: string;
  subtitle: string;
  accentClass: string;
  emptyLabel: string;
  posts: Post[];
  isLoading: boolean;
  isDark: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  scrollState: ScrollState;
  onScroll: () => void;
  onScrollContainer: (direction: "left" | "right") => void;
  onPrefetch: (slug: string) => void;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  themeClass: {
    card: string;
    accent: string;
    tag: string;
    glow: string;
    hoverShadow: string;
  };
}) {
  return (
    <section className={cn("px-4 pb-4 pt-5 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] relative overflow-hidden transition-all duration-300 flex flex-col gap-3 rounded-none z-10", isDark ? "bg-[#1f1d35] text-gray-100" : "bg-white text-gray-900")}>
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className={cn("w-1.5 self-stretch rounded-none shrink-0", accentClass)} />
          <div>
            <h2 className={cn("font-retro text-xl md:text-2xl font-black uppercase tracking-wide leading-none", isDark ? "text-white" : "text-snes-accent")}>
              {title}
            </h2>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-0.5 text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end font-mono text-[8px] text-slate-500 select-none text-right">
          <span className="font-bold tracking-wider">[ SECTION ONLINE ]</span>
          <span className="opacity-60">READY</span>
        </div>
      </div>

      <div className="relative group/scroll-container w-full z-10">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex lg:grid overflow-x-auto lg:overflow-x-visible lg:grid-cols-3 gap-4 pb-4 lg:pb-0 scrollbar-hide snap-x snap-mandatory w-full pt-2 lg:items-start"
        >
          {isLoading ? (
            [1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={cn(
                  "w-[280px] sm:w-[260px] md:w-[280px] lg:w-auto h-[340px] animate-pulse border-2 border-dashed rounded-none shrink-0 snap-start snap-always",
                  isDark ? "border-white/10 bg-gray-900" : "border-black/10 bg-gray-100"
                )}
              />
            ))
          ) : posts.length > 0 ? (
            posts.map((post, i) => (
              <div
                key={post.id}
                className={cn(
                  "relative transition-all duration-300",
                  hoveredIndex !== null && hoveredIndex !== i ? "opacity-55 scale-[0.98]" : hoveredIndex === i ? "scale-[1.02] z-10" : ""
                )}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <CategoryCard
                  post={post}
                  index={i}
                  isDark={isDark}
                  label={title.toUpperCase()}
                  onPrefetch={onPrefetch}
                  themeClass={themeClass}
                />
              </div>
            ))
          ) : (
            <div className={cn("col-span-3 p-8 rounded-none border-2 border-dashed flex flex-col items-center justify-center min-h-[140px] text-center gap-3", isDark ? "bg-[#1f1d35] text-slate-400 border-white/10" : "bg-white text-slate-500 border-black/10")}>
              <FolderOpen className="w-8 h-8 opacity-40 animate-pulse text-blue-500" />
              <span className="text-xs font-retro uppercase tracking-wider font-bold">{emptyLabel}</span>
            </div>
          )}
        </div>

        {scrollState.left && (
          <button
            onClick={() => onScrollContainer("left")}
            className="absolute left-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 flex lg:hidden items-center justify-center w-8 h-8 rounded-full bg-black/70 dark:bg-black/90 text-white border border-white/20 active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-black/80"
            aria-label="Deslizar esquerda"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}
        {scrollState.right && (
          <button
            onClick={() => onScrollContainer("right")}
            className="absolute right-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 flex lg:hidden items-center justify-center w-8 h-8 rounded-full bg-black/70 dark:bg-black/90 text-white border border-white/20 active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-black/80"
            aria-label="Deslizar direita"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </section>
  );
}

export default function HomeEditorialSections({ isDark }: Props) {
  const queryClient = useQueryClient();
  const retrocafeRef = useRef<HTMLDivElement>(null);
  const dossieRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [retrocafeScroll, setRetrocafeScroll] = useState<ScrollState>({ left: false, right: true });
  const [dossieScroll, setDossieScroll] = useState<ScrollState>({ left: false, right: true });
  const [reviewsScroll, setReviewsScroll] = useState<ScrollState>({ left: false, right: true });
  const [hoveredRetrocafeIndex, setHoveredRetrocafeIndex] = useState<number | null>(null);
  const [hoveredDossieIndex, setHoveredDossieIndex] = useState<number | null>(null);
  const [hoveredReviewsIndex, setHoveredReviewsIndex] = useState<number | null>(null);

  const { data: retrocafePosts = [], isLoading: isLoadingRetrocafe } = usePostsByCategory("RetroCafé", 3, true);
  const { data: dossiePosts = [], isLoading: isLoadingDossies } = usePostsByCategory("Dossiês", 3, true);
  const { data: reviewPosts = [], isLoading: isLoadingReviews } = usePostsByCategory("Reviews", 5, true);

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

  const updateScrollState = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>, setScroll: React.Dispatch<React.SetStateAction<ScrollState>>) => {
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

  const scrollContainer = useCallback((ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateScrollState(retrocafeRef, setRetrocafeScroll);
      updateScrollState(dossieRef, setDossieScroll);
      updateScrollState(reviewsRef, setReviewsScroll);
    }, 250);

    const handleResize = () => {
      updateScrollState(retrocafeRef, setRetrocafeScroll);
      updateScrollState(dossieRef, setDossieScroll);
      updateScrollState(reviewsRef, setReviewsScroll);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateScrollState]);

  const retroTheme = {
    card: isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900",
    accent: "text-orange-400",
    tag: "RetroCafé",
    glow: "shadow-[8px_8px_0px_rgba(249,115,22,1)]",
    hoverShadow: "hover:shadow-[8px_8px_0px_rgba(249,115,22,1)]",
  };

  const dossieTheme = {
    card: isDark ? "bg-[#1f1d35] text-gray-100" : "bg-white text-gray-900",
    accent: "text-blue-400",
    tag: "Dossiê",
    glow: "shadow-[8px_8px_0px_rgba(59,130,246,1)]",
    hoverShadow: "hover:shadow-[8px_8px_0px_rgba(59,130,246,1)]",
  };

  const reviewTheme = {
    card: isDark ? "bg-[#141226] text-white" : "bg-white text-zinc-900",
    accent: "text-yellow-400",
    tag: "Review",
    glow: "shadow-[8px_8px_0px_rgba(234,179,8,1)]",
    hoverShadow: "hover:shadow-[8px_8px_0px_rgba(234,179,8,1)]",
  };

  return (
    <section className="flex flex-col gap-6">
      <SectionBlock
        title="RetroCafé"
        subtitle="No Slot"
        accentClass="bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.7)]"
        emptyLabel="Nenhum cartucho de RetroCafé inserido no slot"
        posts={retrocafePosts.slice(0, 3)}
        isLoading={isLoadingRetrocafe}
        isDark={isDark}
        scrollRef={retrocafeRef}
        scrollState={retrocafeScroll}
        onScroll={() => updateScrollState(retrocafeRef, setRetrocafeScroll)}
        onScrollContainer={(direction) => scrollContainer(retrocafeRef, direction)}
        onPrefetch={handlePrefetch}
        hoveredIndex={hoveredRetrocafeIndex}
        setHoveredIndex={setHoveredRetrocafeIndex}
        themeClass={retroTheme}
      />

      <SectionBlock
        title="Dossiês"
        subtitle="Reportagens Especiais"
        accentClass="bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]"
        emptyLabel="Nenhum dossiê secreto decodificado até o momento"
        posts={dossiePosts.slice(0, 3)}
        isLoading={isLoadingDossies}
        isDark={isDark}
        scrollRef={dossieRef}
        scrollState={dossieScroll}
        onScroll={() => updateScrollState(dossieRef, setDossieScroll)}
        onScrollContainer={(direction) => scrollContainer(dossieRef, direction)}
        onPrefetch={handlePrefetch}
        hoveredIndex={hoveredDossieIndex}
        setHoveredIndex={setHoveredDossieIndex}
        themeClass={dossieTheme}
      />

      <SectionBlock
        title="Reviews"
        subtitle="Análises com Nota"
        accentClass="bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.7)]"
        emptyLabel="Sem Reviews recentes"
        posts={reviewPosts.slice(0, 5)}
        isLoading={isLoadingReviews}
        isDark={isDark}
        scrollRef={reviewsRef}
        scrollState={reviewsScroll}
        onScroll={() => updateScrollState(reviewsRef, setReviewsScroll)}
        onScrollContainer={(direction) => scrollContainer(reviewsRef, direction)}
        onPrefetch={handlePrefetch}
        hoveredIndex={hoveredReviewsIndex}
        setHoveredIndex={setHoveredReviewsIndex}
        themeClass={reviewTheme}
      />
    </section>
  );
}
