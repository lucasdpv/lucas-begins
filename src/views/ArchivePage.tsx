"use client";

import React, { useEffect, useMemo } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Gamepad2, ArrowLeft, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useNavigate } from "@/lib/router-compat";
import { useQueryClient } from "@tanstack/react-query";

import PostCard from "../features/posts/components/PostCard";
import PostSkeleton from "../features/posts/components/PostSkeleton";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { useAllPosts, usePosts, postKeys } from "../features/posts/hooks/usePostsQuery";
import { usePostsFilter } from "../hooks/usePostsFilter";
import { getCategoryDescription, SITE_CATEGORIES } from "../features/posts/utils/categoryInfo";
import { cn } from "../lib/utils";
import { Post } from "../features/posts/schemas";

const CATALOG_CATEGORIES = ["Todos", ...SITE_CATEGORIES];

const normalizeCategory = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/s$/, "");

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
  if (norm.includes("anime") || norm.includes("nostalgia")) {
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
  if (norm.includes("anime") || norm.includes("nostalgia")) return "bg-pink-400";
  if (norm.includes("pop") || norm.includes("cultura")) return "bg-emerald-400";
  if (norm.includes("rpg") || norm.includes("mmo")) return "bg-cyan-400";
  return "bg-purple-400";
};

export default function ArchivePage() {
  const { isDark } = useThemeStore();
  const { setActiveCategory, setSearchQuery } = useUIStore();
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [catalogGridRef] = useAutoAnimate<HTMLDivElement>({ duration: 220 });

  // A categoria vem da URL (?categoria=...) para o "voltar" do navegador funcionar e o link ser compartilhável.
  const categoryParam = normalizeCategory(searchParams?.get("categoria") || "");
  const activeCategory = CATALOG_CATEGORIES.find((c) => normalizeCategory(c) === categoryParam) || "Todos";

  const selectCategory = (cat: string) => {
    navigate(cat === "Todos" ? "/archive" : `/archive?categoria=${encodeURIComponent(cat)}`, { replace: true });
  };

  useEffect(() => {
    queryClient.removeQueries({ queryKey: postKeys.list({ category: activeCategory, search: "" }) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVoltar = () => {
    setActiveCategory("Todos");
    setSearchQuery("");
    navigate("/", { state: { resetCategory: true } });
  };

  const isLocalMode = activeCategory !== "Todos";

  const { data: allPosts = [], isLoading: isLoadingAll } = useAllPosts(true);

  const {
    posts: paginatedPosts = [],
    isLoading: isLoadingPaginated,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePosts({ category: activeCategory, pageSize: 8 });

  const posts = isLocalMode ? (allPosts as Post[]) : (paginatedPosts as Post[]);
  const { filteredPosts } = usePostsFilter(posts, activeCategory, "");

  const currentPosts = isLocalMode ? filteredPosts : (paginatedPosts as Post[]);
  const isLoading = isLocalMode ? isLoadingAll : isLoadingPaginated;

  const publishedPosts = useMemo(() => (allPosts as Post[]).filter((p) => !p.isDraft), [allPosts]);
  const getCategoryCount = (cat: string) => {
    if (cat === "Todos") return publishedPosts.length;
    return publishedPosts.filter((p) => normalizeCategory(p.category || "") === normalizeCategory(cat)).length;
  };

  const categoryDescription = activeCategory !== "Todos" ? getCategoryDescription(activeCategory) : undefined;

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
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="font-retro text-3xl md:text-4xl font-black uppercase tracking-wide leading-none">
              Catálogo Completo
            </h1>
          </div>
          {!isLoading && (
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] mt-1 pl-[52px] text-slate-400">
              {isLocalMode
                ? `${currentPosts.length} ${currentPosts.length === 1 ? "título encontrado" : "títulos encontrados"}`
                : `${currentPosts.length} de ${publishedPosts.length || currentPosts.length} títulos disponíveis`}
            </p>
          )}
        </div>

        {/* Fileira de Categorias (Streaming Pills) */}
        <div className="flex flex-wrap items-center gap-2">
          {CATALOG_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count = getCategoryCount(cat);
            if (cat !== "Todos" && count === 0 && publishedPosts.length > 0) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => selectCategory(cat)}
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
                      "font-mono text-[9px] px-1.5 py-0.5 rounded-full",
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

        {categoryDescription && (
          <p
            key={activeCategory}
            className={cn(
              "flex items-start gap-3 max-w-3xl text-sm leading-relaxed animate-bg-fade",
              isDark ? "text-slate-300" : "text-slate-600"
            )}
          >
            <span className={cn("mt-1.5 w-2 h-2 rounded-full shrink-0", getCategoryDotColor(activeCategory))} />
            {categoryDescription}
          </p>
        )}
      </header>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <PostSkeleton key={i} isDark={isDark} variant="compact" />
          ))}
        </div>
      ) : currentPosts.length > 0 ? (
        <div className="flex flex-col gap-12">
          <div ref={catalogGridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            {currentPosts.map((post, idx) => (
              <div key={post.id} className="h-full">
                <PostCard post={post} variant="vintage" priority={idx < 3} />
              </div>
            ))}
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
