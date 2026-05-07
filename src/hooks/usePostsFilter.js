import { useMemo } from "react";
import { slugify } from "../lib/utils";

/**
 * Custom hook para centralizar a lógica de filtragem e ordenação de posts.
 * @param {Array} posts - Lista bruta de posts
 * @param {string} category - Categoria ativa
 * @param {string} search - Termo de busca
 */
export function usePostsFilter(posts, category = "Todos", search = "") {
  
  // 1. Posts Filtrados (Principal)
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (post.isDraft) return false;
      const matchesCat = category === "Todos" || post.category === category;
      const matchesSearch =
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [posts, category, search]);

  // 2. Posts em Destaque (Mais Curtidos)
  const featuredPosts = useMemo(() => {
    return [...posts]
      .filter((p) => !p.isDraft)
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 5);
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
