import React from "react";
import { Gamepad2, Star } from "lucide-react";
import Carousel from "../components/ui/Carousel";
import PostCard from "../components/ui/PostCard";
import RetroRecommender from "../components/ui/RetroRecommender";

/**
 * Página inicial: carrossel em destaque, grid de posts filtrados e sidebar com trending + IA.
 */
export default function HomePage({
  isDark,
  posts,
  filteredPosts,
  trendingPosts,
  activeCategory,
  searchQuery,
  onPostClick,
  onLike,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Coluna principal */}
      <div className="lg:col-span-3">
        {/* Carrossel Em Destaque */}
        {activeCategory === "Todos" && searchQuery === "" && (
          <section className="mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-4 h-8 retro-card ${isDark ? "bg-purple-500" : "bg-purple-600"}`} />
              <h2 className="font-retro text-2xl md:text-3xl font-bold uppercase tracking-wide">
                Em Destaque
              </h2>
            </div>
            <Carousel posts={posts.slice(0, 5)} onPostClick={onPostClick} isDark={isDark} />
          </section>
        )}

        {/* Grid de Posts */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-4 h-8 retro-card ${isDark ? "bg-blue-500" : "bg-blue-600"}`} />
            <h2 className="font-retro text-2xl md:text-3xl font-bold uppercase tracking-wide">
              {searchQuery
                ? `Resultados: "${searchQuery}"`
                : activeCategory === "Todos"
                ? "Últimas Notícias"
                : `Filtrando: ${activeCategory}`}
            </h2>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => onPostClick(post)}
                  onLike={onLike}
                  isDark={isDark}
                />
              ))}
            </div>
          ) : (
            <div className={`p-12 text-center rounded-2xl retro-card ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="font-retro text-xl mb-2 font-bold">Nenhum artigo encontrado.</p>
              <p className="opacity-70">Tente buscar por outro termo ou categoria.</p>
            </div>
          )}
        </section>
      </div>

      {/* Sidebar */}
      <aside className="hidden lg:block lg:col-span-1 space-y-10">
        {/* Em Alta */}
        <div className={`p-6 rounded-2xl retro-card ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="font-retro font-bold text-xl uppercase mb-6 flex items-center gap-2">
            <Star className="text-yellow-500 w-6 h-6" fill="currentColor" /> Em Alta
          </h3>
          <div className="space-y-5">
            {trendingPosts.map((post, idx) => (
              <div
                key={post.id}
                onClick={() => onPostClick(post)}
                className="flex gap-4 cursor-pointer group border-b last:border-0 pb-4 last:pb-0 dark:border-gray-700"
              >
                <div className="text-3xl font-retro font-bold text-purple-500 opacity-50 group-hover:opacity-100 transition-opacity">
                  0{idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-sm group-hover:text-purple-500 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h4>
                  <span className="text-xs opacity-60 font-retro mt-1 block">{post.likes} curtidas</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guru IA */}
        <RetroRecommender isDark={isDark} />
      </aside>
    </div>
  );
}
