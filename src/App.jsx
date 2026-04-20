import React, { useState, useEffect } from "react";

// Dados
import { initialPosts, INITIAL_CATEGORIES } from "./data/mockData";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// UI
import Toast from "./components/ui/Toast";
import LoginModal from "./components/ui/LoginModal";

// Páginas
import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import PostEditorPage from "./pages/PostEditorPage";

export default function RetroBlogApp() {
  // --- TEMA ---
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => setIsDark((prev) => !prev);

  // --- DADOS ---
  const [posts, setPosts] = useState(initialPosts);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  // --- NAVEGAÇÃO ---
  const [currentView, setCurrentView] = useState("home");
  const [activePost, setActivePost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  // --- FILTROS ---
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  // --- MENUS ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  // --- AUTH ---
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // --- TOAST ---
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- INJEÇÃO DE ESTILOS GLOBAIS (dependente do tema) ---
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&family=Inter:wght@400;500;700&display=swap');
      :root { --font-retro: 'Chakra Petch', sans-serif; --font-body: 'Inter', sans-serif; }
      body { background-color: ${isDark ? "#111827" : "#f3f4f6"}; color: ${isDark ? "#e5e7eb" : "#1f2937"}; }
      .font-retro { font-family: var(--font-retro); }
      .font-body { font-family: var(--font-body); }

      .scanline-overlay {
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
        background-size: 100% 4px, 3px 100%; pointer-events: none;
      }

      .magazine-article::first-letter {
        font-family: var(--font-retro);
        font-size: 4.5em;
        float: left;
        line-height: 0.8;
        margin-right: 0.1em;
        margin-top: 0.1em;
        color: ${isDark ? "#c084fc" : "#9333ea"};
        text-shadow: ${isDark ? "3px 3px 0px rgba(0,0,0,1)" : "3px 3px 0px rgba(147,51,234,0.3)"};
      }

      .retro-card {
        border: 2px solid ${isDark ? "#a855f7" : "#000000"};
        box-shadow: ${isDark ? "4px 4px 0px 0px rgba(168,85,247,0.5)" : "5px 5px 0px 0px rgba(0,0,0,1)"};
        transition: all 0.2s ease-in-out;
      }
      .retro-card:hover {
        transform: translate(-2px, -2px);
        box-shadow: ${isDark ? "6px 6px 0px 0px rgba(168,85,247,0.7)" : "7px 7px 0px 0px rgba(0,0,0,1)"};
      }
      .retro-button {
        border: 2px solid ${isDark ? "#c084fc" : "#000000"};
        box-shadow: ${isDark ? "3px 3px 0px 0px #c084fc" : "3px 3px 0px 0px #000000"};
        transition: all 0.1s ease-in-out;
      }
      .retro-button:active {
        transform: translate(2px, 2px);
        box-shadow: 1px 1px 0px 0px ${isDark ? "#c084fc" : "#000"};
      }

      @keyframes slideUpFade {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-toast { animation: slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [isDark]);

  // --- NAVEGAÇÃO ---
  const goHome = () => {
    setCurrentView("home");
    setActivePost(null);
    setEditingPost(null);
    window.scrollTo(0, 0);
  };
  const goToPost = (post) => {
    setActivePost(post);
    setCurrentView("post");
    window.scrollTo(0, 0);
  };
  const goToAdmin = () => { setCurrentView("admin"); window.scrollTo(0, 0); };
  const goToEditor = (post = null) => { setEditingPost(post); setCurrentView("editor"); window.scrollTo(0, 0); };
  const goToAbout = () => {
    setCurrentView("about");
    setActivePost(null);
    setActiveCategory("Todos");
    setSearchQuery("");
    window.scrollTo(0, 0);
  };
  const goToContact = () => {
    setCurrentView("contact");
    setActivePost(null);
    setActiveCategory("Todos");
    setSearchQuery("");
    window.scrollTo(0, 0);
  };

  // --- HANDLERS DE POSTS ---
  const handleLike = (postId, e) => {
    if (e) e.stopPropagation();
    setPosts((curr) => curr.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p)));
    if (activePost?.id === postId) setActivePost((prev) => ({ ...prev, likes: prev.likes + 1 }));
  };

  const handleAddComment = (postId, commentText) => {
    if (!commentText.trim() || !currentUser) return;
    const newComment = { id: Date.now(), authorId: currentUser.id, author: currentUser.name, text: commentText };
    setPosts((curr) =>
      curr.map((p) => {
        if (p.id === postId) {
          const updated = { ...p, comments: [...p.comments, newComment] };
          if (activePost?.id === postId) setActivePost(updated);
          return updated;
        }
        return p;
      })
    );
    showToast("Comentário publicado!");
  };

  const handleDeleteComment = (postId, commentId) => {
    setPosts((curr) =>
      curr.map((p) => {
        if (p.id === postId) {
          const updated = { ...p, comments: p.comments.filter((c) => c.id !== commentId) };
          if (activePost?.id === postId) setActivePost(updated);
          return updated;
        }
        return p;
      })
    );
    showToast("Comentário removido.", "success");
  };

  const handleSavePost = (postData) => {
    if (postData.id) {
      setPosts((curr) => curr.map((p) => (p.id === postData.id ? postData : p)));
      showToast("Artigo atualizado com sucesso!");
    } else {
      const newPost = {
        ...postData,
        id: Date.now(),
        date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
        likes: 0,
        comments: [],
        author: { name: currentUser.name, role: "Editor Chefe" },
        gradient: "from-purple-600 to-blue-600",
      };
      setPosts([newPost, ...posts]);
      showToast("Novo artigo publicado na capa!");
    }
    goToAdmin();
  };

  const handleDeletePost = (postId) => {
    if (!window.confirm("Tem certeza que deseja excluir definitivamente este artigo?")) return;
    setPosts((curr) => curr.filter((p) => p.id !== postId));
    showToast("Artigo removido permanentemente.", "success");
  };

  // --- HANDLERS DE CATEGORIAS ---
  const handleAddCategory = (newCat) => {
    if (!newCat.trim() || categories.includes(newCat.trim())) {
      showToast("Categoria inválida ou já existe.", "error");
      return;
    }
    setCategories([...categories, newCat.trim()]);
    showToast(`Categoria "${newCat}" adicionada!`);
  };

  const handleDeleteCategory = (catToDelete) => {
    const isUsed = posts.some((p) => p.category === catToDelete);
    if (isUsed) {
      showToast("Não é possível excluir: existem artigos usando esta categoria.", "error");
      return;
    }
    setCategories(categories.filter((c) => c !== catToDelete));
    if (activeCategory === catToDelete) setActiveCategory("Todos");
    showToast(`Categoria "${catToDelete}" excluída.`);
  };

  // --- DADOS DERIVADOS ---
  const filteredPosts = posts.filter((post) => {
    const matchesCat = activeCategory === "Todos" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const trendingPosts = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);
  const themeClasses = isDark ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900";

  return (
    <div className={`min-h-screen font-body transition-colors duration-300 relative ${themeClasses}`}>

      <Toast toast={toast} isDark={isDark} />

      <Navbar
        isDark={isDark}
        currentView={currentView}
        currentUser={currentUser}
        categories={categories}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        isMobileMenuOpen={isMobileMenuOpen}
        isCategoryMenuOpen={isCategoryMenuOpen}
        setIsCategoryMenuOpen={setIsCategoryMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setSearchQuery={setSearchQuery}
        setActiveCategory={setActiveCategory}
        onLogout={() => { setCurrentUser(null); goHome(); }}
        goHome={goHome}
        goToAbout={goToAbout}
        goToContact={goToContact}
        goToAdmin={goToAdmin}
        onOpenLogin={() => setShowLoginModal(true)}
        toggleTheme={toggleTheme}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {currentView === "home" && (
          <HomePage
            isDark={isDark}
            posts={posts}
            filteredPosts={filteredPosts}
            trendingPosts={trendingPosts}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            onPostClick={goToPost}
            onLike={handleLike}
          />
        )}

        {currentView === "post" && activePost && (
          <PostDetailPage
            post={activePost}
            onBack={goHome}
            onLike={() => handleLike(activePost.id)}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            currentUser={currentUser}
            isDark={isDark}
            trendingPosts={trendingPosts}
            onTrendingClick={goToPost}
            showToast={showToast}
          />
        )}

        {currentView === "admin" && currentUser?.role === "admin" && (
          <AdminPage
            posts={posts}
            categories={categories}
            isDark={isDark}
            onEdit={goToEditor}
            onDelete={handleDeletePost}
            onBack={goHome}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {currentView === "editor" && currentUser?.role === "admin" && (
          <PostEditorPage
            post={editingPost}
            categories={categories}
            isDark={isDark}
            currentUser={currentUser}
            onSave={handleSavePost}
            onCancel={goToAdmin}
            showToast={showToast}
          />
        )}

        {currentView === "about" && <AboutPage isDark={isDark} />}
        {currentView === "contact" && <ContactPage isDark={isDark} showToast={showToast} />}
      </main>

      <Footer isDark={isDark} onAbout={goToAbout} onContact={goToContact} />

      {showLoginModal && (
        <LoginModal
          isDark={isDark}
          onClose={() => setShowLoginModal(false)}
          onLogin={setCurrentUser}
          showToast={showToast}
        />
      )}
    </div>
  );
}