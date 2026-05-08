import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

export const categoryKeys = {
  all: ['categories'] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const q = query(collection(db, "categories"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data().name as string);
    },
    staleTime: 1000 * 60 * 60, // 1 hora (categorias mudam pouco)
  });
}

export function useAddCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCat: string) => {
      await addDoc(collection(db, "categories"), { name: newCat.trim() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (catToDelete: string) => {
      const q = query(collection(db, "categories"), where("name", "==", catToDelete));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, "categories", d.id)));
      await Promise.all(deletePromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
