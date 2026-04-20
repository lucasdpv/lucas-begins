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

export default function App() {
  const { isDark, toast, isLoginModalOpen } = useAppContext();

  // Injetar estilos base que dependem do tema
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

  const themeClasses = isDark ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900";

  return (
    <div className={`min-h-screen font-body transition-colors duration-300 relative ${themeClasses}`}>
      <Toast toast={toast} isDark={isDark} />
      
      {/* Wrapper flex para empurrar o footer pra baixo, caso a tela tenha pouco conteudo */}
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex-1 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/editor" element={<PostEditorPage />} />
            <Route path="/editor/:id" element={<PostEditorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
        {isLoginModalOpen && <LoginModal />}
      </div>
    </div>
  );
}