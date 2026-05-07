import React, { useMemo, useEffect, useRef, useState } from "react";
import { Gamepad2, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Carousel from "../features/posts/components/Carousel";
import PostCard from "../features/posts/components/PostCard";
import PostSkeleton from "../features/posts/components/PostSkeleton";
import CarouselSkeleton from "../features/posts/components/CarouselSkeleton";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { usePosts } from "../features/posts/hooks/usePostsQuery";
import { usePostsFilter } from "../hooks/usePostsFilter";
import { cn, slugify } from "../lib/utils";

export default function HomePage() {
  const { isDark } = useThemeStore();
  const { activeCategory, searchQuery } = useUIStore();
  const { 
    posts, 
    isLoading: isLoadingPosts, 
    isFetchingNextPage: isFetchingMore, 
    hasNextPage, 
    fetchNextPage: loadMore 
  } = usePosts({ search: searchQuery, category: activeCategory });
  const navigate = useNavigate();
  const observerTarget = useRef(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState("acessados");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoadingPosts && searchQuery === "" && activeCategory === "Todos") {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.disconnect();
    };
  }, [hasNextPage, isLoadingPosts, searchQuery, activeCategory, loadMore]);

  const { filteredPosts, featuredPosts, mostViewedPosts } = usePostsFilter(posts, activeCategory, searchQuery);

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
      {isLoadingPosts && activeCategory === "Todos" && searchQuery === "" ? (
        <CarouselSkeleton isDark={isDark} />
      ) : !isLoadingPosts && activeCategory === "Todos" && searchQuery === "" && posts.length > 0 && (
        <section>
          {/* ... existing section code ... */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-6">
            <div className="lg:col-span-3 flex items-center gap-3">
               <div className={cn("w-1.5 h-6 md:h-8 rounded-sm", isDark ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" : "bg-purple-600")} />
               <h2 className="font-retro text-2xl md:text-3xl font-bold uppercase tracking-wide text-glow">
                 Em Destaque
               </h2>
            </div>
            <div className="hidden lg:flex items-center w-full">
               <div className={cn("flex w-full rounded-xl p-1", isDark ? "bg-black/30 shadow-inner" : "bg-snes-mid shadow-inner")}>
                 <button 
                   onClick={() => setActiveSidebarTab('acessados')}
                   className={cn(
                     "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-retro text-[10px] xl:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                     activeSidebarTab === 'acessados' 
                       ? (isDark ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]" : "bg-purple-600 text-white border-2 border-snes-dark shadow-[2px_2px_0px_#2D1B69]") 
                       : "text-gray-500 hover:text-gray-400 opacity-60 hover:opacity-100"
                   )}
                 >
                   <Eye className="w-3.5 h-3.5 shrink-0" /> Acessados
                 </button>
                 <button 
                   onClick={() => setActiveSidebarTab('curtidos')}
                   className={cn(
                     "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-retro text-[10px] xl:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                     activeSidebarTab === 'curtidos' 
                       ? (isDark ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]" : "bg-purple-600 text-white border-2 border-snes-dark shadow-[2px_2px_0px_#2D1B69]") 
                       : "text-gray-500 hover:text-gray-400 opacity-60 hover:opacity-100"
                   )}
                 >
                   <Star className="w-3.5 h-3.5 shrink-0" /> Em Alta
                 </button>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Carrossel Principal */}
            <div className="lg:col-span-3">
              <Carousel posts={featuredPosts} onPostClick={onPostClick} isDark={isDark} />
            </div>

            {/* Sidebar Em Alta - Altura Casada com o Carrossel */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className={cn(
                "h-full md:h-[560px] p-8 rounded-none flex flex-col relative overflow-hidden transition-all duration-500",
                isDark 
                  ? "bg-[#161b2c] border border-white/5 shadow-xl" 
                  : "bg-snes-surface border-2 border-snes-dark shadow-[4px_4px_0px_0px_#2D1B69]"
              )}>
                {/* Efeito de luz de fundo sutil */}
                {isDark && (
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />
                )}
                
                <div className="flex flex-col justify-between h-full relative z-10 gap-1">
                  {(activeSidebarTab === 'acessados' ? mostViewedPosts : featuredPosts).map((post, idx) => (
                    <div
                      key={post.id}
                      onClick={() => onPostClick(post)}
                      className={cn(
                        "flex items-center gap-5 cursor-pointer group py-3 border-b last:border-0 last:pb-0 transition-all duration-300 hover:translate-x-2",
                        isDark ? "border-white/5" : "border-snes-mid/30"
                      )}
                    >
                      <span className={cn(
                        "text-2xl font-retro font-bold trending-number transition-all duration-300 min-w-[40px]",
                        isDark ? "text-purple-500/50" : "text-purple-600/30"
                      )}>
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "font-bold text-[14px] leading-tight line-clamp-2 transition-colors",
                          isDark ? "text-white group-hover:text-purple-200" : "text-snes-accent group-hover:text-purple-700"
                        )}>
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5 opacity-40 text-[10px] font-bold uppercase tracking-wider">
                           <span>
                             {activeSidebarTab === 'acessados' 
                               ? `${post.views || 0} visualizações` 
                               : `${post.likes || 0} curtidas`}
                           </span>
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
              <div className={cn("w-1.5 h-6 md:h-8 rounded-sm", isDark ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" : "bg-blue-600")} />
              <h2 className="font-retro text-2xl md:text-3xl font-bold uppercase tracking-wide text-glow-blue">
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
              <div className={cn("p-12 text-center rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-snes-surface border-2 border-snes-dark")}>
                <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-50 text-purple-500" />
                <p className="font-retro text-xl mb-2 font-bold uppercase">Nenhum artigo encontrado.</p>
                <p className="opacity-70 font-medium tracking-tight">Tente buscar por outro termo ou categoria.</p>
              </div>
            )}

            {/* Trigger para Scroll Infinito */}
            {hasNextPage && !isLoadingPosts && searchQuery === "" && activeCategory === "Todos" && (
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
