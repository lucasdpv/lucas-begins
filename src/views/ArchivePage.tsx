"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, ArrowLeft, Search, X, Flame, Clock, Star, Heart, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "@/lib/router-compat";
import { useQueryClient } from "@tanstack/react-query";

import PostCard from "../features/posts/components/PostCard";
import PostSkeleton from "../features/posts/components/PostSkeleton";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { useAllPosts, usePosts, postKeys } from "../features/posts/hooks/usePostsQuery";
import { useCategories } from "../features/posts/hooks/useCategoriesQuery";
import { usePostsFilter } from "../hooks/usePostsFilter";
import { cn } from "../lib/utils";
import { Post } from "../features/posts/schemas";

type SortOption = "recent" | "views" | "likes" | "score";

const getCategoryChipActiveStyle = (cat: string) => {
  const norm = cat.toLowerCase();
  if (norm.includes("review")) {
    return "bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.35)]";
  }
  if (norm.includes("dossi")) {
    return "bg-sky-500 text-white border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.35)]";
  }
  if (norm.includes("retro")) {
    return "bg-orange-500 text-slate-950 border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.35)]";
  }
  if (norm.includes("nostalgia")) {
    return "bg-pink-500 text-white border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.35)]";
  }
  if (norm.includes("pop") || norm.includes("cultura")) {
    return "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]";
  }
  if (norm.includes("rpg") || norm.includes("mmo")) {
    return "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]";
  }
  return "bg-purple-600 text-white border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.4)]";
};

const getCategoryDotColor = (cat: string) => {
  const norm = cat.toLowerCase();
  if (norm === "todos") return "bg-purple-400";
  if (norm.includes("review")) return "bg-amber-400";
  if (norm.includes("dossi")) return "bg-sky-400";
  if (norm.includes("retro")) return "bg-orange-400";
  if (norm.includes("nostalgia")) return "bg-pink-400";
  if (norm.includes("pop") || norm.includes("cultura")) return "bg-emerald-400";
  if (norm.includes("rpg") || norm.includes("mmo")) return "bg-cyan-400";
  return "bg-purple-400";
};

