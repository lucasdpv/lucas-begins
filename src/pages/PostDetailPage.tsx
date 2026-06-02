import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { cn, slugify } from "../lib/utils";

// Stores & Hooks
import { useAuth } from "../context/AuthProvider";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { 
  usePost, 
  useLikeMutation, 
  useCommentMutation, 
  useIncrementViewMutation, 
  usePopularPosts, 
  useFavoriteMutation, 
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useReplyCommentMutation,
  useDeleteReplyMutation,
  useLikeReplyMutation
} from "../features/posts/hooks/usePostsQuery";
import { useImageFallback } from "../hooks/useImageFallback";
import { useUserProfile } from "../hooks/useUserQuery";

// Components
import ArticleRenderer from "../features/posts/components/ArticleRenderer";
import PostDetailSkeleton from "../features/posts/components/PostDetailSkeleton";
import ShareModal from "../components/ui/ShareModal";
import PostHero from "../features/posts/components/PostDetail/PostHero";
import PostActions from "../features/posts/components/PostDetail/PostActions";
import PostVerdict from "../features/posts/components/PostDetail/PostVerdict";
import PostAuthorBox from "../features/posts/components/PostDetail/PostAuthorBox";
import PostRelated from "../features/posts/components/PostDetail/PostRelated";
import PostComments from "../features/posts/components/PostDetail/PostComments";

import { Post } from "../features/posts/schemas";
import { USER_ROLES } from "../constants";

interface PostDetailPageProps {
  previewPost?: Post;
}

