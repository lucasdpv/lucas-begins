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

/**
 * Serviço para abstrair as chamadas ao Firestore para a entidade Post.
 */
export const PostService = {
  /**
   * Busca posts com paginação.
   */
  async getPaginatedPosts(limitNumber, lastDoc = null) {
    let q = query(
      collection(db, "posts"), 
      orderBy("createdAt", "desc"),
      limit(limitNumber)
    );
    
    if (lastDoc) {
      q = query(
        collection(db, "posts"), 
        orderBy("createdAt", "desc"), 
        startAfter(lastDoc), 
        limit(limitNumber)
      );
    }

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
   * Atualiza dados de um post existente.
   */
  async updatePost(postId, data) {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, data);
    return true;
  },

  /**
   * Cria um novo post e retorna os dados atualizados com o ID.
   */
  async createPost(postData) {
    const docRef = await addDoc(collection(db, "posts"), postData);
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
