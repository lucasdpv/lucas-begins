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
 * Suporta parâmetro enabled para Lazy Loading.
 */
export function useAllPosts(enabled = true) {
  return useQuery({
    queryKey: postKeys.all,
    queryFn: () => PostService.getAllPosts(),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

/**
 * Hook principal de busca de posts com paginação infinita (usado na Home).
 * Compatibilizado com a assinatura esperada pelo HomePage.tsx
 */
export function usePosts({ category = 'Todos', search = '', enabled = true }: { category?: string, search?: string, enabled?: boolean } = {}) {
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
    enabled: enabled && category === 'Todos',
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
export function useFeaturedPosts(enabled = true) {
  return useQuery({
    queryKey: postKeys.featured(),
    queryFn: () => PostService.getFeaturedPosts(),
    staleTime: 1000 * 60 * 10,
    enabled,
  });
}

/**
 * Hook para buscar os posts mais recentes.
 */
export function useLatestPosts(count: number = 5, enabled = true) {
  return useQuery({
    queryKey: postKeys.latest(count),
    queryFn: () => PostService.getLatestPosts(count),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

/**
 * Hook para buscar posts populares por likes.
 */
export function usePopularPosts(count: number = 4) {
  return useQuery({
    queryKey: ['posts', 'popular', count],
    queryFn: () => PostService.getPopularPosts(count),
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook para buscar posts mais lidos (views desc).
 */
export function useMostViewedPosts(count: number = 5, enabled = true) {
  return useQuery({
    queryKey: ['posts', 'most-viewed', count],
    queryFn: () => PostService.getMostViewedPosts(count),
    staleTime: 1000 * 60 * 10,
    enabled,
  });
}

/**
 * Hook para buscar as melhores reviews (score desc).
 */
export function useTopReviews(count: number = 3) {
  return useQuery({
    queryKey: ['posts', 'top-reviews', count],
    queryFn: () => PostService.getTopReviews(count),
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook para buscar posts de uma categoria específica (ordenados por createdAt desc).
 */
export function usePostsByCategory(category: string, count: number = 3, enabled = true) {
  return useQuery({
    queryKey: ['posts', 'by-category', category, count],
    queryFn: () => PostService.getPostsByCategory(category, count),
    enabled: enabled && !!category,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook para buscar múltiplos posts por IDs (usado nos favoritos).
 */
export function usePostsByIds(ids: string[]) {
  return useQuery({
    queryKey: ['posts', 'by-ids', ids],
    queryFn: () => PostService.getPostsByIds(ids),
    enabled: !!ids && ids.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para buscar a quantidade de comentários de um usuário no blog.
 */
export function useUserCommentsCount(userId: string) {
  return useQuery({
    queryKey: ['user-comments-count', userId],
    queryFn: () => PostService.getUserCommentsCount(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para buscar um único post por ID ou Slug.
 */
export function usePost(
  idOrSlug: string,
  isSlug: boolean = false,
  options?: { enabled?: boolean; initialData?: Post; initialDataUpdatedAt?: number }
) {
  return useQuery({
    queryKey: isSlug ? ['postBySlug', idOrSlug] : postKeys.detail(idOrSlug),
    queryFn: () => isSlug ? PostService.getPostBySlug(idOrSlug) : PostService.getPostById(idOrSlug),
    enabled: options?.enabled !== undefined ? options.enabled : !!idOrSlug,
    staleTime: 1000 * 60 * 10,
    initialData: options?.initialData,
    initialDataUpdatedAt: options?.initialDataUpdatedAt,
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
      queryClient.invalidateQueries({ queryKey: ['postBySlug'] });
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
      queryClient.invalidateQueries({ queryKey: ['postBySlug'] });
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
      queryClient.invalidateQueries({ queryKey: ['postBySlug'] });
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

    onSuccess: async (action, variables) => {
      if (action === 'liked') {
        const result = await userService.addXP(variables.userId, 5);
        if (result?.leveledUp) {
          showToast(`Post curtido! LEVEL UP! Novo Nível: ${result.newLevel}! 🎮`, "info");
        }
      }
    },

    onError: (_err, _variables, context) => {
      if (context?.previousAll) {
        queryClient.setQueryData(postKeys.all, context.previousAll);
      }
      showToast("Falha na conexão com o servidor de likes. 📡", "error");
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: ['postBySlug'] });
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

    onSuccess: async (action, variables) => {
      let msg = action === 'added' ? "Adicionado aos seus favoritos! ⭐" : "Removido dos favoritos.";
      if (action === 'added') {
        trackEvent('post_favorited', { post_id: variables.postId, user_id: variables.userId });
        const result = await userService.addXP(variables.userId, 15);
        if (result?.leveledUp) {
          msg = `Adicionado aos favoritos! LEVEL UP! Novo Nível: ${result.newLevel}! 🎮`;
        }
      }
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
      showToast(msg);
    },

    onError: (_err, variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['userProfile', variables.userId], context.previousProfile);
      }
      showToast("Erro ao atualizar favoritos.", "error");
    },

    onSettled: (_data, _error, variables) => {
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
    onSuccess: async (_, variables) => {
      trackEvent('post_commented', { post_id: variables.postId, user_id: variables.comment.authorId });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: ['postBySlug'] });
      // Não invalida postKeys.all — um novo comentário não precisa recarregar toda a listagem
      
      let msg = "Comentário enviado! 💬";
      if (variables.comment.authorId) {
        const result = await userService.addXP(variables.comment.authorId, 20);
        if (result?.leveledUp) {
          msg = `Comentário enviado! LEVEL UP! Novo Nível: ${result.newLevel}! 🎮`;
        }
        queryClient.invalidateQueries({ queryKey: ['userProfile', variables.comment.authorId] });
      }
      showToast(msg);
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
    mutationFn: ({ postId }: { postId: string }) => 
      PostService.incrementPostViews(postId),
    onSuccess: (_, variables) => {
      // Invalida apenas o post e as queries de slug — não há necessidade de
      // invalidar postKeys.all (lista completa) só para atualizar o contador de views
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: ['postBySlug'] });
    }
  });
}

/**
 * Hook para Curtir/Descurtir um comentário com Atualização Otimista (Optimistic Update).
 */
export function useLikeCommentMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ postId, commentId, userId }: { postId: string, commentId: string | number, userId: string }) => 
      PostService.toggleCommentLike(postId, commentId, userId),
    
    onMutate: async ({ postId, commentId, userId }) => {
      // Cancela queries de detalhes do post para evitar que atualizações do servidor sobrescrevam nossa UI otimista
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });
      await queryClient.cancelQueries({ queryKey: ['postBySlug'] });

      // Salva snapshot dos estados anteriores
      const previousPost = queryClient.getQueryData(postKeys.detail(postId));
      const previousSlugPost = queryClient.getQueryData(['postBySlug']);

      const updateCommentLikes = (old: any) => {
        if (!old) return old;
        const comments = old.comments ? [...old.comments] : [];
        const index = comments.findIndex(c => String(c.id) === String(commentId));
        if (index === -1) return old;

        const comment = { ...comments[index] };
        const likes = comment.likes ? [...comment.likes] : [];
        const hasLiked = likes.includes(userId);

        comment.likes = hasLiked
          ? likes.filter(id => id !== userId)
          : [...likes, userId];

        comments[index] = comment;
        return { ...old, comments };
      };

      // Atualiza caches de forma otimista
      queryClient.setQueryData(postKeys.detail(postId), updateCommentLikes);
      queryClient.setQueriesData({ queryKey: ['postBySlug'] }, updateCommentLikes);

      return { previousPost, previousSlugPost };
    },

    onError: (_err, variables, context) => {
      // Se a mutação falhar, reverte para os snapshots anteriores salvos
      if (context?.previousPost) {
        queryClient.setQueryData(postKeys.detail(variables.postId), context.previousPost);
      }
      if (context?.previousSlugPost) {
        queryClient.setQueryData(['postBySlug'], context.previousSlugPost);
      }
      showToast("Erro ao curtir comentário.", "error");
    },

    onSuccess: async (action, variables) => {
      if (action === 'liked') {
        const result = await userService.addXP(variables.userId, 2);
        if (result?.leveledUp) {
          showToast(`Comentário curtido! LEVEL UP! Novo Nível: ${result.newLevel}! 🎮`, "info");
        }
        queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
      }
    },

    onSettled: (_data, _error, variables) => {
      // Invalida a query para sincronizar com o estado definitivo do banco de dados
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: ['postBySlug'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
    }
  });
}

/**
 * Hook para responder a um comentário.
 */
export function useReplyCommentMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ postId, commentId, reply }: { postId: string, commentId: string | number, reply: any }) => 
      PostService.addCommentReply(postId, commentId, reply),
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: ['postBySlug'] });
      // Não invalida postKeys.all — uma nova resposta não precisa recarregar toda a listagem
      let msg = "Resposta enviada! 💬";
      if (variables.reply.authorId) {
        const result = await userService.addXP(variables.reply.authorId, 10);
        if (result?.leveledUp) {
          msg = `Resposta enviada! LEVEL UP! Novo Nível: ${result.newLevel}! 🎮`;
        }
        queryClient.invalidateQueries({ queryKey: ['userProfile', variables.reply.authorId] });
      }
      showToast(msg);
    },
    onError: () => {
      showToast("Erro ao enviar resposta.", "error");
    }
  });
}

/**
 * Hook para deletar uma resposta.
 */
export function useDeleteReplyMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ postId, commentId, replyId }: { postId: string, commentId: string | number, replyId: string | number }) => 
      PostService.deleteCommentReply(postId, commentId, replyId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      showToast("Resposta removida.");
    },
    onError: () => {
      showToast("Erro ao remover resposta.", "error");
    }
  });
}

