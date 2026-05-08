import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { userService } from '../services/userService';
import { COLLECTIONS } from '../constants';

/**
 * Hook para buscar o perfil reativo do usuário (XP, Level, Favoritos).
 * ✅ CORRIGIDO: Agora inclui sincronização real-time com Firestore
 */
export function useUserProfile(userId: string | undefined) {
  const queryClient = useQueryClient();
  
  const queryResult = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => userId ? userService.getUserProfileById(userId) : null,
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minuto - mais tempo porque temos listeners
    gcTime: 1000 * 60 * 10, // 10 minutos
  });

  // ✅ NOVO: Listener real-time para sincronização entre dispositivos
  useEffect(() => {
    if (!userId) return;

    // Inscrever-se a mudanças em tempo real
    const unsubscribe = onSnapshot(
      doc(db, COLLECTIONS.USERS, userId),
      (snapshot) => {
        if (snapshot.exists()) {
          const profileData = snapshot.data();
          
          // Atualizar o cache do React Query automaticamente
          queryClient.setQueryData(['userProfile', userId], (old: any) => {
            if (!old) {
              return {
                id: userId,
                name: profileData.name || "Player",
                email: profileData.email || "",
                avatar: profileData.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${userId}`,
                bio: profileData.bio || "",
                aka: profileData.aka || "",
                level: profileData.level || 1,
                xp: profileData.xp || 0,
                favorites: profileData.favorites || [],
                role: profileData.role || "user"
              };
            }
            
            // Merge com dados existentes
            return {
              ...old,
              favorites: profileData.favorites || old.favorites || [],
              xp: profileData.xp ?? old.xp,
              level: profileData.level ?? old.level,
              name: profileData.name ?? old.name,
              bio: profileData.bio ?? old.bio,
              avatar: profileData.avatar ?? old.avatar
            };
          });

        }
      },
      (error) => {
        console.error(`[useUserProfile] Real-time listener error for ${userId}:`, error);
      }
    );

    return unsubscribe;
  }, [userId, queryClient]);

  return queryResult;
}
