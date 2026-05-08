import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { COLLECTIONS } from '../constants';

export interface Category {
  id: string;
  name: string;
}

/**
 * Serviço para abstrair as chamadas ao Firestore para a entidade Category.
 * Mantém consistência com o padrão de PostService.
 */
export const CategoryService = {
  /**
   * Busca todas as categorias ordenadas por nome.
   */
  async getAll(): Promise<Category[]> {
    const q = query(collection(db, COLLECTIONS.CATEGORIES), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({ 
      id: d.id, 
      name: d.data().name as string 
    }));
  },

  /**
   * Adiciona uma nova categoria (nome único).
   * Retorna o objeto criado ou null se já existir.
   */
  async add(name: string): Promise<Category | null> {
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
  async deleteByName(name: string): Promise<boolean> {
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
