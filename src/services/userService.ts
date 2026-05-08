import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, DocumentData, DocumentSnapshot } from "firebase/firestore";
import { COLLECTIONS } from "../constants";
import { errorService } from "./errorService";
import { User as FirebaseUser } from "firebase/auth";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  aka: string;
  level: number;
  xp: number;
  favorites: string[];
  role: 'admin' | 'user';
}

/**
 * Serviço para gerenciar dados de usuários e permissões.
 */
export const userService = {
  /**
   * Busca o perfil completo do usuário pelo ID
   */
  getUserProfileById: async (userId: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
      if (!userDoc.exists()) return null;
      
      const profileData = userDoc.data();
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
    } catch (error) {
      errorService.handle(error, "ao buscar perfil por ID");
      return null;
    }
  },

  /**
   * Busca o perfil completo do usuário e seu papel (admin/user)
   */
  getUserProfile: async (user: FirebaseUser | null): Promise<UserProfile | null> => {
    if (!user) return null;

    let role: 'admin' | 'user' = "user";
    let profileData: DocumentData = {};

    try {
      // Paraleliza as duas leituras do Firestore
      const [adminDoc, userDoc] = await Promise.all([
        user.email ? getDoc(doc(db, "admins", user.email)) : Promise.resolve({ exists: () => false } as DocumentSnapshot<DocumentData>),
        getDoc(doc(db, COLLECTIONS.USERS, user.uid))
      ]);

      if (adminDoc.exists()) role = "admin";
      if (userDoc.exists()) profileData = userDoc.data() || {};

      return {
        id: user.uid,
        name: profileData.name || user.displayName || (user.email ? user.email.split('@')[0] : "Player"),
        email: user.email || "",
        avatar: profileData.avatar || user.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.uid}`,
        bio: profileData.bio || "",
        aka: profileData.aka || "",
        level: profileData.level || 1,
        xp: profileData.xp || 0,
        favorites: profileData.favorites || [],
        role
      };
    } catch (error) {
      errorService.handle(error, "ao buscar perfil");
      return null;
    }
  },

  /**
   * Atualiza os dados do perfil no Firestore
   */
  updateProfile: async (userId: string, data: Partial<UserProfile>): Promise<boolean> => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await setDoc(userRef, data, { merge: true });
      return true;
    } catch (error) {
      errorService.handle(error, "ao atualizar perfil");
      throw error;
    }
  },

  /**
   * Alterna um post nos favoritos do usuário.
   * Retorna 'added' ou 'removed' para controle de XP.
   */
  toggleFavorite: async (userId: string, postId: string): Promise<'added' | 'removed' | null> => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);
      
      let favorites: string[] = [];
      
      if (userSnap.exists()) {
        favorites = userSnap.data().favorites || [];
      }

      const isFavorited = favorites.includes(postId);
      let action: 'added' | 'removed';
      let newFavorites: string[];

      if (isFavorited) {
        newFavorites = favorites.filter((id: string) => id !== postId);
        action = 'removed';
      } else {
        newFavorites = [...favorites, postId];
        action = 'added';
      }

      await setDoc(userRef, { favorites: newFavorites }, { merge: true });
      return action;
    } catch (error) {
      errorService.handle(error, "ao alternar favorito");
      return null;
    }
  },

  /**
   * Adiciona XP ao usuário e verifica Level Up.
   */
  /**
   * Adiciona XP ao usuário e verifica Level Up.
   */
  addXP: async (userId: string, amount: number): Promise<void> => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);
      
      let currentXP = 0;
      let currentLevel = 1;
      let email = "";
      let name = "Player";

      if (userSnap.exists()) {
        const data = userSnap.data();
        currentXP = data.xp || 0;
        currentLevel = data.level || 1;
        email = data.email || "";
        name = data.name || "Player";
      }

      let newXP = currentXP + amount;
      let newLevel = currentLevel;

      // Lógica de Level Up acumulativa
      while (newXP >= newLevel * 100) {
        newXP -= newLevel * 100;
        newLevel++;
      }

      await setDoc(userRef, { 
        xp: newXP, 
        level: newLevel,
        // Garante campos básicos se for criação
        id: userId,
        email,
        name,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      errorService.handle(error, "ao adicionar XP");
    }
  }
};
