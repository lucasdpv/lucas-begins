import React from "react";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { cn, formatNumber, formatDate, getPixelAvatar } from "../../../../lib/utils";
import AuthGate from "../../../auth/components/AuthGate";
import { Post } from "../../schemas";

interface PostCommentsProps {
  post: Post;
  currentUser: any;
  commentText: string;
  setCommentText: (text: string) => void;
  onSubmitComment: (e: React.FormEvent) => void;
  onDeleteComment: (commentId: string | number) => void;
  isDark: boolean;
  visibleComments: number;
  onLoadMore: () => void;
}

export default function PostComments({
  post,
  currentUser,
  commentText,
  setCommentText,
  onSubmitComment,
  onDeleteComment,
  isDark,
  visibleComments,
  onLoadMore
}: PostCommentsProps) {
  const comments = post.comments || [];
  const hasMore = visibleComments < comments.length;

  return (
    <section id="comments-section" className="pt-12 border-t-4 border-gray-800">
      <h3 className="font-retro text-3xl mb-10 flex items-center gap-3 uppercase font-bold">
        <MessageSquare className="w-8 h-8 text-purple-500" />
        Comunidade ({formatNumber(post.comments?.length || 0)})
      </h3>

      {currentUser ? (
        <form onSubmit={onSubmitComment} className={cn("mb-12 p-8 rounded-none border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] retro-card", isDark ? "bg-gray-800" : "bg-snes-surface")}>
          <textarea
            className={cn("w-full p-5 rounded-none mb-5 resize-none outline-none border-2 focus:border-purple-500 text-lg", isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent")}
            rows={4}
            placeholder="Mande o papo reto..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <button type="submit" disabled={!commentText.trim()} className="flex items-center gap-2 px-8 py-4 rounded-none font-retro uppercase text-lg font-bold text-white bg-purple-600 retro-button">
              <Send className="w-5 h-5" /> Enviar
            </button>
          </div>
        </form>
      ) : (
        <AuthGate variant="section" className="mb-12" />
      )}

      <div className="space-y-6">
        {comments.slice(0, visibleComments).map((comment) => (
          <div key={comment.id} className={cn("p-6 rounded-none border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] flex gap-5 retro-card items-start", isDark ? "bg-gray-800" : "bg-snes-surface")}>
            <div className="shrink-0 relative">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl border-2 border-black bg-purple-900/20 overflow-hidden shadow-[2px_2px_0_rgba(0,0,0,1)]">
                <img 
                  src={comment.authorAvatar ? comment.authorAvatar : getPixelAvatar(comment.authorId)} 
                  alt={comment.author} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getPixelAvatar(comment.authorId);
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black px-1.5 py-0.5 rounded-md border-2 border-black font-retro font-bold text-[8px] shadow-[1px_1px_0px_rgba(0,0,0,1)] z-10">
                LV.{comment.authorLevel || 1}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="font-retro font-bold text-sm md:text-base uppercase text-purple-400 tracking-wide">
                  {comment.author}
                </div>
                <span className="text-[10px] md:text-xs opacity-40 font-bold uppercase tracking-widest whitespace-nowrap">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className={cn(
                "text-sm md:text-base leading-relaxed font-medium",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                {comment.text}
              </p>
            </div>

            {(currentUser?.role === 'admin' || currentUser?.id === comment.authorId) && (
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                title="Excluir Comentário"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={onLoadMore}
            className={cn(
              "px-10 py-4 font-retro font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]",
              isDark 
                ? "bg-gray-800 border-purple-500 text-purple-400 hover:bg-purple-500/10" 
                : "bg-white border-purple-600 text-purple-600 hover:bg-purple-50"
            )}
          >
            Carregar Mais Comentários
          </button>
        </div>
      )}
    </section>
  );
}
