import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Gamepad2, ArrowLeft } from "lucide-react";
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory, searchQuery]);

  const { filteredPosts } = usePostsFilter(posts, activeCategory, searchQuery);

  return (
    <div className="flex flex-col gap-10">
      <Helmet>
        <title>Todos os Artigos | Lucas Begins</title>
        <meta name="description" content="Arquivo completo de artigos, reviews e notícias do portal Lucas Begins." />
      </Helmet>

      {/* Voltar */}
      <Link
        to="/"
        className={cn(
          "flex items-center gap-2 font-retro text-sm font-bold uppercase tracking-wider hover:text-purple-500 transition-colors group",
          isDark ? "text-gray-400" : "text-gray-600"
        )}
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Voltar
      </Link>

      {/* Header */}
      <header className={cn("pb-6", isDark ? "border-b border-white/5" : "border-b-2 border-snes-dark")}>
        <div className="flex items-center gap-3 mb-2">
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
      </header>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => <PostSkeleton key={i} isDark={isDark} />)}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.5), type: "spring", stiffness: 80 }}
              className="h-full"
            >
              <PostCard post={post} />
            </motion.div>
          ))}
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
