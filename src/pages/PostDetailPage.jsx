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
  CheckCheck,
} from "lucide-react";
import { calculateReadingTime, formatDate, cn, slugify } from "../lib/utils";
import ArticleRenderer from "../components/ui/ArticleRenderer";
import { Helmet } from "react-helmet-async";
import { useAppContext } from "../context/AppContext";
import AuthGate from "../components/ui/AuthGate";

export default function PostDetailPage({ previewPost }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { posts, isDark, currentUser, handleLike, handleAddComment, handleDeleteComment, showToast } = useAppContext();

  const post = previewPost || posts.find((p) => String(p.slug) === String(slug));

  const trendingPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.likes - a.likes).slice(0, 4);
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
    if (!commentText.trim()) return;
    handleAddComment(post.id, commentText);
    setCommentText("");
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copiado! Compartilhe com seus amigos 🎮");
    } catch {
      showToast("Link copiado para compartilhar!");
    }
  };

  const heroStyle = post.imageUrl
    ? {
        backgroundImage: `url(${post.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: post.imagePosition || "center",
      }
    : {};

  const hasLiked = currentUser && post.likedBy?.includes(currentUser.id);

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <Helmet>
        <title>{post.title ? `${post.title} | Lucas Begins` : "Matéria | Lucas Begins"}</title>
        <meta name="description" content={post.excerpt || "Leia mais sobre este incrível artigo retro."} />
        {/* Open Graph — para preview no WhatsApp, Twitter, etc. */}
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content="Lucas Begins" />
        <meta property="og:title" content={post.title || "Lucas Begins"} />
        <meta property="og:description" content={post.excerpt || ""} />
        {post.imageUrl && <meta property="og:image" content={post.imageUrl} />}
        <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ""} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title || "Lucas Begins"} />
        <meta name="twitter:description" content={post.excerpt || ""} />
        {post.imageUrl && <meta name="twitter:image" content={post.imageUrl} />}
      </Helmet>

      {/* Voltar */}
      <button
        onClick={() => navigate("/")}
        className={cn(
          "mb-8 flex items-center gap-2 font-retro text-sm font-bold uppercase tracking-wider hover:text-purple-500 transition-colors group",
          isDark ? "text-gray-400" : "text-gray-600"
        )}
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Voltar à Seleção
      </button>

      {/* Hero */}
      <div
        className={cn(
          "w-full h-[350px] md:h-[550px] rounded-3xl relative overflow-hidden mb-12 retro-card",
          !post.imageUrl && `bg-gradient-to-br ${post.gradient}`
        )}
        style={heroStyle}
      >
        <div className="absolute inset-0 scanline-overlay opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
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
        {/* Coluna Principal */}
        <div className="lg:col-span-3 space-y-10">

          {/* Barra de Autor e Ações */}
          <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b-4", isDark ? "border-gray-800" : "border-gray-200")}>
            {/* Autor */}
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]", isDark ? "bg-purple-900" : "bg-purple-200")}>
                ✍️
              </div>
              <div>
                <p className="font-retro font-bold text-lg uppercase tracking-wide">
                  {post.author?.name || "Autor Desconhecido"}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {post.author?.role && (
                    <span className={cn("text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded border", isDark ? "bg-gray-800 border-gray-700 text-purple-400" : "bg-gray-100 border-gray-300 text-purple-600")}>
                      {post.author.role}
                    </span>
                  )}
                  <span className="text-gray-500 font-bold text-xs uppercase">
                    {formatDate(post.createdAt, post.date)}
                  </span>
                  <span className="text-gray-500 font-bold text-xs flex items-center gap-1 uppercase">
                    <Clock className="w-3 h-3" /> {calculateReadingTime(post.content || "")}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-3">
              {/* Share */}
              <button
                onClick={handleShare}
                className={cn(
                  "p-3 rounded-xl border-2 font-bold retro-button transition-all hover:scale-105",
                  isDark ? "bg-gray-800 border-purple-500 text-purple-400" : "bg-white border-black text-black"
                )}
                title="Copiar link"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {/* Curtir */}
              {currentUser ? (
                <button
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-xl font-retro font-bold text-base uppercase retro-button border-2 group transition-all hover:scale-105 active:scale-95",
                    hasLiked
                      ? "bg-red-500 border-red-600 text-white"
                      : isDark ? "bg-gray-800 border-purple-500 text-white" : "bg-white border-black text-black"
                  )}
                >
                  <Heart className={cn("w-5 h-5 transition-transform", hasLiked ? "fill-current scale-110" : "group-hover:fill-current group-hover:scale-110")} />
                  {post.likes || 0}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={cn("flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-base opacity-40", isDark ? "border-gray-700 text-white" : "border-gray-300 text-black")}>
                    <Heart className="w-5 h-5" />
                    {post.likes || 0}
                  </span>
                  <AuthGate variant="inline" />
                </div>
              )}
            </div>
          </div>

          {/* Auth Banner (não logado) */}
          {!currentUser && (
            <AuthGate variant="banner" />
          )}

          {/* Score / Veredito */}
          {post.score && (
            <div className={cn("p-8 md:p-10 rounded-3xl border-4 border-yellow-400 flex items-center justify-between retro-card", isDark ? "bg-gray-800" : "bg-white")}>
              <div>
                <h4 className="font-retro font-bold text-3xl uppercase mb-2 text-yellow-500 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                  Veredito da Redação
                </h4>
                <p className="text-lg font-bold uppercase tracking-widest">{post.verdict}</p>
              </div>
              <div className="flex flex-col items-center justify-center w-28 h-28 bg-yellow-400 rounded-full text-black transform rotate-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-retro font-bold text-5xl leading-none -mt-2">{post.score}</span>
              </div>
            </div>
          )}

          {/* Conteúdo do artigo */}
          <div className="prose sm:prose-lg md:prose-xl max-w-none text-justify leading-loose text-lg md:text-xl font-medium">
            <ArticleRenderer
              content={post.content || "O seu artigo não tem texto ainda. Adicione algum conteúdo no editor!"}
              isDark={isDark}
            />
          </div>

          {/* Seção de Comentários */}
          <section className={cn("mt-24 pt-12 border-t-4", isDark ? "border-gray-800" : "border-gray-200")}>
            <h3 className="font-retro text-3xl mb-10 flex items-center gap-3 uppercase font-bold">
              <MessageSquare className={cn("w-8 h-8 shrink-0", isDark ? "text-purple-500" : "text-purple-600")} />
              Comunidade ({post.comments?.length || 0})
            </h3>

            {/* Form de comentário ou AuthGate */}
            {currentUser ? (
              <form onSubmit={submitComment} className={cn("mb-12 p-8 rounded-3xl retro-card", isDark ? "bg-gray-800" : "bg-white")}>
                <div className="flex items-center gap-4 mb-6 pb-5 border-b-2 border-dashed border-gray-500/20">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-2xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] object-cover"
                  />
                  <span className="text-base font-bold uppercase font-retro tracking-wide">
                    Comentando como <span className="text-purple-500">{currentUser.name}</span>
                  </span>
                </div>
                <textarea
                  className={cn(
                    "w-full p-5 rounded-2xl mb-5 resize-none outline-none border-2 focus:border-purple-500 text-lg font-medium transition-all",
                    isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-black text-black"
                  )}
                  rows="4"
                  placeholder="Mande o papo reto sobre o artigo..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl font-retro uppercase text-lg font-bold text-white bg-purple-600 retro-button border-2 border-black hover:bg-purple-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" /> Enviar Comentário
                  </button>
                </div>
              </form>
            ) : (
              <AuthGate variant="section" className="mb-12" />
            )}

            {/* Lista de comentários */}
            <div className="space-y-5">
              {post.comments?.map((comment) => {
                const canDelete =
                  currentUser &&
                  (currentUser.role === "admin" || currentUser.id === comment.authorId);
                return (
                  <div
                    key={comment.id}
                    className={cn(
                      "p-6 rounded-2xl flex justify-between gap-5 retro-card transition-all",
                      isDark ? "bg-gray-800" : "bg-white"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        {comment.authorAvatar && (
                          <img
                            src={comment.authorAvatar}
                            alt={comment.author}
                            className="w-9 h-9 rounded-full border-2 border-purple-500 object-cover shrink-0"
                          />
                        )}
                        <div className={cn("font-retro font-bold text-base uppercase tracking-wider", isDark ? "text-purple-400" : "text-purple-600")}>
                          {comment.author}
                        </div>
                        {comment.createdAt && (
                          <span className="text-xs opacity-40 font-bold ml-auto shrink-0">
                            {formatDate(comment.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className={cn("text-base font-medium leading-relaxed", isDark ? "text-gray-300" : "text-gray-700")}>
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
                        className="text-white h-fit p-2.5 bg-red-500 border-2 border-black rounded-xl font-bold retro-button hover:bg-red-600 shrink-0 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Empty state */}
              {(!post.comments || post.comments.length === 0) && (
                <div className={cn("py-12 text-center rounded-2xl border-2 border-dashed", isDark ? "border-gray-700 text-gray-500" : "border-gray-300 text-gray-400")}>
                  <CheckCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-retro font-bold text-sm uppercase tracking-wide opacity-50">
                    Nenhum comentário ainda. Seja o primeiro!
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        {trendingPosts.length > 0 && (
          <aside className="lg:col-span-1 space-y-8">
            <div className={cn("p-6 rounded-3xl retro-card", isDark ? "bg-gray-800" : "bg-white")}>
              <h3 className={cn("font-retro font-bold text-xl uppercase mb-6 flex items-center gap-3 border-b-2 pb-3", isDark ? "border-purple-500" : "border-black")}>
                <Star className={cn("w-6 h-6", isDark ? "text-yellow-400" : "text-yellow-500")} fill="currentColor" />
                Veja Também
              </h3>
              <div className="space-y-6">
                {trendingPosts
                  .filter((p) => p.id !== post.id)
                  .slice(0, 3)
                  .map((p) => (
                    <Link to={`/post/${p.slug || slugify(p.title)}`} key={p.id} className="block cursor-pointer group">
                      <div
                        className={cn(
                          "h-28 w-full rounded-xl mb-3 bg-cover bg-center border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] group-hover:shadow-[5px_5px_0px_rgba(168,85,247,1)] transition-all",
                          !p.imageUrl && `bg-gradient-to-br ${p.gradient}`
                        )}
                        style={p.imageUrl ? { backgroundImage: `url(${p.imageUrl})`, backgroundPosition: p.imagePosition || "center" } : {}}
                      />
                      <span className="text-[10px] font-retro font-bold uppercase tracking-widest opacity-50 bg-purple-600/10 text-purple-500 px-2 py-0.5 rounded mb-1 inline-block">
                        {p.category}
                      </span>
                      <h4 className="font-bold text-sm group-hover:text-purple-500 transition-colors line-clamp-2 leading-snug">
                        {p.title}
                      </h4>
                      <p className="text-xs opacity-40 mt-1 font-bold flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {p.likes || 0} curtidas
                      </p>
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
