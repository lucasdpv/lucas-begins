import { useState, useEffect, useCallback } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import { PostService } from '../services/postService';
import { slugify } from '../lib/utils';

const POSTS_PER_PAGE = 6;

/**
 * Hook para gerenciar os artigos do blog.
 * Utiliza PostService como camada de acesso a dados (separação de responsabilidades).
 * Mantém Optimistic UI para todas as mutações.
 */
export function usePosts(currentUser, showToast) {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);

  // Busca inicial e paginação por cursor
  const fetchPosts = useCallback(async (isLoadMore = false) => {
    setIsLoadingPosts(true);
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
    }
  }, [lastDoc, showToast]);

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
    try {
      if (postData.id) {
        // Atualizar post existente
        const { id, ...dataToUpdate } = postData;
        await PostService.updatePost(id, { ...dataToUpdate, updatedAt: serverTimestamp() });

        // Busca o post atualizado para ter os timestamps corretos
        const freshPost = await PostService.getPostById(id);
        if (freshPost) setPosts(prev => prev.map(p => p.id === id ? freshPost : p));
        showToast('Artigo atualizado com sucesso!');
        return freshPost;
      } else {
        // Criar novo post com slug único (collision prevention)
        const baseSlug = slugify(postData.title);
        const uniqueHash = Math.random().toString(36).substring(2, 7);

        const newPostData = {
          ...postData,
          likes: 0,
          likedBy: [],
          slug: `${baseSlug}-${uniqueHash}`,
          comments: [],
          author: { name: currentUser.name, role: 'Editor Chefe' },
          gradient: postData.gradient || 'from-purple-600 to-blue-600',
          createdAt: serverTimestamp(),
        };
        // Remove campo legado 'date'
        delete newPostData.date;

        const createdPost = await PostService.createPost(newPostData);
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
    const originalPosts = [...posts];
    // Optimistic delete
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
    handleLike,
    handleAddComment,
    handleDeleteComment,
    handleSavePost,
    handleDeletePost,
    loadMore,
    hasMore,
  };
}

