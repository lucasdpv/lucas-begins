import React from "react";
import { Heart, MessageSquare, Clock, Eye, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { calculateReadingTime, formatDate, cn, formatNumber, slugify } from "../../../lib/utils";
import { useAuth } from "../../../context/AuthProvider";
import { useThemeStore } from "../../../store/useThemeStore";
import { useLikeMutation, useFavoriteMutation } from "../hooks/usePostsQuery";
import { useUserProfile } from "../../../hooks/useUserQuery";
import { useImageFallback } from "../../../hooks/useImageFallback";
import { useUIStore } from "../../../store/useUIStore";
import { Post } from "../schemas";

interface PostCardProps {
  post: Post;
  variant?: "default" | "compact" | "vintage";
  showCategory?: boolean;
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
        hoverShadowBrutal: "hover:shadow-[6px_6px_0px_rgba(234,179,8,1)]",
        hoverShadowBrutalCompact: "hover:shadow-[4px_4px_0px_rgba(234,179,8,1)]",
      };
    case "dossiês":
    case "dossies":
    case "dossiê":
    case "dossie":
      return {
        textHover: "group-hover:text-blue-500 dark:group-hover:text-blue-400",
        textLabel: "text-blue-600 dark:text-blue-400",
        hoverBorder: "group-hover:border-blue-500/40 dark:group-hover:border-blue-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]",
        hoverShadowBrutal: "hover:shadow-[6px_6px_0px_rgba(59,130,246,1)]",
        hoverShadowBrutalCompact: "hover:shadow-[4px_4px_0px_rgba(59,130,246,1)]",
      };
    case "retrocafé":
    case "retrocafe":
    case "retro-café":
      return {
        textHover: "group-hover:text-orange-500 dark:group-hover:text-orange-400",
        textLabel: "text-orange-600 dark:text-orange-450",
        hoverBorder: "group-hover:border-orange-500/40 dark:group-hover:border-orange-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(249,115,22,0.25)]",
        hoverShadowBrutal: "hover:shadow-[6px_6px_0px_rgba(249,115,22,1)]",
        hoverShadowBrutalCompact: "hover:shadow-[4px_4px_0px_rgba(249,115,22,1)]",
      };
    case "especial":
      return {
        textHover: "group-hover:text-purple-500 dark:group-hover:text-purple-400",
        textLabel: "text-purple-600 dark:text-purple-400",
        hoverBorder: "group-hover:border-purple-500/40 dark:group-hover:border-purple-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]",
        hoverShadowBrutal: "hover:shadow-[6px_6px_0px_rgba(168,85,247,1)]",
        hoverShadowBrutalCompact: "hover:shadow-[4px_4px_0px_rgba(168,85,247,1)]",
      };
    case "nostalgia":
      return {
        textHover: "group-hover:text-pink-500 dark:group-hover:text-pink-400",
        textLabel: "text-pink-600 dark:text-pink-400",
        hoverBorder: "group-hover:border-pink-500/40 dark:group-hover:border-pink-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]",
        hoverShadowBrutal: "hover:shadow-[6px_6px_0px_rgba(236,72,153,1)]",
        hoverShadowBrutalCompact: "hover:shadow-[4px_4px_0px_rgba(236,72,153,1)]",
      };
    case "cultura pop":
    case "culturapop":
      return {
        textHover: "group-hover:text-emerald-500 dark:group-hover:text-emerald-400",
        textLabel: "text-emerald-600 dark:text-emerald-400",
        hoverBorder: "group-hover:border-emerald-500/40 dark:group-hover:border-emerald-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]",
        hoverShadowBrutal: "hover:shadow-[6px_6px_0px_rgba(16,185,129,1)]",
        hoverShadowBrutalCompact: "hover:shadow-[4px_4px_0px_rgba(16,185,129,1)]",
      };
    case "rpg & mmo":
    case "rpg mmo":
    case "rpg":
      return {
        textHover: "group-hover:text-cyan-500 dark:group-hover:text-cyan-400",
        textLabel: "text-cyan-600 dark:text-cyan-400",
        hoverBorder: "group-hover:border-cyan-500/40 dark:group-hover:border-cyan-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]",
        hoverShadowBrutal: "hover:shadow-[6px_6px_0px_rgba(6,182,212,1)]",
        hoverShadowBrutalCompact: "hover:shadow-[4px_4px_0px_rgba(6,182,212,1)]",
      };
    default:
      return {
        textHover: "group-hover:text-purple-500 dark:group-hover:text-purple-400",
        textLabel: "text-purple-600 dark:text-purple-400",
        hoverBorder: "group-hover:border-purple-500/40 dark:group-hover:border-purple-400/40",
        hoverShadow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]",
        hoverShadowBrutal: "hover:shadow-[6px_6px_0px_rgba(168,85,247,1)]",
        hoverShadowBrutalCompact: "hover:shadow-[4px_4px_0px_rgba(168,85,247,1)]",
      };
  }
};