export default function PostDetailPage({ previewPost }: PostDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { setIsLoginModalOpen } = useUIStore();
  const { currentUser, authLoading } = useAuth();
  const { data: profile } = useUserProfile(currentUser?.id);
  const { isDark } = useThemeStore();
  
  const { data: popularPosts = [], isLoading: isLoadingPopular } = usePopularPosts(4);

  const likeMutation = useLikeMutation();
  const commentMutation = useCommentMutation();
  const favoriteMutation = useFavoriteMutation();
  const deleteCommentMutation = useDeleteCommentMutation();
  const incrementViewMutation = useIncrementViewMutation();

  const likeCommentMutation = useLikeCommentMutation();
  const replyCommentMutation = useReplyCommentMutation();
  const deleteReplyMutation = useDeleteReplyMutation();
  const likeReplyMutation = useLikeReplyMutation();

  const { data: postBySlug, isLoading: isLoadingSlug } = usePost(slug || "", true);
  const { data: postById, isLoading: isLoadingId } = usePost(slug || "", false);
  
  const post = previewPost || postBySlug || postById;

  const isFetchingLocal = isLoadingSlug || isLoadingId;

  const [commentText, setCommentText] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const imgError = useImageFallback(post?.imageUrl ?? undefined);
  const hasIncremented = useRef(false);

  const COMMENTS_PER_PAGE = 5;
  const [visibleComments, setVisibleComments] = useState(COMMENTS_PER_PAGE);

  useEffect(() => {
    if (post && post.id && !previewPost && !hasIncremented.current) {
      if (!authLoading) {
        // Controle de visualizações por localStorage para evitar spams e permitir contagem confiável para guests
        const storageKey = "retro_viewed_posts";
        let viewedPosts: string[] = [];
        try {
          viewedPosts = JSON.parse(localStorage.getItem(storageKey) || "[]");
        } catch (e) {
          viewedPosts = [];
        }

        if (!viewedPosts.includes(post.id)) {
          incrementViewMutation.mutate({ 
            postId: post.id 
          });
          
          viewedPosts.push(post.id);
          localStorage.setItem(storageKey, JSON.stringify(viewedPosts));
        }
        hasIncremented.current = true;
      }
    }
  }, [post?.id, previewPost, incrementViewMutation, currentUser?.id, authLoading]);

  if ((isLoadingPopular || isFetchingLocal) && !post) {
    return (
      <div className="py-20">
        <PostDetailSkeleton isDark={isDark} />
      </div>
    );
  }

  const isAdmin = currentUser?.role === USER_ROLES.ADMIN;
  const isPostDraft = post?.isDraft;
  const isPreview = !!previewPost;

  if (!post || (isPostDraft && !isAdmin && !isPreview)) {
    return (
      <div className="animate-in fade-in max-w-5xl mx-auto py-20 text-center">
        <Helmet>
          <title>Não Encontrado | BeginsProject</title>
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
      authorLevel: currentUser.level || 1,
      createdAt: new Date().toISOString()
    };

    commentMutation.mutate({ postId: post.id, comment });
    setCommentText("");
  };


  const isFavorited = profile?.favorites?.includes(post.id) || false;
  
  const postCanonicalUrl = `https://lucasbegins.com.br/post/${slug || post.slug || (post.title ? slugify(post.title) : "")}`;

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full relative">
      <Helmet>
        <title>{post.title ? `${post.title} | BeginsProject` : "Matéria | BeginsProject"}</title>
        <meta name="description" content={post.excerpt || "Leia mais sobre este incrível artigo retro."} />
        
        {/* OpenGraph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postCanonicalUrl} />
        <meta property="og:title" content={post.title || "BeginsProject"} />
        <meta property="og:description" content={post.excerpt || ""} />
        <meta property="og:site_name" content="BeginsProject" />
        {post.imageUrl && <meta property="og:image" content={post.imageUrl} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={postCanonicalUrl} />
        <meta name="twitter:title" content={post.title || "BeginsProject"} />
        <meta name="twitter:description" content={post.excerpt || ""} />
        {post.imageUrl && <meta name="twitter:image" content={post.imageUrl} />}
        
        <link rel="canonical" href={postCanonicalUrl} />
      </Helmet>

      {/* Voltar */}
      <button
        onClick={() => {
          if (previewPost) return;
          navigate("/");
        }}
        className={cn(
          "mb-8 flex items-center gap-2 font-retro text-sm font-bold uppercase tracking-wider transition-colors group",
          previewPost 
            ? "opacity-60 cursor-not-allowed" 
            : "hover:text-purple-500",
          isDark ? "text-gray-400" : "text-gray-600"
        )}
        disabled={!!previewPost}
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Voltar à Seleção
      </button>

      <div className="w-full space-y-12">
        <PostHero 
          post={post} 
          imgError={imgError} 
        />

        <div id="article-content" className="space-y-12">
          <PostActions 
            post={post}
            currentUser={currentUser}
            isDark={isDark}
            authLoading={authLoading}
            isFavorited={isFavorited}
            isPreview={!!previewPost}
            onLike={() => currentUser && likeMutation.mutate({ postId: post.id, userId: currentUser.id })}
            onFavorite={() => currentUser && favoriteMutation.mutate({ userId: currentUser.id, postId: post.id, isFavorited })}
            onShare={() => setIsShareModalOpen(true)}
            onLoginClick={() => setIsLoginModalOpen(true)}
          />

          {post.excerpt && (
            <div className={cn(
               "relative p-8 pt-12 rounded-none border-2 border-black transition-all duration-300 group shadow-[6px_6px_0_rgba(0,0,0,1)]", 
              isDark ? "bg-[#1f1d35] text-gray-100" : "bg-white text-gray-900"
            )}>
              <div className="absolute -top-6 left-8">
                <span className={cn(
                  "font-retro text-sm font-bold uppercase tracking-widest px-6 py-2.5 rounded-none border-2 border-black flex items-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,1)] bg-purple-600 text-white"
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

          <div className="prose sm:prose-lg md:prose-xl max-w-none text-left leading-loose text-lg md:text-xl font-medium">
            <ArticleRenderer
              content={post.content || "O seu artigo não tem texto ainda."}
              isDark={isDark}
            />
          </div>

          <PostVerdict post={post} isDark={isDark} />
        </div>

        {post.showAuthorBox === true && (
          <PostAuthorBox author={post.author} isDark={isDark} />
        )}

        <PostRelated 
          posts={popularPosts as Post[]} 
          currentPostId={post.id} 
          isDark={isDark} 
          isPreview={!!previewPost}
        />

        <PostComments 
          post={post}
          currentUser={currentUser}
          commentText={commentText}
          setCommentText={setCommentText}
          onSubmitComment={submitComment}
          onDeleteComment={(id) => {
            if (window.confirm("Deseja realmente excluir este comentário?")) {
              deleteCommentMutation.mutate({ postId: post.id, commentId: id });
            }
          }}
          isDark={isDark}
          visibleComments={visibleComments}
          onLoadMore={() => setVisibleComments(prev => prev + COMMENTS_PER_PAGE)}
          isPreview={!!previewPost}
          onLikeComment={(commentId) => {
            if (currentUser) {
              likeCommentMutation.mutate({ postId: post.id, commentId, userId: currentUser.id });
            }
          }}
          onSubmitReply={(commentId, text) => {
            if (currentUser) {
              replyCommentMutation.mutate({ 
                postId: post.id, 
                commentId, 
                reply: { 
                  text, 
                  author: currentUser.name, 
                  authorAvatar: currentUser.avatar, 
                  authorId: currentUser.id, 
                  authorLevel: currentUser.level || 1, 
                  createdAt: new Date().toISOString() 
                } 
              });
            }
          }}
          onDeleteReply={(commentId, replyId) => {
            if (window.confirm("Deseja realmente excluir esta resposta?")) {
              deleteReplyMutation.mutate({ postId: post.id, commentId, replyId });
            }
          }}
          onLikeReply={(commentId, replyId) => {
            if (currentUser) {
              likeReplyMutation.mutate({ postId: post.id, commentId, replyId, userId: currentUser.id });
            }
          }}
        />
      </div>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        post={post} 
        isDark={isDark} 
      />
    </article>
  );
}
