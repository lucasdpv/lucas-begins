import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Controle de estado
import { useAppContext } from "./context/AppContext";

// Layout & UI
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Toast from "./components/ui/Toast";
import LoginModal from "./components/ui/LoginModal";
import PostSkeleton from "./components/ui/PostSkeleton";
import PostDetailSkeleton from "./components/ui/PostDetailSkeleton";
import FormSkeleton from "./components/ui/FormSkeleton";
import AboutSkeleton from "./components/ui/AboutSkeleton";
import ContactSkeleton from "./components/ui/ContactSkeleton";

// Páginas (lazy loaded para reduzir bundle inicial)
const HomePage = lazy(() => import("./pages/HomePage"));
const PostDetailPage = lazy(() => import("./pages/PostDetailPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const PostEditorPage = lazy(() => import("./pages/PostEditorPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { isDark, toast, isLoginModalOpen } = useAppContext();
  const location = useLocation();

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
      root.style.setProperty('--magazine-drop-cap-shadow', '3px 3px 0px rgba(0, 0, 0, 1)');
    } else {
      root.style.setProperty('--retro-border-color', '#2D1B69');
      root.style.setProperty('--retro-card-shadow', '6px 6px 0px 0px #2D1B69');
      root.style.setProperty('--retro-button-border', '#2D1B69');
      root.style.setProperty('--retro-button-shadow', '4px 4px 0px 0px #2D1B69');
      root.style.setProperty('--retro-button-active-shadow', '1px 1px 0px 0px #2D1B69');
      root.style.setProperty('--magazine-drop-cap-color', '#7C3AED');
      root.style.setProperty('--magazine-drop-cap-shadow', '3px 3px 0px rgba(45,27,105,0.4)');
    }
  }, [isDark]);


  const themeClasses = isDark ? "bg-gray-900 text-gray-200" : "bg-snes-light text-snes-accent";

  return (
    <div className={`min-h-screen font-body transition-colors duration-300 relative ${themeClasses}`}>
      <Toast toast={toast} isDark={isDark} />

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
                <Route path="/" element={
                  <Suspense fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                      {[1,2,3].map(i => <PostSkeleton key={i} isDark={isDark} />)}
                    </div>
                  }>
                    <HomePage />
                  </Suspense>
                } />
                <Route path="/post/:slug" element={
                  <Suspense fallback={<PostDetailSkeleton isDark={isDark} />}>
                    <PostDetailPage />
                  </Suspense>
                } />
                <Route path="/about" element={
                  <Suspense fallback={<AboutSkeleton isDark={isDark} />}>
                    <AboutPage />
                  </Suspense>
                } />
                <Route path="/contact" element={
                  <Suspense fallback={<ContactSkeleton isDark={isDark} />}>
                    <ContactPage />
                  </Suspense>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Suspense fallback={<FormSkeleton isDark={isDark} />}>
                      <AdminPage />
                    </Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/editor" element={
                  <ProtectedRoute>
                    <Suspense fallback={<FormSkeleton isDark={isDark} />}>
                      <PostEditorPage />
                    </Suspense>
                  </ProtectedRoute>
                } />
                <Route path="/editor/:id" element={
                  <ProtectedRoute>
                    <Suspense fallback={<FormSkeleton isDark={isDark} />}>
                      <PostEditorPage />
                    </Suspense>
                  </ProtectedRoute>
                } />
                <Route path="*" element={
                  <Suspense fallback={<div className="h-96" />}>
                    <NotFoundPage />
                  </Suspense>
                } />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
        {isLoginModalOpen && <LoginModal />}
      </div>
    </div>
  );
}