import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  query,
  getDocs,
  where
} from 'firebase/firestore';

/**
 * Hook para gerenciar as categorias do blog via Firebase Firestore.
 */
export function useCategories(posts, showToast) {
  const [categories, setCategories] = useState([]);

  // Sincroniza em tempo real com o Firestore
  useEffect(() => {
    const q = query(collection(db, "categories"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const catsData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setCategories(catsData.map(c => c.name));
    });

    return () => unsubscribe();
  }, []);

  const handleAddCategory = async (newCat) => {
    if (!newCat.trim() || categories.includes(newCat.trim())) {
      showToast("Categoria inválida ou já existe.", "error");
      return;
    }
    try {
      await addDoc(collection(db, "categories"), { name: newCat.trim() });
      showToast(`Categoria "${newCat}" adicionada!`);
    } catch {
      showToast("Erro ao adicionar categoria.");
    }
  };

  const handleDeleteCategory = async (catToDelete) => {
    const isUsed = posts.some((p) => p.category === catToDelete);
    if (isUsed) {
      showToast("Não é possível excluir: existem artigos usando esta categoria.", "error");
      return false;
    }

    try {
      // ✅ Corrigido: getDocs (leitura única) em vez de onSnapshot (listener persistente)
      const q = query(collection(db, "categories"), where("name", "==", catToDelete));
      const snapshot = await getDocs(q);

      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, "categories", d.id)));
      await Promise.all(deletePromises);

      showToast(`Categoria "${catToDelete}" excluída.`);
      return true;
    } catch {
      showToast("Erro ao excluir categoria.");
      return false;
    }
  };

  return { categories, handleAddCategory, handleDeleteCategory };
}
