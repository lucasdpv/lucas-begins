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

/**
 * Serviço para abstrair as chamadas ao Firestore para a entidade Post.
 */
export const PostService = {
  /**
   * Busca posts com paginação.
   */
  async getPaginatedPosts(limitNumber, lastDoc = null) {
    const constraints = [
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
   * Busca um post específico.
   */
  async getPostById(postId) {
    const postRef = doc(db, "posts", postId);
    const snap = await getDoc(postRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  /**
   * Atualiza dados de um post existente com metadados automáticos.
   */
  async updatePost(postId, data) {
    const postRef = doc(db, "posts", postId);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await updateDoc(postRef, updateData);
    return true;
  },

  /**
   * Cria um novo post com metadados automáticos (slug, author, timestamps).
   */
  async createPost(postData, currentUser) {
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

    const docRef = await addDoc(collection(db, "posts"), newPostData);
    return this.getPostById(docRef.id);
  },

  /**
   * Remove um post permanentemente.
   */
  async deletePost(postId) {
    await deleteDoc(doc(db, "posts", postId));
    return true;
  }
};