export default function ArchivePage() {
  const { isDark } = useThemeStore();
  const { activeCategory, searchQuery, setActiveCategory, setSearchQuery } = useUIStore();
  const { data: categories = [] } = useCategories();
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.removeQueries({ queryKey: postKeys.list({ category: activeCategory, search: "" }) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cat = (location.state as any)?.category;
    if (cat) setActiveCategory(cat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVoltar = () => {
    setActiveCategory("Todos");
    setSearchQuery("");
    navigate("/", { state: { resetCategory: true } });
  };

  const isSearching = searchQuery.trim() !== "";
  const isLocalMode = isSearching || activeCategory !== "Todos" || sortBy !== "recent";

  const { data: allPosts = [], isLoading: isLoadingAll } = useAllPosts(true);

  const {
    posts: paginatedPosts = [],
    isLoading: isLoadingPaginated,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePosts({ category: activeCategory });

  const posts = isLocalMode ? (allPosts as Post[]) : (paginatedPosts as Post[]);
  const { filteredPosts } = usePostsFilter(posts, activeCategory, searchQuery);

  const currentPosts = useMemo(() => {
    const base = isLocalMode ? [...filteredPosts] : [...paginatedPosts];
    if (sortBy === "views") {
      return base.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    if (sortBy === "likes") {
      return base.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    if (sortBy === "score") {
      return base.sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
    }
    return base;
  }, [isLocalMode, filteredPosts, paginatedPosts, sortBy]);

  const isLoading = isLocalMode ? isLoadingAll : isLoadingPaginated;

  const categoryList = useMemo(() => {
    const normKey = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/s$/, "");
    const defaultOrder = ["Todos", "Especial", "Reviews", "Dossiês", "RetroCafé", "Nostalgia"];
    const seen = new Set<string>();
    const result: string[] = [];
    for (const c of [...defaultOrder, ...(categories as string[])]) {
      const key = normKey(c);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(c);
      }
    }
    return result;
  }, [categories]);

  const publishedPosts = useMemo(() => (allPosts as Post[]).filter((p) => !p.isDraft), [allPosts]);
  const getCategoryCount = (cat: string) => {
    if (cat === "Todos") return publishedPosts.length;
    const norm = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/s$/, "");
    return publishedPosts.filter((p) => norm(p.category || "") === norm(cat)).length;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory]);

  return (
    <div className="flex flex-col gap-8">
      {/* Voltar */}
      <button
        onClick={handleVoltar}
        className={cn(
          "flex items-center gap-2 font-retro text-xs font-bold uppercase tracking-wider hover:text-purple-400 transition-colors group w-fit",
          isDark ? "text-slate-400" : "text-slate-600"
        )}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar ao Início
      </button>

      {/* Header + Barra de Controle do Catálogo */}
      <header className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-retro text-3xl md:text-4xl font-black uppercase tracking-wide leading-none">
                  Catálogo Completo
                </h1>
                {!isLoading && (
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] mt-1 text-slate-400">
                    {isLocalMode
                      ? `${currentPosts.length} títulos encontrados`
                      : `${currentPosts.length} de ${publishedPosts.length || currentPosts.length} títulos disponíveis`}
                    {activeCategory !== "Todos" && ` · Setor: ${activeCategory}`}
                    {searchQuery && ` · Busca: "${searchQuery}"`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Controles Rápidos: Busca Local + Ordenação */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Input de Filtro Rápido */}
            <div
              className={cn(
                "flex items-center px-4 h-10 rounded-xl border transition-all",
                isDark
                  ? "bg-white/[0.04] border-white/10 focus-within:border-purple-500/60"
                  : "bg-white border-slate-200 focus-within:border-purple-600 shadow-sm"
              )}
            >
              <Search className="w-4 h-4 text-purple-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por título..."
                className={cn(
                  "bg-transparent border-none outline-none font-retro font-bold text-xs uppercase tracking-wider w-full sm:w-56",
                  isDark ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-rose-400 ml-1"
                  title="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Botões de Ordenação */}
            <div
              className={cn(
                "flex items-center p-1 rounded-full border",
                isDark ? "bg-white/[0.03] border-white/[0.08]" : "bg-slate-100 border-slate-200"
              )}
            >
              {[
                { id: "recent" as SortOption, label: "Recentes", icon: Clock },
                { id: "views" as SortOption, label: "Mais Lidos", icon: Flame },
                { id: "likes" as SortOption, label: "Curtidos", icon: Heart },
                { id: "score" as SortOption, label: "Notas", icon: Star },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = sortBy === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSortBy(opt.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full font-retro font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer",
                      active
                        ? "bg-purple-600 text-white shadow-[0_0_16px_rgba(168,85,247,0.4)]"
                        : isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-600 hover:text-slate-950"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fileira de Categorias (Streaming Pills) */}
        <div
          className={cn(
            "p-3.5 rounded-2xl border flex flex-wrap items-center gap-2",
            isDark ? "bg-[#110f22]/85 border-white/[0.08]" : "bg-white border-slate-200/80 shadow-sm"
          )}
        >
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-purple-400 px-2 shrink-0 hidden md:inline">
            Gêneros & Setores:
          </span>
          {categoryList.map((cat) => {
            const isActive = activeCategory === cat;
            const count = getCategoryCount(cat);
            if (cat !== "Todos" && count === 0 && publishedPosts.length > 0) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-retro font-bold text-[11px] uppercase tracking-wider transition-all shrink-0 cursor-pointer focus:outline-none",
                  isActive
                    ? getCategoryChipActiveStyle(cat)
                    : isDark
                    ? "bg-white/[0.04] text-slate-300 border-white/[0.08] hover:border-white/20 hover:text-white"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-950"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full shrink-0", getCategoryDotColor(cat))} />
                <span>{cat}</span>
                {publishedPosts.length > 0 && (
                  <span
                    className={cn(
                      "font-mono text-[9px] px-1.5 py-0.2 rounded-full",
                      isActive
                        ? "bg-black/25 text-current"
                        : isDark
                        ? "bg-white/[0.06] text-slate-400"
                        : "bg-slate-200/80 text-slate-600"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PostSkeleton key={i} isDark={isDark} />
          ))}
        </div>
      ) : currentPosts.length > 0 ? (
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {currentPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <PostCard post={post} variant="default" priority={idx < 3} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!isLocalMode && hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="font-retro text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/40 shadow-[0_10px_30px_rgba(168,85,247,0.4)] transition-all active:scale-95 disabled:opacity-50"
              >
                {isFetchingNextPage ? "Carregando títulos..." : "Carregar mais títulos"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "p-16 text-center rounded-3xl border border-dashed",
            isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-slate-300"
          )}
        >
          <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-30 text-purple-500" />
          <p className="font-retro text-xl font-bold uppercase mb-2">Nenhum título encontrado.</p>
          <p className="text-sm opacity-50">Tente outro filtro ou setor.</p>
        </div>
      )}
    </div>
  );
}
