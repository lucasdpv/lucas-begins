import React, { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, ArrowLeft, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";

import PostCard from "../features/posts/components/PostCard";
import PostSkeleton from "../features/posts/components/PostSkeleton";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { useAllPosts } from "../features/posts/hooks/usePostsQuery";
import { usePostsFilter } from "../hooks/usePostsFilter";
import { cn } from "../lib/utils";
import { Post } from "../features/posts/schemas";

export default function ArchivePage() {
  const { isDark } = useThemeStore();
  const { activeCategory, searchQuery } = useUIStore();
  const { data: allPosts = [], isLoading } = useAllPosts();
  const posts = allPosts as Post[];

  // Estados de Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(6);

  const { filteredPosts } = usePostsFilter(posts, activeCategory, searchQuery);

  // Resetar para página 1 quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory, searchQuery, postsPerPage]);

  // Lógica de Paginação
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = useMemo(() => 
    filteredPosts.slice(indexOfFirstPost, indexOfLastPost),
    [filteredPosts, indexOfFirstPost, indexOfLastPost]
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-10">
      <Helmet>
        <title>Todos os Artigos | BeginsProject</title>
        <meta name="description" content="Arquivo completo de artigos, reviews e notícias do portal BeginsProject. Tudo sobre a cultura retro em um só lugar." />
        <meta name="keywords" content="BeginsProject, Lucas Begins, Arquivo de Posts, Reviews de Games Retro, Notícias Retro Gaming" />
      </Helmet>

      {/* Voltar */}
      <Link
        to="/"
        className={cn(
          "flex items-center gap-2 font-retro text-sm font-bold uppercase tracking-wider hover:text-purple-500 transition-colors group w-fit",
          isDark ? "text-gray-400" : "text-gray-600"
        )}
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Voltar
      </Link>

      {/* Header + Seletor de Quantidade */}
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
              {filteredPosts.length} publicaç{filteredPosts.length !== 1 ? "ões" : "ão"} encontrada{filteredPosts.length !== 1 ? "s" : ""}
              {activeCategory !== "Todos" && ` · ${activeCategory}`}
              {searchQuery && ` · "${searchQuery}"`}
            </p>
          )}
        </div>

        {/* Seletor de Posts por Página */}
        <div className="flex items-center gap-3">
          <span className={cn("text-[9px] font-black uppercase tracking-widest opacity-50", isDark ? "text-white" : "text-black")}>Visualizar:</span>
          <div className={cn("flex border-2", isDark ? "border-purple-500/30" : "border-snes-dark")}>
            {[6, 12, 24].map((num) => (
              <button
                key={num}
                onClick={() => setPostsPerPage(num)}
                className={cn(
                  "px-3 py-1.5 font-retro text-[10px] font-bold transition-all",
                  postsPerPage === num
                    ? (isDark ? "bg-purple-600 text-white" : "bg-purple-600 text-white")
                    : (isDark ? "bg-gray-800 text-gray-400 hover:text-white" : "bg-white text-gray-600 hover:bg-gray-50")
                )}
              >
                {num}
              </button>
            ))}
          </div>
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
              {currentPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Paginação Retro */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                  "p-3 border-2 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed",
                  isDark ? "bg-gray-800 border-purple-500 text-purple-400" : "bg-white border-snes-dark text-snes-accent shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                )}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
                  .map((p, i, arr) => {
                    const showEllipsis = i > 0 && p !== arr[i - 1] + 1;
                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && <span className="opacity-30">...</span>}
                        <button
                          onClick={() => handlePageChange(p)}
                          className={cn(
                            "w-10 h-10 font-retro font-bold text-sm border-2 transition-all",
                            currentPage === p
                              ? (isDark ? "bg-purple-600 border-white text-white" : "bg-purple-600 border-black text-white shadow-[2px_2px_0px_rgba(0,0,0,1)]")
                              : (isDark ? "bg-gray-800 border-purple-500/30 text-gray-400 hover:text-white" : "bg-white border-snes-dark text-gray-600 hover:bg-gray-50 shadow-[2px_2px_0px_rgba(0,0,0,1)]")
                          )}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                  "p-3 border-2 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed",
                  isDark ? "bg-gray-800 border-purple-500 text-purple-400" : "bg-white border-snes-dark text-snes-accent shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                )}
              >
                <ChevronRight size={20} />
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

