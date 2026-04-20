import React, { useMemo } from "react";
import { Gamepad2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Carousel from "../components/ui/Carousel";
import PostCard from "../components/ui/PostCard";
import PostSkeleton from "../components/ui/PostSkeleton";
import { useAppContext } from "../context/AppContext";
import { cn } from "../lib/utils";

export default function HomePage() {
  const { isDark, posts, isLoadingPosts, activeCategory, searchQuery } = useAppContext();
  const navigate = useNavigate();

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCat = activeCategory === "Todos" || post.category === activeCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const trendingPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);
  }, [posts]);

  const onPostClick = (post) => navigate(`/post/${post.id}`);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <Helmet>
        <title>Lucas Begins | Seu Portal Retro</title>
        <meta name="description" content="Sua revista digital para a era de ouro dos videogames." />
      </Helmet>

      {/* Coluna principal */}
      <div className="lg:col-span-3">
        {/* Carrossel Em Destaque */}
        {activeCategory === "Todos" && searchQuery === "" && (
          <section className="mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className={cn("w-4 h-8 retro-card", isDark ? "bg-purple-500" : "bg-purple-600")} />
              <h2 className="font-retro text-2xl md:text-3xl font-bold uppercase tracking-wide">
                Em Destaque
              </h2>
            </div>
            <Carousel posts={trendingPosts.slice(0, 5)} onPostClick={onPostClick} isDark={isDark} />
          </section>
        )}

        {/* Grid de Posts */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className={cn("w-4 h-8 retro-card", isDark ? "bg-blue-500" : "bg-blue-600")} />
            <h2 className="font-retro text-2xl md:text-3xl font-bold uppercase tracking-wide">
              {isLoadingPosts 
                ? "Carregando Fases..."
                : searchQuery
                ? `Resultados: "${searchQuery}"`
                : activeCategory === "Todos"
                ? "Últimas Notícias"
                : `Filtrando: ${activeCategory}`}
            </h2>
          </div>

          {isLoadingPosts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => <PostSkeleton key={i} isDark={isDark} />)}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} onClick={() => onPostClick(post)} />
              ))}
            </div>
          ) : (
            <div className={cn("p-12 text-center rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-gray-100")}>
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
        <div className={cn("p-6 rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-white")}>
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
      </aside>
    </div>
  );
}
