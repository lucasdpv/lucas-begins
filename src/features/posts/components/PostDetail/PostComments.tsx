import React, { useState } from "react";
import { MessageSquare, Send, Trash2, Heart, CornerDownRight, Smile, X } from "lucide-react";
import { cn, formatNumber, formatDate, getPixelAvatar } from "../../../../lib/utils";
import AuthGate from "../../../auth/components/AuthGate";
import { Post } from "../../schemas";

const QUICK_EMOJIS = ["🎮", "👾", "🕹️", "🏆", "🔥", "💖", "👍", "💯", "🎉", "🚀", "💀", "😮", "🤔", "👏"];

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
  isPreview?: boolean;
  onLikeComment: (commentId: string | number) => void;
  onSubmitReply: (commentId: string | number, text: string) => void;
  onDeleteReply: (commentId: string | number, replyId: string | number) => void;
  onLikeReply: (commentId: string | number, replyId: string | number) => void;
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
  onLoadMore,
  isPreview = false,
  onLikeComment,
  onSubmitReply,
  onDeleteReply,
  onLikeReply,
}: PostCommentsProps) {
  const comments = post.comments || [];
  const hasMore = visibleComments < comments.length;

  const [replyingToId, setReplyingToId] = useState<string | number | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = (e: React.FormEvent, commentId: string | number) => {
    e.preventDefault();
    if (!replyText.trim() || isPreview) return;
    onSubmitReply(commentId, replyText);
    setReplyText("");
    setReplyingToId(null);
  };

  const handleEmojiClick = (emoji: string, currentVal: string, setter: (val: string) => void) => {
    setter(currentVal + emoji);
  };

  return (
    <section id="comments-section" className="pt-10 border-t border-white/[0.08]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-retro text-2xl md:text-3xl uppercase font-black tracking-wide leading-none text-white">
            Comunidade ({formatNumber(post.commentsCount || post.comments?.length || 0)})
          </h3>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400 mt-1">
            Discussão & comentários dos leitores
          </p>
        </div>
      </div>

      {currentUser ? (
        <div
          className={cn(
            "mb-10 p-6 md:p-8 rounded-2xl border",
            isDark
              ? "bg-[#121024]/90 border-white/[0.08] text-slate-100 shadow-[0_18px_40px_-15px_rgba(0,0,0,0.7)]"
              : "bg-white border-slate-200 text-slate-900 shadow-sm",
            isPreview && "opacity-50 pointer-events-none"
          )}
        >
          <form onSubmit={onSubmitComment}>
            <textarea
              className={cn(
                "w-full p-4 md:p-5 rounded-xl mb-4 resize-none outline-none border transition-all text-base font-medium",
                isDark
                  ? "bg-white/[0.04] border-white/10 focus:border-purple-500 text-white placeholder:text-slate-500"
                  : "bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900"
              )}
              rows={4}
              placeholder={
                isPreview
                  ? "Comentários desabilitados no modo Preview"
                  : "Compartilhe sua opinião sobre esta matéria..."
              }
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              disabled={isPreview}
            />

            {!isPreview && (
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                  <Smile className="w-3.5 h-3.5 text-purple-400" /> Reações Rápidas:
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-hide max-w-full">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleEmojiClick(emoji, commentText, setCommentText)}
                      className={cn(
                        "w-9 h-9 flex items-center justify-center text-lg rounded-xl border transition-all hover:scale-110 active:scale-95 shrink-0 cursor-pointer",
                        isDark
                          ? "bg-white/[0.04] border-white/10 hover:border-purple-500/50 hover:bg-white/[0.08]"
                          : "bg-slate-50 border-slate-200 hover:bg-purple-50"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!commentText.trim() || isPreview}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-retro uppercase text-xs font-black tracking-widest text-white bg-purple-600 hover:bg-purple-500 border border-purple-400/50 shadow-[0_10px_25px_rgba(168,85,247,0.35)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" /> {isPreview ? "Bloqueado" : "Publicar Comentário"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <AuthGate variant="section" className="mb-10" />
      )}

      <div className="space-y-6">
        {comments.slice(0, visibleComments).map((comment) => {
          const commentLikes = comment.likes || [];
          const commentReplies = comment.replies || [];
          const hasLikedComment = currentUser ? commentLikes.includes(currentUser.id) : false;

          return (
            <div key={comment.id} className="flex flex-col">
              <div
                className={cn(
                  "p-5 md:p-6 rounded-2xl border flex gap-4 md:gap-5 items-start transition-all",
                  isDark
                    ? "bg-[#121024]/90 border-white/[0.08] text-slate-100 shadow-lg"
                    : "bg-white border-slate-200 text-slate-900 shadow-sm"
                )}
              >
                <div className="shrink-0 relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-purple-500/30 bg-purple-950/30 overflow-hidden">
                    <img
                      src={
                        comment.authorAvatar
                          ? comment.authorAvatar
                          : getPixelAvatar(comment.authorId)
                      }
                      alt={comment.author}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getPixelAvatar(comment.authorId);
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-retro font-black text-[8px] shadow z-10">
                    LV.{comment.authorLevel || 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="font-retro font-bold text-sm md:text-base uppercase text-purple-300 tracking-wide truncate">
                      {comment.author}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                      </span>
                      {(currentUser?.role === "admin" || currentUser?.id === comment.authorId) && (
                        <button
                          type="button"
                          onClick={() => onDeleteComment(comment.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/15 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Comentário"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p
                    className={cn(
                      "text-sm md:text-base leading-relaxed font-medium mb-4 break-words",
                      isDark ? "text-slate-200" : "text-slate-700"
                    )}
                  >
                    {comment.text}
                  </p>

                  <div className="flex items-center gap-5 text-xs font-retro font-bold uppercase tracking-wider mt-2">
                    <button
                      type="button"
                      onClick={() => currentUser && onLikeComment(comment.id)}
                      disabled={!currentUser}
                      className={cn(
                        "flex items-center gap-1.5 transition-all active:scale-90 cursor-pointer",
                        hasLikedComment
                          ? "text-rose-400"
                          : "text-slate-400 hover:text-rose-400"
                      )}
                      title={currentUser ? "Curtir" : "Faça login para curtir"}
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4 transition-transform",
                          hasLikedComment && "scale-110 fill-current"
                        )}
                      />
                      <span>{commentLikes.length}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!currentUser) return;
                        if (replyingToId === comment.id) {
                          setReplyingToId(null);
                        } else {
                          setReplyingToId(comment.id);
                          setReplyText("");
                        }
                      }}
                      disabled={!currentUser}
                      className={cn(
                        "flex items-center gap-1.5 transition-colors cursor-pointer",
                        replyingToId === comment.id
                          ? "text-purple-400"
                          : "text-slate-400 hover:text-purple-400"
                      )}
                      title={currentUser ? "Responder" : "Faça login para responder"}
                    >
                      <CornerDownRight className="w-4 h-4" />
                      <span>Responder</span>
                    </button>
                  </div>
                </div>
              </div>

              {replyingToId === comment.id && (
                <div className="pl-6 ml-6 border-l-2 border-purple-500/30 mt-3">
                  <form
                    onSubmit={(e) => handleReplySubmit(e, comment.id)}
                    className={cn(
                      "p-4 rounded-2xl border",
                      isDark
                        ? "bg-[#151329] border-white/10 text-slate-100 shadow-lg"
                        : "bg-slate-50 border-slate-200 text-slate-900"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2.5 text-xs font-retro uppercase font-bold text-purple-400">
                      <span>Respondendo a {comment.author}:</span>
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      className={cn(
                        "w-full px-4 py-2.5 border rounded-xl outline-none mb-3 text-sm font-medium focus:border-purple-500",
                        isDark
                          ? "bg-white/[0.04] border-white/10 text-white"
                          : "bg-white border-slate-200 text-slate-900"
                      )}
                      placeholder="Sua resposta..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                      autoFocus
                    />

                    <div className="flex justify-end gap-2 text-xs font-retro uppercase">
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white font-bold"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold border border-purple-400/40 shadow-md"
                      >
                        Enviar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {commentReplies.length > 0 && (
                <div className="space-y-3 mt-3">
                  {commentReplies.map((reply: any) => {
                    const replyLikes = reply.likes || [];
                    const hasLikedReply = currentUser ? replyLikes.includes(currentUser.id) : false;

                    return (
                      <div
                        key={reply.id}
                        className="pl-6 ml-6 border-l-2 border-purple-500/25 flex gap-3.5 items-start"
                      >
                        <div className="shrink-0 relative">
                          <div className="w-10 h-10 rounded-xl border border-purple-500/30 bg-purple-950/30 overflow-hidden">
                            <img
                              src={
                                reply.authorAvatar
                                  ? reply.authorAvatar
                                  : getPixelAvatar(reply.authorId)
                              }
                              alt={reply.author}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = getPixelAvatar(reply.authorId);
                              }}
                            />
                          </div>
                        </div>

                        <div
                          className={cn(
                            "flex-1 p-4 rounded-2xl border min-w-0 relative",
                            isDark
                              ? "bg-[#151329]/90 border-white/[0.07] text-slate-100"
                              : "bg-slate-50 border-slate-200 text-slate-900"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3 mb-1.5">
                            <div className="font-retro font-bold text-xs md:text-sm uppercase text-purple-300 tracking-wide truncate">
                              {reply.author}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-mono text-slate-400 uppercase">
                                {formatDate(reply.createdAt)}
                              </span>
                              {(currentUser?.role === "admin" ||
                                currentUser?.id === reply.authorId) && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteReply(comment.id, reply.id)}
                                  className="p-1 text-rose-400 hover:bg-rose-500/15 rounded-lg transition-colors"
                                  title="Excluir Resposta"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="text-xs md:text-sm leading-relaxed font-medium mb-2 text-slate-200 break-words">
                            {reply.text}
                          </p>

                          <button
                            type="button"
                            onClick={() => currentUser && onLikeReply(comment.id, reply.id)}
                            disabled={!currentUser}
                            className={cn(
                              "flex items-center gap-1 text-[11px] font-retro font-bold transition-all",
                              hasLikedReply ? "text-rose-400" : "text-slate-400 hover:text-rose-400"
                            )}
                          >
                            <Heart
                              className={cn("w-3.5 h-3.5", hasLikedReply && "fill-current")}
                            />
                            <span>{replyLikes.length}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="px-8 py-3.5 font-retro text-xs font-black uppercase tracking-widest rounded-full border border-white/10 bg-white/[0.04] text-purple-300 hover:bg-purple-600 hover:text-white hover:border-purple-400 transition-all cursor-pointer"
          >
            Carregar Mais Comentários
          </button>
        </div>
      )}
    </section>
  );
}
