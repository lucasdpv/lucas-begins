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
  increment,
  where,
  QueryDocumentSnapshot,
  DocumentData,
  QuerySnapshot,
  arrayUnion,
  arrayRemove,
  runTransaction,
  writeBatch
} from 'firebase/firestore';
import { slugify } from '../lib/utils';
import { Post, Comment, PostSchema } from '../features/posts/schemas';
import { errorService } from './errorService';

/**
 * Serviço para abstrair as chamadas ao Firestore para a entidade Post.
 */
export const PostService = {
  /**
   * Busca posts com paginação.
   */
  async getPaginatedPosts(limitNumber: number, lastDoc: QueryDocumentSnapshot<DocumentData> | null = null, category?: string): Promise<any> {
    const constraints: any[] = [
      orderBy("createdAt", "desc"),
      limit(limitNumber)
    ];
    
    if (category && category !== 'all') {
      constraints.unshift(where("category", "==", category));
    }

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(collection(db, "posts"), ...constraints);
    const snapshot = await getDocs(q);
    
    return {
      posts: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)),
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
    };
  },

  /**
   * Busca posts em destaque (isFeatured).
   */
  async getFeaturedPosts(): Promise<Post[]> {
    const q = query(
      collection(db, "posts"), 
      where("isFeatured", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
  },

  /**
   * Busca os posts mais recentes.
   */
  async getLatestPosts(limitNumber: number = 5): Promise<Post[]> {
    const q = query(
      collection(db, "posts"),
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
    const q = query(collection(db, "posts"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = { id: doc.id, ...doc.data() };
      const result = PostSchema.safeParse(data);
      if (!result.success) {
        console.warn(`[PostService] Validation failed for post ${doc.id}, using raw data.`, result.error.format());
      }
      // Retornamos sempre o data bruto por enquanto para não quebrar a Home
      return data as Post;
    }).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  },

  /**
   * Busca um post específico.
   */
  async getPostById(postId: string): Promise<Post | null> {
    const postRef = doc(db, "posts", postId);
    const snap = await getDoc(postRef);
    if (!snap.exists()) return null;
    
    const data = { id: snap.id, ...snap.data() };
    const result = PostSchema.safeParse(data);
    if (!result.success) {
      console.warn(`[PostService] Validation failed for post ${postId}, using raw data.`);
    }
    return data as Post;
  },

  /**
   * Busca um post específico pelo Slug (URL amigável).
   */
  async getPostBySlug(slug: string): Promise<Post | null> {
    const q = query(collection(db, "posts"), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const postDoc = snapshot.docs[0];
    
    const data = { id: postDoc.id, ...postDoc.data() };
    const result = PostSchema.safeParse(data);
    if (!result.success) {
      console.warn(`[PostService] Validation failed for slug ${slug}, using raw data.`);
    }
    return data as Post;
  },

  /**
   * Atualiza dados de um post existente com metadados automáticos.
   */
  async updatePost(postId: string, data: Partial<Post>): Promise<boolean> {
    const postRef = doc(db, "posts", postId);
    
    // Removemos o ID dos dados para evitar erro no Firestore
    const { id, ...cleanData } = data as any;
    
    const updateData = {
      ...cleanData,
      updatedAt: serverTimestamp()
    };
    await updateDoc(postRef, updateData as DocumentData);
    return true;
  },

  /**
   * Incrementa o contador de visualizações do post de forma única.
   */
  async incrementPostViews(postId: string, userId?: string, viewerId?: string): Promise<void> {
    try {
      const postRef = doc(db, "posts", postId);
      
      await runTransaction(db, async (transaction) => {
        const postSnap = await transaction.get(postRef);
        if (!postSnap.exists()) return;

        const data = postSnap.data();
        const viewedBy = data.viewedBy || [];

        if (!viewedBy.includes(viewerId)) {
          transaction.update(postRef, {
            views: increment(1),
            viewedBy: arrayUnion(viewerId)
          });
        }
      });
    } catch (error) {
      errorService.handle(error, "ao incrementar views");
    }
  },

  /**
   * Cria um novo post com metadados automáticos (slug, author, timestamps).
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
          name: currentUser?.name || currentUser?.displayName || 'Anônimo',
          avatar: currentUser?.avatar || currentUser?.photoURL || "",
          role: currentUser?.role || 'autor'
        },
      };

      // LIMPEZA CRÍTICA: Firestore não aceita 'undefined'. Convertemos para 'null' ou removemos.
      Object.keys(newPostData).forEach(key => {
        if ((newPostData as any)[key] === undefined) {
          delete (newPostData as any)[key];
        }
      });

      const docRef = await addDoc(collection(db, "posts"), newPostData as DocumentData);
      return this.getPostById(docRef.id);
    } catch (error: any) {
      // Relançamos para que o Toast na UI mostre o erro real (ex: missing permissions)
      throw new Error(error.message || "Erro desconhecido no Firebase");
    }
  },

  /**
   * Alterna o like de um usuário no post de forma atômica e segura.
   * Impede curtidas negativas e duplicidade.
   */
  async toggleLike(postId: string, userId: string): Promise<'liked' | 'unliked' | null> {

    
    try {
      const postRef = doc(db, "posts", postId);
      
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
      console.error(`[PostService.toggleLike] ❌ ERRO Atômico:`, error);
      errorService.handle(error, "ao fazer toggle de like atômico");
      return null;
    }
  },

  /**
   * Adiciona um comentário ao post usando operação atômica.
   * ✅ CORRIGIDO: Usa arrayUnion para evitar perda de comentários
   */
  async addComment(postId: string, comment: Partial<Comment>): Promise<void> {
    try {
      const postRef = doc(db, "posts", postId);
      
      await updateDoc(postRef, {
        comments: arrayUnion({ ...comment, id: Date.now() } as any),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      errorService.handle(error, "ao adicionar comentário");
      throw error;
    }
  },

  /**
   * Remove um comentário do post usando operação atômica com transação.
   * ✅ CORRIGIDO: Usa transação para garantir consistência
   */
  async deleteComment(postId: string, commentId: string | number): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        const postRef = doc(db, "posts", postId);
        const postSnap = await transaction.get(postRef);
        
        if (!postSnap.exists()) return;

        const data = postSnap.data() as Post;
        const comments = data.comments || [];
        const commentToRemove = comments.find(c => c.id === commentId);

        if (commentToRemove) {
          transaction.update(postRef, {
            comments: arrayRemove(commentToRemove),
            updatedAt: serverTimestamp()
          });
        }
      });
    } catch (error) {
      errorService.handle(error, "ao remover comentário");
      throw error;
    }
  },

  /**
   * Zera todas as curtidas e visualizações de todos os posts.
   * Ação drástica para resetar o engajamento da plataforma.
   */
  async resetAllMetrics(): Promise<void> {
    const posts = await this.getAllPosts();

    for (const post of posts) {
      if (!post.id) continue;
      
      try {
        await updateDoc(postRef, { 
          likes: 0, 
          likedBy: [], 
          views: 0, 
          viewedBy: [] 
        });
      } catch (err) {
        console.error(`❌ Erro no post ${post.id}:`, err);
      }
    }
  },

  /**
   * Normaliza as visualizações de todos os posts (limpeza de dados inflados).
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
        const postRef = doc(db, "posts", post.id);
        batch.update(postRef, { views: normalizedViews });
      });
      
      await batch.commit();
    }
  },

  /**
   * Remove um post permanentemente.
   */
  async deletePost(postId: string): Promise<boolean> {
    await deleteDoc(doc(db, "posts", postId));
    return true;
  }
};
