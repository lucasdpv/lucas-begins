import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "../hooks/useToast";
import { usePosts } from "../hooks/usePosts";
import { useCategories } from "../hooks/useCategories";
import { db, auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { seedDatabase } from "../lib/SeedData";
import { cleanupDuplicates } from "../lib/CleanUp";
import { AppContext } from "./AppContext";
import { STORAGE_KEYS, MIGRATION_VERSION } from "../constants";

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Inicializa os hooks
  const { toast, showToast } = useToast();
  const { posts, isLoadingPosts, isFetchingMore, handleLike, handleAddComment, handleDeleteComment, handleSavePost, handleDeletePost, loadMore, hasMore } = usePosts(currentUser, showToast, searchQuery, activeCategory);
  const { categories, handleAddCategory, handleDeleteCategory } = useCategories(posts, showToast);

  // 1. Monitora o estado de autenticação e busca papel de Admin no Modo Pro
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

        // Busca dados extras do perfil (Bio, AKA, Level, Avatar Custom)
        let profileData = {};
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            profileData = userDoc.data();
          }
        } catch (error) {
          console.error("Erro ao buscar perfil:", error);
        }

        setCurrentUser({
          id: user.uid,
          name: profileData.name || user.displayName || (user.email ? user.email.split('@')[0] : "Player"),
          email: user.email || "",
          avatar: profileData.avatar || user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || "P"}`,
          bio: profileData.bio || "",
          aka: profileData.aka || "",
          level: profileData.level || 1,
          role: role
        });
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Roda o Seed de dados inicial e Limpeza de migração (apenas quando necessário)
  useEffect(() => {
    const lastMigration = localStorage.getItem(STORAGE_KEYS.MIGRATION_VERSION);

    const runInitialSetup = async () => {
      await seedDatabase();
      // Só roda o cleanup se ainda não rodou esta versão
      if (lastMigration !== MIGRATION_VERSION) {
        await cleanupDuplicates();
        localStorage.setItem(STORAGE_KEYS.MIGRATION_VERSION, MIGRATION_VERSION);
      }
    };
    runInitialSetup();
  }, []);

  // Efeitos para persistência do tema
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDark));
  }, [isDark]);

  // Monitora o retorno do signInWithRedirect
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          showToast("Bem-vindo de volta, Player 1! 🎮");
          setIsLoginModalOpen(false);
        }
      } catch (err) {
        console.error("Erro no redirecionamento:", err);
        showToast("Falha na autenticação.", "error");
      }
    };
    handleRedirectResult();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithProvider = useCallback(async (provider, providerName) => {
    try {
      await signInWithPopup(auth, provider);
      showToast("Bem-vindo de volta, Player 1! 🎮");
      setIsLoginModalOpen(false);
    } catch (err) {
      console.error("Erro no popup:", err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') return;
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/web-storage-unsupported' || err.message.includes('localStorage')) {
        showToast("Redirecionando para login seguro...", "info");
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectErr) {
          console.error("Erro no redirect fallback:", redirectErr);
          showToast(`Falha total ao autenticar com ${providerName}.`, "error");
        }
      } else {
        showToast(`Falha na autenticação com ${providerName}.`, "error");
      }
    }
  }, [showToast]);

  const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);

  const login = useCallback(() => loginWithProvider(googleProvider, "Google"), [loginWithProvider]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      showToast("Sessão encerrada. Até a próxima!");
    } catch {
      showToast("Erro ao sair.");
    }
  }, [showToast]);

  const handleUpdateProfile = useCallback(async (data) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.id);
      await setDoc(userRef, data, { merge: true });
      setCurrentUser(prev => ({ ...prev, ...data }));
      showToast("Perfil atualizado com sucesso! 🎮");
    } catch (err) {
      console.error(err);
      showToast("Erro ao atualizar perfil.");
    }
  }, [currentUser, showToast]);

  const value = useMemo(() => ({
    isDark, toggleTheme,
    currentUser, login, handleLogout, authLoading,
    toast, showToast,
    posts, isLoadingPosts, isFetchingMore, handleLike, handleAddComment, handleDeleteComment, handleSavePost, handleDeletePost,
    loadMore, hasMore,
    categories, handleAddCategory, handleDeleteCategory,
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
    isLoginModalOpen, setIsLoginModalOpen,
    handleUpdateProfile
  }), [
    isDark, toggleTheme,
    currentUser, login, handleLogout, authLoading,
    toast, showToast,
    posts, isLoadingPosts, isFetchingMore, handleLike, handleAddComment, handleDeleteComment, handleSavePost, handleDeletePost,
    loadMore, hasMore,
    categories, handleAddCategory, handleDeleteCategory,
    activeCategory, searchQuery, isLoginModalOpen, handleUpdateProfile
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
