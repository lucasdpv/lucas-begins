import React from "react";
import Image from "next/image";
import { Heart, MessageSquare, Clock, Eye, Bookmark } from "lucide-react";
import { Link } from "@/lib/router-compat";
import {
  calculateReadingTime,
  formatDate,
  cn,
  formatNumber,
  slugify,
  splitTitle,
  isValidImageUrl,
} from "../../../lib/utils";
import { useAuth } from "../../../context/AuthProvider";
import { useThemeStore } from "../../../store/useThemeStore";
import { useLikeMutation, useFavoriteMutation } from "../hooks/usePostsQuery";
import { useUserProfile } from "../../../hooks/useUserQuery";
import { useImageFallback } from "../../../hooks/useImageFallback";
import { useUIStore } from "../../../store/useUIStore";
import { useQueryClient } from "@tanstack/react-query";
import { PostService } from "../../../services/postService";
import { Post } from "../schemas";

interface PostCardProps {
  post: Post;
  variant?: "default" | "compact" | "vintage";
  showCategory?: boolean;
  priority?: boolean;
}

const getCategoryCardStyles = (category: string) => {
  const norm = category?.toLowerCase().trim() || "";
  if (norm.includes("review")) {
    return {
      textHover: "group-hover:text-amber-500 dark:group-hover:text-amber-400",
      textLabel: "text-amber-600 dark:text-amber-400",
      pillBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      pillLight: "bg-amber-50 text-amber-700 border-amber-200",
      accentBar: "from-amber-400 to-yellow-500",
      hoverGlow: "hover:border-amber-500/40 hover:shadow-[0_16px_40px_-12px_rgba(245,158,11,0.28)]",
    };
  }
  if (norm.includes("dossi")) {
    return {
      textHover: "group-hover:text-sky-500 dark:group-hover:text-sky-400",
      textLabel: "text-sky-600 dark:text-sky-400",
      pillBg: "bg-sky-500/15 text-sky-400 border-sky-500/30",
      pillLight: "bg-sky-50 text-sky-700 border-sky-200",
      accentBar: "from-sky-400 to-blue-600",
      hoverGlow: "hover:border-sky-500/40 hover:shadow-[0_16px_40px_-12px_rgba(56,189,248,0.28)]",
    };
  }
  if (norm.includes("retro")) {
    return {
      textHover: "group-hover:text-orange-500 dark:group-hover:text-orange-400",
      textLabel: "text-orange-600 dark:text-orange-400",
      pillBg: "bg-orange-500/15 text-orange-400 border-orange-500/30",
      pillLight: "bg-orange-50 text-orange-700 border-orange-200",
      accentBar: "from-orange-400 to-rose-500",
      hoverGlow: "hover:border-orange-500/40 hover:shadow-[0_16px_40px_-12px_rgba(249,115,22,0.28)]",
    };
  }
  if (norm.includes("anime") || norm.includes("nostalgia")) {
    return {
      textHover: "group-hover:text-pink-500 dark:group-hover:text-pink-400",
      textLabel: "text-pink-600 dark:text-pink-400",
      pillBg: "bg-pink-500/15 text-pink-400 border-pink-500/30",
      pillLight: "bg-pink-50 text-pink-700 border-pink-200",
      accentBar: "from-pink-400 to-fuchsia-500",
      hoverGlow: "hover:border-pink-500/40 hover:shadow-[0_16px_40px_-12px_rgba(236,72,153,0.28)]",
    };
  }
  if (norm.includes("pop") || norm.includes("cultura")) {
    return {
      textHover: "group-hover:text-emerald-500 dark:group-hover:text-emerald-400",
      textLabel: "text-emerald-600 dark:text-emerald-400",
      pillBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      pillLight: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accentBar: "from-emerald-400 to-teal-500",
      hoverGlow: "hover:border-emerald-500/40 hover:shadow-[0_16px_40px_-12px_rgba(16,185,129,0.28)]",
    };
  }
  if (norm.includes("rpg") || norm.includes("mmo")) {
    return {
      textHover: "group-hover:text-cyan-500 dark:group-hover:text-cyan-400",
      textLabel: "text-cyan-600 dark:text-cyan-400",
      pillBg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
      pillLight: "bg-cyan-50 text-cyan-700 border-cyan-200",
      accentBar: "from-cyan-400 to-blue-500",
      hoverGlow: "hover:border-cyan-500/40 hover:shadow-[0_16px_40px_-12px_rgba(6,182,212,0.28)]",
    };
  }
  return {
    textHover: "group-hover:text-purple-500 dark:group-hover:text-purple-400",
    textLabel: "text-purple-600 dark:text-purple-400",
    pillBg: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    pillLight: "bg-purple-50 text-purple-700 border-purple-200",
    accentBar: "from-purple-500 to-fuchsia-500",
    hoverGlow: "hover:border-purple-500/40 hover:shadow-[0_16px_40px_-12px_rgba(168,85,247,0.28)]",
  };
};

