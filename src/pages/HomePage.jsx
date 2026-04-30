import React, { useMemo, useEffect, useRef } from "react";
import { Gamepad2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Carousel from "../components/ui/Carousel";
import PostCard from "../components/ui/PostCard";
import PostSkeleton from "../components/ui/PostSkeleton";
import { useAppContext } from "../context/AppContext";
import { cn, slugify } from "../lib/utils";

export default function HomePage() {
  const { isDark, posts, isLoadingPosts, isFetchingMore, activeCategory, searchQuery, loadMore, hasMore } = useAppContext();
  const navigate = useNavigate();
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingPosts && searchQuery === "" && activeCategory === "Todos") {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.disconnect();
    };
  }, [hasMore, isLoadingPosts, searchQuery, activeCategory, loadMore]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (post.isDraft) return false;
      const matchesCat = activeCategory === "Todos" || post.category === activeCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const trendingPosts = useMemo(() => {
    return [...posts]
      .filter((p) => !p.isDraft)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5);
  }, [posts]);

  const onPostClick = (post) => {
    const targetSlug = post.slug || slugify(post.title);
    navigate(`/post/${targetSlug}`);
  };

  return (
    <div className="flex flex-col gap-12">
      <Helmet>
        <title>Lucas Begins | Seu Portal Retro</title>
        <meta name="description" content="Sua revista digital para a era de ouro dos videogames." />
      </Helmet>

      {/* Seção Superior: Destaque + Em Alta (Lado a Lado) */}
      {!isLoadingPosts && activeCategory === "Todos" && searchQuery === "" && posts.length > 0 && (
        <section>
          {/* Linha de Títulos Unificada para Simetria Total */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-6">
            <div className="lg:col-span-3 flex items-center gap-3">
               <div className={cn("w-4 h-8 retro-card", isDark ? "bg-purple-500" : "bg-purple-600")} />
               <h2 className="font-retro text-2xl md:text-3xl font-bold uppercase tracking-wide">
                 Em Destaque
               </h2>
            </div>
            <div className="hidden lg:flex items-center gap-3">
               <Star className="text-yellow-500 w-6 h-6" fill="currentColor" />
               <h2 className="font-retro text-2xl font-bold uppercase tracking-wide">
                 Em Alta
               </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Carrossel Principal */}
            <div className="lg:col-span-3">
              <Carousel posts={trendingPosts.slice(0, 5)} onPostClick={onPostClick} isDark={isDark} />
            </div>

            {/* Sidebar Em Alta - Altura Casada com o Carrossel */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className={cn("h-full md:h-[560px] p-6 rounded-3xl glass-card flex flex-col relative overflow-hidden", isDark ? "" : "bg-white/40")}>
                {/* Efeito sutil de luz de fundo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col justify-between h-full relative z-10">
                  {trendingPosts.map((post, idx) => (
                    <div
                      key={post.id}
                      onClick={() => onPostClick(post)}
                      className={cn(
                        "flex gap-4 cursor-pointer group pb-4 border-b last:border-0 last:pb-0 transition-all duration-300 hover:translate-x-1",
                        isDark ? "border-purple-500/20" : "border-gray-100"
                      )}
                    >
                      <div className={cn(
                        "text-2xl md:text-3xl font-retro font-bold opacity-30 group-hover:opacity-100 group-hover:text-purple-500 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]",
                        isDark ? "text-purple-400" : "text-purple-600"
                      )}>
                        {(idx + 1).toString().padStart(2, "0")}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm leading-snug line-clamp-2 group-hover:text-purple-500 transition-colors">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 opacity-40 text-[10px] font-bold uppercase">
                           <span>{post.likes || 0} curtidas</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* Seção Inferior: Grid Geral de Notícias - Agora Ocupando Largura Total */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => <PostSkeleton key={i} isDark={isDark} />)}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="animate-fade-in h-full">
                    <PostCard post={post} onClick={() => onPostClick(post)} />
                  </div>
                ))}
                {/* Skeletons de Rodapé para o Scroll Infinito */}
                {isFetchingMore && (
                  <>
                    <PostSkeleton isDark={isDark} />
                    <PostSkeleton isDark={isDark} />
                    <PostSkeleton isDark={isDark} />
                  </>
                )}
              </div>
            ) : (
              <div className={cn("p-12 text-center rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-white border-2 border-black")}>
                <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-50 text-purple-500" />
                <p className="font-retro text-xl mb-2 font-bold uppercase">Nenhum artigo encontrado.</p>
                <p className="opacity-70 font-medium tracking-tight">Tente buscar por outro termo ou categoria.</p>
              </div>
            )}

            {/* Trigger para Scroll Infinito */}
            {hasMore && !isLoadingPosts && searchQuery === "" && activeCategory === "Todos" && (
              <div ref={observerTarget} className="mt-16 flex justify-center py-10">
                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-100" />
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
