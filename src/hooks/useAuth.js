import { useState, useEffect } from "react";
import { auth, googleProvider, facebookProvider, db } from "../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function useAuth(showToast) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Busca se o usuário está na lista VIP de admins no Firestore
        let role = "user";
        try {
          if (user.email) {
            const adminDoc = await getDoc(doc(db, "admins", user.email));
            if (adminDoc.exists()) {
              role = "admin";
            }
          }
        } catch (error) {
          console.error("Erro ao verificar permissões:", error);
        }

        setCurrentUser({
          id: user.uid,
          name: user.displayName || (user.email ? user.email.split('@')[0] : "Player"),
          email: user.email || "",
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || "P"}`,
          role: role
        });
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithProvider = async (provider, providerName) => {
    try {
      await signInWithPopup(auth, provider);
      showToast("Bem-vindo de volta, Player 1! 🎮");
      return true;
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') return false;
      showToast(`Falha na autenticação com ${providerName}.`, "error");
      return false;
    }
  };

  const login = () => loginWithProvider(googleProvider, "Google");
  const loginWithFacebook = () => loginWithProvider(facebookProvider, "Facebook");

  const logout = async () => {
    try {
      await signOut(auth);
      showToast("Sessão encerrada. Até a próxima!");
    } catch {
      showToast("Erro ao sair.");
    }
  };

  return {
    currentUser,
    authLoading,
    login,
    loginWithFacebook,
    logout
  };
}
