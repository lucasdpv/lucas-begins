import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { COLLECTIONS } from '../constants';

/**
 * Serviço para abstrair as chamadas ao Firestore para a entidade Category.
 * Mantém consistência com o padrão de PostService.
 */
export const CategoryService = {
  /**
   * Busca todas as categorias ordenadas por nome.
   */
  async getAll() {
    const q = query(collection(db, COLLECTIONS.CATEGORIES), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, name: d.data().name }));
  },

  /**
   * Adiciona uma nova categoria (nome único).
   * Retorna o objeto criado ou null se já existir.
   */
  async add(name) {
    const trimmed = name.trim();
    if (!trimmed) return null;

    // Verifica duplicata
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      where("name", "==", trimmed)
    );
    const existing = await getDocs(q);
    if (!existing.empty) return null;

    const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), { name: trimmed });
    return { id: docRef.id, name: trimmed };
  },

  /**
   * Remove uma categoria pelo nome.
   * Retorna true se removida, false se não encontrada.
   */
  async deleteByName(name) {
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES),
      where("name", "==", name)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return false;

    await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
    return true;
  },
};