export default function PostCard({
  post,
  variant = "default",
  showCategory = true,
  priority = false,
}: PostCardProps) {
  const { isDark } = useThemeStore();
  const { currentUser } = useAuth();
  const { setIsLoginModalOpen } = useUIStore();
  const { data: profile } = useUserProfile(currentUser?.id);
  const likeMutation = useLikeMutation();
  const favoriteMutation = useFavoriteMutation();
  const imgError = useImageFallback(post.imageUrl ?? undefined);
  const [randomSector] = React.useState(() => Math.floor(Math.random() * 99));
  const queryClient = useQueryClient();

  const hasLiked = currentUser && post.likedBy?.includes(currentUser.id);
  const commentCount = post.commentsCount || post.comments?.length || 0;
  const isCompact = variant === "compact";
  const isVintage = variant === "vintage";

  const targetSlug = post.slug || slugify(post.title);
  const targetPath = `/post/${targetSlug}`;
  const cardStyles = getCategoryCardStyles(post.category);
  const { mainTitle, subtitle } = splitTitle(post.title);

  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["postBySlug", targetSlug],
      queryFn: () => PostService.getPostBySlug(targetSlug),
      staleTime: 1000 * 60 * 10,
    });
  };

  // Variant Compact: Card enxuto para listas secundárias
  if (isCompact) {
    return (
      <article
        className={cn(
          "flex flex-col h-full group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1",
          isDark
            ? "bg-[#121024]/90 border-white/[0.08] text-slate-100 shadow-lg"
            : "bg-white border-slate-200/80 text-slate-900 shadow-sm",
          cardStyles.hoverGlow
        )}
        onMouseEnter={handlePrefetch}
        onTouchStart={handlePrefetch}
      >
        <Link
          to={targetPath}
          className="absolute inset-0 z-0"
          aria-label={`Ler matéria: ${post.title}`}
        />

        <div
          className={cn(
            "w-full h-36 sm:h-40 relative overflow-hidden flex items-center justify-center z-10 pointer-events-none",
            isDark ? "bg-slate-900" : "bg-slate-100"
          )}
        >
          {post.imageUrl && isValidImageUrl(post.imageUrl) && !imgError && (
            <Image
              src={post.imageUrl}
              alt={post.title}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ objectPosition: post.imagePosition || "center" }}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
              priority={priority}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="flex flex-col flex-grow p-4 relative z-10 pointer-events-none">
          {mainTitle ? (
            <div className="flex flex-col gap-0.5 mb-2">
              <h3
                className={cn(
                  "font-retro font-bold uppercase line-clamp-2 leading-snug transition-colors duration-300 text-xs sm:text-sm",
                  cardStyles.textHover,
                  isDark ? "text-slate-100" : "text-slate-900"
                )}
              >
                {mainTitle}
              </h3>
              <span
                className={cn(
                  "font-sans text-[11px] leading-tight mt-0.5 line-clamp-1",
                  isDark ? "text-slate-400" : "text-slate-600"
                )}
              >
                {subtitle}
              </span>
            </div>
          ) : (
            <h3
              className={cn(
                "font-retro font-bold uppercase line-clamp-2 leading-snug transition-colors duration-300 text-xs sm:text-sm mb-2",
                cardStyles.textHover,
                isDark ? "text-slate-100" : "text-slate-900"
              )}
            >
              {subtitle}
            </h3>
          )}

          <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-black/5 dark:border-white/[0.06]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 whitespace-nowrap">
              {formatDate(post.createdAt, post.date ?? undefined)}
            </span>

            <div
              className="flex items-center gap-2 ml-auto relative z-20 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={cn(
                  "flex items-center gap-1 font-bold transition-all text-xs active:scale-95 cursor-pointer",
                  hasLiked
                    ? "text-rose-500 scale-105"
                    : isDark
                    ? "text-slate-400 hover:text-rose-400"
                    : "text-slate-500 hover:text-rose-500"
                )}
                onClick={() =>
                  currentUser
                    ? likeMutation.mutate({ postId: post.id, userId: currentUser.id })
                    : setIsLoginModalOpen(true)
                }
                title={currentUser ? "Curtir" : "Faça login para curtir"}
              >
                <Heart className={cn("w-3.5 h-3.5", hasLiked && "fill-current")} />
                <span>{formatNumber(post.likes || 0)}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Variant Vintage (Recém-Adicionados): pôster com o texto sobre a arte, no mesmo padrão
  // dos cards de RetroCafé e Dossiê.
  if (isVintage) {
    return (
      <article
        className={cn(
          "flex flex-col justify-end min-h-[300px] xl:min-h-[340px] h-full group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 select-none",
          isDark
            ? "bg-[#121024]/90 border-white/[0.08] text-white shadow-[0_14px_34px_-12px_rgba(0,0,0,0.65)]"
            : "bg-white border-slate-200/80 text-slate-900 shadow-[0_10px_28px_-10px_rgba(15,23,42,0.08)]",
          cardStyles.hoverGlow
        )}
        onMouseEnter={handlePrefetch}
        onTouchStart={handlePrefetch}
      >
        <Link
          to={targetPath}
          className="absolute inset-0 z-[1]"
          aria-label={`Ler matéria: ${post.title}`}
        />

        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none bg-slate-950">
          {post.imageUrl && isValidImageUrl(post.imageUrl) && !imgError && (
            <Image
              src={post.imageUrl}
              alt={post.title}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              style={{ objectPosition: post.imagePosition || "center" }}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              priority={priority}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090812]/95 from-5% via-[#090812]/50 via-45% to-transparent" />
        </div>

        {post.score && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none select-none">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full font-retro font-black text-[10px] bg-amber-400 text-slate-950 uppercase tracking-wider shadow-md">
              ★ {post.score}
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3 z-10 pointer-events-none flex items-center gap-1.5 font-mono text-[9px] text-slate-200">
          <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10">
            <Eye className="w-3 h-3" />
            {formatNumber(post.views || 0)}
          </span>
          <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10 uppercase">
            <Clock className="w-3 h-3" />
            {calculateReadingTime(post.content || "").replace(" min de leitura", " min")}
          </span>
        </div>

        <div className="relative z-10 pointer-events-none flex flex-col gap-2 p-4 sm:p-5 min-w-0 [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
          <div className="flex items-center gap-2 min-w-0 text-[10px] font-retro font-bold uppercase tracking-wider">
            <span
              className={cn(
                "text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-full border shrink-0 [text-shadow:none]",
                isDark ? cardStyles.pillBg : cardStyles.pillLight
              )}
            >
              {post.category}
            </span>
            <span className="whitespace-nowrap truncate text-slate-300">
              {formatDate(post.createdAt, post.date ?? undefined)}
            </span>
          </div>

          {mainTitle ? (
            <div className="flex flex-col gap-0.5 min-w-0">
              <h3
                className={cn(
                  "font-retro font-bold uppercase leading-snug transition-colors duration-300 text-sm xl:text-base text-white [text-wrap:balance]",
                  cardStyles.textHover
                )}
              >
                {mainTitle}
              </h3>
              <span className={cn("font-sans text-xs leading-snug font-semibold", cardStyles.textLabel)}>
                {subtitle}
              </span>
            </div>
          ) : (
            <h3
              className={cn(
                "font-retro font-bold uppercase leading-snug transition-colors duration-300 text-sm xl:text-base text-white [text-wrap:balance]",
                cardStyles.textHover
              )}
            >
              {subtitle}
            </h3>
          )}
        </div>
      </article>
    );
  }

  // Variant Default: Card Widescreen Catálogo Completo
  return (
    <article
      className={cn(
        "flex flex-col h-full group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5",
        isDark
          ? "bg-[#121024]/90 border-white/[0.08] text-slate-100 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.7)]"
          : "bg-white border-slate-200/80 text-slate-900 shadow-[0_12px_30px_-10px_rgba(15,23,42,0.08)]",
        cardStyles.hoverGlow
      )}
      onMouseEnter={handlePrefetch}
      onTouchStart={handlePrefetch}
    >
      <Link
        to={targetPath}
        className="absolute inset-0 z-0"
        aria-label={`Ler matéria: ${post.title}`}
      />

      {/* Thumbnail Widescreen */}
      <div className="w-full aspect-video relative overflow-hidden bg-slate-950 z-10 pointer-events-none shrink-0">
        {post.imageUrl && isValidImageUrl(post.imageUrl) && !imgError && (
          <Image
            src={post.imageUrl}
            alt={post.title}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ objectPosition: post.imagePosition || "center" }}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            priority={priority}
          />
        )}

        {imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
            <div className="text-rose-400 font-retro text-[10px] mb-1 bg-black/50 px-2.5 py-1 rounded-full border border-rose-500/40">
              ⚠️ SINAL INDISPONÍVEL
            </div>
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Setor {randomSector}
            </p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#121024] via-transparent to-transparent opacity-60 pointer-events-none" />

        {showCategory && (
          <div className="absolute top-3 left-3 z-20 pointer-events-none flex items-center gap-2">
            <span
              className={cn(
                "text-[9px] font-retro font-black uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md",
                isDark ? cardStyles.pillBg : "bg-black/75 text-white border-white/15"
              )}
            >
              {post.category}
            </span>
            {post.score && (
              <span className="text-[9px] font-retro font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow">
                ★ {post.score}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-grow p-5 relative z-10 pointer-events-none">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
          <span>{formatDate(post.createdAt, post.date ?? undefined)}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-400" />
            {calculateReadingTime(post.content || "").replace(" min de leitura", " min")}
          </span>
        </div>

        {mainTitle ? (
          <div className="flex flex-col gap-1 mb-2.5">
            <h3
              className={cn(
                "font-retro font-bold uppercase line-clamp-2 leading-snug transition-colors duration-300 text-base",
                cardStyles.textHover,
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              {mainTitle}
            </h3>
            <span
              className={cn(
                "font-sans text-xs font-semibold leading-snug line-clamp-1",
                cardStyles.textLabel
              )}
            >
              {subtitle}
            </span>
          </div>
        ) : (
          <h3
            className={cn(
              "font-retro font-bold uppercase line-clamp-2 leading-snug transition-colors duration-300 mb-2.5 text-base",
              cardStyles.textHover,
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            {subtitle}
          </h3>
        )}

        {post.excerpt && (
          <p
            className={cn(
              "text-xs leading-relaxed line-clamp-2 mb-4",
              isDark ? "text-slate-400" : "text-slate-500"
            )}
          >
            {post.excerpt}
          </p>
        )}

        <div
          className={cn(
            "flex items-center justify-between mt-auto pt-3.5 border-t",
            isDark ? "border-white/[0.06]" : "border-slate-100"
          )}
        >
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              {formatNumber(post.views || 0)}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              {formatNumber(commentCount)}
            </span>
          </div>

          <div
            className="flex items-center gap-3 ml-auto relative z-20 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={cn(
                "flex items-center gap-1 font-bold transition-all text-xs active:scale-95 cursor-pointer",
                hasLiked
                  ? "text-rose-500 scale-105"
                  : isDark
                  ? "text-slate-400 hover:text-rose-400"
                  : "text-slate-500 hover:text-rose-500"
              )}
              onClick={() =>
                currentUser
                  ? likeMutation.mutate({ postId: post.id, userId: currentUser.id })
                  : setIsLoginModalOpen(true)
              }
              title={currentUser ? "Curtir" : "Faça login para curtir"}
            >
              <Heart className={cn("w-4 h-4", hasLiked && "fill-current")} />
              <span>{formatNumber(post.likes || 0)}</span>
            </button>

            <button
              className={cn(
                "flex items-center transition-all active:scale-95 cursor-pointer",
                profile?.favorites?.includes(post.id)
                  ? "text-amber-400 scale-105"
                  : isDark
                  ? "text-slate-400 hover:text-amber-400"
                  : "text-slate-500 hover:text-amber-500"
              )}
              onClick={() => {
                if (currentUser) {
                  const isFavorited = profile?.favorites?.includes(post.id) || false;
                  favoriteMutation.mutate({
                    userId: currentUser.id,
                    postId: post.id,
                    isFavorited,
                  });
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              title={currentUser ? "Salvar na Minha Lista" : "Faça login para salvar"}
            >
              <Bookmark
                className={cn(
                  "w-4 h-4",
                  profile?.favorites?.includes(post.id) && "fill-current"
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
