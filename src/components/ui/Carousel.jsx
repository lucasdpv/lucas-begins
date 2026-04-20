import React, { useState, useEffect } from "react";

/**
 * Carrossel automático com autoplay a cada 6 segundos.
 * Exibe os posts em destaque na home.
 */
export default function Carousel({ posts, onPostClick, isDark }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % posts.length),
      6000
    );
    return () => clearInterval(timer);
  }, [posts.length]);

  if (!posts.length) return null;

  const currentPost = posts[currentIndex];
  const bgStyle = currentPost.imageUrl
    ? {
        backgroundImage: `url(${currentPost.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <div className="relative rounded-3xl overflow-hidden retro-card">
      <div
        className={`w-full h-[400px] md:h-[600px] relative transition-all duration-1000 cursor-pointer ${
          currentPost.imageUrl ? "" : `bg-gradient-to-br ${currentPost.gradient}`
        }`}
        style={bgStyle}
        onClick={() => onPostClick(currentPost)}
      >
        <div className="absolute inset-0 scanline-overlay opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white max-w-5xl">
          <div className="flex gap-3 mb-6">
            <span className="bg-purple-600 font-retro text-xs md:text-sm px-5 py-2.5 rounded-lg uppercase font-bold tracking-widest border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              {currentPost.category}
            </span>
          </div>
          <h3 className="font-retro font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight hover:text-purple-400 transition-colors drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            {currentPost.title}
          </h3>
          <p className="hidden md:block text-gray-200 text-xl font-medium mb-10 line-clamp-2 max-w-3xl drop-shadow-md">
            {currentPost.excerpt}
          </p>
        </div>
      </div>

      {/* Dots de navegação */}
      <div className="absolute bottom-8 right-8 flex gap-4">
        {posts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-3 rounded-full border-2 border-black transition-all duration-500 shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
              idx === currentIndex ? "w-12 bg-purple-500" : "w-4 bg-white/80 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
