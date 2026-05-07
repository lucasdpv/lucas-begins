import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "../hooks/useToast";
import { usePosts } from "../hooks/usePosts";
import { useCategories } from "../hooks/useCategories";
import { db, auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { seedDatabase } from "../lib/SeedData";
import { cleanupDuplicates } from "../lib/CleanUp";
import { userService } from "../services/userService";
import { errorService } from "../services/errorService";
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
  const { posts, isLoadingPosts, isFetchingMore, handleLike, handleAddComment, handleDeleteComment, handleSavePost, handleDeletePost, handleToggleFeatured, loadMore, hasMore, fetchAllPosts, handleView } = usePosts(currentUser, showToast, searchQuery, activeCategory);
  const { categories, handleAddCategory, handleDeleteCategory } = useCategories(posts, showToast);

  // 1. Monitora o estado de autenticação e busca papel de Admin no Modo Pro
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await userService.getUserProfile(user);
        setCurrentUser(profile);
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
      // Só roda o setup inicial (seed e cleanup) se a versão da migração mudou
      if (lastMigration !== MIGRATION_VERSION) {
        await cleanupDuplicates();
        await seedDatabase();
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
        errorService.handle(err, "no retorno do login");
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
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') return;
      errorService.handle(err, "no login via popup");
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/web-storage-unsupported' || err.message.includes('localStorage')) {
        showToast("Redirecionando para login seguro...", "info");
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectErr) {
          errorService.handle(redirectErr, "no login via redirect");
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
      await userService.updateProfile(currentUser.id, data);
      setCurrentUser(prev => ({ ...prev, ...data }));
      showToast("Perfil atualizado com sucesso! 🎮");
    } catch (err) {
      showToast("Erro ao atualizar perfil.");
    }
  }, [currentUser, showToast]);

  const value = useMemo(() => ({
    isDark, toggleTheme,
    currentUser, login, handleLogout, authLoading,
    toast, showToast,
    posts, isLoadingPosts, isFetchingMore, handleLike, handleAddComment, handleDeleteComment, handleSavePost, handleDeletePost, handleToggleFeatured,
    loadMore, hasMore, fetchAllPosts, handleView,
    categories, handleAddCategory, handleDeleteCategory,
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
    isLoginModalOpen, setIsLoginModalOpen,
    handleUpdateProfile
  }), [
    isDark, toggleTheme,
    currentUser, login, handleLogout, authLoading,
    toast, showToast,
    posts, isLoadingPosts, isFetchingMore, handleLike, handleAddComment, handleDeleteComment, handleSavePost, handleDeletePost, handleToggleFeatured,
    loadMore, hasMore, fetchAllPosts, handleView,
    categories, handleAddCategory, handleDeleteCategory,
    activeCategory, searchQuery, isLoginModalOpen, handleUpdateProfile
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
