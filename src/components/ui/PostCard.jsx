import React from "react";
import { Heart, MessageSquare, Clock } from "lucide-react";
import { calculateReadingTime, cn } from "../../lib/utils";
import { useAppContext } from "../../context/AppContext";

export default function PostCard({ post, onClick }) {
  const { isDark, handleLike } = useAppContext();

  const bgStyle = post.imageUrl
    ? { backgroundImage: `url(${post.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

  return (
    <article
      className={cn(
        "flex flex-col rounded-3xl overflow-hidden retro-card cursor-pointer",
        isDark ? "bg-gray-800" : "bg-white"
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "h-56 md:h-64 w-full relative overflow-hidden group border-b-4",
          isDark ? "border-purple-600" : "border-black",
          !post.imageUrl && `bg-gradient-to-br ${post.gradient}`
        )}
        style={bgStyle}
      >
        <div className="absolute inset-0 scanline-overlay opacity-30 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-4 left-4 flex gap-3">
          <span className="bg-purple-600 text-white font-retro font-bold text-xs px-4 py-2 rounded-lg uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
            {post.category}
          </span>
          {post.score && (
            <span className="bg-yellow-400 text-black font-retro font-bold text-xs px-4 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              {post.score}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <h3 className="font-retro font-bold text-2xl md:text-3xl mb-4 line-clamp-3 leading-tight group-hover:text-purple-500 transition-colors">
          {post.title}
        </h3>
        <p className={cn("text-base mb-8 line-clamp-3 flex-grow leading-relaxed font-medium", isDark ? "text-gray-400" : "text-gray-600")}>
          {post.excerpt}
        </p>
        <div className={cn("flex items-center justify-between text-sm mt-auto pt-6 border-t-2", isDark ? "border-gray-700" : "border-gray-200")}>
          <div className="flex flex-col gap-2">
            <span className="font-retro font-bold text-[11px] uppercase tracking-wider opacity-70">{post.date}</span>
            <span className="text-xs flex items-center gap-1.5 font-bold uppercase opacity-50">
              <Clock className="w-4 h-4" />
              {calculateReadingTime(post.content || "")}
            </span>
          </div>
          <div className="flex gap-4">
            <button
              className="flex items-center gap-2 hover:text-red-500 transition-colors font-bold text-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleLike(post.id, e);
              }}
            >
              <Heart className="w-5 h-5" /> {post.likes}
            </button>
            <div className="flex items-center gap-2 font-bold text-lg opacity-70">
              <MessageSquare className="w-5 h-5" /> {post.comments?.length || 0}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
