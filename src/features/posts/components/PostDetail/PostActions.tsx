import React from "react";
import { 
  Clock, 
  Share2, 
  Eye, 
  Heart, 
  Bookmark, 
  Lock 
} from "lucide-react";
import { cn, formatDate, calculateReadingTime, formatNumber } from "../../../../lib/utils";
import { Post } from "../../schemas";

interface PostActionsProps {
  post: Post;
  currentUser: any;
  isDark: boolean;
  onLike: () => void;
  onFavorite: () => void;
  onShare: () => void;
  onLoginClick: () => void;
  isFavorited: boolean;
  authLoading: boolean;
}

export default function PostActions({
  post,
  currentUser,
  isDark,
  onLike,
  onFavorite,
  onShare,
  onLoginClick,
  isFavorited,
  authLoading
}: PostActionsProps) {
  const hasLiked = currentUser && post.likedBy?.includes(currentUser.id);

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b-4", isDark ? "border-gray-800" : "border-gray-200")}>
      <div className="flex items-center gap-4">
        <div className="relative">
          {post.author?.avatar ? (
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="w-14 h-14 rounded-2xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] object-cover" 
            />
          ) : (
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]", isDark ? "bg-purple-900" : "bg-purple-200")}>
              ✍️
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black px-1.5 py-0.5 rounded-lg border-2 border-black font-retro font-bold text-[8px] shadow-[2px_2px_0px_rgba(0,0,0,1)] z-10">
            LV.{post.author?.level || 1}
          </div>
        </div>
        <div className="flex-1">
          <p className="font-retro font-bold text-lg uppercase tracking-wide">
            {post.author?.name || "Autor Desconhecido"}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-gray-500 font-bold text-xs uppercase">
               {formatDate(post.createdAt, (post as any).date ?? undefined)}
            </span>
            <span className="text-gray-500 font-bold text-xs flex items-center gap-1 uppercase">
              <Clock className="w-3 h-3" /> {calculateReadingTime(post.content || "")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onShare}
          className={cn(
            "h-11 w-11 md:h-12 md:w-12 rounded-2xl border-2 transition-all hover:scale-105 flex items-center justify-center shrink-0",
            isDark 
              ? "bg-gray-800 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
              : "bg-white border-snes-dark/20 text-snes-accent shadow-sm"
          )}
          title="Compartilhar"
        >
          <Share2 className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <div className={cn(
          "flex items-center justify-center gap-1.5 md:gap-2 h-11 px-3 md:h-12 md:px-5 rounded-2xl border-2 font-bold text-xs md:text-base cursor-default shrink-0",
          isDark 
            ? "bg-gray-800/40 border-gray-700 text-gray-400 shadow-inner" 
            : "bg-gray-50 border-gray-200 text-gray-500 shadow-inner"
        )}>
          <Eye className="w-4 h-4 md:w-5 md:h-5 opacity-60" />
          <span className="font-retro">{formatNumber(post.views || 0)}</span>
        </div>

        {authLoading ? (
          <div className="h-12 w-24 bg-gray-500/10 animate-pulse rounded-2xl border-2 border-dashed border-gray-500/20" />
        ) : (
          <>
            {currentUser ? (
              <button
                onClick={onLike}
                className={cn(
                  "flex items-center justify-center gap-1.5 md:gap-3 h-11 px-3 md:h-12 md:px-6 rounded-2xl font-retro font-bold text-xs md:text-base uppercase border-2 transition-all hover:scale-105 active:scale-95 shadow-lg shrink-0",
                  hasLiked 
                    ? "bg-red-500 border-red-400 text-white shadow-red-500/20" 
                    : isDark 
                      ? "bg-gray-800 border-purple-500/50 text-white shadow-purple-500/10" 
                      : "bg-white border-snes-dark/20 text-snes-accent shadow-sm"
                )}
              >
                <Heart className={cn("w-4 h-4 md:w-5 md:h-5 transition-transform", hasLiked ? "fill-current scale-110" : "group-hover:fill-current")} />
                <span>{formatNumber(post.likes || 0)}</span>
              </button>
            ) : (
              <div className={cn(
                "flex items-center justify-center gap-1.5 md:gap-3 h-11 px-3 md:h-12 md:px-6 rounded-2xl border-2 font-bold text-xs md:text-base opacity-60 cursor-not-allowed shrink-0",
                isDark ? "bg-gray-800 border-gray-700 text-gray-500" : "bg-gray-100 border-gray-200 text-gray-400"
              )}>
                <Heart className="w-4 h-4 md:w-5 md:h-5" />
                <span>{formatNumber(post.likes || 0)}</span>
              </div>
            )}

            {currentUser && (
              <button
                onClick={onFavorite}
                title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                className={cn(
                  "flex items-center justify-center gap-1.5 md:gap-3 h-11 px-3 md:h-12 md:px-6 rounded-2xl font-retro font-bold text-xs md:text-base uppercase border-2 transition-all hover:scale-105 active:scale-95 shadow-lg shrink-0",
                  isFavorited 
                    ? "bg-yellow-400 border-yellow-500 text-black shadow-yellow-400/20" 
                    : isDark 
                      ? "bg-gray-800 border-purple-500/50 text-white shadow-purple-500/10" 
                      : "bg-white border-snes-dark/20 text-snes-accent shadow-sm"
                )}
              >
                <Bookmark className={cn("w-4 h-4 md:w-5 md:h-5 transition-transform", isFavorited ? "fill-current scale-110" : "group-hover:fill-current")} />
                <span className="hidden md:inline">{isFavorited ? "Salvo" : "Salvar"}</span>
              </button>
            )}

            {!currentUser && (
              <button
                onClick={onLoginClick}
                className={cn(
                  "flex items-center justify-center gap-2 h-11 px-4 md:h-12 md:px-6 rounded-2xl border-2 font-retro font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shrink-0",
                  isDark 
                    ? "bg-purple-600 border-purple-400 text-white shadow-purple-500/20" 
                    : "bg-purple-600 border-purple-700 text-white shadow-purple-600/20"
                )}
              >
                <Lock className="w-4 h-4" />
                <span className="hidden md:inline">LOGIN</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
