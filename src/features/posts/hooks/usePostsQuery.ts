import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { PostService } from '../../../services/postService';
import { Post } from '../schemas';
import { useUIStore } from '../../../store/useUIStore';
import { userService } from '../../../services/userService';
import { useAuth } from '../../../context/AuthProvider';
import { useMemo } from 'react';
import { trackEvent } from '../../../lib/analytics';

/**
 * Keys para gerenciamento do cache do React Query.
 */
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: any) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  featured: () => [...postKeys.all, 'featured'] as const,
  latest: (count: number) => [...postKeys.all, 'latest', count] as const,
};

/**
 * Hook para buscar todos os posts (usado no Admin e componentes simples).
 */
export function useAllPosts() {
  return useQuery({
    queryKey: postKeys.all,
    queryFn: () => PostService.getAllPosts(),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook principal de busca de posts com paginação infinita (usado na Home).
 * Compatibilizado com a assinatura esperada pelo HomePage.tsx
 */
export function usePosts({ category = 'Todos', search = '' }: { category?: string, search?: string } = {}) {
  const query = useInfiniteQuery({
    queryKey: postKeys.list({ category, search }),
    queryFn: ({ pageParam }) => 
      PostService.getPaginatedPosts(
        6, 
        pageParam, 
        category !== 'Todos' ? category : undefined
      ),
    initialPageParam: null as any,
    getNextPageParam: (lastPage: any) => lastPage.lastDoc || undefined,
    staleTime: 1000 * 60 * 5,
  });

  // Achatando as páginas de posts em um único array para facilitar o uso na UI
  const posts = useMemo(() => {
    return query.data?.pages.flatMap((page: any) => page.posts) || [];
  }, [query.data?.pages]);

  return {
    ...query,
    posts,
  };
}

/**
 * Hook para buscar posts em destaque (Carrossel).
 */
export function useFeaturedPosts() {
  return useQuery({
    queryKey: postKeys.featured(),
    queryFn: () => PostService.getFeaturedPosts(),
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook para buscar os posts mais recentes.
 */
export function useLatestPosts(count: number = 5) {
  return useQuery({
    queryKey: postKeys.latest(count),
    queryFn: () => PostService.getLatestPosts(count),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para buscar um único post por ID ou Slug.
 */
export function usePost(idOrSlug: string, isSlug: boolean = false) {
  return useQuery({
    queryKey: isSlug ? ['postBySlug', idOrSlug] : postKeys.detail(idOrSlug),
    queryFn: () => isSlug ? PostService.getPostBySlug(idOrSlug) : PostService.getPostById(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook para criar um novo post.
 */
export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();
  const { currentUser } = useAuth();

  return useMutation({
    mutationFn: (post: Partial<Post>) => PostService.createPost(post as Post, currentUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      showToast("Post publicado com sucesso! 🚀");
    },
    onError: () => {
      showToast("Erro ao publicar post.", "error");
    }
  });
}

/**
 * Hook para deletar um post.
 */
export function useDeletePostMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: (id: string) => PostService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      showToast("Post deletado permanentemente. 🗑️");
    },
    onError: () => {
      showToast("Erro ao deletar post.", "error");
    }
  });
}

/**
 * Hook para atualizar um post.
 */
export function useUpdatePostMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Post> }) => PostService.updatePost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
      showToast("Post atualizado com sucesso! ✨");
    },
    onError: () => {
      showToast("Erro ao atualizar post.", "error");
    }
  });
}

/**
 * Hook para Curtir/Descurtir um post.
 */
export function useLikeMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: string, userId: string }) => {
      const action = await PostService.toggleLike(postId, userId);
      if (action === 'liked') {
        trackEvent('post_liked', { post_id: postId, user_id: userId });
        await userService.addXP(userId, 5);
      }
      return action;
    },
    
    onMutate: async ({ postId, userId }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });
      await queryClient.cancelQueries({ queryKey: postKeys.details() });
      await queryClient.cancelQueries({ queryKey: ['postBySlug'] });

      const previousAll = queryClient.getQueryData(postKeys.all);

      const updatePostData = (p: any) => {
        if (!p || (p.id !== postId && p.slug !== postId)) return p;
        const likedBy = p.likedBy || [];
        const hasLiked = likedBy.includes(userId);
        return {
          ...p,
          likes: hasLiked ? Math.max((p.likes || 1) - 1, 0) : (p.likes || 0) + 1,
          likedBy: hasLiked ? likedBy.filter((id: string) => id !== userId) : [...likedBy, userId]
        };
      };

      queryClient.setQueriesData({ queryKey: postKeys.all }, (old: any) => {
        if (!old) return old;
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map(updatePostData)
            }))
          };
        }
        if (Array.isArray(old)) return old.map(updatePostData);
        return old;
      });

      queryClient.setQueriesData({ queryKey: postKeys.details() }, updatePostData);
      queryClient.setQueriesData({ queryKey: ['postBySlug'] }, updatePostData);

      return { previousAll };
    },

    onError: (err, variables, context) => {
      if (context?.previousAll) {
        queryClient.setQueryData(postKeys.all, context.previousAll);
      }
      showToast("Falha na conexão com o servidor de likes. 📡", "error");
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
    }
  });
}

/**
 * Hook para Favoritos.
 */
export function useFavoriteMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ userId, postId, isFavorited }: { userId: string, postId: string, isFavorited: boolean }) => 
      userService.toggleFavorite(userId, postId, isFavorited),
    
    onMutate: async ({ userId, postId }) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile', userId] });
      const previousProfile = queryClient.getQueryData(['userProfile', userId]);

      queryClient.setQueryData(['userProfile', userId], (old: any) => {
        if (!old) return old;
        const favorites = old.favorites || [];
        const isFavorited = favorites.includes(postId);
        return {
          ...old,
          favorites: isFavorited 
            ? favorites.filter((id: string) => id !== postId)
            : [...favorites, postId]
        };
      });

      return { previousProfile };
    },

    onSuccess: (action, variables) => {
      if (action === 'added') {
        trackEvent('post_favorited', { post_id: variables.postId, user_id: variables.userId });
        userService.addXP(variables.userId, 15);
      }
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
      showToast(action === 'added' ? "Adicionado aos seus favoritos! ⭐" : "Removido dos favoritos.");
    },

    onError: (err, variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['userProfile', variables.userId], context.previousProfile);
      }
      showToast("Erro ao atualizar favoritos.", "error");
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
    }
  });
}

/**
 * Hook para comentários.
 */
export function useCommentMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ postId, comment }: { postId: string, comment: any }) => 
      PostService.addComment(postId, comment),
    onSuccess: (_, variables) => {
      trackEvent('post_commented', { post_id: variables.postId, user_id: variables.comment.authorId });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: ['postBySlug'] });
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      if (variables.comment.authorId) {
        userService.addXP(variables.comment.authorId, 20);
        queryClient.invalidateQueries({ queryKey: ['userProfile', variables.comment.authorId] });
      }
      showToast("Comentário enviado! 💬");
    }
  });
}

/**
 * Hook para deletar comentários.
 */
export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string, commentId: string | number }) => 
      PostService.deleteComment(postId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      showToast("Comentário removido.");
    }
  });
}

/**
 * Hook para incrementar visualizações.
 */
export function useIncrementViewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId, viewerId }: { postId: string, userId?: string, viewerId: string }) => 
      PostService.incrementPostViews(postId, userId, viewerId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: ['postBySlug'] });
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    }
  });
}
