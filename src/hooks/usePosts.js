import { useState, useEffect, useCallback, useRef } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import { PostService } from '../services/postService';
import { slugify } from '../lib/utils';
import DOMPurify from 'dompurify';

const POSTS_PER_PAGE = 6;

/**
 * Sanitiza o conteúdo Markdown de um post removendo qualquer HTML/JS injetado.
 * Permite apenas texto puro e a sintaxe Markdown do projeto.
 */
function sanitizePostContent(content) {
  if (!content) return '';
  return DOMPurify.sanitize(content, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Hook para gerenciar os artigos do blog.
 * Utiliza PostService como camada de acesso a dados (separação de responsabilidades).
 * Mantém Optimistic UI para todas as mutações.
 */
export function usePosts(currentUser, showToast) {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  // Timestamp do último comentário para rate limiting (30s de cooldown)
  const lastCommentTimeRef = useRef(0);

  // Busca inicial e paginação por cursor
  const fetchPosts = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) {
      setIsFetchingMore(true);
    } else if (posts.length === 0) {
      setIsLoadingPosts(true);
    }
    try {
      // Busca N+1 para detectar se há próxima página sem custo extra
      const fetchLimit = POSTS_PER_PAGE + 1;
      const snapshot = await PostService.getPaginatedPosts(
        fetchLimit,
        isLoadMore ? lastDoc : null
      );

      const hasNextPage = snapshot.docs.length > POSTS_PER_PAGE;
      const pageDocs = hasNextPage
        ? snapshot.docs.slice(0, POSTS_PER_PAGE)
        : snapshot.docs;

      const postsData = pageDocs.map(doc => ({ id: doc.id, ...doc.data() }));

      setPosts(prev => (isLoadMore ? [...prev, ...postsData] : postsData));
      if (pageDocs.length > 0) setLastDoc(pageDocs[pageDocs.length - 1]);
      setHasMore(hasNextPage);
    } catch (error) {
      console.error('[usePosts:fetchPosts]', error);
      showToast('Erro ao carregar posts.', 'error');
    } finally {
      setIsLoadingPosts(false);
      setIsFetchingMore(false);
    }
  }, [lastDoc, showToast, posts.length]);

  // Carregamento inicial (somente na montagem)
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
    if (!isLoadingPosts && hasMore) fetchPosts(true);
  };

  // -------------------------
  // Handlers com Optimistic UI
  // -------------------------

  const handleLike = async (postId, e) => {
    if (e) e.stopPropagation();
    if (!currentUser) return;

    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;
    const post = posts[postIndex];

    const likedBy = post.likedBy || [];
    const hasLiked = likedBy.includes(currentUser.id);
    const newLikedBy = hasLiked
      ? likedBy.filter(id => id !== currentUser.id)
      : [...likedBy, currentUser.id];

    const originalPosts = [...posts];
    setPosts(prev => {
      const updated = [...prev];
      updated[postIndex] = { ...post, likedBy: newLikedBy, likes: newLikedBy.length };
      return updated;
    });

    try {
      await PostService.updatePost(postId, { likedBy: newLikedBy, likes: newLikedBy.length });
    } catch (error) {
      console.error('[usePosts:handleLike]', error);
      showToast('Erro ao curtir o post.', 'error');
      setPosts(originalPosts);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    if (!commentText.trim() || !currentUser) return;

    // Rate limiting: 30 segundos entre comentários
    const COMMENT_COOLDOWN_MS = 30_000;
    const now = Date.now();
    if (now - lastCommentTimeRef.current < COMMENT_COOLDOWN_MS) {
      const remaining = Math.ceil((COMMENT_COOLDOWN_MS - (now - lastCommentTimeRef.current)) / 1000);
      showToast(`Aguarde ${remaining}s antes de comentar novamente.`, 'error');
      return;
    }

    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;
    const post = posts[postIndex];

    const newComment = {
      id: Date.now(),
      authorId: currentUser.id,
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    const newCommentsList = [...(post.comments || []), newComment];
    const originalPosts = [...posts];

    setPosts(prev => {
      const updated = [...prev];
      updated[postIndex] = { ...post, comments: newCommentsList };
      return updated;
    });

    try {
      await PostService.updatePost(postId, { comments: newCommentsList });
      lastCommentTimeRef.current = Date.now();
      showToast('Comentário publicado!');
    } catch (error) {
      console.error('[usePosts:handleAddComment]', error);
      showToast('Erro ao comentar.', 'error');
      setPosts(originalPosts);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;
    const post = posts[postIndex];

    const comment = post.comments?.find(c => c.id === commentId);
    const isOwner = comment && comment.authorId === currentUser?.id;
    const isAdmin = currentUser?.role === 'admin';

    if (!isOwner && !isAdmin) {
      showToast('Você não tem permissão para excluir este comentário.', 'error');
      return;
    }

    const newCommentsList = post.comments.filter(c => c.id !== commentId);
    const originalPosts = [...posts];

    setPosts(prev => {
      const updated = [...prev];
      updated[postIndex] = { ...post, comments: newCommentsList };
      return updated;
    });

    try {
      await PostService.updatePost(postId, { comments: newCommentsList });
      showToast('Comentário removido.', 'success');
    } catch (error) {
      console.error('[usePosts:handleDeleteComment]', error);
      showToast('Erro ao remover comentário.', 'error');
      setPosts(originalPosts);
    }
  };

  const handleSavePost = async (postData) => {
    // Verificação básica de segurança no cliente
    if (currentUser?.role !== 'admin') {
      showToast('Acesso negado. Apenas editores chefes podem lançar fases.', 'error');
      return null;
    }

    try {
      if (postData.id) {
        const { id, ...dataToUpdate } = postData;
        dataToUpdate.content = sanitizePostContent(dataToUpdate.content);
        await PostService.updatePost(id, dataToUpdate);
        
        const freshPost = await PostService.getPostById(id);
        if (freshPost) setPosts(prev => prev.map(p => p.id === id ? freshPost : p));
        showToast('Artigo atualizado com sucesso!');
        return freshPost;
      } else {
        const createdPost = await PostService.createPost({
          ...postData,
          content: sanitizePostContent(postData.content),
        }, currentUser);
        if (createdPost) setPosts(prev => [createdPost, ...prev]);
        showToast('Novo artigo publicado na capa!');
        return createdPost;
      }
    } catch (error) {
      console.error('[usePosts:handleSavePost]', error);
      showToast('Erro ao salvar o artigo.', 'error');
      return null;
    }
  };

  const handleDeletePost = async (postId) => {
    if (currentUser?.role !== 'admin') {
      showToast('Apenas admins podem remover posts.', 'error');
      return false;
    }

    const originalPosts = [...posts];
    setPosts(prev => prev.filter(p => p.id !== postId));

    try {
      await PostService.deletePost(postId);
      showToast('Artigo removido permanentemente.', 'success');
      return true;
    } catch (error) {
      console.error('[usePosts:handleDeletePost]', error);
      showToast('Erro ao excluir artigo.', 'error');
      setPosts(originalPosts);
      return false;
    }
  };

  return {
    posts,
    isLoadingPosts,
    isFetchingMore,
    handleLike,
    handleAddComment,
    handleDeleteComment,
    handleSavePost,
    handleDeletePost,
    loadMore,
    hasMore,
  };
}

