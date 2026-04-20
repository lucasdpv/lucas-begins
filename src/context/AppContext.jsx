import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "../hooks/useToast";
import { usePosts } from "../hooks/usePosts";
import { useCategories } from "../hooks/useCategories";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('lucas_begins_theme');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lucas_begins_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Inicializa os hooks
  const { toast, showToast } = useToast();
  const { posts, isLoadingPosts, handleLike, handleAddComment, handleDeleteComment, handleSavePost, handleDeletePost } = usePosts(currentUser, showToast);
  const { categories, handleAddCategory, handleDeleteCategory } = useCategories(posts, showToast);

  // Efeitos para persistência
  useEffect(() => {
    localStorage.setItem('lucas_begins_theme', JSON.stringify(isDark));
  }, [isDark]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lucas_begins_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lucas_begins_user');
    }
  }, [currentUser]);

  // Handlers simples
  const toggleTheme = () => setIsDark(prev => !prev);
  const login = (user) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  const value = {
    isDark, toggleTheme,
    currentUser, login, logout,
    toast, showToast,
    posts, isLoadingPosts, handleLike, handleAddComment, handleDeleteComment, handleSavePost, handleDeletePost,
    categories, handleAddCategory, handleDeleteCategory,
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
    isLoginModalOpen, setIsLoginModalOpen
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
