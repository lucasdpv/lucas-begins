"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { useParams, useNavigate } from "@/lib/router-compat";
import { ArrowLeft, Compass, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../lib/utils";

// Stores & Hooks
import { useAuth } from "../context/AuthProvider";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import {
  usePost,
  useLikeMutation,
  useCommentMutation,
  useIncrementViewMutation,
  usePostsByCategory,
  useLatestPosts,
  useFavoriteMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useReplyCommentMutation,
  useDeleteReplyMutation,
  useLikeReplyMutation,
} from "../features/posts/hooks/usePostsQuery";
import { useUserProfile } from "../hooks/useUserQuery";

// Components
import ArticleRenderer from "../features/posts/components/ArticleRenderer";
import PostDetailSkeleton from "../features/posts/components/PostDetailSkeleton";
const ShareModal = dynamic(() => import("../components/ui/ShareModal"), { ssr: false });
import PostHero from "../features/posts/components/PostDetail/PostHero";
import PostActions from "../features/posts/components/PostDetail/PostActions";
import PostVerdict from "../features/posts/components/PostDetail/PostVerdict";
import PostAuthorBox from "../features/posts/components/PostDetail/PostAuthorBox";
import PostRelated from "../features/posts/components/PostDetail/PostRelated";
import PostComments from "../features/posts/components/PostDetail/PostComments";
import ChapterPill from "../features/posts/components/PostDetail/ChapterPill";

import { Post } from "../features/posts/schemas";
import { USER_ROLES } from "../constants";

interface PostDetailPageProps {
  previewPost?: Post;
  initialPost?: Post;
}

export default function PostDetailPage({ previewPost, initialPost }: PostDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { setIsLoginModalOpen } = useUIStore();
  const { currentUser, authLoading } = useAuth();
  const { data: profile } = useUserProfile(currentUser?.id);
  const { isDark } = useThemeStore();
  const [shouldLoadRelated, setShouldLoadRelated] = useState(false);

  // Carrega recomendações de forma diferida (depois que a matéria já estiver visível e renderizada)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setShouldLoadRelated(true), { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(() => setShouldLoadRelated(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const likeMutation = useLikeMutation();
  const commentMutation = useCommentMutation();
  const favoriteMutation = useFavoriteMutation();
  const deleteCommentMutation = useDeleteCommentMutation();
  const incrementViewMutation = useIncrementViewMutation();

  const likeCommentMutation = useLikeCommentMutation();
  const replyCommentMutation = useReplyCommentMutation();
  const deleteReplyMutation = useDeleteReplyMutation();
  const likeReplyMutation = useLikeReplyMutation();

  const { data: postBySlug, isLoading: isLoadingSlug } = usePost(slug || "", true, {
    initialData: initialPost,
  });

  const slugResolved = !isLoadingSlug;
  const { data: postById, isLoading: isLoadingId } = usePost(slug || "", false, {
    enabled: slugResolved && !postBySlug && !!slug,
  });

  const post = previewPost || postBySlug || postById || initialPost;

  // Busca apenas 6 matérias da mesma categoria (e se faltar, 4 recentes como apoio), de forma diferida
  const { data: categoryPosts = [] } = usePostsByCategory(
    post?.category || "",
    6,
    shouldLoadRelated && !!post?.category && !previewPost
  );

  const { data: fallbackRecentPosts = [] } = useLatestPosts(
    4,
    shouldLoadRelated && !previewPost && categoryPosts.length < 3
  );

  const candidateRelatedPosts = useMemo(() => {
    const map = new Map<string, Post>();
    [...categoryPosts, ...fallbackRecentPosts].forEach((item) => {
      if (item && item.id && !map.has(item.id)) {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values());
  }, [categoryPosts, fallbackRecentPosts]);

  const isFetchingLocal = isLoadingSlug || (!postBySlug && isLoadingId);
  const [showSkeleton, setShowSkeleton] = useState(false);
  useEffect(() => {
    if (!isFetchingLocal || post) {
      setShowSkeleton(false);
      return;
    }
    const timer = setTimeout(() => setShowSkeleton(true), 300);
    return () => clearTimeout(timer);
  }, [isFetchingLocal, post]);

  const [commentText, setCommentText] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [isTocOpen, setIsTocOpen] = useState(true);
  const [isChapterPillVisible, setIsChapterPillVisible] = useState(false);
  const [imgError, setImgError] = useState(false);
  const hasIncremented = useRef(false);

  const headings = useMemo(() => {
    if (!post?.content) return [];
    const result: { id: string; label: string; words: number }[] = [];
    for (const line of post.content.split("\n")) {
      if (line.startsWith("## ")) {
        const label = line.slice(3).trim().replace(/\*\*/g, "").replace(/\*/g, "");
        const id = `sec-${label
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")}`;
        result.push({ id, label, words: 0 });
      } else if (result.length > 0 && line.trim()) {
        result[result.length - 1].words += line.trim().split(/\s+/).length;
      }
    }
    // Mesma base do calculateReadingTime: 200 palavras por minuto.
    return result.map(({ id, label, words }) => ({ id, label, minutes: Math.max(1, Math.round(words / 200)) }));
  }, [post?.content]);

  useEffect(() => {
    const handleScroll = () => {
      if (headings.length > 0) {
        let current = headings[0].id;
        for (const h of headings) {
          const el = document.getElementById(h.id);
          if (el) {
            const top = el.getBoundingClientRect().top;
            if (top <= 160) {
              current = h.id;
            }
          }
        }
        setActiveHeadingId(current);
      }

      const toc = document.getElementById("post-toc");
      const article = document.getElementById("article-content");
      setIsChapterPillVisible(
        !!toc &&
          !!article &&
          toc.getBoundingClientRect().bottom < 0 &&
          article.getBoundingClientRect().bottom > window.innerHeight * 0.4
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const COMMENTS_PER_PAGE = 5;
  const [visibleComments, setVisibleComments] = useState(COMMENTS_PER_PAGE);

  useEffect(() => {
    if (post && post.id && !previewPost && !hasIncremented.current) {
      if (!authLoading) {
        const storageKey = "retro_viewed_posts";
        let viewedPosts: string[] = [];
        try {
          viewedPosts = JSON.parse(localStorage.getItem(storageKey) || "[]");
        } catch {
          viewedPosts = [];
        }

        if (!viewedPosts.includes(post.id)) {
          incrementViewMutation.mutate({
            postId: post.id,
          });

          viewedPosts.push(post.id);
          localStorage.setItem(storageKey, JSON.stringify(viewedPosts));
        }
        hasIncremented.current = true;
      }
    }
  }, [post?.id, previewPost, incrementViewMutation, currentUser?.id, authLoading]);

  if (showSkeleton && !post) {
    return (
      <div className="py-20">
        <PostDetailSkeleton />
      </div>
    );
  }

  if (isFetchingLocal && !post && !showSkeleton) {
    return null;
  }

  const isAdmin = currentUser?.role === USER_ROLES.ADMIN;
  const isPostDraft = post?.isDraft;
  const isPreview = !!previewPost;

  if (!post || (isPostDraft && !isAdmin && !isPreview)) {
    return (
      <div className="animate-in fade-in max-w-5xl mx-auto py-20 text-center">
        <h1 className="font-retro text-4xl mb-4">Post não encontrado</h1>
        <button onClick={() => navigate("/")} className="text-purple-500 underline font-retro">
          Voltar ao início
        </button>
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
      createdAt: new Date().toISOString(),
    };

    commentMutation.mutate({ postId: post.id, comment });
    setCommentText("");
  };

  const isFavorited = profile?.favorites?.includes(post.id) || false;

  return (
    <article className="w-full max-w-[1520px] mx-auto relative">
      {/* Voltar */}
      <button
        onClick={() => {
          if (previewPost) return;
          navigate("/");
        }}
        className={cn(
          "mb-8 flex items-center gap-2 font-retro text-xs font-bold uppercase tracking-wider transition-colors group",
          previewPost ? "opacity-60 cursor-not-allowed" : "hover:text-purple-400",
          isDark ? "text-slate-400" : "text-slate-600"
        )}
        disabled={!!previewPost}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar ao Catálogo
      </button>

      <div className="w-full space-y-12">
        <PostHero post={post} imgError={imgError} onImageError={() => setImgError(true)} />

        <div id="article-content" className="space-y-10 w-full">
          <PostActions
            post={post}
            currentUser={currentUser}
            isDark={isDark}
            authLoading={authLoading}
            isFavorited={isFavorited}
            isPreview={!!previewPost}
            onLike={() => currentUser && likeMutation.mutate({ postId: post.id, userId: currentUser.id })}
            onFavorite={() =>
              currentUser &&
              favoriteMutation.mutate({ userId: currentUser.id, postId: post.id, isFavorited })
            }
            onShare={() => setIsShareModalOpen(true)}
            onLoginClick={() => setIsLoginModalOpen(true)}
          />

          {post.excerpt && (
            <div
              className={cn(
                "relative p-8 pt-10 rounded-2xl border transition-all duration-300",
                isDark
                  ? "bg-[#121024]/90 border-white/[0.08] text-slate-100 shadow-[0_18px_40px_-15px_rgba(0,0,0,0.7)]"
                  : "bg-white border-slate-200/80 text-slate-900 shadow-md"
              )}
            >
              <div className="absolute -top-3.5 left-6">
                <span className="font-retro text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-purple-600 text-white border border-purple-400/40 flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.45)]">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Sinopse
                </span>
              </div>
              <p
                className={cn(
                  "text-lg md:text-xl leading-relaxed font-medium italic article-paragraph",
                  isDark ? "text-slate-300" : "text-slate-700"
                )}
              >
                "{post.excerpt}"
              </p>
            </div>
          )}

          {/* Capítulos da Matéria (Índice Retrátil em Largura Total) */}
          {headings.length >= 2 && (
            <div
              id="post-toc"
              className={cn(
                "rounded-2xl border overflow-hidden transition-all",
                isDark
                  ? "bg-[#121024]/90 border-white/[0.08] text-slate-100 shadow-lg"
                  : "bg-white border-slate-200/80 text-slate-900 shadow-sm"
              )}
            >
              <button
                type="button"
                onClick={() => setIsTocOpen((prev) => !prev)}
                aria-expanded={isTocOpen}
                aria-controls="post-toc-panel"
                className={cn(
                  "w-full px-6 py-4 flex items-center justify-between border-b cursor-pointer transition-colors",
                  isDark
                    ? "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                    : "border-slate-100 bg-slate-50/70 hover:bg-slate-100/80"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-purple-400" />
                  <span className="font-retro font-black text-xs md:text-sm uppercase tracking-wider">
                    Capítulos da Matéria ({headings.length} Seções)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {isTocOpen ? (
                    <ChevronUp className="w-4 h-4 text-purple-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-purple-400" />
                  )}
                </div>
              </button>

              <div
                id="post-toc-panel"
                aria-hidden={!isTocOpen}
                className={cn("toc-collapsible", isTocOpen && "is-expanded")}
              >
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {headings.map((h, idx) => {
                    const isActive = activeHeadingId === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => {
                          const el = document.getElementById(h.id);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={cn(
                          "text-left px-3.5 py-2.5 rounded-xl border font-retro text-[11px] md:text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 cursor-pointer focus:outline-none",
                          isActive
                            ? "border-purple-400/50 bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] font-black"
                            : isDark
                            ? "border-white/[0.06] bg-white/[0.03] text-slate-300 hover:border-purple-500/40 hover:text-white"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-purple-400 hover:text-slate-950"
                        )}
                      >
                        <span
                          className={cn(
                            "font-mono text-[10px] font-black px-2 py-0.5 rounded-full shrink-0",
                            isActive
                              ? "bg-black/30 text-amber-300"
                              : "bg-purple-500/15 text-purple-400"
                          )}
                        >
                          0{idx + 1}
                        </span>
                        <span className="truncate">{h.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
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

        {post.showAuthorBox === true && <PostAuthorBox author={post.author} isDark={isDark} />}

        <PostRelated
          posts={candidateRelatedPosts}
          currentPostId={post.id}
          currentCategory={post.category}
          isDark={isDark}
          isPreview={!!previewPost}
        />

        <div id="post-comments-section">
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
            onLoadMore={() => setVisibleComments((prev) => prev + COMMENTS_PER_PAGE)}
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
                    createdAt: new Date().toISOString(),
                  },
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
                likeReplyMutation.mutate({
                  postId: post.id,
                  commentId,
                  replyId,
                  userId: currentUser.id,
                });
              }
            }}
          />
        </div>
      </div>

      {!previewPost && (
        <ChapterPill
          headings={headings}
          activeHeadingId={activeHeadingId}
          isVisible={isChapterPillVisible}
          isDark={isDark}
        />
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        post={post}
        isDark={isDark}
      />
    </article>
  );
}
