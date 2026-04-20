import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "../hooks/useToast";
import { usePosts } from "../hooks/usePosts";
import { useCategories } from "../hooks/useCategories";
import { db, auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { seedDatabase } from "../lib/SeedData";
import { cleanupDuplicates } from "../lib/CleanUp";
import { AppContext } from "./AppContext";

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('lucas_begins_theme');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Inicializa os hooks
  const { toast, showToast } = useToast();
  const { posts, isLoadingPosts, handleLike, handleAddComment, handleDeleteComment, handleSavePost, handleDeletePost, loadMore, hasMore } = usePosts(currentUser, showToast);
  const { categories, handleAddCategory, handleDeleteCategory } = useCategories(posts, showToast);

  // 1. Monitora o estado de autenticação e busca papel de Admin no Modo Pro
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Busca se o usuário está na lista VIP de admins no Firestore
        let role = "user";
        try {
          const adminDoc = await getDoc(doc(db, "admins", user.email));
          if (adminDoc.exists()) {
            role = "admin";
          }
        } catch {
          console.error("Erro ao verificar permissões:");
        }

        setCurrentUser({
          id: user.uid,
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`,
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
    // Incrementar MIGRATION_VERSION quando houver uma nova migração necessária
    const MIGRATION_VERSION = "v1.2";
    const lastMigration = localStorage.getItem("lucas_migration");

    const runInitialSetup = async () => {
      await seedDatabase();
      // Só roda o cleanup se ainda não rodou esta versão
      if (lastMigration !== MIGRATION_VERSION) {
        await cleanupDuplicates();
        localStorage.setItem("lucas_migration", MIGRATION_VERSION);
      }
    };
    runInitialSetup();
  }, []);

  // Efeitos para persistência do tema
  useEffect(() => {
    localStorage.setItem('lucas_begins_theme', JSON.stringify(isDark));
  }, [isDark]);

  // Handlers Firebase
  const toggleTheme = () => setIsDark(prev => !prev);
  
  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast("Bem-vindo de volta, Player 1!");
      setIsLoginModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Falha na autenticação com o Google.", "error");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      showToast("Sessão encerrada. Até a próxima!");
    } catch {
      showToast("Erro ao sair.");
    }
  };

  const value = useMemo(() => ({
    isDark, toggleTheme,
    currentUser, login, logout, authLoading,
    toast, showToast,
    posts, isLoadingPosts, handleLike, handleAddComment, handleDeleteComment, handleSavePost, handleDeletePost,
    loadMore, hasMore,
    categories, handleAddCategory, handleDeleteCategory,
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
    isLoginModalOpen, setIsLoginModalOpen
  }), [
    isDark, currentUser, authLoading, toast, showToast, posts, isLoadingPosts, hasMore,
    categories, activeCategory, searchQuery, isLoginModalOpen
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
