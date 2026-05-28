import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "./context/AuthProvider";
import { useThemeStore } from "./store/useThemeStore";
import { useUIStore } from "./store/useUIStore";

// Layout & UI
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Toast from "./components/ui/Toast";
import LoginModal from "./features/auth/components/LoginModal";
import BackToTop from "./components/ui/BackToTop";
import CookieConsent from "./components/ui/CookieConsent";
import SystemInitializer from "./components/SystemInitializer";
import PostSkeleton from "./features/posts/components/PostSkeleton";
import PostDetailSkeleton from "./features/posts/components/PostDetailSkeleton";
import FormSkeleton from "./components/ui/FormSkeleton";
import AboutSkeleton from "./components/ui/AboutSkeleton";
import ContactSkeleton from "./components/ui/ContactSkeleton";

// Páginas (Imports diretos para estabilidade de contexto)
import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import PostEditorPage from "./pages/PostEditorPage";
import DashboardPage from "./pages/DashboardPage";
import DebugPage from "./pages/DebugPage";
import NotFoundPage from "./pages/NotFoundPage";
import ArchivePage from "./pages/ArchivePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { isDark } = useThemeStore();
  const { toast, isLoginModalOpen } = useUIStore();
  const location = useLocation();

  // Atualiza os CSS Custom Properties do tema (definidos em index.css)
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.setProperty('--retro-border-color', '#a855f7');
      root.style.setProperty('--retro-card-shadow', '6px 6px 0px 0px #000000');
      root.style.setProperty('--retro-button-border', '#c084fc');
      root.style.setProperty('--retro-button-shadow', '4px 4px 0px 0px #000000');
      root.style.setProperty('--retro-button-active-shadow', '1px 1px 0px 0px #000000');
      root.style.setProperty('--magazine-drop-cap-color', '#c084fc');
      root.style.setProperty('--magazine-drop-cap-shadow', '4px 4px 0px #000000');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.setProperty('--retro-border-color', '#4f43ae');
      root.style.setProperty('--retro-card-shadow', '6px 6px 0px 0px #211a21');
      root.style.setProperty('--retro-button-border', '#4f43ae');
      root.style.setProperty('--retro-button-shadow', '4px 4px 0px 0px #211a21');
      root.style.setProperty('--retro-button-active-shadow', '1px 1px 0px 0px #211a21');
      root.style.setProperty('--magazine-drop-cap-color', '#4f43ae');
      root.style.setProperty('--magazine-drop-cap-shadow', '4px 4px 0px #211a21');
    }
  }, [isDark]);


  const themeClasses = isDark ? "bg-dark-mesh text-gray-200" : "bg-light-mesh text-snes-accent";

  return (
    <div className={`min-h-screen overflow-x-hidden font-body transition-colors duration-500 relative z-0 ${themeClasses}`}>
      <SystemInitializer />
      <Toast toast={toast} isDark={isDark} />

      {/* Ambient Glows Globais (Full-width, sem cortes nas laterais do container do conteúdo) */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse duration-[8000ms]" />
          <div className="absolute top-[40%] right-[-5%] w-[550px] h-[550px] bg-blue-600/5 rounded-full blur-[130px] animate-pulse duration-[10000ms]" />
          <div className="absolute top-[70%] left-[5%] w-[450px] h-[450px] bg-amber-500/3 rounded-full blur-[110px] animate-pulse duration-[12000ms]" />
        </div>
      )}

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/post/:slug" element={<PostDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPage />
                  </ProtectedRoute>
                } />
                <Route path="/editor" element={
                  <ProtectedRoute requiredRole="admin">
                    <PostEditorPage />
                  </ProtectedRoute>
                } />
                <Route path="/editor/:id" element={
                  <ProtectedRoute requiredRole="admin">
                    <PostEditorPage />
                  </ProtectedRoute>
                } />
                <Route path="/archive" element={<ArchivePage />} />
                <Route path="/debug" element={<DebugPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
        <BackToTop />
        {/* Overlays globais */}
        <CookieConsent />
        {isLoginModalOpen && <LoginModal />}
      </div>
    </div>
  );
}
