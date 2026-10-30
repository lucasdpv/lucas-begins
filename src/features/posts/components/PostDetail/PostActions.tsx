import React from "react";
import { Clock, Share2, Eye, Heart, Bookmark, Lock } from "lucide-react";
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
  isPreview?: boolean;
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
  authLoading,
  isPreview = false,
}: PostActionsProps) {
  const hasLiked = currentUser && post.likedBy?.includes(currentUser.id);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b",
        isDark ? "border-white/[0.08]" : "border-slate-200"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          {post.author?.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-14 h-14 rounded-2xl border border-purple-500/40 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)] object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border border-white/10 bg-purple-950/60 shadow-lg">
              ✍️
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full border border-amber-300 font-retro font-black text-[9px] shadow-md z-10">
            LV.{post.author?.level || 1}
          </div>
        </div>
        <div className="flex-1">
          <p className="font-retro font-black text-lg uppercase tracking-wide text-white">
            {post.author?.name || "Autor Desconhecido"}
          </p>
          <div className="flex flex-wrap items-center gap-2.5 mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-400">
            <span>{formatDate(post.createdAt, (post as any).date ?? undefined)}</span>
            <span className="opacity-40">·</span>
            <span className="flex items-center gap-1.5 text-purple-300">
              <Clock className="w-3.5 h-3.5" /> {calculateReadingTime(post.content || "")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onShare}
          disabled={isPreview}
          className={cn(
            "h-11 w-11 md:h-12 md:w-12 rounded-2xl border transition-all flex items-center justify-center shrink-0 cursor-pointer",
            isPreview ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95",
            isDark
              ? "bg-white/[0.04] border-white/[0.1] hover:border-purple-500/50 text-purple-400"
              : "bg-white border-slate-200 text-slate-800 shadow-sm"
          )}
          title={isPreview ? "Indisponível no modo Preview" : "Compartilhar"}
        >
          <Share2 className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        <div
          className={cn(
            "flex items-center justify-center gap-2 h-11 px-4 md:h-12 md:px-5 rounded-2xl border font-bold text-xs md:text-sm cursor-default shrink-0",
            isDark
              ? "bg-white/[0.03] border-white/[0.08] text-slate-300"
              : "bg-slate-50 border-slate-200 text-slate-600"
          )}
        >
          <Eye className="w-4 h-4 text-purple-400" />
          <span className="font-mono">{formatNumber(post.views || 0)}</span>
        </div>

        {authLoading ? (
          <div className="h-12 w-24 bg-white/[0.05] animate-pulse rounded-2xl border border-white/10" />
        ) : (
          <>
            {currentUser ? (
              <button
                type="button"
                onClick={onLike}
                disabled={isPreview}
                className={cn(
                  "flex items-center justify-center gap-2 h-11 px-4 md:h-12 md:px-5 rounded-2xl font-retro font-black text-xs md:text-sm uppercase border transition-all shrink-0 cursor-pointer",
                  isPreview ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95",
                  hasLiked
                    ? "bg-rose-500 border-rose-400/60 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)]"
                    : isDark
                    ? "bg-white/[0.04] border-white/[0.1] hover:border-rose-500/40 text-white"
                    : "bg-white border-slate-200 text-slate-800"
                )}
                title={isPreview ? "Indisponível no modo Preview" : "Curtir"}
              >
                <Heart
                  className={cn(
                    "w-4 h-4 md:w-5 md:h-5 transition-transform",
                    hasLiked ? "fill-current scale-110" : ""
                  )}
                />
                <span>{formatNumber(post.likes || 0)}</span>
              </button>
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center gap-2 h-11 px-4 md:h-12 md:px-5 rounded-2xl border font-bold text-xs md:text-sm opacity-60 cursor-not-allowed shrink-0",
                  isDark ? "bg-white/[0.03] border-white/[0.08] text-slate-400" : "bg-slate-100 border-slate-200"
                )}
              >
                <Heart className="w-4 h-4" />
                <span>{formatNumber(post.likes || 0)}</span>
              </div>
            )}

            {currentUser && (
              <button
                type="button"
                onClick={onFavorite}
                disabled={isPreview}
                title={
                  isPreview
                    ? "Indisponível no modo Preview"
                    : isFavorited
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
                }
                className={cn(
                  "flex items-center justify-center gap-2 h-11 px-4 md:h-12 md:px-5 rounded-2xl font-retro font-black text-xs md:text-sm uppercase tracking-wider border transition-all shrink-0 cursor-pointer",
                  isPreview ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95",
                  isFavorited
                    ? "bg-amber-400 border-amber-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)]"
                    : isDark
                    ? "bg-white/[0.04] border-white/[0.1] hover:border-amber-400/50 text-white"
                    : "bg-white border-slate-200 text-slate-800"
                )}
              >
                <Bookmark
                  className={cn(
                    "w-4 h-4 md:w-5 md:h-5 transition-transform",
                    isFavorited ? "fill-current scale-110" : ""
                  )}
                />
                <span className="hidden md:inline">{isFavorited ? "Salvo" : "Salvar"}</span>
              </button>
            )}

            {!currentUser && (
              <button
                type="button"
                onClick={onLoginClick}
                className="flex items-center justify-center gap-2 h-11 px-4 md:h-12 md:px-6 rounded-2xl border border-purple-400/40 bg-purple-600 hover:bg-purple-500 text-white font-retro font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.35)] shrink-0 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span className="hidden md:inline">Login</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
