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
  QuerySnapshot
} from 'firebase/firestore';
import { slugify } from '../lib/utils';
import { Post, Comment, PostSchema } from '../features/posts/schemas';

/**
 * Serviço para abstrair as chamadas ao Firestore para a entidade Post.
 */
export const PostService = {
  /**
   * Busca posts com paginação.
   */
  async getPaginatedPosts(limitNumber: number, lastDoc: QueryDocumentSnapshot<DocumentData> | null = null): Promise<QuerySnapshot<DocumentData>> {
    const constraints: any[] = [
      orderBy("createdAt", "desc"),
      limit(limitNumber)
    ];
    
    if (lastDoc) {
      constraints.splice(1, 0, startAfter(lastDoc));
    }

    const q = query(collection(db, "posts"), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot;
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
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await updateDoc(postRef, updateData as DocumentData);
    return true;
  },

  /**
   * Incrementa o número de visualizações de um post.
   */
  async incrementPostViews(postId: string): Promise<boolean> {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      views: increment(1)
    });
    return true;
  },

  /**
   * Cria um novo post com metadados automáticos (slug, author, timestamps).
   */
  async createPost(postData: Partial<Post>, currentUser: any): Promise<Post | null> {
    const baseSlug = slugify(postData.title);
    const uniqueHash = Math.random().toString(36).substring(2, 7);

    const newPostData = {
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...postData,
      slug: `${baseSlug}-${uniqueHash}`,
      // Garante que o author do editor (com avatar, bio, level, aka) seja preservado,
      // adicionando apenas o role se não estiver definido
      author: {
        name: currentUser?.name || 'Anônimo',
        role: currentUser?.role === 'admin' ? 'Editor Chefe' : 'Colaborador',
        ...postData.author,
      },
    };

    const docRef = await addDoc(collection(db, "posts"), newPostData as DocumentData);
    return this.getPostById(docRef.id);
  },

  /**
   * Alterna o like de um usuário no post.
   */
  async toggleLike(postId: string, userId: string): Promise<void> {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) return;

    const data = postSnap.data() as Post;
    const likedBy = data.likedBy || [];
    const hasLiked = likedBy.includes(userId);

    if (hasLiked) {
      await updateDoc(postRef, {
        likedBy: likedBy.filter(id => id !== userId),
        likes: increment(-1)
      });
    } else {
      await updateDoc(postRef, {
        likedBy: [...likedBy, userId],
        likes: increment(1)
      });
    }
  },

  /**
   * Adiciona um comentário ao post.
   */
  async addComment(postId: string, comment: Partial<Comment>): Promise<void> {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) return;

    const data = postSnap.data() as Post;
    const comments = data.comments || [];
    
    await updateDoc(postRef, {
      comments: [...comments, { ...comment, id: Date.now() }]
    });
  },

  /**
   * Remove um comentário do post.
   */
  async deleteComment(postId: string, commentId: string | number): Promise<void> {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) return;

    const data = postSnap.data() as Post;
    const comments = data.comments || [];

    await updateDoc(postRef, {
      comments: comments.filter(c => c.id !== commentId)
    });
  },

  /**
   * Remove um post permanentemente.
   */
  async deletePost(postId: string): Promise<boolean> {
    await deleteDoc(doc(db, "posts", postId));
    return true;
  }
};
