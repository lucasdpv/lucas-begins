import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Heart, Clock } from "lucide-react";
import { calculateReadingTime, cn, coverBgStyle } from "../../lib/utils";
import { CategoryBadge, ScoreBadge } from "./Badge";

/**
 * Carrossel automático com autoplay, pausa no hover, navegação por teclado.
 * Respeita o campo imagePosition de cada post.
 */
export default function Carousel({ posts, onPostClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % posts.length);
  }, [posts.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
  }, [posts.length]);

  // Autoplay com pausa no hover
  useEffect(() => {
    if (isPaused || posts.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPaused, next, posts.length]);

  // Navegação por teclado
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const currentPost = posts[currentIndex];
  if (!currentPost) return null;

  const bgStyle = coverBgStyle(currentPost.imageUrl, currentPost.imagePosition);

  return (
    <div
      className="relative rounded-3xl overflow-hidden retro-card group/carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide */}
      <div
        className={cn(
          "w-full h-[400px] md:h-[560px] relative cursor-pointer transition-all duration-700",
          !currentPost.imageUrl && `bg-gradient-to-br ${currentPost.gradient}`
        )}
        style={bgStyle}
        onClick={() => onPostClick(currentPost)}
      >
        {/* Scanlines */}
        <div className="absolute inset-0 scanline-overlay opacity-30 group-hover/carousel:opacity-50 transition-opacity" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 text-white max-w-5xl">
          <div className="flex gap-3 mb-4">
            <CategoryBadge size="md">{currentPost.category}</CategoryBadge>
            {currentPost.score && <ScoreBadge score={currentPost.score} size="md" />}
          </div>

          <h2 className="font-retro font-bold text-3xl md:text-5xl lg:text-6xl mb-4 leading-tight drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:text-purple-300 transition-colors">
            {currentPost.title}
          </h2>

          <p className="hidden md:block text-gray-200 text-lg font-medium mb-6 line-clamp-2 max-w-3xl drop-shadow-md">
            {currentPost.excerpt}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-5 text-sm text-gray-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-400" fill="currentColor" />
              {currentPost.likes || 0}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-300" />
              {calculateReadingTime(currentPost.content || "")}
            </span>
          </div>
        </div>
      </div>

      {/* Botões de navegação — aparecem no hover */}
      {posts.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            tabIndex={0}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-black/50 text-white border-2 border-white/20 backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 transition-all hover:bg-purple-600 hover:border-purple-500 focus:bg-purple-600 focus:border-purple-500 focus:outline-none retro-button"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            tabIndex={0}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-black/50 text-white border-2 border-white/20 backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 transition-all hover:bg-purple-600 hover:border-purple-500 focus:bg-purple-600 focus:border-purple-500 focus:outline-none retro-button"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots + barra de progresso */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3">
        {posts.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
            className={cn(
              "h-2.5 rounded-full border border-white/30 transition-all duration-500 shadow-sm",
              idx === currentIndex ? "w-10 bg-purple-500" : "w-2.5 bg-white/60 hover:bg-white"
            )}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Indicador de pausa */}
      {isPaused && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-black/50 text-white text-xs font-retro font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
          ⏸ Pausado
        </div>
      )}
    </div>
  );
}