export default function PostCard({ post, variant = "default", showCategory = true }: PostCardProps) {
  const { isDark } = useThemeStore();
  const { currentUser } = useAuth();
  const { setIsLoginModalOpen } = useUIStore();
  const { data: profile } = useUserProfile(currentUser?.id);
  const likeMutation = useLikeMutation();
  const favoriteMutation = useFavoriteMutation();
  const imgError = useImageFallback(post.imageUrl ?? undefined);
  const [randomSector] = React.useState(() => Math.floor(Math.random() * 99));

  const hasLiked = currentUser && post.likedBy?.includes(currentUser.id);
  const commentCount = post.comments?.length || 0;
  const isCompact = variant === "compact";
  const isVintage = variant === "vintage";

  const targetSlug = post.slug || slugify(post.title);
  const targetPath = `/post/${targetSlug}`;
  const cardStyles = getCategoryCardStyles(post.category);

  // Variant Compact: Design Card Contido
  if (isCompact) {
    return (
      <article
        className={cn(
          "flex flex-col h-full group relative overflow-hidden rounded-none border-2 transition-all duration-300 hover:translate-y-[-4px]",
          isDark
            ? "bg-[#1f1d35] border-black text-gray-100 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:border-black"
            : "bg-white border-black text-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:border-black",
          cardStyles.hoverShadowBrutalCompact
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
            "group-hover:text-purple-500 dark:group-hover:text-purple-400",
            isDark ? "text-gray-100" : "text-gray-900"
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
                  "flex items-center gap-1 font-bold transition-all text-[10px] active:scale-95 cursor-pointer",
                  hasLiked 
                    ? "text-red-500 scale-105" 
                    : isDark 
                    ? "text-gray-400 hover:text-red-400 hover:scale-110" 
                    : "text-gray-600 hover:text-red-500 hover:scale-110"
                )}
                onClick={() => currentUser ? likeMutation.mutate({ postId: post.id, userId: currentUser.id }) : setIsLoginModalOpen(true)}
                title={currentUser ? "Curtir" : "Faça login para curtir"}
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

  // Variant Vintage: Sleek Neoretro Horizontal Console Lane (Straight lines, brutalist)
  if (isVintage) {
    return (
      <article
        className={cn(
          "flex items-stretch h-[150px] sm:h-[165px] md:h-[180px] group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:translate-x-0.5 active:translate-y-0 select-none border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-none",
          isDark
            ? "bg-[#1f1d35] text-white"
            : "bg-white text-gray-900",
          cardStyles.hoverShadowBrutal
        )}
      >
        <Link
          to={targetPath}
          className="absolute inset-0 z-0"
          aria-label={`Ler matéria: ${post.title}`}
        />

        {/* 1. Category Color Strip (Leftmost visual indicator) */}
        <div className={cn(
          "w-3 shrink-0 border-r-2 border-black",
          post.category.toLowerCase().includes("reviews") ? "bg-yellow-500" :
          post.category.toLowerCase().includes("dossi") ? "bg-blue-500" :
          post.category.toLowerCase().includes("retro") ? "bg-orange-500" : "bg-purple-500"
        )} />

        {/* 2. Visor / Image Box (Rectangular aspect ratio) */}
        <div
          className={cn(
            "w-32 sm:w-40 md:w-48 h-full relative overflow-hidden border-r-2 border-black flex items-center justify-center z-10 pointer-events-none shrink-0 bg-gray-950"
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

          {/* CRT Scanlines Overlay (Very subtle) */}
          <div className="absolute inset-0 scanline-overlay opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-300 z-10" />

          {/* Floating score indicator */}
          {post.score && (
            <div className="absolute top-2 left-2 z-20 pointer-events-none select-none">
              <div className="flex items-center gap-1 px-1.5 py-0.5 font-retro font-black text-[9px] border border-black bg-yellow-400 text-black uppercase tracking-wider leading-none shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                ★ {post.score}
              </div>
            </div>
          )}
        </div>

        {/* 3. Content Block (Title, excerpt, metadata) */}
        <div className="flex flex-col flex-grow relative z-10 pointer-events-none p-3 sm:py-3 sm:px-4 min-w-0">
          {/* Header Row: Category Badge & Date */}
          <div className="flex items-center justify-between text-[9px] font-retro font-bold uppercase tracking-wider select-none text-gray-500 dark:text-gray-400 mb-1 shrink-0">
            <div className="flex items-center gap-2 overflow-hidden min-w-0">
              <span className={cn(
                "text-[8px] font-retro font-black uppercase tracking-widest px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] shrink-0",
                post.category.toLowerCase().includes("reviews") ? "bg-yellow-400 text-black" :
                post.category.toLowerCase().includes("dossi") ? "bg-blue-500 text-white" :
                post.category.toLowerCase().includes("retro") ? "bg-orange-500 text-black" : "bg-purple-500 text-white"
              )}>
                {post.category}
              </span>
              <span className="whitespace-nowrap truncate opacity-70">
                {formatDate(post.createdAt, post.date ?? undefined)}
              </span>
            </div>
            
            <div className="font-mono text-[8px] opacity-75 whitespace-nowrap shrink-0">
              {calculateReadingTime(post.content || "").replace(" min de leitura", " MIN")}
            </div>
          </div>

          {/* Title */}
          <h3 className={cn(
            "font-retro font-bold uppercase line-clamp-2 leading-snug transition-colors duration-300 text-xs sm:text-sm md:text-[15px] mb-1 shrink-0",
            post.category.toLowerCase().includes("reviews") ? "group-hover:text-yellow-500 dark:group-hover:text-yellow-400" :
            post.category.toLowerCase().includes("dossi") ? "group-hover:text-blue-500 dark:group-hover:text-blue-400" :
            post.category.toLowerCase().includes("retro") ? "group-hover:text-orange-500 dark:group-hover:text-orange-400" :
            "group-hover:text-purple-500 dark:group-hover:text-purple-400",
            isDark ? "text-white" : "text-gray-900"
          )}>
            {post.title}
          </h3>

          {/* Excerpt - Hidden on mobile, visible on sm and up */}
          {post.excerpt && (
            <p className={cn(
              "text-[10px] md:text-xs mb-2 line-clamp-2 leading-relaxed opacity-75 hidden sm:block shrink-0",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              {post.excerpt}
            </p>
          )}

          {/* Footer controls row */}
          <div className="mt-auto pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between shrink-0">
            {/* Left spec widgets */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 text-[9px] font-mono font-bold text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-0.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-500 opacity-80" />
                  <span>{formatNumber(commentCount)}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Eye className="w-3.5 h-3.5 text-purple-500 opacity-80" />
                  <span>{formatNumber(post.views || 0)}</span>
                </div>
              </div>
            </div>

            {/* Right action block */}
            <div className="flex items-center gap-2 relative z-20 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-1.5">
                <button
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-none border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 transition-all text-red-500 hover:scale-105 active:scale-95 cursor-pointer hover:border-red-500 dark:hover:border-red-400",
                    hasLiked ? "bg-red-500/10 border-red-500" : ""
                  )}
                  onClick={() => currentUser ? likeMutation.mutate({ postId: post.id, userId: currentUser.id }) : setIsLoginModalOpen(true)}
                  title={currentUser ? "Curtir" : "Faça login para curtir"}
                >
                  <Heart className={cn("w-3 h-3", hasLiked && "fill-current")} />
                </button>

                <button
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-none border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 transition-all text-yellow-500 hover:scale-105 active:scale-95 cursor-pointer hover:border-yellow-500 dark:hover:border-yellow-400",
                    profile?.favorites?.includes(post.id) ? "bg-yellow-500/10 border-yellow-500" : ""
                  )}
                  onClick={() => {
                    if (currentUser) {
                      const isFavorited = profile?.favorites?.includes(post.id) || false;
                      favoriteMutation.mutate({ userId: currentUser.id, postId: post.id, isFavorited });
                    } else {
                      setIsLoginModalOpen(true);
                    }
                  }}
                  title={currentUser ? "Favoritar" : "Faça login para favoritar"}
                >
                  <Bookmark className={cn("w-3 h-3", profile?.favorites?.includes(post.id) && "fill-current")} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Variant Default: Design Card Contido Widescreen (Aspect-Video) Original
  return (
    <article
      className={cn(
        "flex flex-col h-full group relative overflow-hidden rounded-none border-2 transition-all duration-300 hover:translate-y-[-4px]",
        isDark
          ? "bg-[#1f1d35] border-black text-gray-100 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:border-black"
          : "bg-white border-black text-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:border-black",
        cardStyles.hoverShadowBrutal
      )}
    >
      <Link
        to={targetPath}
        className="absolute inset-0 z-0"
        aria-label={`Ler matéria: ${post.title}`}
      />

      {/* Thumbnail — Widescreen aspect ratio */}
      <div
        className={cn(
          "w-full aspect-video relative overflow-hidden bg-gray-900 z-10 pointer-events-none shrink-0"
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
        <div className="absolute inset-0 scanline-overlay opacity-20 group-hover:opacity-45 transition-opacity duration-300 z-10" />

        {/* Category pill — canto inferior esquerdo sobre a imagem */}
        {showCategory && (
          <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
            <span className={cn(
              "text-[9px] font-retro font-black uppercase tracking-widest px-2 py-0.5 rounded border",
              cardStyles.textLabel,
              isDark
                ? "bg-black/70 border-white/10 backdrop-blur-sm"
                : "bg-white/80 border-black/10 backdrop-blur-sm"
            )}>
              {post.category}
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo dentro do card */}
      <div className="flex flex-col flex-grow p-4 relative z-10 pointer-events-none">
        {/* Data */}
        <span className="text-[9px] font-retro font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1.5">
          {formatDate(post.createdAt, post.date ?? undefined)}
        </span>

        <h3 className={cn(
          "font-retro font-bold uppercase line-clamp-2 leading-snug transition-colors duration-300 mb-2 text-sm md:text-base lg:text-[17px]",
          cardStyles.textHover,
          isDark ? "text-gray-100" : "text-gray-900"
        )}>
          {post.title}
        </h3>

        {/* Excerpt preview */}
        {post.excerpt && (
          <p className={cn(
            "text-[11px] md:text-xs leading-relaxed line-clamp-2 mb-3",
            isDark ? "text-slate-400" : "text-slate-500"
          )}>
            {post.excerpt}
          </p>
        )}

        {/* Footer do card com HUD de ações minimalista */}
        <div className={cn(
          "flex items-center justify-between mt-auto pt-3 border-t",
          isDark ? "border-white/5" : "border-black/5"
        )}>
          {/* Tempo de leitura */}
          <span className={cn("text-[9px] sm:text-[10px] flex items-center gap-1 font-bold uppercase whitespace-nowrap", isDark ? "opacity-40" : "opacity-55")}>
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {calculateReadingTime(post.content || "").replace(" min de leitura", "m")}
          </span>

          {/* Container de Ações e Status */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto relative z-20 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                className={cn(
                  "flex items-center gap-1 font-bold transition-all text-[11px] sm:text-xs active:scale-95 cursor-pointer",
                  hasLiked
                    ? "text-red-500 scale-105"
                    : isDark
                    ? "text-gray-400 hover:text-red-400 hover:scale-110"
                    : "text-gray-600 hover:text-red-500 hover:scale-110"
                )}
                onClick={() => currentUser ? likeMutation.mutate({ postId: post.id, userId: currentUser.id }) : setIsLoginModalOpen(true)}
                title={currentUser ? "Curtir" : "Faça login para curtir"}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{formatNumber(post.likes || 0)}</span>
              </button>

              <button
                className={cn(
                  "flex items-center gap-1 font-bold transition-all text-[11px] sm:text-xs active:scale-95 cursor-pointer",
                  profile?.favorites?.includes(post.id)
                    ? "text-yellow-500 scale-105"
                    : isDark
                    ? "text-gray-400 hover:text-yellow-400 hover:scale-110"
                    : "text-gray-600 hover:text-yellow-500 hover:scale-110"
                )}
                onClick={() => {
                  if (currentUser) {
                    const isFavorited = profile?.favorites?.includes(post.id) || false;
                    favoriteMutation.mutate({ userId: currentUser.id, postId: post.id, isFavorited });
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
                title={currentUser ? "Favoritar" : "Faça login para favoritar"}
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
          </div>
        </div>
      </div>
    </article>
  );
}

