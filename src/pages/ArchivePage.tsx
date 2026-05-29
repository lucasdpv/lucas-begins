import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import PostCard from "../features/posts/components/PostCard";
import PostSkeleton from "../features/posts/components/PostSkeleton";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { useAllPosts, usePosts } from "../features/posts/hooks/usePostsQuery";
import { usePostsFilter } from "../hooks/usePostsFilter";
import { cn } from "../lib/utils";
import { Post } from "../features/posts/schemas";

export default function ArchivePage() {
  const { isDark } = useThemeStore();
  const { activeCategory, searchQuery, setActiveCategory } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Aplica categoria vinda da HomePáge via state (sem alterar a store antes da animação de entrada)
  useEffect(() => {
    const cat = (location.state as any)?.category;
    if (cat) setActiveCategory(cat);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Volta para home e sinaliza reset de categoria (a HomePage reseta após montar)
  const handleVoltar = () => {
    navigate("/", { state: { resetCategory: true } });
  };

  const isSearching = searchQuery.trim() !== "";

  // 1. Busca Local Lazy (apenas quando há termo na pesquisa rápida)
  const { data: allPosts = [], isLoading: isLoadingAll } = useAllPosts(isSearching);

  // 2. Paginação Baseada em Cursores Firestore (navegação por fases)
  const {
    posts: paginatedPosts = [],
    isLoading: isLoadingPaginated,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = usePosts({ category: activeCategory });

  // Seleciona o set de posts ativo
  const posts = isSearching ? (allPosts as Post[]) : (paginatedPosts as Post[]);

  // Filtra em memória se estiver pesquisando
  const { filteredPosts } = usePostsFilter(posts, activeCategory, searchQuery);

  const currentPosts = isSearching ? filteredPosts : paginatedPosts;
  const isLoading = isSearching ? isLoadingAll : isLoadingPaginated;

  // Reseta o scroll ao mudar a categoria
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-10">
      <Helmet>
        <title>Todos os Artigos | BeginsProject</title>
        <link rel="canonical" href="https://lucasbegins.com.br/archive" />
        <meta name="description" content="Arquivo completo de artigos, reviews e notícias do portal BeginsProject. Tudo sobre a cultura retro em um só lugar." />
        <meta name="keywords" content="BeginsProject, Lucas Begins, Arquivo de Posts, Reviews de Games Retro, Notícias Retro Gaming" />
      </Helmet>

      {/* Voltar */}
      <button
        onClick={handleVoltar}
        className={cn(
          "flex items-center gap-2 font-retro text-sm font-bold uppercase tracking-wider hover:text-purple-500 transition-colors group w-fit",
          isDark ? "text-gray-400" : "text-gray-600"
        )}
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Voltar
      </button>

      {/* Header */}
      <header className={cn("pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6", isDark ? "border-b border-white/5" : "border-b-2 border-snes-dark")}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className={cn("w-1.5 h-8 rounded-none", isDark ? "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.7)]" : "bg-purple-600")} />
            <h1 className="font-retro text-3xl md:text-4xl font-black uppercase tracking-wide text-glow leading-none">
              Arquivo Completo
            </h1>
          </div>
          {!isLoading && (
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 pl-5">
              {isSearching ? `${filteredPosts.length} publicações encontradas` : `${paginatedPosts.length} posts carregados nesta fase`}
              {activeCategory !== "Todos" && ` · ${activeCategory}`}
              {searchQuery && ` · "${searchQuery}"`}
            </p>
          )}
        </div>
      </header>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => <PostSkeleton key={i} isDark={isDark} />)}
        </div>
      ) : currentPosts.length > 0 ? (
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {currentPosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <PostCard post={post} variant="default" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Botão Retro de Carregar Mais (Cursor Paginação) */}
          {!isSearching && hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className={cn(
                  "font-retro text-xs font-bold uppercase tracking-widest px-8 py-4 border-4 transition-all active:scale-95 disabled:opacity-50",
                  isDark 
                    ? "bg-purple-600 border-purple-400 text-white shadow-[4px_4px_0_rgba(168,85,247,0.4)] hover:bg-purple-500" 
                    : "bg-purple-500 border-black text-white shadow-[4px_4px_0_rgba(0,0,0,1)] hover:bg-purple-600 hover:shadow-[6px_6px_0_rgba(0,0,0,1)]"
                )}
              >
                {isFetchingNextPage ? "CARREGANDO DADOS..." : "INICIAR PRÓXIMA FASE (CARREGAR MAIS)"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={cn("p-16 text-center retro-card", isDark ? "bg-gray-800/40" : "bg-snes-surface border-2 border-snes-dark")}>
          <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-30 text-purple-500" />
          <p className="font-retro text-xl font-bold uppercase mb-2">Nenhum artigo encontrado.</p>
          <p className="text-sm opacity-50">Tente outro filtro ou categoria.</p>
        </div>
      )}
    </div>
  );
}
