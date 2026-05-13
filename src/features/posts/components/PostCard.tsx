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

export default function PostCard({ post, variant = "default" }: PostCardProps) {
  const { isDark } = useThemeStore();
  const { currentUser } = useAuth();
  const { data: profile } = useUserProfile(currentUser?.id);
  const likeMutation = useLikeMutation();
  const favoriteMutation = useFavoriteMutation();
  const imgError = useImageFallback(post.imageUrl ?? undefined);
  const bgStyle = imgError ? {} : coverBgStyle(post.imageUrl, post.imagePosition);
  const [randomSector] = React.useState(() => Math.floor(Math.random() * 99));

  const { BORDER, SHADOW, ROUNDED, TRANSITION, HOVER_LIFT } = BRUTAL_DESIGN;

  const hasLiked = currentUser && post.likedBy?.includes(currentUser.id);
  const commentCount = post.comments?.length || 0;
  const isCompact = variant === "compact";

  const targetSlug = post.slug || slugify(post.title);
  const targetPath = `/post/${targetSlug}`;

  return (
    <article
      className={cn(
        "flex flex-col h-full group relative",
        BORDER, SHADOW, ROUNDED, TRANSITION, HOVER_LIFT,
        "hover:shadow-[8px_8px_0px_0px_rgba(168,85,247,1)]",
        isDark ? "bg-gray-800" : "bg-snes-light",
        isCompact && "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(168,85,247,1)]"
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
          "w-full relative overflow-hidden border-b-2 border-black flex items-center justify-center z-10 pointer-events-none",
          isCompact ? "h-32 sm:h-40" : "h-56 md:h-64",
          isDark ? "bg-gray-900" : "bg-snes-mid",
          !post.imageUrl && !imgError && post.gradient && `bg-gradient-to-br ${post.gradient}`
        )}
        style={bgStyle}
      >
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

        <div className="absolute inset-0 scanline-overlay opacity-30 group-hover:opacity-70 transition-opacity duration-300" />
        
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
          "font-retro font-bold uppercase line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors duration-300",
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
          isCompact ? "pt-2 border-t border-black/10" : "pt-4 border-t-2 border-snes-mid",
          isDark && !isCompact && "border-gray-800"
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
                  hasLiked ? "text-red-500" : isDark ? "text-gray-400" : "text-gray-600",
                  currentUser 
                    ? "hover:scale-110 active:scale-95 cursor-pointer hover:text-red-400" 
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
                  profile?.favorites?.includes(post.id) ? "text-yellow-500" : isDark ? "text-gray-400" : "text-gray-600",
                  currentUser 
                    ? "hover:scale-110 active:scale-95 cursor-pointer hover:text-yellow-400" 
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
