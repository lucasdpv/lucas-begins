import { useState, useMemo } from "react";
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
  ChevronDown,
} from "lucide-react";
import { calculateReadingTime, formatDate, cn, slugify, coverBgStyle } from "../lib/utils";
import ArticleRenderer from "../components/ui/ArticleRenderer";
import { Helmet } from "react-helmet-async";
import { useAppContext } from "../context/AppContext";
import { useImageFallback } from "../hooks/useImageFallback";
import { CategoryBadge } from "../components/ui/Badge";
import AuthGate from "../components/ui/AuthGate";
import PostDetailSkeleton from "../components/ui/PostDetailSkeleton";

export default function PostDetailPage({ previewPost }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { posts, isDark, currentUser, handleLike, handleAddComment, handleDeleteComment, showToast, isLoadingPosts } = useAppContext();

  const post = previewPost || posts.find((p) => String(p.slug) === String(slug));

  const trendingPosts = useMemo(() => {
    return [...posts]
      .filter((p) => !p.isDraft)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 4);
  }, [posts]);

  const [commentText, setCommentText] = useState("");
  const imgError = useImageFallback(post?.imageUrl);
  const COMMENTS_PER_PAGE = 5;
  const [visibleComments, setVisibleComments] = useState(COMMENTS_PER_PAGE);

  // Enquanto estiver carregando os posts do Firebase, mostramos o Skeleton
  if (isLoadingPosts && !post) {
    return (
      <div className="py-20">
        <PostDetailSkeleton isDark={isDark} />
      </div>
    );
  }

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
    const shareData = {
      title: post.title || "Lucas Begins",
      text: post.excerpt ? `Confira: ${post.excerpt}` : "Dá uma olhada nessa matéria no Lucas Begins!",
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") {
          fallbackCopy(url);
        }
      }
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copiado! Compartilhe com seus amigos 🎮");
    } catch {
      showToast("Link copiado para compartilhar!");
    }
  };

  const heroStyle = imgError ? {} : coverBgStyle(post.imageUrl);

  const hasLiked = currentUser && post.likedBy?.includes(currentUser.id);

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full relative">
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

      {/* Layout Expandido - Alinhado com a Navbar */}
      <div className="w-full space-y-12">
        {/* Hero */}
        <div
          className={cn(
            "w-full h-[350px] md:h-[550px] rounded-3xl relative overflow-hidden retro-card flex items-center justify-center",
            (!post.imageUrl || imgError) && `bg-gradient-to-br ${post.gradient || 'from-gray-900 to-purple-900'}`
          )}
          style={heroStyle}
        >
          {imgError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10 bg-black/60">
              <div className="text-red-500 font-retro text-2xl md:text-4xl mb-4 animate-pulse border-2 border-red-500 px-6 py-2 rounded bg-black/80">
                ⚠️ DATA_CORRUPTION_DETECTED
              </div>
              <p className="font-retro text-sm md:text-lg uppercase tracking-widest text-gray-300 max-w-2xl leading-relaxed">
                A transmissão de alta fidelidade do setor {post.category} foi interrompida. 
                Nossos técnicos estão recalibrando os lasers de projeção.
              </p>
            </div>
          )}
          <div className="absolute inset-0 scanline-overlay opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent z-[5]" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white w-full z-[10] pointer-events-none text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6 pointer-events-auto">
              <CategoryBadge size="md" className="shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-black">
                {post.category}
              </CategoryBadge>
              {post.score && (
                <div className="bg-yellow-400 text-black px-4 py-1.5 rounded-xl font-retro font-bold border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] text-sm">
                   ★ {post.score}
                </div>
              )}
            </div>
            <h1 className="font-retro font-bold text-3xl md:text-5xl lg:text-6xl leading-tight text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-glow tracking-tighter">
              {post.title}
            </h1>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div id="article-content" className="space-y-12">
          {/* Barra de Autor e Ações */}
          <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b-4", isDark ? "border-gray-800" : "border-gray-200")}>
            <div className="flex items-center gap-4">
              {post.author?.avatar ? (
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  className="w-14 h-14 rounded-2xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] object-cover" 
                />
              ) : (
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]", isDark ? "bg-purple-900" : "bg-purple-200")}>
                  ✍️
                </div>
              )}
              <div className="flex-1">
                <p className="font-retro font-bold text-lg uppercase tracking-wide">
                  {post.author?.name || "Autor Desconhecido"}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-gray-500 font-bold text-xs uppercase">
                    {formatDate(post.createdAt, post.date)}
                  </span>
                  <span className="text-gray-500 font-bold text-xs flex items-center gap-1 uppercase">
                    <Clock className="w-3 h-3" /> {calculateReadingTime(post.content || "")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className={cn(
                  "h-12 px-4 rounded-xl border-2 font-bold retro-button transition-all hover:scale-105 flex items-center justify-center",
                  isDark ? "bg-gray-800 border-purple-500 text-purple-400" : "bg-snes-surface border-snes-dark text-snes-accent"
                )}
              >
                <Share2 className="w-5 h-5" />
              </button>

              {currentUser ? (
                <button
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-retro font-bold text-base uppercase retro-button border-2 group transition-all hover:scale-105 active:scale-95",
                    hasLiked ? "bg-red-500 border-red-600 text-white" : isDark ? "bg-gray-800 border-purple-500 text-white" : "bg-snes-surface border-snes-dark text-snes-accent"
                  )}
                >
                  <Heart className={cn("w-5 h-5 transition-transform", hasLiked ? "fill-current scale-110" : "group-hover:fill-current group-hover:scale-110")} />
                  {post.likes || 0}
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className={cn("flex items-center justify-center gap-2 h-12 px-5 rounded-xl border-2 font-bold text-base opacity-40", isDark ? "border-gray-700 text-white" : "border-gray-300 text-black")}>
                    <Heart className="w-5 h-5" />
                    {post.likes || 0}
                  </span>
                  <AuthGate variant="inline" />
                </div>
              )}
            </div>
          </div>

          {/* Synopsis */}
          {post.excerpt && (
            <div className={cn(
              "relative p-8 pt-12 rounded-3xl border-4 group", 
              isDark ? "bg-gray-800/40 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]" : "bg-white border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
            )}>
              <div className="absolute -top-6 left-8">
                <span className={cn(
                  "font-retro text-sm font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl border-4 flex items-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,1)]", 
                  isDark ? "bg-purple-600 border-purple-400 text-white" : "bg-purple-500 border-purple-700 text-white"
                )}>
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  SYNOPSIS
                </span>
              </div>
              <p className={cn("text-lg md:text-xl leading-relaxed font-medium italic", isDark ? "text-gray-300" : "text-gray-700")}>
                "{post.excerpt}"
              </p>
            </div>
          )}

          {/* Artigo */}
          <div className="prose sm:prose-lg md:prose-xl max-w-none text-justify leading-loose text-lg md:text-xl font-medium">
            <ArticleRenderer
              content={post.content || "O seu artigo não tem texto ainda."}
              isDark={isDark}
            />
          </div>

          {/* Veredito */}
          {post.score && (
            <div className={cn("p-8 md:p-10 rounded-3xl border-4 border-yellow-400 flex items-center justify-between retro-card", isDark ? "bg-gray-800" : "bg-snes-surface")}>
              <div>
                <h4 className="font-retro font-bold text-2xl uppercase mb-2 text-yellow-500">Veredito da Redação</h4>
                <p className="text-lg font-bold uppercase tracking-widest">{post.verdict}</p>
              </div>
              <div className="flex flex-col items-center justify-center w-24 h-24 bg-yellow-400 rounded-full text-black transform rotate-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-retro font-bold text-4xl leading-none">{post.score}</span>
              </div>
            </div>
          )}
        </div>

        {/* Veja Também - Agora no final do artigo */}
        {trendingPosts.length > 0 && (
          <section className="pt-12 border-t-4 border-dashed border-gray-500/20">
            <h3 className={cn("font-retro font-bold text-2xl uppercase mb-8 flex items-center gap-3", isDark ? "text-purple-400" : "text-purple-600")}>
              <Star className="w-7 h-7 text-yellow-500" fill="currentColor" />
              Próximas Fases (Recomendados)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingPosts
                .filter((p) => p.id !== post.id)
                .slice(0, 3)
                .map((p) => (
                  <Link to={`/post/${p.slug || slugify(p.title)}`} key={p.id} className="block group">
                    <div
                      className={cn(
                        "h-40 w-full rounded-2xl mb-4 bg-cover bg-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_rgba(168,85,247,1)] transition-all overflow-hidden",
                        !p.imageUrl && `bg-gradient-to-br ${p.gradient}`
                      )}
                      style={p.imageUrl ? { backgroundImage: `url(${p.imageUrl})` } : {}}
                    >
                      <div className="w-full h-full bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <h4 className="font-retro font-bold text-sm uppercase group-hover:text-purple-500 transition-colors line-clamp-2">
                      {p.title}
                    </h4>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* Autor e Comentários */}
        <div className="space-y-16">
          {post.showAuthorBox === true && (
            <section className={cn("p-8 md:p-10 rounded-3xl border-2 relative overflow-hidden group", isDark ? "bg-gray-800/40 border-purple-500/30" : "bg-snes-input border-snes-dark/10")}>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-purple-600 shadow-[6px_6px_0px_rgba(0,0,0,1)] transform -rotate-3 group-hover:rotate-0 transition-transform">
                  <img src={post.author?.avatar} alt={post.author?.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="font-retro text-xs uppercase font-bold text-purple-500 mb-1 block">Escrito por</span>
                  <h3 className="font-retro text-3xl font-bold uppercase mb-4">{post.author?.name}</h3>
                  <p className={cn("text-lg font-medium", isDark ? "text-gray-400" : "text-gray-600")}>{post.author?.bio}</p>
                </div>
              </div>
            </section>
          )}

          <section id="comments-section" className="pt-12 border-t-4 border-gray-800">
            <h3 className="font-retro text-3xl mb-10 flex items-center gap-3 uppercase font-bold">
              <MessageSquare className="w-8 h-8 text-purple-500" />
              Comunidade ({post.comments?.length || 0})
            </h3>

            {currentUser ? (
              <form onSubmit={submitComment} className={cn("mb-12 p-8 rounded-3xl retro-card", isDark ? "bg-gray-800" : "bg-snes-surface")}>
                <textarea
                  className={cn("w-full p-5 rounded-2xl mb-5 resize-none outline-none border-2 focus:border-purple-500 text-lg", isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent")}
                  rows="4"
                  placeholder="Mande o papo reto..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />
                <div className="flex justify-end">
                  <button type="submit" disabled={!commentText.trim()} className="flex items-center gap-2 px-8 py-4 rounded-xl font-retro uppercase text-lg font-bold text-white bg-purple-600 retro-button">
                    <Send className="w-5 h-5" /> Enviar
                  </button>
                </div>
              </form>
            ) : (
              <AuthGate variant="section" className="mb-12" />
            )}

            <div className="space-y-5">
              {post.comments?.slice(0, visibleComments).map((comment) => (
                <div key={comment.id} className={cn("p-6 rounded-2xl flex justify-between gap-5 retro-card", isDark ? "bg-gray-800" : "bg-snes-surface")}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="font-retro font-bold text-base uppercase text-purple-400">{comment.author}</div>
                      <span className="text-xs opacity-40 ml-auto">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-base font-medium">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
