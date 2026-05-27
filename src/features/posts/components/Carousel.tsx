import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Heart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { calculateReadingTime, cn, coverBgStyle, formatNumber, slugify } from "../../../lib/utils";
import { CategoryBadge, ScoreBadge } from "../../../components/ui/Badge";
import { Post } from "../schemas";

interface CarouselProps {
  posts: Post[];
  isDark?: boolean;
}

/**
 * Carrossel automático com autoplay, pausa no hover, navegação por teclado.
 * Respeita o campo imagePosition de cada post.
 */
export default function Carousel({ posts }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Touch Swipe Handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prev();
    }
  };

  const currentPost = posts[currentIndex];
  if (!currentPost) return null;

  const bgStyle = coverBgStyle(currentPost.imageUrl, currentPost.imagePosition);

  return (
    <div
      className="relative rounded-none border-2 border-black overflow-hidden retro-card group/carousel select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide Content */}
      <div
        className={cn(
          "w-full h-[400px] md:h-[560px] relative transition-all duration-700",
          !currentPost.imageUrl && currentPost.gradient && `bg-gradient-to-br ${currentPost.gradient}`
        )}
        style={bgStyle}
      >
        {/* Link Esticado (Stretched Link) - Fica por cima da imagem mas por baixo dos botões de seta */}
        <Link 
          to={`/post/${currentPost.slug || slugify(currentPost.title)}`}
          className="absolute inset-0 z-10"
          aria-label={`Ler matéria: ${currentPost.title}`}
        />

        {/* Scanlines */}
        <div className="absolute inset-0 scanline-overlay opacity-30 group-hover/carousel:opacity-50 transition-opacity z-[5]" />
        
        {/* Deep Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent pointer-events-none z-[5]" />
        
        {/* Content Container */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-16 md:p-12 z-[11] pointer-events-none flex justify-center md:justify-start">
          <div className="max-w-[90%] md:max-w-3xl text-center md:text-left flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2.5 mb-4">
              <CategoryBadge size="sm">{currentPost.category}</CategoryBadge>
              {currentPost.score && (
                <ScoreBadge score={currentPost.score} size="sm" className="translate-y-[-1px] shrink-0" />
              )}
            </div>
            
            <h2 className="font-retro font-bold text-xl md:text-3xl lg:text-4xl leading-tight text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-glow group-hover/carousel:text-purple-300 transition-colors mb-6">
              {currentPost.title}
            </h2>
            
            <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
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
      </div>

      {/* Botões de navegação - Devem estar acima do link (Z-INDEX 20+) */}
      {posts.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-xl bg-black/60 text-white border-2 border-white/20 backdrop-blur-md z-30 transition-all hover:bg-purple-600 hover:border-purple-500 active:scale-90 opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-xl bg-black/60 text-white border-2 border-white/20 backdrop-blur-md z-30 transition-all hover:bg-purple-600 hover:border-purple-500 active:scale-90 opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Dots */}
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
        <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-black/50 text-white text-xs font-retro font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm z-30">
          ⏸ Pausado
        </div>
      )}

      {/* Indicador de progresso de autoplay (barra de progresso) */}
      {posts.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-20 overflow-hidden">
          <div
            key={currentIndex}
            className={cn(
              "h-full bg-purple-500 origin-left transition-all duration-300",
              !isPaused ? "animate-carousel-progress" : "w-0"
            )}
          />
        </div>
      )}
    </div>
  );
}
