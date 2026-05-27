import React from "react";
import { Heart, MessageSquare, Clock, Eye, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { calculateReadingTime, formatDate, cn, formatNumber, slugify } from "../../../lib/utils";
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
        textLabel: "text-amber-600 dark:text-amber-400",
        hoverBorder: "group-hover:border-amber-500/40 dark:group-hover:border-amber-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]",
      };
    case "dossiês":
    case "dossies":
      return {
        textHover: "group-hover:text-blue-500 dark:group-hover:text-blue-400",
        textLabel: "text-blue-600 dark:text-blue-400",
        hoverBorder: "group-hover:border-blue-500/40 dark:group-hover:border-blue-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]",
      };
    case "retrocafé":
    case "retrocafe":
    case "retro-café":
      return {
        textHover: "group-hover:text-orange-500 dark:group-hover:text-orange-400",
        textLabel: "text-orange-600 dark:text-orange-450",
        hoverBorder: "group-hover:border-orange-500/40 dark:group-hover:border-orange-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(249,115,22,0.25)]",
      };
    case "especial":
      return {
        textHover: "group-hover:text-purple-500 dark:group-hover:text-purple-400",
        textLabel: "text-purple-600 dark:text-purple-400",
        hoverBorder: "group-hover:border-purple-500/40 dark:group-hover:border-purple-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]",
      };
    case "nostalgia":
      return {
        textHover: "group-hover:text-pink-500 dark:group-hover:text-pink-400",
        textLabel: "text-pink-600 dark:text-pink-400",
        hoverBorder: "group-hover:border-pink-500/40 dark:group-hover:border-pink-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]",
      };
    case "cultura pop":
    case "culturapop":
      return {
        textHover: "group-hover:text-emerald-500 dark:group-hover:text-emerald-400",
        textLabel: "text-emerald-600 dark:text-emerald-400",
        hoverBorder: "group-hover:border-emerald-500/40 dark:group-hover:border-emerald-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]",
      };
    case "rpg & mmo":
    case "rpg mmo":
    case "rpg":
      return {
        textHover: "group-hover:text-cyan-500 dark:group-hover:text-cyan-400",
        textLabel: "text-cyan-600 dark:text-cyan-400",
        hoverBorder: "group-hover:border-cyan-500/40 dark:group-hover:border-cyan-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]",
      };
    default:
      return {
        textHover: "group-hover:text-purple-500 dark:group-hover:text-purple-400",
        textLabel: "text-purple-600 dark:text-purple-400",
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

  // Variant Compact: Mantém estrutura em caixa clássica de glassmorphism para tabelas de administração e painéis
  if (isCompact) {
    return (
      <article
        className={cn(
          "flex flex-col h-full group relative overflow-hidden rounded-2xl border transition-all duration-300 glass-card glass-card-hover shadow-[4px_4px_0px_rgba(0,0,0,0.05)]",
          isDark ? "border-purple-500/10" : "border-black/5",
          cardStyles.hoverBorder,
          cardStyles.hoverShadow
        )}
      >
        <Link 
          to={targetPath} 
          className="absolute inset-0 z-0" 
          aria-label={`Ler matéria: ${post.title}`}
        />

        {/* Thumbnail Compact */}
        <div
          className={cn(
            "w-full h-32 sm:h-40 relative overflow-hidden border-b border-black/10 dark:border-white/5 flex items-center justify-center z-10 pointer-events-none",
            isDark ? "bg-gray-900" : "bg-snes-mid/20",
            !post.imageUrl && !imgError && post.gradient && `bg-gradient-to-br ${post.gradient}`
          )}
        >
          {post.imageUrl && !imgError && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              style={{ objectPosition: post.imagePosition || "center" }}
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 scanline-overlay opacity-30 group-hover:opacity-75 transition-opacity duration-300 z-10" />
        </div>

        {/* Conteúdo Compact */}
        <div className="flex flex-col flex-grow p-3 relative z-10 pointer-events-none">
          <h3 className={cn(
            "font-retro font-bold uppercase line-clamp-2 leading-tight transition-colors duration-300 text-xs mb-2",
            cardStyles.textHover
          )}>
            {post.title}
          </h3>

          {/* Footer Compact */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/5 dark:border-white/5">
            <span className={cn("font-retro font-bold uppercase tracking-wider text-[9px] sm:text-[10px] whitespace-nowrap", isDark ? "opacity-60" : "opacity-80")}>
              {formatDate(post.createdAt, post.date ?? undefined)}
            </span>

            <div className="flex items-center gap-2 ml-auto relative z-20 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              <button
                className={cn(
                  "flex items-center gap-1 font-bold transition-all text-[10px]",
                  hasLiked 
                    ? "text-red-500 scale-105" 
                    : isDark 
                    ? "text-gray-400 hover:text-red-400 hover:scale-110" 
                    : "text-gray-600 hover:text-red-500 hover:scale-110",
                  currentUser ? "active:scale-95 cursor-pointer" : isDark ? "opacity-40" : "opacity-50"
                )}
                onClick={() => currentUser ? likeMutation.mutate({ postId: post.id, userId: currentUser.id }) : null}
                disabled={!currentUser}
              >
                <Heart className="w-3 h-3" />
                <span>{formatNumber(post.likes || 0)}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Variant Default: Design Editorial "Borderless" Premium
  // A caixa e bordas externas são removidas; o contorno e as auras de categoria residem inteiramente na imagem
  return (
    <article
      className="flex flex-col h-full group relative transition-all duration-300 hover:translate-y-[-4px]"
    >
      <Link 
        to={targetPath} 
        className="absolute inset-0 z-0" 
        aria-label={`Ler matéria: ${post.title}`}
      />

      {/* Thumbnail Container (Image gets borders/shadows/glows) */}
      <div
        className={cn(
          "w-full aspect-video md:aspect-[16/10] relative overflow-hidden rounded-3xl border transition-all duration-500 bg-gray-900 z-10 pointer-events-none shadow-md",
          isDark 
            ? "border-purple-500/10 shadow-[6px_6px_0px_rgba(0,0,0,0.35)]" 
            : "border-black/5 shadow-[6px_6px_0px_rgba(45,27,105,0.05)]",
          cardStyles.hoverBorder,
          cardStyles.hoverShadow
        )}
      >
        {post.imageUrl && !imgError && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
             <p className={cn(
               "text-[9px] sm:text-[10px] font-bold uppercase leading-tight max-w-[200px]",
               isDark ? "text-gray-400" : "text-gray-600"
             )}>
               Textura no setor {randomSector} corrompida...
             </p>
          </div>
        )}

        {/* CRT Scanlines Overlay */}
        <div className="absolute inset-0 scanline-overlay opacity-30 group-hover:opacity-60 transition-opacity duration-300 z-10" />

        {/* Score Badge floating top-right */}
        {post.score && (
          <div className="absolute top-4 right-4 z-20">
            <ScoreBadge score={post.score} />
          </div>
        )}
      </div>

      {/* Conteúdo Area (Borderless, sitting directly on page bg) */}
      <div className="flex flex-col flex-grow mt-4 px-1 relative z-10 pointer-events-none">
        {/* Editorial Metadata HUD */}
        <div className="flex items-center gap-2 mb-2 text-[10px] font-retro font-bold uppercase tracking-wider">
          <span className={cn("transition-colors duration-300", cardStyles.textLabel)}>
            {post.category}
          </span>
          <span className="text-slate-600 dark:text-slate-500">•</span>
          <span className="text-slate-500 dark:text-slate-400">
            {formatDate(post.createdAt, post.date ?? undefined)}
          </span>
        </div>

        <h3 className={cn(
          "font-retro font-bold uppercase line-clamp-2 leading-snug transition-colors duration-300 mb-2.5 text-base md:text-lg lg:text-xl",
          cardStyles.textHover
        )}>
          {post.title}
        </h3>
        
        <p className={cn("text-xs md:text-sm mb-5 line-clamp-3 flex-grow leading-relaxed font-medium", isDark ? "text-gray-400" : "text-gray-600")}>
          {post.excerpt}
        </p>

        {/* Footer do card com HUD de ações minimalista */}
        <div className="flex items-center justify-between mt-auto pt-3.5 border-t border-black/5 dark:border-white/5">
          {/* Tempo de leitura */}
          <span className={cn("text-[9px] sm:text-[10px] flex items-center gap-1 font-bold uppercase whitespace-nowrap", isDark ? "opacity-45" : "opacity-60")}>
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {calculateReadingTime(post.content || "").replace(" min de leitura", "m")}
          </span>

          {/* Container de Ações e Status */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto relative z-20 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                className={cn(
                  "flex items-center gap-1 font-bold transition-all text-[11px] sm:text-xs",
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
                <Heart className="w-3.5 h-3.5" />
                <span>{formatNumber(post.likes || 0)}</span>
              </button>

              <button
                className={cn(
                  "flex items-center gap-1 font-bold transition-all text-[11px] sm:text-xs",
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
                <Bookmark className="w-3.5 h-3.5" />
              </button>

              <div className={cn("flex items-center gap-1 font-bold text-[11px] sm:text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{formatNumber(commentCount)}</span>
              </div>

              <div className={cn("flex items-center gap-1 font-bold text-[11px] sm:text-xs", isDark ? "text-gray-500" : "text-gray-400")}>
                <Eye className="w-3.5 h-3.5" />
                <span>{formatNumber(post.views || 0)}</span>
              </div>
            </div>

            {!currentUser && (
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
