import React, { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageSquare,
  Send,
  Star,
  Clock,
  Eye,
  Lock,
  Bookmark,
  Trash2
} from "lucide-react";
import { calculateReadingTime, formatDate, cn, slugify, coverBgStyle, formatNumber, getPixelAvatar } from "../lib/utils";
import ArticleRenderer from "../features/posts/components/ArticleRenderer";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthProvider";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { usePost, useLikeMutation, useCommentMutation, useIncrementViewMutation, useAllPosts, useFavoriteMutation, useDeleteCommentMutation } from "../features/posts/hooks/usePostsQuery";
import { useImageFallback } from "../hooks/useImageFallback";
import { useUserProfile } from "../hooks/useUserQuery";
import { CategoryBadge } from "../components/ui/Badge";
import AuthGate from "../features/auth/components/AuthGate";
import PostDetailSkeleton from "../features/posts/components/PostDetailSkeleton";
import { Post } from "../features/posts/schemas";

interface PostDetailPageProps {
  previewPost?: Post;
}

export default function PostDetailPage({ previewPost }: PostDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showToast, setIsLoginModalOpen } = useUIStore();
  const { currentUser, authLoading } = useAuth();
  const { data: profile } = useUserProfile(currentUser?.id);
  const { isDark } = useThemeStore();
  
  const { data: posts = [], isLoading: isLoadingPosts } = useAllPosts();

  const likeMutation = useLikeMutation();
  const commentMutation = useCommentMutation();
  const favoriteMutation = useFavoriteMutation();
  const deleteCommentMutation = useDeleteCommentMutation();
  const incrementViewMutation = useIncrementViewMutation();

  // Busca o post usando React Query se não for um preview e não estiver na lista global
  // Busca o post usando React Query: tenta por slug primeiro, se falhar ou não existir, o próprio hook pode ser usado com ID
  const { data: postBySlug, isLoading: isLoadingSlug } = usePost(slug!, true);
  const { data: postById, isLoading: isLoadingId } = usePost(slug!, false);
  
  // A ordem de prioridade: Preview > Lista Global > Busca por Slug > Busca por ID
  const post = previewPost || 
               (posts as Post[]).find((p) => String(p.slug) === String(slug) || String(p.id) === String(slug)) || 
               postBySlug || 
               postById;

  const isFetchingLocal = isLoadingSlug && isLoadingId;

  const trendingPosts = useMemo(() => {
    return [...(posts as Post[])]
      .filter((p) => !p.isDraft)
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 4);
  }, [posts]);

  const [commentText, setCommentText] = useState("");
  const imgError = useImageFallback(post?.imageUrl ?? undefined);
  const COMMENTS_PER_PAGE = 5;
  const [visibleComments] = useState(COMMENTS_PER_PAGE);

  const hasIncremented = useRef(false);

  useEffect(() => {
    // Só dispara se o post existir, não for preview e ainda não incrementamos nesta sessão
    if (post && post.id && !previewPost && !hasIncremented.current) {
      // Se estivermos logados, esperamos o currentUser estar disponível para garantir o XP
      if (!authLoading) {
        incrementViewMutation.mutate({ postId: post.id, userId: currentUser?.id });
        hasIncremented.current = true;
      }
    }
  }, [post?.id, previewPost, incrementViewMutation, currentUser?.id, authLoading]);

  // Enquanto estiver carregando os posts do Firebase ou buscando o post localmente, mostramos o Skeleton
  if ((isLoadingPosts || isFetchingLocal) && !post) {
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

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    const comment = {
      text: commentText,
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorId: currentUser.id,
      createdAt: new Date().toISOString()
    };

    commentMutation.mutate({ postId: post.id, comment });
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
      } catch (err: any) {
        if (err.name !== "AbortError") {
          fallbackCopy(url);
        }
      }
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copiado! Compartilhe com seus amigos 🎮");
    } catch {
      showToast("Link copiado para compartilhar!");
    }
  };

  const heroStyle = imgError ? {} : coverBgStyle(post.imageUrl, post.imagePosition);

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
            "w-full h-[350px] md:h-[550px] rounded-none border-2 border-black relative overflow-hidden retro-card flex items-center justify-center",
            (!post.imageUrl || imgError) && `bg-gradient-to-br ${(post as any).gradient || 'from-gray-900 to-purple-900'}`
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
                     {formatDate(post.createdAt, (post as any).date ?? undefined)}
                  </span>
                  <span className="text-gray-500 font-bold text-xs flex items-center gap-1 uppercase">
                    <Clock className="w-3 h-3" /> {calculateReadingTime(post.content || "")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleShare}
                className={cn(
                  "h-11 w-11 md:h-12 md:w-12 rounded-2xl border-2 transition-all hover:scale-105 flex items-center justify-center shrink-0",
                  isDark 
                    ? "bg-gray-800 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                    : "bg-white border-snes-dark/20 text-snes-accent shadow-sm"
                )}
                title="Compartilhar"
              >
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <div className={cn(
                "flex items-center justify-center gap-1.5 md:gap-2 h-11 px-3 md:h-12 md:px-5 rounded-2xl border-2 font-bold text-xs md:text-base cursor-default shrink-0",
                isDark 
                  ? "bg-gray-800/40 border-gray-700 text-gray-400 shadow-inner" 
                  : "bg-gray-50 border-gray-200 text-gray-500 shadow-inner"
              )}>
                <Eye className="w-4 h-4 md:w-5 md:h-5 opacity-60" />
                <span className="font-retro">{formatNumber(post.views || 0)}</span>
              </div>

              {/* Se estiver carregando o auth, mostramos um placeholder ou nada para evitar pulos de UI */}
              {authLoading ? (
                <div className="h-12 w-24 bg-gray-500/10 animate-pulse rounded-2xl border-2 border-dashed border-gray-500/20" />
              ) : (
                <>
                  {currentUser ? (
                    <button
                      onClick={() => likeMutation.mutate({ postId: post.id, userId: currentUser.id })}
                      className={cn(
                        "flex items-center justify-center gap-1.5 md:gap-3 h-11 px-3 md:h-12 md:px-6 rounded-2xl font-retro font-bold text-xs md:text-base uppercase border-2 transition-all hover:scale-105 active:scale-95 shadow-lg shrink-0",
                        hasLiked 
                          ? "bg-red-500 border-red-400 text-white shadow-red-500/20" 
                          : isDark 
                            ? "bg-gray-800 border-purple-500/50 text-white shadow-purple-500/10" 
                            : "bg-white border-snes-dark/20 text-snes-accent shadow-sm"
                      )}
                    >
                      <Heart className={cn("w-4 h-4 md:w-5 md:h-5 transition-transform", hasLiked ? "fill-current scale-110" : "group-hover:fill-current")} />
                      <span>{formatNumber(post.likes || 0)}</span>
                    </button>
                  ) : (
                    <div className={cn(
                      "flex items-center justify-center gap-1.5 md:gap-3 h-11 px-3 md:h-12 md:px-6 rounded-2xl border-2 font-bold text-xs md:text-base opacity-60 cursor-not-allowed shrink-0",
                      isDark ? "bg-gray-800 border-gray-700 text-gray-500" : "bg-gray-100 border-gray-200 text-gray-400"
                    )}>
                      <Heart className="w-4 h-4 md:w-5 md:h-5" />
                      <span>{formatNumber(post.likes || 0)}</span>
                    </div>
                  )}

                  {currentUser && (
                    <button
                      onClick={() => favoriteMutation.mutate({ userId: currentUser.id, postId: post.id })}
                      title={profile?.favorites?.includes(post.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      className={cn(
                        "flex items-center justify-center gap-1.5 md:gap-3 h-11 px-3 md:h-12 md:px-6 rounded-2xl font-retro font-bold text-xs md:text-base uppercase border-2 transition-all hover:scale-105 active:scale-95 shadow-lg shrink-0",
                        profile?.favorites?.includes(post.id) 
                          ? "bg-yellow-400 border-yellow-500 text-black shadow-yellow-400/20" 
                          : isDark 
                            ? "bg-gray-800 border-purple-500/50 text-white shadow-purple-500/10" 
                            : "bg-white border-snes-dark/20 text-snes-accent shadow-sm"
                      )}
                    >
                      <Bookmark className={cn("w-4 h-4 md:w-5 md:h-5 transition-transform", profile?.favorites?.includes(post.id) ? "fill-current scale-110" : "group-hover:fill-current")} />
                      <span className="hidden md:inline">{profile?.favorites?.includes(post.id) ? "Salvo" : "Salvar"}</span>
                    </button>
                  )}

                  {!currentUser && (
                    <button
                      onClick={() => { setIsLoginModalOpen(true); }}
                      className={cn(
                        "flex items-center justify-center gap-2 h-11 px-4 md:h-12 md:px-6 rounded-2xl border-2 font-retro font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shrink-0",
                        isDark 
                          ? "bg-purple-600 border-purple-400 text-white shadow-purple-500/20" 
                          : "bg-purple-600 border-purple-700 text-white shadow-purple-600/20"
                      )}
                    >
                      <Lock className="w-4 h-4" />
                      <span className="hidden md:inline">LOGIN</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Synopsis */}
          {post.excerpt && (
            <div className={cn(
              "relative p-8 pt-12 rounded-none border-4 group", 
              isDark ? "bg-gray-800/40 border-purple-500 shadow-[4px_4px_0_rgba(168,85,247,0.4)]" : "bg-white border-purple-400 shadow-[4px_4px_0_rgba(168,85,247,0.4)]"
            )}>
              <div className="absolute -top-6 left-8">
                <span className={cn(
                  "font-retro text-sm font-bold uppercase tracking-widest px-6 py-2.5 rounded-none border-4 border-black flex items-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,1)]", 
                  isDark ? "bg-purple-600 text-white" : "bg-purple-500 text-white"
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
          <div className="prose sm:prose-lg md:prose-xl max-w-none text-left leading-loose text-lg md:text-xl font-medium">
            <ArticleRenderer
              content={post.content || "O seu artigo não tem texto ainda."}
              isDark={isDark}
            />
          </div>

          {/* Veredito */}
          {post.score && (
            <div className={cn(
              "border-4 border-yellow-400 shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden",
              isDark ? "bg-gray-900" : "bg-snes-surface"
            )}>
              {/* Header da seção */}
              <div className="bg-yellow-400 px-5 py-2 flex items-center gap-3">
                <Star className="w-4 h-4 text-black" fill="currentColor" />
                <span className="font-retro font-bold text-xs md:text-sm uppercase tracking-widest text-black">
                  Veredito da Redação
                </span>
              </div>

              {/* Corpo: nota + texto */}
              <div className="flex items-stretch">
                {/* Nota */}
                <div className="flex flex-col items-center justify-center px-6 md:px-10 py-5 bg-yellow-400 border-r-4 border-black shrink-0 gap-0.5">
                  <span className="font-retro font-bold text-[10px] md:text-xs uppercase text-black/70 tracking-widest leading-none">Score</span>
                  <span className="font-retro font-bold text-5xl md:text-7xl leading-none text-black">{post.score}</span>
                  <span className="font-retro text-[9px] text-black/50 uppercase tracking-wider leading-none">/10</span>
                </div>

                {/* Texto do veredito */}
                <div className="flex items-center px-6 md:px-10 py-5 flex-1">
                  <p className={cn(
                    "font-retro font-bold text-sm md:text-lg uppercase tracking-wide leading-relaxed",
                    isDark ? "text-gray-100" : "text-gray-800"
                  )}>
                    {post.verdict}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Escrito Por — logo após o conteúdo/veredito */}
        {post.showAuthorBox === true && (
          <section className={cn(
            "border-2 overflow-hidden group",
            isDark ? "bg-gray-800/40 border-purple-500/20" : "bg-snes-input border-snes-dark/10"
          )}>
            {/* Label topo */}
            <div className={cn(
              "px-5 py-2 border-b-2 flex items-center gap-2",
              isDark ? "border-purple-500/20 bg-purple-500/5" : "border-snes-dark/10 bg-purple-50"
            )}>
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="font-retro text-[10px] md:text-xs font-bold uppercase tracking-widest text-purple-500">
                Escrito por
              </span>
            </div>
            {/* Conteúdo */}
            <div className="flex items-center gap-5 md:gap-8 p-5 md:p-7">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-4 border-purple-600 shadow-[4px_4px_0px_rgba(0,0,0,1)] shrink-0 -rotate-2 group-hover:rotate-0 transition-transform">
                <img src={post.author?.avatar ?? undefined} alt={post.author?.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-retro font-bold text-base md:text-2xl uppercase tracking-wide truncate">
                  {post.author?.name}
                </h3>
                <p className={cn(
                  "text-sm md:text-base font-medium mt-1 leading-snug line-clamp-2",
                  isDark ? "text-gray-400" : "text-gray-600"
                )}>
                  {post.author?.bio}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Separador retro antes das Próximas Fases */}
        {trendingPosts.filter((p) => p.id !== post.id).length > 0 && (
          <div className="flex items-center gap-4 py-2">
            <span className={cn("flex-1 border-t-4 border-dashed", isDark ? "border-gray-700" : "border-gray-300")} />
            <span className={cn(
              "font-retro text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 border-2 shrink-0",
              isDark ? "border-gray-700 text-gray-600 bg-gray-900" : "border-gray-300 text-gray-400 bg-white"
            )}>
              ● ● ●
            </span>
            <span className={cn("flex-1 border-t-4 border-dashed", isDark ? "border-gray-700" : "border-gray-300")} />
          </div>
        )}

        {/* Próximas Fases — sempre por último (antes dos comentários) */}
        {trendingPosts.filter((p) => p.id !== post.id).length > 0 && (
          <section>
            <h3 className={cn("font-retro font-bold text-xl md:text-2xl uppercase mb-6 md:mb-8 flex items-center gap-3", isDark ? "text-purple-400" : "text-purple-600")}>
              <Star className="w-5 h-5 md:w-7 md:h-7 text-yellow-500" fill="currentColor" />
              Próximas Fases
              <span className={cn("font-retro text-[10px] md:text-xs font-bold uppercase tracking-widest ml-1 px-2 py-0.5 border", isDark ? "border-purple-700 text-purple-600" : "border-purple-300 text-purple-400")}>
                Recomendados
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {trendingPosts
                .filter((p) => p.id !== post.id)
                .slice(0, 3)
                .map((p) => (
                  <Link to={`/post/${p.slug || slugify(p.title)}`} key={p.id} className="block group">
                    <div
                      className={cn(
                        "h-36 md:h-40 w-full mb-3 bg-cover bg-center border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_rgba(168,85,247,1)] transition-all overflow-hidden",
                        !p.imageUrl && `bg-gradient-to-br ${(p as any).gradient}`
                      )}
                      style={p.imageUrl ? { backgroundImage: `url(${p.imageUrl})` } : {}}
                    >
                      <div className="w-full h-full bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <h4 className="font-retro font-bold text-xs md:text-sm uppercase group-hover:text-purple-500 transition-colors line-clamp-2 leading-snug">
                      {p.title}
                    </h4>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* Comentários — sempre ao final */}
        <div className="space-y-16">
          <section id="comments-section" className="pt-12 border-t-4 border-gray-800">
            <h3 className="font-retro text-3xl mb-10 flex items-center gap-3 uppercase font-bold">
              <MessageSquare className="w-8 h-8 text-purple-500" />
              Comunidade ({formatNumber(post.comments?.length || 0)})
            </h3>

            {currentUser ? (
              <form onSubmit={submitComment} className={cn("mb-12 p-8 rounded-none border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] retro-card", isDark ? "bg-gray-800" : "bg-snes-surface")}>
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
              {post.comments?.slice(0, visibleComments).map((comment) => (
                <div key={comment.id} className={cn("p-6 rounded-none border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] flex gap-5 retro-card items-start", isDark ? "bg-gray-800" : "bg-snes-surface")}>
                  {/* Avatar Pixel Art */}
                  <div className="shrink-0">
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

                  {/* Moderação (Admin ou Dono) */}
                  {(currentUser?.role === 'admin' || currentUser?.id === comment.authorId) && (
                    <button
                      onClick={() => {
                        if (window.confirm("Deseja realmente excluir este comentário?")) {
                          deleteCommentMutation.mutate({ postId: post.id, commentId: comment.id });
                        }
                      }}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                      title="Excluir Comentário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
