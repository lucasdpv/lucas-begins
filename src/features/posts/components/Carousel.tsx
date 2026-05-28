import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Heart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { calculateReadingTime, cn, coverBgStyle, formatNumber, slugify } from "../../../lib/utils";
import { CategoryBadge, ScoreBadge } from "../../../components/ui/Badge";
import { Post } from "../schemas";

interface CarouselProps {
  posts: Post[];
  isDark?: boolean;
}

const AUTOPLAY_INTERVAL = 6000;

/**
 * Carrossel premium com transição animada (framer-motion crossfade + slide),
 * strip de thumbnails de prévia, barra de progresso segmentada, swipe e teclado.
 */
export default function Carousel({ posts }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const goTo = useCallback((idx: number, dir?: number) => {
    setDirection(dir ?? (idx > currentIndex ? 1 : -1));
    setCurrentIndex(idx);
    setProgress(0);
  }, [currentIndex]);

  const next = useCallback(() => {
    const nextIdx = (currentIndex + 1) % posts.length;
    goTo(nextIdx, 1);
  }, [currentIndex, posts.length, goTo]);

  const prev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + posts.length) % posts.length;
    goTo(prevIdx, -1);
  }, [currentIndex, posts.length, goTo]);

  // Progress ticker
  useEffect(() => {
    if (isPaused || posts.length <= 1) {
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }
    setProgress(0);
    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + (100 / (AUTOPLAY_INTERVAL / 50));
      });
    }, 50);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [isPaused, next, posts.length, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const dist = touchStart.current - touchEnd.current;
    if (dist > 50) next();
    else if (dist < -50) prev();
  };

  const currentPost = posts[currentIndex];
  if (!currentPost) return null;

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden group/carousel select-none border-2 border-black dark:border-purple-500/20 shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_rgba(168,85,247,0.15)] glass-card"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide area */}
      <div className="relative w-full h-[400px] md:h-[560px] overflow-hidden bg-gray-950">
        <AnimatePresence custom={direction} initial={false} mode="sync">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
            style={coverBgStyle(currentPost.imageUrl, currentPost.imagePosition)}
          >
            {/* Stretched link */}
            <Link
              to={`/post/${currentPost.slug || slugify(currentPost.title)}`}
              className="absolute inset-0 z-10"
              aria-label={`Ler matéria: ${currentPost.title}`}
            />

            {/* Scanlines */}
            <div className="absolute inset-0 scanline-overlay opacity-20 group-hover/carousel:opacity-35 transition-opacity z-[5]" />

            {/* Cinematic gradient: stronger at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/55 to-transparent pointer-events-none z-[5]" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 via-transparent to-transparent pointer-events-none z-[5]" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-5 md:p-10 md:pb-8 z-[11] pointer-events-none">
              <div className="max-w-2xl flex flex-col items-start">
                <div className="flex items-center gap-2.5 mb-3">
                  <CategoryBadge size="sm">{currentPost.category}</CategoryBadge>
                  {currentPost.score && (
                    <ScoreBadge score={currentPost.score} size="sm" className="translate-y-[-1px] shrink-0" />
                  )}
                </div>

                <h2 className="font-retro font-bold text-xl md:text-3xl lg:text-4xl leading-tight text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-glow group-hover/carousel:text-purple-300 transition-colors mb-3">
                  {currentPost.title}
                </h2>

                {currentPost.excerpt && (
                  <p className="text-xs md:text-sm text-white/70 leading-relaxed line-clamp-2 mb-4 max-w-xl drop-shadow-md">
                    {currentPost.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-red-400 shrink-0" fill="currentColor" />
                    {formatNumber(currentPost.likes || 0)}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/30 shrink-0" />
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                    {calculateReadingTime(currentPost.content || "")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav buttons */}
        {posts.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-2.5 rounded-xl bg-black/60 text-white border border-white/20 backdrop-blur-md z-30 transition-all hover:bg-purple-600 hover:border-purple-500 active:scale-90 opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-2.5 rounded-xl bg-black/60 text-white border border-white/20 backdrop-blur-md z-30 transition-all hover:bg-purple-600 hover:border-purple-500 active:scale-90 opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}
        {/* Slide Indicators & Progress (Bottom-Right overlay) */}
        {posts.length > 1 && (
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-10 z-30 flex items-center gap-2.5 bg-black/40 px-3.5 py-2 rounded-2xl backdrop-blur-md border border-white/10">
            {posts.map((post, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={post.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(idx, idx > currentIndex ? 1 : -1);
                  }}
                  className={cn(
                    "relative h-1.5 rounded-full overflow-hidden transition-all duration-300 focus:outline-none cursor-pointer",
                    isActive ? "w-8 bg-white/20" : "w-3 bg-white/40 hover:bg-white/60"
                  )}
                  aria-label={`Ir para slide ${idx + 1}`}
                >
                  {isActive && (
                    <div
                      className="absolute inset-y-0 left-0 bg-purple-400 transition-none"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pause indicator */}
      {isPaused && posts.length > 1 && (
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[10px] font-retro font-bold uppercase tracking-wider border border-white/15 backdrop-blur-sm z-30">
          ⏸ Pausado
        </div>
      )}
    </div>
  );
}
