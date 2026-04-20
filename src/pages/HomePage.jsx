import React, { useMemo } from "react";
import { Gamepad2, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Carousel from "../components/ui/Carousel";
import PostCard from "../components/ui/PostCard";
import PostSkeleton from "../components/ui/PostSkeleton";
import { useAppContext } from "../context/AppContext";
import { cn } from "../lib/utils";

export default function HomePage() {
  const { isDark, posts, isLoadingPosts, activeCategory, searchQuery, loadMore, hasMore } = useAppContext();
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

  const onPostClick = (post) => {
    // Fallback: se o slug ainda não existir na memória, gera um temporário p/ a URL não quebrar
    const targetSlug = post.slug || slugify(post.title);
    navigate(`/post/${targetSlug}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <Helmet>
        <title>Lucas Begins | Seu Portal Retro</title>
        <meta name="description" content="Sua revista digital para a era de ouro dos videogames." />
      </Helmet>

      {/* Coluna principal */}
      <div className="lg:col-span-3">
        {/* Carrossel Em Destaque */}
        {!isLoadingPosts && activeCategory === "Todos" && searchQuery === "" && posts.length > 0 && (
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
            <div className={cn("p-12 text-center rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-white border-2 border-black")}>
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-50 text-purple-500" />
              <p className="font-retro text-xl mb-2 font-bold uppercase">Nenhum artigo encontrado.</p>
              <p className="opacity-70 font-medium tracking-tight">Tente buscar por outro termo ou categoria.</p>
            </div>
          )}

          {/* Botão Carregar Mais / Próxima Fase */}
          {hasMore && !isLoadingPosts && searchQuery === "" && activeCategory === "Todos" && (
            <div className="mt-16 flex justify-center">
              <button
                onClick={loadMore}
                className={cn(
                  "group relative flex items-center gap-4 px-10 py-5 rounded-2xl font-retro text-xl font-bold uppercase tracking-widest transition-all retro-button border-4",
                  isDark 
                    ? "bg-gray-800 border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white" 
                    : "bg-white border-black text-black hover:bg-black hover:text-white"
                )}
              >
                Próxima Fase
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Sidebar */}
      <aside className="hidden lg:block lg:col-span-1">
        {/* Em Alta */}
        {!isLoadingPosts && activeCategory === "Todos" && searchQuery === "" && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Star className="text-yellow-500 w-6 h-6" fill="currentColor" />
              <h2 className="font-retro text-2xl font-bold uppercase tracking-wide">
                Em Alta
              </h2>
            </div>
            
            <div className={cn("p-6 rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-white")}>
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
          </section>
        )}
      </aside>
    </div>
  );
}
