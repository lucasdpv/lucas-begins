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
        
        {/* Deep Gradient Overlay - Improved for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent pointer-events-none" />
        
        {/* Decorative corner lights (Modern/Harmonious touch) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 blur-[120px] pointer-events-none" />

        {/* Content Container - Centered on Mobile to avoid arrows */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-16 md:p-12 z-[2] pointer-events-none flex justify-center md:justify-start">
          <div className="max-w-[75%] md:max-w-3xl pointer-events-auto text-center md:text-left flex flex-col items-center md:items-start">
            <div className="mb-4">
              <CategoryBadge size="sm">{currentPost.category}</CategoryBadge>
            </div>
            
            <h2 className="font-retro font-bold text-xl md:text-3xl lg:text-4xl leading-tight text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-glow group-hover/carousel:text-purple-300 transition-colors mb-6">
              {currentPost.title}
            </h2>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {currentPost.score && <ScoreBadge score={currentPost.score} size="sm" />}
              <span className="h-0.5 w-0.5 rounded-full bg-white/30 hidden md:block" />
              <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-wide text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                 <span className="flex items-center gap-1">
                   <Heart className="w-3 h-3 text-red-400" fill="currentColor" />
                   {currentPost.likes || 0}
                 </span>
                 <span className="flex items-center gap-1">
                   <Clock className="w-3 h-3 text-purple-300" />
                   {calculateReadingTime(currentPost.content || "")}
                 </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de navegação — Prioridade Máxima */}
      {posts.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            tabIndex={0}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-xl bg-black/60 text-white border-2 border-white/20 backdrop-blur-md z-30 transition-all hover:bg-purple-600 hover:border-purple-500 active:scale-90 focus:outline-none opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            tabIndex={0}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-xl bg-black/60 text-white border-2 border-white/20 backdrop-blur-md z-30 transition-all hover:bg-purple-600 hover:border-purple-500 active:scale-90 focus:outline-none opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Dots + barra de progresso — Centralizado no Mobile */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 flex items-center gap-3 z-30">
        {posts.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
            className={cn(
              "h-2 md:h-2.5 rounded-full border border-white/30 transition-all duration-500 shadow-sm",
              idx === currentIndex ? "w-8 md:w-10 bg-purple-500" : "w-2 md:w-2.5 bg-white/60 hover:bg-white"
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
