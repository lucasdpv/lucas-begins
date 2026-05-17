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
  
  // Novas propriedades para ações sociais
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
  onLikeReply
}: PostCommentsProps) {
  const comments = post.comments || [];
  const hasMore = visibleComments < comments.length;

  // Estados locais para respostas
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
    <section id="comments-section" className="pt-12 border-t-4 border-gray-800">
      <h3 className="font-retro text-3xl mb-10 flex items-center gap-3 uppercase font-bold">
        <MessageSquare className="w-8 h-8 text-purple-500" />
        Comunidade ({formatNumber(post.comments?.length || 0)})
      </h3>

      {currentUser ? (
        <div className={cn(
          "mb-12 p-6 md:p-8 rounded-none border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] retro-card", 
          isDark ? "bg-gray-800" : "bg-snes-surface",
          isPreview && "opacity-50 pointer-events-none"
        )}>
          <form onSubmit={onSubmitComment}>
            <textarea
              className={cn(
                "w-full p-4 md:p-5 rounded-none mb-3 resize-none outline-none border-2 focus:border-purple-500 text-base md:text-lg font-medium", 
                isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
              )}
              rows={4}
              placeholder={isPreview ? "Comentários desabilitados no modo Preview" : "Mande o papo reto..."}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              disabled={isPreview}
            />

            {/* Emoji Quick Dock */}
            {!isPreview && (
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2 text-xs opacity-60 font-bold uppercase tracking-wider">
                  <Smile className="w-3.5 h-3.5 text-purple-400" /> Atalhos de Emojis:
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleEmojiClick(emoji, commentText, setCommentText)}
                      className={cn(
                        "w-9 h-9 flex items-center justify-center text-lg rounded-md border border-black/20 hover:border-purple-500 transition-all hover:scale-115 active:scale-90 font-retro",
                        isDark ? "bg-gray-900/60 hover:bg-gray-900" : "bg-white hover:bg-purple-50"
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
                className="flex items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 rounded-none font-retro uppercase text-base md:text-lg font-bold text-white bg-purple-600 retro-button"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" /> {isPreview ? "Bloqueado" : "Enviar"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <AuthGate variant="section" className="mb-12" />
      )}

      <div className="space-y-8">
        {comments.slice(0, visibleComments).map((comment) => {
          const commentLikes = comment.likes || [];
          const commentReplies = comment.replies || [];
          const hasLikedComment = currentUser ? commentLikes.includes(currentUser.id) : false;

          return (
            <div key={comment.id} className="flex flex-col">
              {/* Card de Comentário Principal */}
              <div className={cn(
                "p-5 md:p-6 rounded-none border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] flex gap-4 md:gap-5 retro-card items-start", 
                isDark ? "bg-gray-800" : "bg-snes-surface"
              )}>
                <div className="shrink-0 relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 border-black bg-purple-900/20 overflow-hidden shadow-[2px_2px_0_rgba(0,0,0,1)]">
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
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black px-1.5 py-0.5 rounded-md border border-black font-retro font-bold text-[8px] shadow-[1px_1px_0px_rgba(0,0,0,1)] z-10">
                    LV.{comment.authorLevel || 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="font-retro font-bold text-sm md:text-base uppercase text-purple-400 tracking-wide truncate">
                      {comment.author}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] md:text-xs opacity-40 font-bold uppercase tracking-widest whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                      </span>
                      {(currentUser?.role === 'admin' || currentUser?.id === comment.authorId) && (
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          title="Excluir Comentário"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p className={cn(
                    "text-sm md:text-base leading-relaxed font-medium mb-4 break-words",
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}>
                    {comment.text}
                  </p>

                  {/* Actions Bar (Likes, Reply) */}
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider mt-2">
                    {/* Botão de Like do Comentário */}
                    <button
                      onClick={() => currentUser && onLikeComment(comment.id)}
                      disabled={!currentUser}
                      className={cn(
                        "flex items-center gap-1.5 transition-all active:scale-80",
                        hasLikedComment 
                          ? "text-pink-500 fill-pink-500 hover:text-pink-600" 
                          : "text-gray-400 hover:text-pink-500"
                      )}
                      title={currentUser ? "Curtir" : "Faça login para curtir"}
                    >
                      <Heart className={cn("w-4 h-4 transition-transform", hasLikedComment && "scale-110 fill-current")} />
                      <span>{commentLikes.length}</span>
                    </button>

                    {/* Botão de Responder */}
                    <button
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
                        "flex items-center gap-1.5 transition-colors",
                        replyingToId === comment.id ? "text-purple-400" : "text-gray-400 hover:text-purple-400"
                      )}
                      title={currentUser ? "Responder" : "Faça login para responder"}
                    >
                      <CornerDownRight className="w-4 h-4" />
                      <span>Responder</span>
                    </button>
                  </div>
                </div>


              </div>

              {/* Form de Resposta Inline */}
              {replyingToId === comment.id && (
                <div className={cn(
                  "pl-6 ml-6 border-l-2 border-dashed border-purple-500/30 mt-3",
                  "animate-in slide-in-from-top-2 duration-200"
                )}>
                  <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className={cn(
                    "p-4 rounded-none border-2 border-black bg-gray-900/10 shadow-[2px_2px_0_rgba(0,0,0,1)]",
                    isDark ? "bg-gray-800" : "bg-purple-50/50"
                  )}>
                    <div className="flex items-center justify-between mb-2 text-xs font-retro uppercase font-bold text-purple-400">
                      <span>Respondendo a {comment.author}:</span>
                      <button type="button" onClick={() => setReplyingToId(null)} className="text-gray-400 hover:text-red-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      className={cn(
                        "w-full px-3 py-2 border-2 outline-none mb-3 text-sm font-medium focus:border-purple-500",
                        isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-snes-dark text-snes-accent"
                      )}
                      placeholder="Sua resposta..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                      autoFocus
                    />

                    {/* Emoji Shortcuts for Reply */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-3 scrollbar-none max-w-full">
                      {QUICK_EMOJIS.slice(0, 8).map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleEmojiClick(emoji, replyText, setReplyText)}
                          className={cn(
                            "w-7 h-7 flex items-center justify-center text-sm rounded border border-black/10 transition-transform active:scale-90 font-retro",
                            isDark ? "bg-gray-950/60 hover:bg-gray-950" : "bg-white hover:bg-purple-100"
                          )}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2 text-xs font-retro uppercase">
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className={cn(
                          "px-3 py-1.5 border border-black font-bold",
                          isDark ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-black hover:bg-gray-100"
                        )}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                      >
                        Enviar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Renderização de Respostas (Replies List) */}
              {commentReplies.length > 0 && (
                <div className="space-y-4 mt-3">
                  {commentReplies.map((reply: any) => {
                    const replyLikes = reply.likes || [];
                    const hasLikedReply = currentUser ? replyLikes.includes(currentUser.id) : false;

                    return (
                      <div 
                        key={reply.id} 
                        className="pl-6 ml-6 border-l-2 border-dashed border-purple-500/30 flex gap-3.5 md:gap-4 items-start animate-in fade-in slide-in-from-left-2 duration-300"
                      >
                        {/* Indicador visual de encadeamento retro */}
                        <div className="shrink-0 relative">
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg border-2 border-black bg-purple-900/10 overflow-hidden shadow-[1px_1px_0_rgba(0,0,0,1)]">
                            <img 
                              src={reply.authorAvatar ? reply.authorAvatar : getPixelAvatar(reply.authorId)} 
                              alt={reply.author} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = getPixelAvatar(reply.authorId);
                              }}
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black px-1 rounded border border-black font-retro font-bold text-[6px] shadow-[1px_1px_0px_rgba(0,0,0,1)] z-10 font-retro">
                            LV.{reply.authorLevel || 1}
                          </div>
                        </div>

                        <div className={cn(
                          "flex-1 p-3.5 md:p-4 rounded-none border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] min-w-0 relative",
                          isDark ? "bg-gray-800/60" : "bg-snes-surface/70"
                        )}>
                          <div className="flex items-center justify-between gap-3 mb-1.5">
                            <div className="font-retro font-bold text-xs md:text-sm uppercase text-purple-300 tracking-wide truncate">
                              {reply.author}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[8px] md:text-[10px] opacity-35 font-bold uppercase tracking-widest whitespace-nowrap font-mono">
                                {formatDate(reply.createdAt)}
                              </span>
                              {(currentUser?.role === 'admin' || currentUser?.id === reply.authorId) && (
                                <button
                                  onClick={() => onDeleteReply(comment.id, reply.id)}
                                  className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                  title="Excluir Resposta"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <p className={cn(
                            "text-xs md:text-sm leading-relaxed font-medium mb-2.5 break-words",
                            isDark ? "text-gray-300" : "text-gray-700"
                          )}>
                            {reply.text}
                          </p>

                          {/* Reply Actions (Likes only) */}
                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                            <button
                              onClick={() => currentUser && onLikeReply(comment.id, reply.id)}
                              disabled={!currentUser}
                              className={cn(
                                "flex items-center gap-1 transition-all active:scale-80",
                                hasLikedReply 
                                  ? "text-pink-500 fill-pink-500 hover:text-pink-600" 
                                  : "text-gray-400 hover:text-pink-500"
                              )}
                              title={currentUser ? "Curtir Resposta" : "Faça login para curtir"}
                            >
                              <Heart className={cn("w-3.5 h-3.5 transition-transform", hasLikedReply && "scale-110 fill-current")} />
                              <span>{replyLikes.length}</span>
                            </button>
                          </div>


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
