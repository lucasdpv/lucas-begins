import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from "../../../context/AuthProvider";
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

  const allPostsQuery = useQuery({
    queryKey: postKeys.list({ ...filters, type: 'all' }),
    queryFn: () => PostService.getAllPosts() as Promise<Post[]>,
    enabled: isGlobal,
    staleTime: 1000 * 60 * 5,
  });

  const infinitePostsQuery = useInfinitePosts();

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
    staleTime: 1000 * 60 * 10,
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
      console.log("[useLikeMutation] Triggered", { postId, userId });
      const action = await PostService.toggleLike(postId, userId);
      console.log("[useLikeMutation] Action result", action);
      if (action === 'liked') {
        await userService.addXP(userId, 5);
      }
      return action;
    },
    onMutate: async ({ postId, userId }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });
      await queryClient.cancelQueries({ queryKey: ['userProfile', userId] });

      const prevPost = queryClient.getQueryData(postKeys.detail(postId));
      const prevProfile = queryClient.getQueryData(['userProfile', userId]);

      // 1. Atualiza a lista global (Home/Search)
      queryClient.setQueryData(postKeys.all, (old: any) => {
        if (!old) return old;
        return old.map((p: any) => {
          if (p.id === postId) {
            const likedBy = p.likedBy || [];
            const hasLiked = likedBy.includes(userId);
            return {
              ...p,
              likes: hasLiked ? (p.likes || 1) - 1 : (p.likes || 0) + 1,
              likedBy: hasLiked ? likedBy.filter((id: string) => id !== userId) : [...likedBy, userId]
            };
          }
          return p;
        });
      });

      // 2. Atualiza TODOS os caches de detalhe (por ID ou por Slug)
      queryClient.setQueriesData({ queryKey: ['post'] }, (old: any) => {
        if (!old || old.id !== postId) return old;
        const likedBy = old.likedBy || [];
        const hasLiked = likedBy.includes(userId);
        return {
          ...old,
          likes: hasLiked ? (old.likes || 1) - 1 : (old.likes || 0) + 1,
          likedBy: hasLiked ? likedBy.filter((id: string) => id !== userId) : [...likedBy, userId]
        };
      });

      // 3. Atualiza o perfil do usuário (XP será atualizado por listener real-time)
      queryClient.setQueryData(['userProfile', userId], (old: any) => {
        if (!old) return old;
        // Apenas atualizar optimistically o cache local
        return { ...old };
      });

      return { prevPost, prevProfile };
    },
    onError: (err, variables, context: any) => {
      console.error("[useLikeMutation] Error:", err);
      if (context?.prevPost) {
        queryClient.setQueryData(postKeys.detail(variables.postId), context.prevPost);
      }
      if (context?.prevProfile) {
        queryClient.setQueryData(['userProfile', variables.userId], context.prevProfile);
      }
    },
    onSettled: (data, error, { postId, userId }) => {
      // Invalidar queries para garantir sincronização com banco
      if (!error) {
        queryClient.invalidateQueries({ queryKey: postKeys.all });
        queryClient.invalidateQueries({ queryKey: ['post'] });
        queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      }
    },
  });
}

export function useCommentMutation() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  return useMutation({
    mutationFn: async ({ postId, comment }: { postId: string, comment: any }) => {
      await PostService.addComment(postId, comment);
      await userService.addXP(comment.authorId, 20);
    },
    onMutate: async ({ postId, comment }) => {
      await queryClient.cancelQueries({ queryKey: ['post'] });
      const previousData = queryClient.getQueriesData({ queryKey: ['post'] });

      queryClient.setQueriesData({ queryKey: ['post'] }, (old: any) => {
        if (!old || old.id !== postId) return old;
        return {
          ...old,
          comments: [...(old.comments || []), { ...comment, id: Date.now() }]
        };
      });

      return { previousData };
    },
    onError: (err, variables, context: any) => {
      console.error("[useCommentMutation] Error:", err);
      if (context?.previousData) {
        context.previousData.forEach(([key, value]: [any, any]) => {
          queryClient.setQueryData(key, value);
        });
      }
    },
    onSettled: (data, error, { postId }) => {
      // Invalidar para sincronização em tempo real
      if (!error) {
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
        queryClient.invalidateQueries({ queryKey: ['post'] });
      }
    },
  });
}

export function useFavoriteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, postId }: { userId: string, postId: string }) => {
      console.log("[useFavoriteMutation] Triggered", { userId, postId });
      const action = await userService.toggleFavorite(userId, postId);
      console.log("[useFavoriteMutation] Action result", action);
      if (action === 'added') {
        await userService.addXP(userId, 15);
      }
      return action;
    },
    onMutate: async ({ userId, postId }) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile', userId] });
      const previousProfile = queryClient.getQueryData(['userProfile', userId]);

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
          xp: isFavorited ? old.xp : old.xp + 15
        };
      });

      return { previousProfile };
    },
    onError: (err, variables, context) => {
      console.error("[useFavoriteMutation] Error:", err);
      if (context?.previousProfile) {
        queryClient.setQueryData(['userProfile', variables.userId], context.previousProfile);
      }
    },
    onSettled: (data, error, { userId, postId }) => {
      // Invalidar sempre para garantir sincronização
      if (!error) {
        queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
        queryClient.invalidateQueries({ queryKey: postKeys.all });
        queryClient.invalidateQueries({ queryKey: ['post'] });
      }
    },
  });
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: string, commentId: string | number }) => 
      PostService.deleteComment(postId, commentId),
    onMutate: async ({ postId, commentId }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });
      const previousData = queryClient.getQueryData(postKeys.detail(postId));

      queryClient.setQueryData(postKeys.detail(postId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          comments: (old.comments || []).filter((c: any) => c.id !== commentId)
        };
      });

      return { previousData };
    },
    onError: (err, variables, context: any) => {
      console.error("[useDeleteCommentMutation] Error:", err);
      if (context?.previousData) {
        queryClient.setQueryData(postKeys.detail(variables.postId), context.previousData);
      }
    },
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
