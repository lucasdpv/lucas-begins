import React from "react";
import { Heart, MessageSquare, Clock, Eye } from "lucide-react";
import { calculateReadingTime, formatDate, cn, coverBgStyle } from "../../lib/utils";
import { useAppContext } from "../../context/AppContext";
import { useImageFallback } from "../../hooks/useImageFallback";
import { CategoryBadge, ScoreBadge } from "./Badge";
import AuthGate from "./AuthGate";

export default function PostCard({ post, onClick }) {
  const { isDark, handleLike, currentUser } = useAppContext();
  const imgError = useImageFallback(post.imageUrl);
  const bgStyle = imgError ? {} : coverBgStyle(post.imageUrl, post.imagePosition);
  const [randomSector] = React.useState(() => Math.floor(Math.random() * 99));

  const hasLiked = currentUser && post.likedBy?.includes(currentUser.id);
  const commentCount = post.comments?.length || 0;

  return (
    <article
      className={cn(
        "flex flex-col h-full rounded-none border-2 border-black cursor-pointer group transition-all duration-300 hover:-translate-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(168,85,247,1)]",
        isDark ? "bg-gray-800" : "bg-snes-light"
      )}
      onClick={onClick}
    >
      {/* Thumb */}
      <div
        className={cn(
          "h-56 md:h-64 w-full relative overflow-hidden border-b-2 border-black flex items-center justify-center",
          isDark ? "bg-gray-900" : "bg-snes-mid",
          !post.imageUrl && !imgError && `bg-gradient-to-br ${post.gradient}`
        )}
        style={bgStyle}
      >
        {/* Mensagem Gamificada em caso de Erro de Imagem */}
        {imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
             <div className="text-red-500 font-retro text-[10px] sm:text-xs mb-2 animate-pulse bg-black/40 px-2 py-1 rounded border border-red-500/50">
               ⚠️ GRAPHIC_ERROR_0x404
             </div>
             <p className={cn(
               "text-[9px] sm:text-[10px] font-bold uppercase leading-tight max-w-[200px]",
               isDark ? "text-gray-400" : "text-gray-600"
             )}>
               Textura não encontrada. Verificando integridade dos pixels no setor {randomSector}...
             </p>
             <div className="mt-3 w-24 h-1 bg-gray-800 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-red-500 animate-[loading_2s_infinite]" style={{ width: '30%' }} />
             </div>
          </div>
        )}

        <div className="absolute inset-0 scanline-overlay opacity-30 group-hover:opacity-70 transition-opacity duration-300" />
        
        {/* Overlay de hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        <div className="absolute top-4 left-4 flex gap-2 flex-wrap z-20">
          <div className="glass-card px-0.5 py-0.5 rounded-xl border-white/20 shadow-lg backdrop-blur-md">
            <CategoryBadge>{post.category}</CategoryBadge>
          </div>
          {post.score && (
            <div className="glass-card px-0.5 py-0.5 rounded-xl border-white/20 shadow-lg backdrop-blur-md">
              <ScoreBadge score={post.score} />
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-7 flex flex-col flex-grow">
        <h3 className="font-retro font-bold text-lg md:text-xl mb-3 uppercase line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors duration-300">
          {post.title}
        </h3>
        <p className={cn("text-sm md:text-base mb-6 line-clamp-3 flex-grow leading-relaxed font-medium", isDark ? "text-gray-400" : "text-gray-600")}>
          {post.excerpt}
        </p>

        {/* Footer do card */}
        <div className={cn("flex items-center justify-between text-sm mt-auto pt-4 border-t-2", isDark ? "border-gray-800" : "border-snes-mid")}>
          {/* Data e tempo de leitura */}
          <div className="flex flex-col gap-1 shrink-0">
            <span className="font-retro font-bold text-[10px] uppercase tracking-wider opacity-60 whitespace-nowrap">
              {formatDate(post.createdAt, post.date)}
            </span>
            <span className="text-[10px] md:text-xs flex items-center gap-1 font-bold uppercase opacity-40 whitespace-nowrap">
              <Clock className="w-3 h-3 shrink-0" />
              {calculateReadingTime(post.content || "")}
            </span>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-end gap-2.5 md:gap-4 ml-2" onClick={(e) => e.stopPropagation()}>
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
              <span className={cn("text-sm font-bold flex items-center gap-1.5 opacity-40", isDark ? "text-gray-400" : "text-gray-500")}>
                <Heart className="w-4 h-4" />
                {post.likes || 0}
              </span>
            )}

            {/* Comentários */}
            <div className={cn("flex items-center gap-1.5 font-bold text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
              <MessageSquare className="w-4 h-4" />
              <span>{commentCount}</span>
            </div>

            {/* Visualizações */}
            <div className={cn("flex items-center gap-1.5 font-bold text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
              <Eye className="w-4 h-4" />
              <span>{post.views || 0}</span>
            </div>

            {/* Login Discreto */}
            {!currentUser && <AuthGate variant="inline" className="ml-auto" />}
          </div>
        </div>
      </div>
    </article>
  );
}
