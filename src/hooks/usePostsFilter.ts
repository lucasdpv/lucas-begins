import { useMemo } from "react";
import { Post } from "../features/posts/schemas";

/**
 * Custom hook para centralizar a lógica de filtragem e ordenação de posts.
 * @param {Post[]} posts - Lista bruta de posts
 * @param {string} category - Categoria ativa
 * @param {string} search - Termo de busca
 */
export function usePostsFilter(posts: Post[], category = "Todos", search = "") {
  
  // 1. Posts Filtrados (Principal)
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (post.isDraft) return false;
      const matchesCat = category === "Todos" || post.category === category;
      const matchesSearch =
        (post.title?.toLowerCase().includes(search.toLowerCase()) || false) ||
        (post.excerpt?.toLowerCase().includes(search.toLowerCase()) || false);
      return matchesCat && matchesSearch;
    });
  }, [posts, category, search]);

  // 2. Posts em Destaque (Marcados manualmente) — todos, sem limite
  const featuredPosts = useMemo(() => {
    return posts
      .filter((p) => !p.isDraft && p.isFeatured)
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }, [posts]);

  // 3. Posts Mais Vistos
  const mostViewedPosts = useMemo(() => {
    return [...posts]
      .filter((p) => !p.isDraft)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  }, [posts]);

  return {
    filteredPosts,
    featuredPosts,
    mostViewedPosts
  };
}
