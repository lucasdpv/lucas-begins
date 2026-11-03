"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";

// Layout & UI
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Toast from "./ui/Toast";
import BackToTop from "./ui/BackToTop";
import NavigationProgress from "./ui/NavigationProgress";

// Modais e Overlays carregados sob demanda (Code-splitting)
const LoginModal = dynamic(() => import("../features/auth/components/LoginModal"), {
  ssr: false,
});
const CookieConsent = dynamic(() => import("./ui/CookieConsent"), {
  ssr: false,
});

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemeStore();
  const { toast, isLoginModalOpen } = useUIStore();
  const pathname = usePathname();

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

  // Scroll para o topo a cada navegação — evita herdar posição de scroll da página anterior
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  const themeClasses = isDark ? "bg-dark-mesh text-gray-200" : "bg-light-mesh text-snes-accent";

  return (
    <div className={`min-h-screen overflow-x-hidden font-body transition-colors duration-500 relative z-0 ${themeClasses}`}>
      <NavigationProgress />
      <Toast toast={toast} isDark={isDark} />

      {/* Ambient Glows Globais */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[10%] left-[-5%] w-[740px] h-[740px] -translate-x-[120px] -translate-y-[120px] bg-[radial-gradient(circle,rgba(147,51,234,0.05)_0%,transparent_68%)]" />
          <div className="absolute top-[40%] right-[-5%] w-[810px] h-[810px] translate-x-[130px] -translate-y-[130px] bg-[radial-gradient(circle,rgba(37,99,235,0.05)_0%,transparent_68%)]" />
          <div className="absolute top-[70%] left-[5%] w-[670px] h-[670px] -translate-x-[110px] -translate-y-[110px] bg-[radial-gradient(circle,rgba(245,158,11,0.03)_0%,transparent_68%)]" />
        </div>
      )}

      <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* Animação CSS pura: key no div causa remount no React a cada rota,
            disparando @keyframes pageEnter definido no index.css */}
        <main className="layout-container py-6 md:py-10 flex-1">
          <div key={pathname} className="page-enter">
            {children}
          </div>
        </main>

        <Footer />
      </div>

      <BackToTop />
      {/* Overlays globais */}
      <CookieConsent />
      {isLoginModalOpen && <LoginModal />}
    </div>
  );
}
