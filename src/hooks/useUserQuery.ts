import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';

/**
 * Hook para buscar o perfil reativo do usuário (XP, Level, Favoritos).
 */
export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => userId ? userService.getUserProfileById(userId) : null,
    enabled: !!userId,
    staleTime: 0, // Força a busca do servidor para garantir sincronização entre aparelhos
  });
}
