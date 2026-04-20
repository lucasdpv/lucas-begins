import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore';

import { slugify } from '../lib/utils';

const POSTS_PER_PAGE = 6;

/**
 * Hook para gerenciar os artigos do blog via Firebase Firestore.
 */
export function usePosts(currentUser, showToast) {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [limitCount, setLimitCount] = useState(POSTS_PER_PAGE);
  const [hasMore, setHasMore] = useState(true);

  // Escuta o banco de dados em tempo real com limite dinâmico
  useEffect(() => {
    const q = query(
      collection(db, "posts"), 
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      
      // Verifica se ainda existem mais posts no banco
      // Nota: Se o número retornado for menor que o limite solicitado, 
      // e não for a primeira carga vazia, chegamos ao fim.
      setHasMore(snapshot.docs.length >= limitCount);
      setIsLoadingPosts(false);
    }, (error) => {
      console.error("Erro ao carregar posts:", error);
      setIsLoadingPosts(false);
    });

    return () => unsubscribe();
  }, [limitCount]);

  const loadMore = () => {
    setLimitCount(prev => prev + POSTS_PER_PAGE);
  };

  // Handlers Assíncronos
  const handleLike = async (postId, e) => {
    if (e) e.stopPropagation();
    if (!currentUser) return;

    try {
      const postRef = doc(db, "posts", postId);
      const post = posts.find(p => p.id === postId);
      
      // Inicializa likedBy se não existir (suporte a posts antigos)
      const likedBy = post.likedBy || [];
      const hasLiked = likedBy.includes(currentUser.id);
      
      let newLikedBy;
      if (hasLiked) {
        // Unlike: remove o ID do usuário
        newLikedBy = likedBy.filter(id => id !== currentUser.id);
      } else {
        // Like: adiciona o ID do usuário
        newLikedBy = [...likedBy, currentUser.id];
      }

      await updateDoc(postRef, {
        likedBy: newLikedBy,
        likes: newLikedBy.length // Mantemos o contador para facilitar queries básicas
      });
    } catch {
      showToast("Erro ao curtir o post.");
    }
  };

  const handleAddComment = async (postId, commentText) => {
    if (!commentText.trim() || !currentUser) return;
    
    try {
      const postRef = doc(db, "posts", postId);
      const post = posts.find(p => p.id === postId);
      
      const newComment = { 
        id: Date.now(), 
        authorId: currentUser.id, 
        author: currentUser.name, 
        authorAvatar: currentUser.avatar,
        text: commentText,
        createdAt: new Date().toISOString()
      };

      await updateDoc(postRef, {
        comments: [...(post.comments || []), newComment]
      });
      showToast("Comentário publicado!");
    } catch {
      showToast("Erro ao comentar.");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const postRef = doc(db, "posts", postId);
      const post = posts.find(p => p.id === postId);
      const comment = post.comments?.find(c => c.id === commentId);

      // Trava de Segurança: Só autor ou admin pode deletar
      const isOwner = comment && comment.authorId === currentUser?.id;
      const isAdmin = currentUser?.role === "admin";

      if (!isOwner && !isAdmin) {
        showToast("Você não tem permissão para excluir este comentário.", "error");
        return;
      }

      await updateDoc(postRef, {
        comments: post.comments.filter((c) => c.id !== commentId)
      });
      showToast("Comentário removido.", "success");
    } catch {
      showToast("Erro ao remover comentário.");
    }
  };

  const handleSavePost = async (postData) => {
    try {
      if (postData.id) {
        // Atualizar Post Existente
        const postRef = doc(db, "posts", postData.id);
        // eslint-disable-next-line no-unused-vars
        const { id, ...dataToUpdate } = postData;
        await updateDoc(postRef, {
          ...dataToUpdate,
          updatedAt: serverTimestamp()
        });
        showToast("Artigo atualizado com sucesso!");
        return postData;
      } else {
        // Criar Novo Post
        const newPost = {
          ...postData,
          date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
          likes: 0,
          likedBy: [],
          slug: slugify(postData.title),
          comments: [],
          author: { name: currentUser.name, role: "Editor Chefe" },
          gradient: postData.gradient || "from-purple-600 to-blue-600",
          createdAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, "posts"), newPost);
        showToast("Novo artigo publicado na capa!");
        return { id: docRef.id, ...newPost };
      }
    } catch (error) {
      showToast("Erro ao salvar o artigo.");
      console.error(error);
      return null;
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      showToast("Artigo removido permanentemente.", "success");
      return true;
    } catch {
      showToast("Erro ao excluir artigo.");
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
