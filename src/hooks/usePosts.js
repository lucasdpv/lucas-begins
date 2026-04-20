import { useState, useEffect } from 'react';
import { initialPosts } from '../data/mockData';

/**
 * Hook para gerenciar os artigos do blog, incluindo persistência no LocalStorage.
 */
export function usePosts(currentUser, showToast) {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Carregamento inicial assíncrono para simular latência de rede e exibir Skeletons
  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem('lucas_begins_posts');
      setPosts(saved ? JSON.parse(saved) : initialPosts);
      setIsLoadingPosts(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Salva no LocalStorage sempre que houver mudança e já tiver carregado
  useEffect(() => {
    if (!isLoadingPosts) {
      localStorage.setItem('lucas_begins_posts', JSON.stringify(posts));
    }
  }, [posts, isLoadingPosts]);

  // Handlers
  const handleLike = (postId, e) => {
    if (e) e.stopPropagation();
    setPosts((curr) => curr.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p)));
  };

  const handleAddComment = (postId, commentText) => {
    if (!commentText.trim() || !currentUser) return;
    const newComment = { id: Date.now(), authorId: currentUser.id, author: currentUser.name, text: commentText };
    setPosts((curr) =>
      curr.map((p) => {
        if (p.id === postId) {
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      })
    );
    showToast("Comentário publicado!");
  };

  const handleDeleteComment = (postId, commentId) => {
    setPosts((curr) =>
      curr.map((p) => {
        if (p.id === postId) {
          return { ...p, comments: p.comments.filter((c) => c.id !== commentId) };
        }
        return p;
      })
    );
    showToast("Comentário removido.", "success");
  };

  const handleSavePost = (postData) => {
    let savedPost = null;
    if (postData.id) {
      setPosts((curr) => curr.map((p) => (p.id === postData.id ? postData : p)));
      showToast("Artigo atualizado com sucesso!");
      savedPost = postData;
    } else {
      const newPost = {
        ...postData,
        id: Date.now(),
        date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
        likes: 0,
        comments: [],
        author: { name: currentUser.name, role: "Editor Chefe" },
        gradient: "from-purple-600 to-blue-600",
      };
      setPosts([newPost, ...posts]);
      showToast("Novo artigo publicado na capa!");
      savedPost = newPost;
    }
    return savedPost;
  };

  const handleDeletePost = (postId) => {
    if (!window.confirm("Tem certeza que deseja excluir definitivamente este artigo?")) return false;
    setPosts((curr) => curr.filter((p) => p.id !== postId));
    showToast("Artigo removido permanentemente.", "success");
    return true;
  };

  return {
    posts,
    isLoadingPosts,
    handleLike,
    handleAddComment,
    handleDeleteComment,
    handleSavePost,
    handleDeletePost
  };
}
