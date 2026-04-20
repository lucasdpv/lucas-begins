import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';

import { slugify } from '../lib/utils';

const POSTS_PER_PAGE = 6;

/**
 * Hook para gerenciar os artigos do blog via Firebase Firestore.
 * Refatorado para usar Pagination baseada em Cursors (Performance & Custo)
 * e atualizações Otimistas (Optimistic UI).
 */
export function usePosts(currentUser, showToast) {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);

  // Busca inicial e de paginação
  const fetchPosts = useCallback(async (isLoadMore = false) => {
    try {
      let q = query(
        collection(db, "posts"), 
        orderBy("createdAt", "desc"),
        limit(POSTS_PER_PAGE)
      );
      
      if (isLoadMore && lastDoc) {
        q = query(
          collection(db, "posts"), 
          orderBy("createdAt", "desc"), 
          startAfter(lastDoc), 
          limit(POSTS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPosts(prev => isLoadMore ? [...prev, ...postsData] : postsData);
      
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }
      setHasMore(snapshot.docs.length >= POSTS_PER_PAGE);
    } catch (error) {
      console.error("[usePosts:fetchPosts]", error);
      showToast("Erro ao carregar posts.", "error");
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
    if (!isLoadingPosts && hasMore) {
      fetchPosts(true);
    }
  };

  // -------------------------
  // Handlers Assíncronos (Com Optimistic UI)
  // -------------------------

  const handleLike = async (postId, e) => {
    if (e) e.stopPropagation();
    if (!currentUser) return;

    // Acha o post no estado local (Cache)
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;
    const post = posts[postIndex];

    const likedBy = post.likedBy || [];
    const hasLiked = likedBy.includes(currentUser.id);
    let newLikedBy = hasLiked 
      ? likedBy.filter(id => id !== currentUser.id) 
      : [...likedBy, currentUser.id];

    // 1. Optimistic Update (UI responde instantaneamente)
    const originalPosts = [...posts];
    setPosts(prev => {
      const updated = [...prev];
      updated[postIndex] = { ...post, likedBy: newLikedBy, likes: newLikedBy.length };
      return updated;
    });

    // 2. Persistência no Banco
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        likedBy: newLikedBy,
        likes: newLikedBy.length
      });
    } catch (error) {
      console.error("[usePosts:handleLike]", error);
      showToast("Erro ao curtir o post.", "error");
      setPosts(originalPosts); // Rollback em caso de erro
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
      createdAt: new Date().toISOString()
    };

    const newCommentsList = [...(post.comments || []), newComment];
    const originalPosts = [...posts];

    // Optimistic Update
    setPosts(prev => {
      const updated = [...prev];
      updated[postIndex] = { ...post, comments: newCommentsList };
      return updated;
    });

    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { comments: newCommentsList });
      showToast("Comentário publicado!");
    } catch (error) {
      console.error("[usePosts:handleAddComment]", error);
      showToast("Erro ao comentar.", "error");
      setPosts(originalPosts); // Rollback
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;
    const post = posts[postIndex];

    const comment = post.comments?.find(c => c.id === commentId);
    const isOwner = comment && comment.authorId === currentUser?.id;
    const isAdmin = currentUser?.role === "admin";

    if (!isOwner && !isAdmin) {
      showToast("Você não tem permissão para excluir este comentário.", "error");
      return;
    }

    const newCommentsList = post.comments.filter((c) => c.id !== commentId);
    const originalPosts = [...posts];

    // Optimistic Update
    setPosts(prev => {
      const updated = [...prev];
      updated[postIndex] = { ...post, comments: newCommentsList };
      return updated;
    });

    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { comments: newCommentsList });
      showToast("Comentário removido.", "success");
    } catch (error) {
      console.error("[usePosts:handleDeleteComment]", error);
      showToast("Erro ao remover comentário.", "error");
      setPosts(originalPosts); // Rollback
    }
  };

  const handleSavePost = async (postData) => {
    try {
      if (postData.id) {
        // Atualizar Post Existente
        const postRef = doc(db, "posts", postData.id);
        const { id, ...dataToUpdate } = postData;
        await updateDoc(postRef, {
          ...dataToUpdate,
          updatedAt: serverTimestamp()
        });
        
        // Obter post atualizado do banco para ter os timestamps corretos caso precise local
        const updatedSnap = await getDoc(postRef);
        const updatedPost = { id: updatedSnap.id, ...updatedSnap.data() };

        setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
        showToast("Artigo atualizado com sucesso!");
        return updatedPost;
      } else {
        // Criar Novo Post com Colision Prevention (Hash curto)
        const baseSlug = slugify(postData.title);
        const uniqueHash = Math.random().toString(36).substring(2, 7);
        
        const newPost = {
          ...postData,
          likes: 0,
          likedBy: [],
          slug: `${baseSlug}-${uniqueHash}`, 
          comments: [],
          author: { name: currentUser.name, role: "Editor Chefe" },
          gradient: postData.gradient || "from-purple-600 to-blue-600",
          createdAt: serverTimestamp()
        };
        // Remove 'date' string hardcoded (vamos usar apenas createdAt na UI)
        delete newPost.date;

        const docRef = await addDoc(collection(db, "posts"), newPost);
        const createdSnap = await getDoc(docRef);
        const createdPostObj = { id: createdSnap.id, ...createdSnap.data() };
        
        setPosts(prev => [createdPostObj, ...prev]);
        showToast("Novo artigo publicado na capa!");
        return createdPostObj;
      }
    } catch (error) {
      console.error("[usePosts:handleSavePost]", error);
      showToast("Erro ao salvar o artigo.", "error");
      return null;
    }
  };

  const handleDeletePost = async (postId) => {
    const originalPosts = [...posts];
    // Optimistic Delete
    setPosts(prev => prev.filter(p => p.id !== postId));
    
    try {
      await deleteDoc(doc(db, "posts", postId));
      showToast("Artigo removido permanentemente.", "success");
      return true;
    } catch (error) {
      console.error("[usePosts:handleDeletePost]", error);
      showToast("Erro ao excluir artigo.", "error");
      setPosts(originalPosts); // Rollback
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
    hasMore
  };
}