/**
 * Hook para Curtir/Descurtir uma resposta com Atualização Otimista (Optimistic Update).
 */
export function useLikeReplyMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  return useMutation({
    mutationFn: ({ postId, commentId, replyId, userId }: { postId: string, commentId: string | number, replyId: string | number, userId: string }) => 
      PostService.toggleReplyLike(postId, commentId, replyId, userId),

    onMutate: async ({ postId, commentId, replyId, userId }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });
      await queryClient.cancelQueries({ queryKey: ['postBySlug'] });

      const previousPost = queryClient.getQueryData(postKeys.detail(postId));
      const previousSlugPost = queryClient.getQueryData(['postBySlug']);

      const updateReplyLikes = (old: any) => {
        if (!old) return old;
        const comments = old.comments ? [...old.comments] : [];
        const cIndex = comments.findIndex(c => String(c.id) === String(commentId));
        if (cIndex === -1) return old;

        const comment = { ...comments[cIndex] };
        const replies = comment.replies ? [...comment.replies] : [];
        const rIndex = replies.findIndex(r => String(r.id) === String(replyId));
        if (rIndex === -1) return old;

        const reply = { ...replies[rIndex] };
        const likes = reply.likes ? [...reply.likes] : [];
        const hasLiked = likes.includes(userId);

        reply.likes = hasLiked
          ? likes.filter(id => id !== userId)
          : [...likes, userId];

        replies[rIndex] = reply;
        comment.replies = replies;
        comments[cIndex] = comment;
        return { ...old, comments };
      };

      queryClient.setQueryData(postKeys.detail(postId), updateReplyLikes);
      queryClient.setQueriesData({ queryKey: ['postBySlug'] }, updateReplyLikes);

      return { previousPost, previousSlugPost };
    },

    onError: (_err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(postKeys.detail(variables.postId), context.previousPost);
      }
      if (context?.previousSlugPost) {
        queryClient.setQueryData(['postBySlug'], context.previousSlugPost);
      }
      showToast("Erro ao curtir resposta.", "error");
    },

    onSuccess: async (action, variables) => {
      if (action === 'liked') {
        const result = await userService.addXP(variables.userId, 2);
        if (result?.leveledUp) {
          showToast(`Resposta curtida! LEVEL UP! Novo Nível: ${result.newLevel}! 🎮`, "info");
        }
        queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: ['postBySlug'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
    }
  });
}
