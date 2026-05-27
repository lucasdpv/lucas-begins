import React from "react";
import { Heart, MessageSquare, Clock, Eye, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { calculateReadingTime, formatDate, cn, coverBgStyle, formatNumber, slugify } from "../../../lib/utils";
import { BRUTAL_DESIGN } from "../../../constants";
import { useAuth } from "../../../context/AuthProvider";
import { useThemeStore } from "../../../store/useThemeStore";
import { useLikeMutation, useFavoriteMutation } from "../hooks/usePostsQuery";
import { useUserProfile } from "../../../hooks/useUserQuery";
import { useImageFallback } from "../../../hooks/useImageFallback";
import { CategoryBadge, ScoreBadge } from "../../../components/ui/Badge";
import AuthGate from "../../auth/components/AuthGate";
import { Post } from "../schemas";

interface PostCardProps {
  post: Post;
  variant?: "default" | "compact";
}

const getCategoryCardStyles = (category: string) => {
  const norm = category?.toLowerCase().trim() || "";
  switch (norm) {
    case "reviews":
      return {
        textHover: "group-hover:text-amber-500 dark:group-hover:text-amber-400",
        hoverBorder: "group-hover:border-amber-500/40 dark:group-hover:border-amber-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]",
      };
    case "dossiês":
    case "dossies":
      return {
        textHover: "group-hover:text-blue-500 dark:group-hover:text-blue-400",
        hoverBorder: "group-hover:border-blue-500/40 dark:group-hover:border-blue-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]",
      };
    case "retrocafé":
    case "retrocafe":
    case "retro-café":
      return {
        textHover: "group-hover:text-orange-500 dark:group-hover:text-orange-400",
        hoverBorder: "group-hover:border-orange-500/40 dark:group-hover:border-orange-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(249,115,22,0.25)]",
      };
    case "especial":
      return {
        textHover: "group-hover:text-purple-500 dark:group-hover:text-purple-400",
        hoverBorder: "group-hover:border-purple-500/40 dark:group-hover:border-purple-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]",
      };
    case "nostalgia":
      return {
        textHover: "group-hover:text-pink-500 dark:group-hover:text-pink-400",
        hoverBorder: "group-hover:border-pink-500/40 dark:group-hover:border-pink-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]",
      };
    case "cultura pop":
    case "culturapop":
      return {
        textHover: "group-hover:text-emerald-500 dark:group-hover:text-emerald-400",
        hoverBorder: "group-hover:border-emerald-500/40 dark:group-hover:border-emerald-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]",
      };
    case "rpg & mmo":
    case "rpg mmo":
    case "rpg":
      return {
        textHover: "group-hover:text-cyan-500 dark:group-hover:text-cyan-400",
        hoverBorder: "group-hover:border-cyan-500/40 dark:group-hover:border-cyan-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]",
      };
    default:
      return {
        textHover: "group-hover:text-purple-500 dark:group-hover:text-purple-400",
        hoverBorder: "group-hover:border-purple-500/40 dark:group-hover:border-purple-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]",
      };
  }
};

export default function PostCard({ post, variant = "default" }: PostCardProps) {
  const { isDark } = useThemeStore();
  const { currentUser } = useAuth();
  const { data: profile } = useUserProfile(currentUser?.id);
  const likeMutation = useLikeMutation();
  const favoriteMutation = useFavoriteMutation();
  const imgError = useImageFallback(post.imageUrl ?? undefined);
  const [randomSector] = React.useState(() => Math.floor(Math.random() * 99));

  const hasLiked = currentUser && post.likedBy?.includes(currentUser.id);
  const commentCount = post.comments?.length || 0;
  const isCompact = variant === "compact";

  const targetSlug = post.slug || slugify(post.title);
  const targetPath = `/post/${targetSlug}`;
  const cardStyles = getCategoryCardStyles(post.category);

  return (
    <article
      className={cn(
        "flex flex-col h-full group relative overflow-hidden rounded-3xl border-2 transition-all duration-300 glass-card glass-card-hover",
        isDark 
          ? "border-purple-500/10 shadow-[6px_6px_0px_rgba(0,0,0,0.35)]" 
          : "border-black/5 shadow-[6px_6px_0px_rgba(45,27,105,0.05)]",
        cardStyles.hoverBorder,
        cardStyles.hoverShadow,
        isCompact && "rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,0.05)]"
      )}
    >
      {/* Link Esticado (Stretched Link) - Captura o clique em todo o card */}
      <Link 
        to={targetPath} 
        className="absolute inset-0 z-0" 
        aria-label={`Ler matéria: ${post.title}`}
      />

      {/* Thumb */}
      <div
        className={cn(
          "w-full relative overflow-hidden border-b-2 border-black/10 dark:border-white/5 flex items-center justify-center z-10 pointer-events-none",
          isCompact ? "h-32 sm:h-40" : "h-56 md:h-64",
          isDark ? "bg-gray-900" : "bg-snes-mid/20",
          !post.imageUrl && !imgError && post.gradient && `bg-gradient-to-br ${post.gradient}`
        )}
      >
        {/* Imagem Real de Capa com Zoom suave no hover */}
        {post.imageUrl && !imgError && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            style={{ objectPosition: post.imagePosition || "center" }}
            loading="lazy"
          />
        )}

        {/* Mensagem Gamificada em caso de Erro de Imagem */}
        {imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
             <div className="text-red-500 font-retro text-[8px] sm:text-[10px] mb-1 animate-pulse bg-black/40 px-1.5 py-0.5 rounded border border-red-500/50">
               ⚠️ ERROR
             </div>
             {!isCompact && (
               <p className={cn(
                 "text-[9px] sm:text-[10px] font-bold uppercase leading-tight max-w-[200px]",
                 isDark ? "text-gray-400" : "text-gray-600"
               )}>
                 Textura no setor {randomSector} corrompida...
               </p>
             )}
          </div>
        )}

        {/* CRT Scanlines Overlay */}
        <div className="absolute inset-0 scanline-overlay opacity-30 group-hover:opacity-75 transition-opacity duration-300 z-10" />
        
        {!isCompact && (
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap z-20">
            <CategoryBadge>{post.category}</CategoryBadge>
            {post.score && (
              <ScoreBadge score={post.score} />
            )}
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className={cn("flex flex-col flex-grow relative z-10 pointer-events-none", isCompact ? "p-3" : "px-5 py-6")}>
        <h3 className={cn(
          "font-retro font-bold uppercase line-clamp-2 leading-tight transition-colors duration-300",
          cardStyles.textHover,
          isCompact ? "text-xs mb-2" : "text-lg md:text-xl mb-3"
        )}>
          {post.title}
        </h3>
        
        {!isCompact && (
          <p className={cn("text-sm md:text-base mb-6 line-clamp-3 flex-grow leading-relaxed font-medium", isDark ? "text-gray-400" : "text-gray-700")}>
            {post.excerpt}
          </p>
        )}

        {/* Footer do card */}
        <div className={cn(
          "flex flex-wrap items-end justify-between mt-auto gap-y-3",
          isCompact ? "pt-2 border-t border-black/5 dark:border-white/5" : "pt-4 border-t-2 border-black/10 dark:border-white/5"
        )}>
          {/* Data e tempo de leitura */}
          <div className="flex flex-col gap-0.5 min-w-[80px]">
            <span className={cn("font-retro font-bold uppercase tracking-wider text-[9px] sm:text-[10px] whitespace-nowrap", isDark ? "opacity-60" : "opacity-80")}>
              {formatDate(post.createdAt, post.date ?? undefined)}
            </span>
            {!isCompact && (
              <span className={cn("text-[9px] sm:text-[10px] flex items-center gap-1 font-bold uppercase whitespace-nowrap", isDark ? "opacity-40" : "opacity-60")}>
                <Clock className="w-3 h-3 shrink-0" />
                {calculateReadingTime(post.content || "").replace(" min de leitura", "m")}
              </span>
            )}
          </div>

          {/* Container de Ações e Status - Z-INDEX 20 e pointer-events-auto para ser clicável por cima do link */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto relative z-20 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            {/* Stats Group */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                className={cn(
                  "flex items-center gap-1 font-bold transition-all",
                  isCompact ? "text-[10px]" : "text-[11px] sm:text-sm",
                  hasLiked 
                    ? "text-red-500 scale-105" 
                    : isDark 
                    ? "text-gray-400 hover:text-red-400 hover:scale-110" 
                    : "text-gray-600 hover:text-red-500 hover:scale-110",
                  currentUser 
                    ? "active:scale-95 cursor-pointer" 
                    : isDark ? "opacity-40" : "opacity-50"
                )}
                onClick={() => currentUser ? likeMutation.mutate({ postId: post.id, userId: currentUser.id }) : null}
                title={currentUser ? "Curtir" : "Faça login para curtir"}
                disabled={!currentUser}
              >
                <Heart className={cn(isCompact ? "w-3 h-3" : "w-3.5 h-3.5 sm:w-4 sm:h-4", hasLiked && "fill-current")} />
                <span>{formatNumber(post.likes || 0)}</span>
              </button>

              <button
                className={cn(
                  "flex items-center gap-1 font-bold transition-all",
                  isCompact ? "text-[10px]" : "text-[11px] sm:text-sm",
                  profile?.favorites?.includes(post.id) 
                    ? "text-yellow-500 scale-105" 
                    : isDark 
                    ? "text-gray-400 hover:text-yellow-400 hover:scale-110" 
                    : "text-gray-600 hover:text-yellow-500 hover:scale-110",
                  currentUser 
                    ? "active:scale-95 cursor-pointer" 
                    : isDark ? "opacity-40" : "opacity-50"
                )}
                onClick={() => {
                  if (currentUser) {
                    const isFavorited = profile?.favorites?.includes(post.id) || false;
                    favoriteMutation.mutate({ userId: currentUser.id, postId: post.id, isFavorited });
                  }
                }}
                title={currentUser ? "Favoritar" : "Faça login para favoritar"}
                disabled={!currentUser}
              >
                <Bookmark className={cn(isCompact ? "w-3 h-3" : "w-3.5 h-3.5 sm:w-4 sm:h-4", profile?.favorites?.includes(post.id) && "fill-current")} />
              </button>

              {!isCompact && (
                <>
                  <div className={cn("flex items-center gap-1 font-bold text-[11px] sm:text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{formatNumber(commentCount)}</span>
                  </div>

                  <div className={cn("flex items-center gap-1 font-bold text-[11px] sm:text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{formatNumber(post.views || 0)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Login Button Separate */}
            {!currentUser && !isCompact && (
              <div className="pl-2 border-l border-black/10 dark:border-white/10">
                <AuthGate variant="inline" />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
