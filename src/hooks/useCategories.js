import { useState, useEffect } from 'react';
import { INITIAL_CATEGORIES } from '../data/mockData';

/**
 * Hook para gerenciar as categorias do blog, com persistência no LocalStorage.
 */
export function useCategories(posts, showToast) {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('lucas_begins_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('lucas_begins_categories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = (newCat) => {
    if (!newCat.trim() || categories.includes(newCat.trim())) {
      showToast("Categoria inválida ou já existe.", "error");
      return;
    }
    setCategories([...categories, newCat.trim()]);
    showToast(`Categoria "${newCat}" adicionada!`);
  };

  const handleDeleteCategory = (catToDelete) => {
    const isUsed = posts.some((p) => p.category === catToDelete);
    if (isUsed) {
      showToast("Não é possível excluir: existem artigos usando esta categoria.", "error");
      return false; // falhou
    }
    setCategories(categories.filter((c) => c !== catToDelete));
    showToast(`Categoria "${catToDelete}" excluída.`);
    return true; // funcionou
  };

  return { categories, handleAddCategory, handleDeleteCategory };
}
