import React, { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageSquare,
  Send,
  Trash2,
  Star,
  Clock,
  Gamepad2,
} from "lucide-react";
import { calculateReadingTime, renderArticleContent, cn } from "../lib/utils";
import { Helmet } from "react-helmet-async";
import { useAppContext } from "../context/AppContext";

export default function PostDetailPage({ previewPost }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { posts, isDark, currentUser, handleLike, handleAddComment, handleDeleteComment, showToast } = useAppContext();

  const post = previewPost || posts.find((p) => String(p.slug) === String(slug));

  const trendingPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);
  }, [posts]);

  const [commentText, setCommentText] = useState("");

  if (!post) {
    return (
      <div className="animate-in fade-in max-w-5xl mx-auto py-20 text-center">
        <Helmet>
          <title>Não Encontrado | Lucas Begins</title>
        </Helmet>
        <h1 className="font-retro text-4xl mb-4">Post não encontrado</h1>
        <button onClick={() => navigate("/")} className="text-purple-500 underline font-retro">Voltar ao início</button>
      </div>
    );
  }

  const submitComment = (e) => {
    e.preventDefault();
    handleAddComment(post.id, commentText);
    setCommentText("");
  };

  const heroStyle = post.imageUrl
    ? { backgroundImage: `url(${post.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <Helmet>
        <title>{post.title ? `${post.title} | Lucas Begins` : "Matéria | Lucas Begins"}</title>
        <meta name="description" content={post.excerpt || "Leia mais sobre este incrível artigo retro."} />
      </Helmet>

      <button
        onClick={() => navigate("/")}
        className={cn(
          "mb-8 flex items-center gap-2 font-retro text-sm font-bold uppercase tracking-wider hover:text-purple-500 transition-colors",
          isDark ? "text-gray-400" : "text-gray-600"
        )}
      >
        <ArrowLeft className="w-5 h-5" /> Voltar à Seleção
      </button>

      <div
        className={cn(
          "w-full h-[350px] md:h-[550px] rounded-3xl relative overflow-hidden mb-12 retro-card",
          !post.imageUrl && `bg-gradient-to-br ${post.gradient}`
        )}
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
        <div className="lg:col-span-3 space-y-10">
          <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b-4", isDark ? "border-gray-800" : "border-gray-200")}>
            <div className="flex items-center gap-5">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]", isDark ? "bg-purple-900" : "bg-purple-200")}>
                ✍️
              </div>
              <div>
                <p className="font-retro font-bold text-xl uppercase tracking-wide">
                  {post.author?.name || "Autor Desconhecido"}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={cn("text-xs uppercase font-bold tracking-widest px-2 py-1 rounded border", isDark ? "bg-gray-800 border-gray-700 text-purple-400" : "bg-gray-100 border-gray-300 text-purple-600")}>
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
                className={cn("p-4 rounded-xl border-2 font-bold retro-button", isDark ? "bg-gray-800 border-purple-500 text-purple-400" : "bg-white border-black text-black")}
              >
                <Share2 className="w-6 h-6" />
              </button>
              <button
                onClick={() => currentUser && handleLike(post.id)}
                disabled={!currentUser}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-xl font-retro font-bold text-lg uppercase retro-button border-2 group transition-all",
                  !currentUser ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95",
                  currentUser && post.likedBy?.includes(currentUser.id) 
                    ? "bg-red-500 border-red-600 text-white" 
                    : (isDark ? "bg-gray-800 border-purple-500 text-white" : "bg-white border-black text-black")
                )}
                title={!currentUser ? "Faça login para curtir" : ""}
              >
                <Heart className={cn("w-6 h-6 transition-colors", currentUser && post.likedBy?.includes(currentUser.id) ? "fill-current" : "group-hover:fill-current")} />
                {post.likes}
              </button>
            </div>
          </div>

          {post.score && (
            <div className={cn("p-8 md:p-10 rounded-3xl border-4 border-yellow-400 flex items-center justify-between retro-card", isDark ? "bg-gray-800" : "bg-white")}>
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

          <div className="magazine-article prose sm:prose-lg md:prose-xl max-w-none text-justify leading-loose text-lg md:text-xl font-medium">
            {renderArticleContent(
              post.content || "O seu artigo não tem texto ainda. Adicione algum conteúdo no editor!",
              isDark
            )}
          </div>

          <section className={cn("mt-24 pt-12 border-t-4", isDark ? "border-gray-800" : "border-gray-200")}>
            <h3 className="font-retro text-3xl mb-10 flex items-center gap-3 uppercase font-bold">
              <MessageSquare className={cn("w-8 h-8 shrink-0", isDark ? "text-purple-500" : "text-purple-600")} />
              <span>Comunidade ({post.comments?.length || 0})</span>
            </h3>

            {currentUser ? (
              <form onSubmit={submitComment} className={cn("mb-12 p-8 rounded-3xl retro-card", isDark ? "bg-gray-800" : "bg-white")}>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-dashed border-gray-500/30">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-2xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] object-cover"
                  />
                  <span className="text-lg font-bold uppercase font-retro tracking-wide">
                    Comentando como <span className="text-purple-500">{currentUser.name}</span>
                  </span>
                </div>
                <textarea
                  className={cn(
                    "w-full p-5 rounded-2xl mb-6 resize-none outline-none border-2 focus:border-purple-500 text-lg font-medium transition-all",
                    isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-black text-black"
                  )}
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
              <div className={cn("mb-12 p-12 text-center rounded-3xl border-4 border-dashed", isDark ? "border-gray-700 bg-gray-800/50" : "border-snes-dark bg-snes-mid/30")}>
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
                  <div key={comment.id} className={cn("p-8 rounded-2xl flex justify-between gap-6 retro-card", isDark ? "bg-gray-800" : "bg-snes-light")}>
                    <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      {comment.authorAvatar && (
                        <img 
                          src={comment.authorAvatar} 
                          alt={comment.author}
                          className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover"
                        />
                      )}
                      <div className={cn("font-retro font-bold text-lg uppercase tracking-wider", isDark ? "text-purple-500" : "text-snes-purple-deep")}>
                        {comment.author}
                      </div>
                    </div>
                      <p className={cn("text-lg font-medium leading-relaxed", isDark ? "text-gray-300" : "text-gray-700")}>
                        {comment.text}
                      </p>
                    </div>
                    {canDelete && (
                      <button
                        onClick={() => {
                          if (window.confirm("Deseja apagar este comentário?")) {
                            handleDeleteComment(post.id, comment.id);
                          }
                        }}
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

        {trendingPosts.length > 0 && (
          <aside className="lg:col-span-1 space-y-10">
            <div className={cn("p-8 rounded-3xl retro-card", isDark ? "bg-gray-800" : "bg-snes-light")}>
              <h3 className={cn("font-retro font-bold text-2xl uppercase mb-8 flex items-center gap-3 border-b-2 pb-3", isDark ? "border-purple-500" : "border-snes-dark")}>
                <Star className={cn("w-8 h-8", isDark ? "text-yellow-400" : "text-snes-purple-deep")} fill="currentColor" /> Veja Também
              </h3>
              <div className="space-y-8">
                {trendingPosts
                  .filter((p) => p.id !== post.id)
                  .slice(0, 3)
                  .map((p) => (
                    <Link to={`/post/${p.slug || slugify(p.title)}`} key={p.id} className="block cursor-pointer group">
                      <div
                        className={cn(
                          "h-32 w-full rounded-xl mb-4 bg-cover bg-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_rgba(168,85,247,1)] transition-all",
                          !p.imageUrl && `bg-gradient-to-br ${p.gradient}`
                        )}
                        style={p.imageUrl ? { backgroundImage: `url(${p.imageUrl})` } : {}}
                      />
                      <h4 className="font-bold text-base group-hover:text-purple-500 transition-colors line-clamp-3 leading-snug">
                        {p.title}
                      </h4>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
