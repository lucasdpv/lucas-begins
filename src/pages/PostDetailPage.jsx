import React, { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageSquare,
  Send,
  Trash2,
  Star,
  Bot,
  Loader2,
  Sparkles,
  Clock,
  Gamepad2,
} from "lucide-react";
import { calculateReadingTime, renderArticleContent } from "../lib/utils";
import { fetchGemini } from "../lib/gemini";

/**
 * Página de leitura completa de um post no estilo revista.
 * Inclui hero, metadados, conteúdo, resumo via IA, score, comentários e sidebar.
 */
export default function PostDetailPage({
  post,
  onBack,
  onLike,
  onAddComment,
  onDeleteComment,
  currentUser,
  isDark,
  trendingPosts,
  onTrendingClick,
  showToast,
}) {
  const [commentText, setCommentText] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState("");

  const submitComment = (e) => {
    e.preventDefault();
    onAddComment(post.id, commentText);
    setCommentText("");
  };

  const heroStyle = post.imageUrl
    ? { backgroundImage: `url(${post.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

  const handleSummarize = async () => {
    if (summary) return;
    setIsSummarizing(true);
    try {
      const prompt = `Resuma este texto de videogames em 2 ou 3 frases curtas e cativantes em português do Brasil, estilo revista Ação Games:\n\n${post.content}`;
      const result = await fetchGemini(prompt);
      setSummary(result);
    } catch {
      setSummary("Erro ao gerar o resumo.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      {/* Botão Voltar */}
      <button
        onClick={onBack}
        className={`mb-8 flex items-center gap-2 font-retro text-sm font-bold uppercase tracking-wider hover:text-purple-500 transition-colors ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        <ArrowLeft className="w-5 h-5" /> Voltar à Seleção
      </button>

      {/* Hero */}
      <div
        className={`w-full h-[350px] md:h-[550px] rounded-3xl relative overflow-hidden mb-12 retro-card ${
          post.imageUrl ? "" : `bg-gradient-to-br ${post.gradient}`
        }`}
        style={heroStyle}
      >
        <div className="absolute inset-0 scanline-overlay opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        <div className="absolute bottom-0 p-8 md:p-16 text-white w-full max-w-5xl">
          <span className="bg-purple-600 font-retro text-xs md:text-sm px-4 py-2 rounded-lg uppercase tracking-wider mb-6 inline-block font-bold border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
            {post.category}
          </span>
          <h1 className="font-retro font-bold text-4xl md:text-6xl lg:text-7xl leading-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
            {post.title || "Sem Título"}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
        {/* Corpo do Artigo */}
        <div className="lg:col-span-3 space-y-10">
          {/* Metadados do Autor */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] ${isDark ? "bg-purple-900" : "bg-purple-200"}`}>
                ✍️
              </div>
              <div>
                <p className="font-retro font-bold text-xl uppercase tracking-wide">
                  {post.author?.name || "Autor Desconhecido"}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs uppercase font-bold tracking-widest px-2 py-1 rounded border ${isDark ? "bg-gray-800 border-gray-700 text-purple-400" : "bg-gray-100 border-gray-300 text-purple-600"}`}>
                    {post.author?.role}
                  </span>
                  <span className="text-gray-500 font-bold text-xs uppercase">{post.date}</span>
                  <span className="text-gray-500 font-bold text-xs flex items-center gap-1 uppercase">
                    <Clock className="w-3 h-3" /> {calculateReadingTime(post.content || "")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => showToast("Link copiado para compartilhar!")}
                className={`p-4 rounded-xl border-2 font-bold retro-button ${isDark ? "bg-gray-800 border-purple-500 text-purple-400" : "bg-white border-black text-black"}`}
              >
                <Share2 className="w-6 h-6" />
              </button>
              <button
                onClick={onLike}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-retro font-bold text-lg uppercase retro-button border-2 ${isDark ? "bg-gray-800 border-purple-500 text-white" : "bg-white border-black text-black"} hover:bg-red-500 hover:border-red-500 hover:text-white group`}
              >
                <Heart className={`w-6 h-6 transition-colors ${post.likes > 0 ? "text-red-500 fill-red-500 group-hover:text-white group-hover:fill-white" : "text-gray-400 group-hover:text-white"}`} />
                {post.likes}
              </button>
            </div>
          </div>

          {/* Resumo via IA */}
          <div className="flex flex-col gap-4">
            <button
              onClick={handleSummarize}
              disabled={isSummarizing || summary !== "" || !post.content}
              className={`w-fit flex items-center gap-3 px-6 py-3 rounded-xl font-retro uppercase text-sm font-bold transition-all retro-button border-2 ${
                summary
                  ? isDark
                    ? "bg-purple-900 border-purple-500 text-purple-300"
                    : "bg-purple-100 border-purple-400 text-purple-700"
                  : "bg-purple-600 border-black text-white"
              }`}
            >
              {isSummarizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-yellow-400" />}
              {summary ? "Resumo do Guru IA" : "Pedir Resumo Rápido à IA"}
            </button>
            {summary && (
              <div className={`p-6 md:p-8 rounded-2xl flex items-start gap-4 animate-in fade-in border-4 border-dashed ${isDark ? "bg-gray-800 border-purple-500/50" : "bg-purple-50 border-purple-300"}`}>
                <Bot className={`w-8 h-8 shrink-0 mt-1 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
                <p className="text-base md:text-lg leading-relaxed font-bold italic">{summary}</p>
              </div>
            )}
          </div>

          {/* Score / Veredito */}
          {post.score && (
            <div className={`p-8 md:p-10 rounded-3xl border-4 border-yellow-400 flex items-center justify-between retro-card ${isDark ? "bg-gray-800" : "bg-white"}`}>
              <div>
                <h4 className="font-retro font-bold text-3xl uppercase mb-2 text-yellow-500 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                  Veredito da Redação
                </h4>
                <p className="text-lg font-bold uppercase tracking-widest">{post.verdict}</p>
              </div>
              <div className="flex flex-col items-center justify-center w-32 h-32 bg-yellow-400 rounded-full text-black transform rotate-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-retro font-bold text-6xl leading-none -mt-2">{post.score}</span>
              </div>
            </div>
          )}

          {/* Conteúdo do artigo */}
          <div className="magazine-article prose sm:prose-lg md:prose-xl max-w-none text-justify leading-loose text-lg md:text-xl font-medium">
            {renderArticleContent(
              post.content || "O seu artigo não tem texto ainda. Adicione algum conteúdo no editor!",
              isDark
            )}
          </div>

          {/* Seção de Comentários */}
          <section className={`mt-24 pt-12 border-t-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
            <h3 className="font-retro text-3xl mb-10 flex items-center gap-3 uppercase font-bold">
              <MessageSquare className={`w-8 h-8 shrink-0 ${isDark ? "text-purple-500" : "text-purple-600"}`} />
              <span>Comunidade ({post.comments?.length || 0})</span>
            </h3>

            {currentUser ? (
              <form onSubmit={submitComment} className={`mb-12 p-8 rounded-3xl retro-card ${isDark ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-dashed border-gray-500/30">
                  <span className="text-4xl bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    {currentUser.avatar}
                  </span>
                  <span className="text-lg font-bold uppercase font-retro tracking-wide">
                    Comentando como <span className="text-purple-500">{currentUser.name}</span>
                  </span>
                </div>
                <textarea
                  className={`w-full p-5 rounded-2xl mb-6 resize-none outline-none border-2 focus:border-purple-500 text-lg font-medium transition-all ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-black text-black"}`}
                  rows="4"
                  placeholder="Mande o papo reto sobre o artigo..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />
                <div className="flex justify-end">
                  <button type="submit" className="flex items-center gap-2 px-8 py-4 rounded-xl font-retro uppercase text-lg font-bold text-white bg-purple-600 retro-button border-2 border-black">
                    <Send className="w-5 h-5" /> Enviar Comentário
                  </button>
                </div>
              </form>
            ) : (
              <div className={`mb-12 p-12 text-center rounded-3xl border-4 border-dashed ${isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-400 bg-gray-50"}`}>
                <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="mb-4 text-xl font-bold font-retro uppercase tracking-wide">
                  Insert Coin para Comentar
                </p>
                <p className="opacity-70 font-medium">
                  Faça login no menu superior para participar da discussão.
                </p>
              </div>
            )}

            <div className="space-y-6">
              {post.comments?.map((comment) => {
                const canDelete =
                  currentUser &&
                  (currentUser.role === "admin" || currentUser.id === comment.authorId);
                return (
                  <div key={comment.id} className={`p-8 rounded-2xl flex justify-between gap-6 retro-card ${isDark ? "bg-gray-800" : "bg-white"}`}>
                    <div className="flex-1">
                      <div className="font-retro font-bold text-lg mb-3 uppercase tracking-wider text-purple-500">
                        {comment.author}
                      </div>
                      <p className={`text-lg font-medium leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        {comment.text}
                      </p>
                    </div>
                    {canDelete && (
                      <button
                        onClick={() => onDeleteComment(post.id, comment.id)}
                        className="text-white h-fit p-3 bg-red-500 border-2 border-black rounded-xl font-bold retro-button hover:bg-red-600"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar: Veja Também */}
        {trendingPosts.length > 0 && (
          <aside className="lg:col-span-1 space-y-10">
            <div className={`p-8 rounded-3xl retro-card ${isDark ? "bg-gray-800" : "bg-white"}`}>
              <h3 className="font-retro font-bold text-2xl uppercase mb-8 flex items-center gap-3 border-b-2 border-purple-500 pb-3">
                <Star className="text-yellow-400 w-8 h-8" fill="currentColor" /> Veja Também
              </h3>
              <div className="space-y-8">
                {trendingPosts
                  .filter((p) => p.id !== post.id)
                  .slice(0, 3)
                  .map((p) => (
                    <div key={p.id} onClick={() => onTrendingClick(p)} className="cursor-pointer group">
                      <div
                        className={`h-32 w-full rounded-xl mb-4 bg-cover bg-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_rgba(168,85,247,1)] transition-all ${
                          p.imageUrl ? "" : `bg-gradient-to-br ${p.gradient}`
                        }`}
                        style={p.imageUrl ? { backgroundImage: `url(${p.imageUrl})` } : {}}
                      />
                      <h4 className="font-bold text-base group-hover:text-purple-500 transition-colors line-clamp-3 leading-snug">
                        {p.title}
                      </h4>
                    </div>
                  ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
