import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, updateDoc, DocumentData, DocumentSnapshot, arrayUnion, arrayRemove, runTransaction } from "firebase/firestore";
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
  readPosts?: string[];
  role: 'admin' | 'user';
  commentsCount?: number;
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
        role: profileData.role || "user",
        commentsCount: profileData.commentsCount || 0
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
      
      if (userDoc.exists()) {
        profileData = userDoc.data() || {};
      } else {
        // Se o perfil do usuário não existir no Firestore, criamos com os dados iniciais do login
        const initialData = {
          name: user.displayName || (user.email ? user.email.split('@')[0] : "Player"),
          email: user.email || "",
          avatar: user.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.uid}`,
          bio: "",
          aka: "",
          level: 1,
          xp: 0,
          favorites: [],
          role,
          commentsCount: 0,
          createdAt: new Date()
        };
        await setDoc(doc(db, COLLECTIONS.USERS, user.uid), initialData);
        profileData = initialData;
      }

      return {
        id: user.uid,
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar,
        bio: profileData.bio,
        aka: profileData.aka,
        level: profileData.level,
        xp: profileData.xp,
        favorites: profileData.favorites,
        role,
        commentsCount: profileData.commentsCount || 0
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
   * Alterna um post nos favoritos do usuário usando operação rápida.
   * Retorna 'added' ou 'removed' com base no estado anterior passado.
   */
  toggleFavorite: async (userId: string, postId: string, currentlyFavorited: boolean): Promise<'added' | 'removed' | null> => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const action: 'added' | 'removed' = currentlyFavorited ? 'removed' : 'added';
      
      await updateDoc(userRef, { 
        favorites: currentlyFavorited ? arrayRemove(postId) : arrayUnion(postId),
        updatedAt: new Date()
      });
      
      return action;
    } catch (error) {
      errorService.handle(error, "ao alternar favorito");
      return null;
    }
  },

  /**
   * Adiciona XP ao usuário, verifica Level Up e impede ganho duplicado por post.
   */
  addXP: async (userId: string, amount: number, postId?: string): Promise<{leveledUp: boolean, newLevel: number} | null> => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      
      return await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        
        let currentXP = 0;
        let currentLevel = 1;
        let readPosts: string[] = [];
        let data = { name: "Player", email: "", avatar: "" };

        if (userSnap.exists()) {
          const userData = userSnap.data();
          currentXP = userData.xp || 0;
          currentLevel = userData.level || 1;
          readPosts = userData.readPosts || [];
          data = { ...data, ...userData };
        }

        // Se um postId foi fornecido, verifica se o usuário já ganhou XP para este post
        if (postId && readPosts.includes(postId)) {
          console.warn("[userService.addXP] Usuário já ganhou XP por ler este post:", postId);
          return null;
        }

        let newXP = currentXP + amount;
        let newLevel = currentLevel;

        // Lógica de Level Up acumulativa (Ex: 100 XP para lvl 2, +200 para lvl 3...)
        while (newXP >= newLevel * 100) {
          newXP -= newLevel * 100;
          newLevel++;
        }

        const updates: any = {
          xp: newXP,
          level: newLevel,
          updatedAt: new Date()
        };

        // Se ganhou XP por leitura, registra o post na lista de já lidos
        if (postId) {
          updates.readPosts = arrayUnion(postId);
        }

        transaction.set(userRef, updates, { merge: true });

        return { leveledUp: newLevel > currentLevel, newLevel };
      });
    } catch (error) {
      console.error("[userService.addXP] Erro na transação de addXP:", error);
      errorService.handle(error, "ao adicionar XP");
      return null;
    }
  }
};
