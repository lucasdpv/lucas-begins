import React from "react";
import { Heart, MessageSquare, Clock } from "lucide-react";
import { calculateReadingTime, formatDate, cn } from "../../lib/utils";
import { useAppContext } from "../../context/AppContext";
import AuthGate from "./AuthGate";

export default function PostCard({ post, onClick }) {
  const { isDark, handleLike, currentUser } = useAppContext();

  const hasLiked = currentUser && post.likedBy?.includes(currentUser.id);
  const commentCount = post.comments?.length || 0;

  const bgStyle = post.imageUrl
    ? { backgroundImage: `url(${post.imageUrl})`, backgroundSize: "cover", backgroundPosition: post.imagePosition || "center" }
    : {};

  return (
    <article
      className={cn(
        "flex flex-col rounded-3xl overflow-hidden retro-card cursor-pointer group transition-all duration-200",
        isDark ? "bg-gray-800" : "bg-snes-light"
      )}
      onClick={onClick}
    >
      {/* Thumb */}
      <div
        className={cn(
          "h-56 md:h-64 w-full relative overflow-hidden border-b-4",
          isDark ? "border-purple-600" : "border-black",
          !post.imageUrl && `bg-gradient-to-br ${post.gradient}`
        )}
        style={bgStyle}
      >
        <div className="absolute inset-0 scanline-overlay opacity-30 group-hover:opacity-70 transition-opacity duration-300" />
        {/* Overlay de hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          <span className="bg-purple-600 text-white font-retro font-bold text-xs px-4 py-1.5 rounded-lg uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            {post.category}
          </span>
          {post.score && (
            <span className="bg-yellow-400 text-black font-retro font-bold text-xs px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center gap-1">
              ★ {post.score}
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 md:p-7 flex flex-col flex-grow">
        <h3 className="font-retro font-bold text-xl md:text-2xl mb-3 line-clamp-3 leading-tight group-hover:text-purple-500 transition-colors duration-200">
          {post.title}
        </h3>
        <p className={cn("text-sm mb-6 line-clamp-3 flex-grow leading-relaxed font-medium", isDark ? "text-gray-400" : "text-gray-600")}>
          {post.excerpt}
        </p>

        {/* Footer do card */}
        <div className={cn("flex items-center justify-between text-sm mt-auto pt-5 border-t-2", isDark ? "border-gray-700" : "border-gray-200")}>
          {/* Data e tempo de leitura */}
          <div className="flex flex-col gap-1">
            <span className="font-retro font-bold text-[10px] uppercase tracking-wider opacity-60">
              {formatDate(post.createdAt, post.date)}
            </span>
            <span className="text-xs flex items-center gap-1 font-bold uppercase opacity-40">
              <Clock className="w-3 h-3" />
              {calculateReadingTime(post.content || "")}
            </span>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            {/* Curtir */}
            {currentUser ? (
              <button
                className={cn(
                  "flex items-center gap-1.5 font-bold text-sm transition-all hover:scale-110 active:scale-95",
                  hasLiked ? "text-red-500" : isDark ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"
                )}
                onClick={() => handleLike(post.id)}
                title="Curtir"
              >
                <Heart className={cn("w-4 h-4", hasLiked && "fill-current")} />
                <span>{post.likes || 0}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-bold flex items-center gap-1 opacity-40", isDark ? "text-gray-400" : "text-gray-500")}>
                  <Heart className="w-4 h-4" />
                  {post.likes || 0}
                </span>
                <AuthGate variant="inline" />
              </div>
            )}

            {/* Comentários — sempre visível, só leitura */}
            <div className={cn("flex items-center gap-1.5 font-bold text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
              <MessageSquare className="w-4 h-4" />
              <span>{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
