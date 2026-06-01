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
  getDoc,
  setDoc,
  increment,
  where,
  QueryDocumentSnapshot,
  DocumentData,
  arrayUnion,
  arrayRemove,
  runTransaction,
  writeBatch,
  collectionGroup,
  documentId
} from 'firebase/firestore';
import { slugify } from '../lib/utils';
import { Post, Comment, PostSchema } from '../features/posts/schemas';
import { errorService } from './errorService';
import { COLLECTIONS } from '../constants';

/**
 * Servico para abstrair as chamadas ao Firestore para a entidade Post.
 */
export const PostService = {
  /**
   * Busca posts com paginacao.
   */
  async getPaginatedPosts(limitNumber: number, lastDoc: QueryDocumentSnapshot<DocumentData> | null = null, category?: string): Promise<any> {
    try {
      // Se tiver categoria específica, fazemos busca index-free e ordenação client-side
      if (category && category !== 'Todos' && category !== 'all') {
        const categoriesToSearch = category.toLowerCase().includes("dossi")
          ? ["Dossiê", "Dossiês", "dossie", "dossies"]
          : [category];

        const q = query(
          collection(db, COLLECTIONS.POSTS),
          where("category", "in", categoriesToSearch)
        );
        const snapshot = await getDocs(q);
        const posts = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Post))
          .filter(p => !p.isDraft)
          .sort((a, b) => {
            const timeA = a.createdAt?.seconds || (a.createdAt instanceof Date ? a.createdAt.getTime() / 1000 : 0);
            const timeB = b.createdAt?.seconds || (b.createdAt instanceof Date ? b.createdAt.getTime() / 1000 : 0);
            return timeB - timeA;
          });

        return {
          posts: posts,
          lastDoc: null // Como já temos tudo em memória para a categoria, não precisamos de mais páginas
        };
      }

      // Se for "Todos", usamos paginação por cursor nativa do Firestore (sem índice necessário)
      const constraints: any[] = [
        orderBy("createdAt", "desc"),
        limit(limitNumber)
      ];

      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const q = query(collection(db, COLLECTIONS.POSTS), ...constraints);
      const snapshot = await getDocs(q);
      const posts = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Post))
        .filter(p => !p.isDraft);
      
      return {
        posts: posts,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
      };
    } catch (error) {
      console.error("[PostService] Error in getPaginatedPosts:", error);
      return { posts: [], lastDoc: null };
    }
  },

  /**
   * Busca posts em destaque (isFeatured).
   */
  async getFeaturedPosts(): Promise<Post[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.POSTS), 
        where("isFeatured", "==", true)
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      
      // Ordena por data no client-side para evitar a necessidade de índice composto
      return posts
        .filter(p => !p.isDraft)
        .sort((a, b) => {
          const timeA = a.createdAt?.seconds || (a.createdAt instanceof Date ? a.createdAt.getTime() / 1000 : 0);
          const timeB = b.createdAt?.seconds || (b.createdAt instanceof Date ? b.createdAt.getTime() / 1000 : 0);
          return timeB - timeA;
        })
        .slice(0, 5);
    } catch (error) {
      console.error("[PostService] Error in getFeaturedPosts:", error);
      return [];
    }
  },

  /**
   * Busca os posts mais recentes.
   */
  async getLatestPosts(limitNumber: number = 5): Promise<Post[]> {
    const q = query(
      collection(db, COLLECTIONS.POSTS),
      orderBy("createdAt", "desc"),
      limit(limitNumber)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
  },

  /**
   * Busca todos os posts (para busca global e filtros).
   */
  async getAllPosts(): Promise<Post[]> {
    try {
      const q = query(collection(db, COLLECTIONS.POSTS));
      const snapshot = await getDocs(q);
      
      const posts = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Post));

      // Ordenação resiliente: tenta pegar o timestamp do Firebase, senão usa 0
      return posts.sort((a, b) => {
        const timeA = a.createdAt?.seconds || (a.createdAt instanceof Date ? a.createdAt.getTime() / 1000 : 0);
        const timeB = b.createdAt?.seconds || (b.createdAt instanceof Date ? b.createdAt.getTime() / 1000 : 0);
        return timeB - timeA;
      });
    } catch (error) {
      console.error("[PostService] Error fetching all posts:", error);
      return [];
    }
  },

  /**
   * Busca posts populares (ordenados por likes, ignorando rascunhos) limitando a quantidade.
   */
  async getPopularPosts(limitNumber: number = 4): Promise<Post[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.POSTS),
        orderBy("likes", "desc"),
        limit(limitNumber + 5)
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      
      // Filtra rascunhos no client-side para evitar a necessidade de índice composto com where('isDraft')
      return posts.filter(p => !p.isDraft).slice(0, limitNumber);
    } catch (error) {
      console.error("[PostService] Error fetching popular posts:", error);
      return [];
    }
  },

  /**
   * Busca um post especifico.
   */
  async getPostById(postId: string): Promise<Post | null> {
    try {
      const postRef = doc(db, COLLECTIONS.POSTS, postId);
      const snap = await getDoc(postRef);
      if (!snap.exists()) return null;
      
      // Busca comentários da subcoleção de forma ordenada
      const commentsQ = query(
        collection(db, COLLECTIONS.POSTS, postId, "comments"),
        orderBy("createdAt", "desc")
      );
      const commentsSnap = await getDocs(commentsQ);
      const comments = commentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const data = { id: snap.id, ...snap.data(), comments };
      const result = PostSchema.safeParse(data);
      if (!result.success) {
        console.warn(`[PostService] Validation failed for post ${postId}, using raw data.`);
      }
      return data as Post;
    } catch (error) {
      console.error("[PostService] Error in getPostById:", error);
      return null;
    }
  },

  /**
   * Busca um post especifico pelo Slug (URL amigavel).
   */
  async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      const q = query(collection(db, COLLECTIONS.POSTS), where("slug", "==", slug), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      const postDoc = snapshot.docs[0];
      
      // Busca comentários da subcoleção de forma ordenada
      const commentsQ = query(
        collection(db, COLLECTIONS.POSTS, postDoc.id, "comments"),
        orderBy("createdAt", "desc")
      );
      const commentsSnap = await getDocs(commentsQ);
      const comments = commentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const data = { id: postDoc.id, ...postDoc.data(), comments };
      const result = PostSchema.safeParse(data);
      if (!result.success) {
        console.warn(`[PostService] Validation failed for slug ${slug}, using raw data.`);
      }
      return data as Post;
    } catch (error) {
      console.error("[PostService] Error in getPostBySlug:", error);
      return null;
    }
  },

  /**
   * Atualiza dados de um post existente.
   */
  async updatePost(postId: string, data: Partial<Post>): Promise<boolean> {
    const postRef = doc(db, COLLECTIONS.POSTS, postId);
    
    const { id, author, ...cleanData } = data as any;
    
    const updateData: any = {
      ...cleanData,
      updatedAt: serverTimestamp()
    };

    if (author) {
      Object.keys(author).forEach(key => {
        if (author[key] !== undefined) {
          updateData[`author.${key}`] = author[key];
        }
      });
    }

    await updateDoc(postRef, updateData as DocumentData);
    return true;
  },

  /**
   * Incrementa o contador de visualizacoes.
   */
  async incrementPostViews(postId: string): Promise<void> {
    try {
      const postRef = doc(db, COLLECTIONS.POSTS, postId);
      await updateDoc(postRef, {
        views: increment(1)
      });
    } catch (error) {
      errorService.handle(error, "ao incrementar views");
    }
  },

  /**
   * Cria um novo post.
   */
  async createPost(postData: Partial<Post>, currentUser: any): Promise<Post | null> {
    try {
      const baseSlug = slugify(postData.title || 'post');
      const uniqueHash = Math.random().toString(36).substring(2, 7);
      
      const { id, ...cleanData } = postData as any;

      const newPostData = {
        ...cleanData,
        likes: 0,
        likedBy: [],
        comments: [],
        views: 0,
        viewedBy: [],
        slug: `${baseSlug}-${uniqueHash}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        author: {
          id: currentUser?.uid || currentUser?.id || "",
          name: currentUser?.name || currentUser?.displayName || 'Anonimo',
          avatar: currentUser?.avatar || currentUser?.photoURL || "",
          role: currentUser?.role || 'autor',
          bio: currentUser?.bio || "",
          aka: currentUser?.aka || "",
          level: currentUser?.level || 1
        },
      };

      Object.keys(newPostData).forEach(key => {
        if ((newPostData as any)[key] === undefined) {
          delete (newPostData as any)[key];
        }
      });

      const docRef = await addDoc(collection(db, COLLECTIONS.POSTS), newPostData as DocumentData);
      return this.getPostById(docRef.id);
    } catch (error: any) {
      throw new Error(error.message || "Erro desconhecido no Firebase");
    }
  },

  /**
   * Alterna o like de um usuario no post.
   */
  async toggleLike(postId: string, userId: string): Promise<'liked' | 'unliked' | null> {
    try {
      const postRef = doc(db, COLLECTIONS.POSTS, postId);
      
      return await runTransaction(db, async (transaction) => {
        const postSnap = await transaction.get(postRef);
        if (!postSnap.exists()) return null;

        const data = postSnap.data();
        const likedBy = data.likedBy || [];
        const hasLiked = likedBy.includes(userId);
        
        const action: 'liked' | 'unliked' = hasLiked ? 'unliked' : 'liked';
        
        transaction.update(postRef, {
          likedBy: hasLiked ? arrayRemove(userId) : arrayUnion(userId),
          likes: hasLiked ? Math.max((data.likes || 1) - 1, 0) : (data.likes || 0) + 1,
          updatedAt: serverTimestamp()
        });

        return action;
      });
    } catch (error) {
      errorService.handle(error, "ao fazer toggle de like");
      return null;
    }
  },

  /**
   * Adiciona um comentario na subcoleção do post.
   */
  async addComment(postId: string, comment: Partial<Comment>): Promise<void> {
    try {
      const commentsColl = collection(db, COLLECTIONS.POSTS, postId, "comments");
      const newCommentDoc = doc(commentsColl);
      
      await setDoc(newCommentDoc, {
        ...comment,
        id: newCommentDoc.id,
        likes: [],
        replies: [],
        createdAt: new Date().toISOString()
      });

      // Incrementa commentsCount no documento do post
      const postRef = doc(db, COLLECTIONS.POSTS, postId);
      await updateDoc(postRef, {
        commentsCount: increment(1)
      });

      // Incrementa commentsCount no documento do autor do comentário
      if (comment.authorId) {
        const userRef = doc(db, COLLECTIONS.USERS, comment.authorId);
        await updateDoc(userRef, {
          commentsCount: increment(1)
        });
      }
    } catch (error) {
      errorService.handle(error, "ao adicionar comentario");
      throw error;
    }
  },

  /**
   * Remove um comentario da subcoleção.
   */
  async deleteComment(postId: string, commentId: string | number): Promise<void> {
    try {
      const commentRef = doc(db, COLLECTIONS.POSTS, postId, "comments", String(commentId));
      
      // Busca informações do comentário para saber o autor e decrementar dele
      try {
        const snap = await getDoc(commentRef);
        if (snap.exists()) {
          const commentData = snap.data();
          if (commentData.authorId) {
            const userRef = doc(db, COLLECTIONS.USERS, commentData.authorId);
            await updateDoc(userRef, {
              commentsCount: increment(-1)
            }).catch(err => {
              console.warn("[PostService] Erro ao decrementar commentsCount do usuário:", err);
            });
          }
        }
      } catch (err) {
        console.warn("[PostService] Erro ao buscar comentário antes de deletar:", err);
      }

      await deleteDoc(commentRef);

      // Decrementa commentsCount no documento do post
      const postRef = doc(db, COLLECTIONS.POSTS, postId);
      await updateDoc(postRef, {
        commentsCount: increment(-1)
      });
    } catch (error) {
      errorService.handle(error, "ao remover comentario");
      throw error;
    }
  },

  /**
   * Zera métricas de todos os posts.
   */
  async resetAllMetrics(): Promise<void> {
    const posts = await this.getAllPosts();

    for (const post of posts) {
      if (!post.id) continue;
      
      try {
        const postRef = doc(db, COLLECTIONS.POSTS, post.id);
        await updateDoc(postRef, { 
          likes: 0, 
          likedBy: [], 
          views: 0, 
          viewedBy: [] 
        });
      } catch (err) {
        console.error(`Erro no post ${post.id}:`, err);
      }
    }
  },

  /**
   * Normaliza visualizacoes.
   */
  async normalizeAllPostViews(): Promise<void> {
    const posts = await this.getAllPosts();
    
    const CHUNK_SIZE = 400;
    for (let i = 0; i < posts.length; i += CHUNK_SIZE) {
      const chunk = posts.slice(i, i + CHUNK_SIZE);
      const batch = writeBatch(db);
      
      chunk.forEach(post => {
        if (!post.id) return;
        const likes = post.likes || 0;
        const normalizedViews = Math.max(likes + (Math.floor(Math.random() * 10) + 5), 5);
        const postRef = doc(db, COLLECTIONS.POSTS, post.id);
        batch.update(postRef, { views: normalizedViews });
      });
      
      await batch.commit();
    }
  },

  /**
   * Alterna o like de um usuário em um comentário específico na subcoleção.
   */
  async toggleCommentLike(postId: string, commentId: string | number, userId: string): Promise<'liked' | 'unliked' | null> {
    try {
      const commentRef = doc(db, COLLECTIONS.POSTS, postId, "comments", String(commentId));
      
      return await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(commentRef);
        if (!snap.exists()) return null;

        const data = snap.data();
        const likes = data.likes || [];
        const hasLiked = likes.includes(userId);
        const action: 'liked' | 'unliked' = hasLiked ? 'unliked' : 'liked';

        transaction.update(commentRef, {
          likes: hasLiked ? arrayRemove(userId) : arrayUnion(userId)
        });

        return action;
      });
    } catch (error) {
      errorService.handle(error, "ao fazer toggle de like no comentário");
      return null;
    }
  },

  /**
   * Adiciona uma resposta (reply) a um comentário específico na subcoleção.
   */
  async addCommentReply(postId: string, commentId: string | number, reply: any): Promise<void> {
    try {
      const commentRef = doc(db, COLLECTIONS.POSTS, postId, "comments", String(commentId));
      
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(commentRef);
        if (!snap.exists()) return;

        const replies = snap.data().replies ? [...snap.data().replies] : [];
        replies.push({
          ...reply,
          id: Date.now(),
          likes: []
        });

        transaction.update(commentRef, { replies });
      });
    } catch (error) {
      errorService.handle(error, "ao adicionar resposta ao comentário");
      throw error;
    }
  },

  /**
   * Remove uma resposta (reply) de um comentário específico na subcoleção.
   */
  async deleteCommentReply(postId: string, commentId: string | number, replyId: string | number): Promise<void> {
    try {
      const commentRef = doc(db, COLLECTIONS.POSTS, postId, "comments", String(commentId));
      
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(commentRef);
        if (!snap.exists()) return;

        const replies = (snap.data().replies || []).filter((r: any) => String(r.id) !== String(replyId));
        transaction.update(commentRef, { replies });
      });
    } catch (error) {
      errorService.handle(error, "ao deletar resposta do comentário");
      throw error;
    }
  },

  /**
   * Alterna o like em uma resposta (reply) dentro de um comentário na subcoleção.
   */
  async toggleReplyLike(postId: string, commentId: string | number, replyId: string | number, userId: string): Promise<'liked' | 'unliked' | null> {
    try {
      const commentRef = doc(db, COLLECTIONS.POSTS, postId, "comments", String(commentId));
      
      return await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(commentRef);
        if (!snap.exists()) return null;

        const replies = [...(snap.data().replies || [])];
        const reply = replies.find((r: any) => String(r.id) === String(replyId));
        if (!reply) return null;

        if (!reply.likes) {
          reply.likes = [];
        }

        const hasLiked = reply.likes.includes(userId);
        const action: 'liked' | 'unliked' = hasLiked ? 'unliked' : 'liked';

        reply.likes = hasLiked 
          ? reply.likes.filter((id: string) => id !== userId) 
          : [...reply.likes, userId];

        transaction.update(commentRef, { replies });

        return action;
      });
    } catch (error) {
      errorService.handle(error, "ao fazer toggle de like na resposta");
      return null;
    }
  },

  /**
   * Busca posts ordenados por visualizações descrescentemente (mais lidos).
   */
  async getMostViewedPosts(limitNumber: number = 5): Promise<Post[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.POSTS),
        orderBy("views", "desc"),
        limit(limitNumber + 5)
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      return posts.filter(p => !p.isDraft).slice(0, limitNumber);
    } catch (error) {
      console.error("[PostService] Error fetching most viewed posts:", error);
      return [];
    }
  },

  /**
   * Busca reviews com maior pontuação (score desc).
   */
  async getTopReviews(limitNumber: number = 3): Promise<Post[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.POSTS),
        orderBy("score", "desc"),
        limit(limitNumber + 10)
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      
      return posts
        .filter(p => {
          if (p.isDraft) return false;
          return p.score !== undefined && p.score !== null && p.score !== "";
        })
        .sort((a, b) => {
          const scoreA = Number(a.score) || 0;
          const scoreB = Number(b.score) || 0;
          if (scoreB !== scoreA) return scoreB - scoreA;
          
          const timeA = a.createdAt?.seconds || (a.createdAt instanceof Date ? a.createdAt.getTime() / 1000 : 0);
          const timeB = b.createdAt?.seconds || (b.createdAt instanceof Date ? b.createdAt.getTime() / 1000 : 0);
          return timeB - timeA;
        })
        .slice(0, limitNumber);
    } catch (error) {
      console.error("[PostService] Error fetching top reviews:", error);
      return [];
    }
  },

  async getPostsByCategory(category: string, limitNumber: number = 3): Promise<Post[]> {
    try {
      const categoriesToSearch = category.toLowerCase().includes("dossi")
        ? ["Dossiê", "Dossiês", "dossie", "dossies"]
        : [category];

      const q = query(
        collection(db, COLLECTIONS.POSTS),
        where("category", "in", categoriesToSearch),
        limit(limitNumber + 5)
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));

      return posts
        .filter(p => !p.isDraft)
        .sort((a, b) => {
          const timeA = a.createdAt?.seconds || (a.createdAt instanceof Date ? a.createdAt.getTime() / 1000 : 0);
          const timeB = b.createdAt?.seconds || (b.createdAt instanceof Date ? b.createdAt.getTime() / 1000 : 0);
          return timeB - timeA;
        })
        .slice(0, limitNumber);
    } catch (error) {
      console.error("[PostService] Error fetching posts by category:", error);
      return [];
    }
  },

  /**
   * Busca múltiplos posts por uma lista de IDs (usado no inventário de favoritos).
   */
  async getPostsByIds(ids: string[]): Promise<Post[]> {
    if (!ids || ids.length === 0) return [];
    try {
      // O Firestore limita queries 'in' a no máximo 30 elementos
      const q = query(
        collection(db, COLLECTIONS.POSTS),
        where(documentId(), "in", ids.slice(0, 30))
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      return posts.filter(p => !p.isDraft);
    } catch (error) {
      console.error("[PostService] Error in getPostsByIds:", error);
      return [];
    }
  },

  /**
   * Conta a quantidade total de comentários feitos por um usuário usando Collection Group Query.
   */
  async getUserCommentsCount(userId: string): Promise<number> {
    try {
      const q = query(
        collectionGroup(db, "comments"),
        where("authorId", "==", userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error("[PostService] Error in getUserCommentsCount:", error);
      return 0;
    }
  },

  /**
   * Remove um post e todos os seus comentários associados.
   */
  async deletePost(postId: string): Promise<boolean> {
    try {
      const commentsQ = query(collection(db, COLLECTIONS.POSTS, postId, "comments"));
      const commentsSnap = await getDocs(commentsQ);
      
      const batch = writeBatch(db);
      commentsSnap.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      await deleteDoc(doc(db, COLLECTIONS.POSTS, postId));
      return true;
    } catch (error) {
      console.error("[PostService] Error in deletePost:", error);
      throw error;
    }
  },

  /**
   * Sincroniza a contagem de comentários de todos os posts e usuários.
   */
  async syncAllCommentsCounts(): Promise<void> {
    try {
      const posts = await this.getAllPosts();
      
      const userCommentsMap: Record<string, number> = {};

      for (const post of posts) {
        if (!post.id) continue;
        
        // 1. Busca comentários da subcoleção do post
        const commentsQ = query(collection(db, COLLECTIONS.POSTS, post.id, "comments"));
        const commentsSnap = await getDocs(commentsQ);
        const count = commentsSnap.size;

        // 2. Atualiza a contagem no post
        const postRef = doc(db, COLLECTIONS.POSTS, post.id);
        await updateDoc(postRef, {
          commentsCount: count
        });

        // 3. Contabiliza comentários por usuário
        commentsSnap.docs.forEach(docSnap => {
          const commentData = docSnap.data();
          if (commentData.authorId) {
            userCommentsMap[commentData.authorId] = (userCommentsMap[commentData.authorId] || 0) + 1;
          }
        });
      }

      // 4. Atualiza a contagem nos documentos de usuários
      for (const [userId, count] of Object.entries(userCommentsMap)) {
        try {
          const userRef = doc(db, COLLECTIONS.USERS, userId);
          await updateDoc(userRef, {
            commentsCount: count
          });
        } catch (userErr) {
          console.warn(`[PostService] Erro ao sincronizar contagem do usuário ${userId}:`, userErr);
        }
      }
    } catch (error) {
      console.error("[PostService] Erro na sincronização de comentários:", error);
    }
  }
};
