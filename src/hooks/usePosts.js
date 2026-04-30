import { useState, useEffect, useCallback, useRef } from 'react';
import { PostService } from '../services/postService';
import { POSTS_PER_PAGE } from '../constants';
import DOMPurify from 'dompurify';

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

  // Aplica uma atualização otimista e faz rollback em caso de erro
  const optimisticUpdate = useCallback(async (postId, getNextPost, serviceCall, errorTag, errorMsg) => {
    const idx = posts.findIndex(p => p.id === postId);
    if (idx === -1) return;
    const originalPosts = posts;
    setPosts(prev => {
      const next = [...prev];
      next[idx] = getNextPost(prev[idx]);
      return next;
    });
    try {
      return await serviceCall();
    } catch (err) {
      console.error(errorTag, err);
      showToast(errorMsg, 'error');
      setPosts(originalPosts);
    }
  }, [posts, showToast]);

  const handleLike = useCallback(async (postId) => {
    if (!currentUser) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const likedBy = post.likedBy || [];
    const newLikedBy = likedBy.includes(currentUser.id)
      ? likedBy.filter(id => id !== currentUser.id)
      : [...likedBy, currentUser.id];
    const update = { likedBy: newLikedBy, likes: newLikedBy.length };
    await optimisticUpdate(
      postId,
      (p) => ({ ...p, ...update }),
      () => PostService.updatePost(postId, update),
      '[usePosts:handleLike]',
      'Erro ao curtir o post.'
    );
  }, [currentUser, posts, optimisticUpdate]);

  const handleAddComment = useCallback(async (postId, commentText) => {
    if (!commentText.trim() || !currentUser) return;
    const COMMENT_COOLDOWN_MS = 30_000;
    const now = Date.now();
    if (now - lastCommentTimeRef.current < COMMENT_COOLDOWN_MS) {
      const remaining = Math.ceil((COMMENT_COOLDOWN_MS - (now - lastCommentTimeRef.current)) / 1000);
      showToast(`Aguarde ${remaining}s antes de comentar novamente.`, 'error');
      return;
    }
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const newComment = {
      id: Date.now(),
      authorId: currentUser.id,
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      text: commentText,
      createdAt: new Date().toISOString(),
    };
    const newComments = [...(post.comments || []), newComment];
    await optimisticUpdate(
      postId,
      (p) => ({ ...p, comments: newComments }),
      async () => {
        await PostService.updatePost(postId, { comments: newComments });
        lastCommentTimeRef.current = Date.now();
        showToast('Comentário publicado!');
      },
      '[usePosts:handleAddComment]',
      'Erro ao comentar.'
    );
  }, [currentUser, posts, showToast, optimisticUpdate]);

  const handleDeleteComment = useCallback(async (postId, commentId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const comment = post.comments?.find(c => c.id === commentId);
    if (!comment) return;
    if (comment.authorId !== currentUser?.id && currentUser?.role !== 'admin') {
      showToast('Você não tem permissão para excluir este comentário.', 'error');
      return;
    }
    const newComments = post.comments.filter(c => c.id !== commentId);
    await optimisticUpdate(
      postId,
      (p) => ({ ...p, comments: newComments }),
      async () => {
        await PostService.updatePost(postId, { comments: newComments });
        showToast('Comentário removido.', 'success');
      },
      '[usePosts:handleDeleteComment]',
      'Erro ao remover comentário.'
    );
  }, [currentUser, posts, showToast, optimisticUpdate]);

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

