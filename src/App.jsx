import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Controle de estado
import { useAppContext } from "./context/AppContext";

// Layout & UI
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Toast from "./components/ui/Toast";
import LoginModal from "./components/ui/LoginModal";

// Páginas
import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import PostEditorPage from "./pages/PostEditorPage";

import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { isDark, toast, isLoginModalOpen } = useAppContext();

  // Atualiza os CSS Custom Properties do tema (definidos em index.css)
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--retro-border-color', '#a855f7');
      root.style.setProperty('--retro-card-shadow', '4px 4px 0px 0px rgba(168,85,247,0.5)');
      root.style.setProperty('--retro-button-border', '#c084fc');
      root.style.setProperty('--retro-button-shadow', '3px 3px 0px 0px #c084fc');
      root.style.setProperty('--retro-button-active-shadow', '1px 1px 0px 0px #c084fc');
      root.style.setProperty('--magazine-drop-cap-color', '#c084fc');
      root.style.setProperty('--magazine-drop-cap-shadow', '3px 3px 0px rgba(0,0,0,1)');
    } else {
      root.style.setProperty('--retro-border-color', '#000000');
      root.style.setProperty('--retro-card-shadow', '6px 6px 0px 0px #000000');
      root.style.setProperty('--retro-button-border', '#000000');
      root.style.setProperty('--retro-button-shadow', '4px 4px 0px 0px #000000');
      root.style.setProperty('--retro-button-active-shadow', '1px 1px 0px 0px #000000');
      root.style.setProperty('--magazine-drop-cap-color', '#9333ea');
      root.style.setProperty('--magazine-drop-cap-shadow', '3px 3px 0px rgba(147,51,234,0.3)');
    }
  }, [isDark]);


  const themeClasses = isDark ? "bg-gray-900 text-gray-200" : "bg-snes-light text-snes-accent";

  return (
    <div className={`min-h-screen font-body transition-colors duration-300 relative ${themeClasses}`}>
      <Toast toast={toast} isDark={isDark} />

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex-1 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:slug" element={<PostDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/editor" element={<ProtectedRoute><PostEditorPage /></ProtectedRoute>} />
            <Route path="/editor/:id" element={<ProtectedRoute><PostEditorPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
        {isLoginModalOpen && <LoginModal />}
      </div>
    </div>
  );
}