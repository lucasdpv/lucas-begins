import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PostService } from '../../../services/postService';
import { userService } from '../../../services/userService';
import { POSTS_PER_PAGE } from '../../../constants';
import { Post, Comment, PostSchema } from '../schemas';

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: any) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: postKeys.list('paginated'),
    queryFn: async ({ pageParam = null }: { pageParam: any }) => {
      const snapshot = await PostService.getPaginatedPosts(POSTS_PER_PAGE, pageParam);
      const posts = snapshot.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() };
        const result = PostSchema.safeParse(data);
        if (!result.success) {
          console.warn(`[useInfinitePosts] Validation failed for post ${doc.id}, using raw data.`, result.error.format());
        }
        return data as Post;
      });
      const lastDoc = snapshot.docs.length === POSTS_PER_PAGE ? snapshot.docs[snapshot.docs.length - 1] : null;
      return { posts, lastDoc };
    },
    getNextPageParam: (lastPage) => lastPage.lastDoc,
    initialPageParam: null,
  });
}

interface PostFilters {
  search: string;
  category: string;
}

export function usePosts(filters: PostFilters = { search: "", category: "Todos" }) {
  const isGlobal = filters.search !== "" || filters.category !== "Todos";

  // Query para buscar TUDO quando há filtro ativo
  const allPostsQuery = useQuery({
    queryKey: postKeys.list({ ...filters, type: 'all' }),
    queryFn: () => PostService.getAllPosts() as Promise<Post[]>,
    enabled: isGlobal,
    staleTime: 1000 * 60 * 5,
  });

  // Query infinita para a Home sem filtros
  const infinitePostsQuery = useInfinitePosts();

  // Se for global, retornamos os dados do allPostsQuery
  // Se não for, retornamos os dados do infinitePostsQuery
  const isLoading = isGlobal ? allPostsQuery.isLoading : infinitePostsQuery.isLoading;
  const posts = isGlobal 
    ? allPostsQuery.data || [] 
    : infinitePostsQuery.data?.pages.flatMap(page => page.posts) || [];
  
  return {
    posts,
    isLoading,
    isFetchingNextPage: infinitePostsQuery.isFetchingNextPage,
    hasNextPage: infinitePostsQuery.hasNextPage,
    fetchNextPage: infinitePostsQuery.fetchNextPage,
    isError: isGlobal ? allPostsQuery.isError : infinitePostsQuery.isError,
  };
}

export function useAllPosts() {
  return useQuery({
    queryKey: postKeys.list('all'),
    queryFn: () => PostService.getAllPosts() as Promise<Post[]>,
    staleTime: 1000 * 60 * 10, // 10 minutos para a lista completa
  });
}

export function usePost(slugOrId: string, isSlug: boolean = false) {
  return useQuery({
    queryKey: isSlug ? ['postBySlug', slugOrId] : postKeys.detail(slugOrId),
    queryFn: () => isSlug ? PostService.getPostBySlug(slugOrId) : PostService.getPostById(slugOrId) as Promise<Post>,
    enabled: !!slugOrId,
  });
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postData, currentUser }: { postData: Partial<Post>, currentUser: any }) => 
      PostService.createPost(postData, currentUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PostService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Post> }) => PostService.updatePost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.id) });
      }
    },
  });
}

export function useLikeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: string, userId: string }) => {
      await PostService.toggleLike(postId, userId);
      // Ganha 5 XP por curtir
      await userService.addXP(userId, 5);
    },
    onMutate: async ({ postId, userId }) => {
      // Cancela queries
      await queryClient.cancelQueries({ queryKey: postKeys.all });
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });
      await queryClient.cancelQueries({ queryKey: ['userProfile', userId] });

      // Snapshots
      const prevPost = queryClient.getQueryData(postKeys.detail(postId));
      const prevProfile = queryClient.getQueryData(['userProfile', userId]);

      // Update Post Detail
      queryClient.setQueryData(postKeys.detail(postId), (old: any) => {
        if (!old) return old;
        const likedBy = old.likedBy || [];
        const hasLiked = likedBy.includes(userId);
        const newLikes = hasLiked ? (old.likes || 1) - 1 : (old.likes || 0) + 1;
        const newLikedBy = hasLiked ? likedBy.filter((id: string) => id !== userId) : [...likedBy, userId];
        return { ...old, likes: newLikes, likedBy: newLikedBy };
      });

      // Update Profile XP
      queryClient.setQueryData(['userProfile', userId], (old: any) => {
        if (!old) return old;
        return { ...old, xp: old.xp + 5 };
      });

      return { prevPost, prevProfile };
    },
    onError: (err, variables, context: any) => {
      if (context?.prevPost) {
        queryClient.setQueryData(postKeys.detail(variables.postId), context.prevPost);
      }
      if (context?.prevProfile) {
        queryClient.setQueryData(['userProfile', variables.userId], context.prevProfile);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
    },
  });
}

export function useCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, comment }: { postId: string, comment: Partial<Comment> }) => {
      await PostService.addComment(postId, comment);
      // Ganha 10 XP por comentar
      if (comment.authorId) {
        await userService.addXP(comment.authorId, 10);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useFavoriteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, postId }: { userId: string, postId: string }) => {
      await userService.toggleFavorite(userId, postId);
      // Ganha 15 XP por favoritar (incentiva a leitura futura)
      await userService.addXP(userId, 15);
    },
    // Otimistic Update: Atualiza a UI antes mesmo da resposta do banco
    onMutate: async ({ userId, postId }) => {
      // Cancela refetches em andamento para não sobrescrever o estado otimista
      await queryClient.cancelQueries({ queryKey: ['userProfile', userId] });

      // Salva o estado anterior para rollback em caso de erro
      const previousProfile = queryClient.getQueryData(['userProfile', userId]);

      // Atualiza o cache localmente
      queryClient.setQueryData(['userProfile', userId], (old: any) => {
        if (!old) return old;
        const favorites = old.favorites || [];
        const isFavorited = favorites.includes(postId);
        const newFavorites = isFavorited 
          ? favorites.filter((id: string) => id !== postId)
          : [...favorites, postId];
        
        return {
          ...old,
          favorites: newFavorites,
          xp: old.xp + 15 // XP também sobe visualmente
        };
      });

      return { previousProfile };
    },
    // Se falhar, volta ao estado anterior
    onError: (err, variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['userProfile', variables.userId], context.previousProfile);
      }
    },
    // Sempre invalida ao final para sincronizar com a verdade do servidor
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
    },
  });
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string, commentId: string | number }) => PostService.deleteComment(postId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
    },
  });
}

export function useIncrementViewMutation() {
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: string, userId?: string }) => {
      await PostService.incrementPostViews(postId);
      if (userId) {
        await userService.addXP(userId, 10);
      }
    },
  });
}
