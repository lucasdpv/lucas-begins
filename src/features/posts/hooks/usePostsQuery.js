import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PostService } from '../../../services/postService';
import { POSTS_PER_PAGE } from '../../../constants';

export const postKeys = {
  all: ['posts'],
  lists: () => [...postKeys.all, 'list'],
  list: (filters) => [...postKeys.lists(), { filters }],
  details: () => [...postKeys.all, 'detail'],
  detail: (id) => [...postKeys.details(), id],
};

export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: postKeys.list('paginated'),
    queryFn: async ({ pageParam = null }) => {
      const snapshot = await PostService.getPaginatedPosts(POSTS_PER_PAGE, pageParam);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const lastDoc = snapshot.docs.length === POSTS_PER_PAGE ? snapshot.docs[snapshot.docs.length - 1] : null;
      return { posts, lastDoc };
    },
    getNextPageParam: (lastPage) => lastPage.lastDoc,
    initialPageParam: null,
  });
}

export function usePosts(filters = { search: "", category: "Todos" }) {
  const isGlobal = filters.search !== "" || filters.category !== "Todos";

  // Query para buscar TUDO quando há filtro ativo
  const allPostsQuery = useQuery({
    queryKey: postKeys.list({ ...filters, type: 'all' }),
    queryFn: () => PostService.getAllPosts(),
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
    queryFn: () => PostService.getAllPosts(),
    staleTime: 1000 * 60 * 10, // 10 minutos para a lista completa
  });
}

export function usePost(slugOrId, isSlug = false) {
  return useQuery({
    queryKey: isSlug ? ['postBySlug', slugOrId] : postKeys.detail(slugOrId),
    queryFn: () => isSlug ? PostService.getPostBySlug(slugOrId) : PostService.getPostById(slugOrId),
    enabled: !!slugOrId,
  });
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postData, currentUser }) => PostService.createPost(postData, currentUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => PostService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => PostService.updatePost(id, data),
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
    mutationFn: ({ postId, userId }) => PostService.toggleLike(postId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
    },
  });
}

export function useCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, comment }) => PostService.addComment(postId, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
    },
  });
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, commentId }) => PostService.deleteComment(postId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
    },
  });
}

export function useIncrementViewMutation() {
  return useMutation({
    mutationFn: (postId) => PostService.incrementPostViews(postId),
  });
}
