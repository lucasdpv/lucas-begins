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
  role: 'admin' | 'user';
}

/**
 * Serviço para gerenciar dados de usuários e permissões.
 */
export const userService = {
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
        avatar: profileData.avatar || user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || "P"}`,
        bio: profileData.bio || "",
        aka: profileData.aka || "",
        level: profileData.level || 1,
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
  }
};
