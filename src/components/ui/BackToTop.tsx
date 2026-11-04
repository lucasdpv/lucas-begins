import React, { useState, useEffect, useRef } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/useThemeStore";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark } = useThemeStore();
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScrollOrMove = () => {
      const scrollY = window.scrollY;

      // Se estiver no topo inicial (< 500px), esconde imediatamente
      if (scrollY <= 500) {
        setIsVisible(false);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        return;
      }

      // Mostra o botão assim que detectar rolagem/movimento além de 500px
      setIsVisible(true);

      // Limpa qualquer timer anterior e agenda o auto-hide após 2.5s parado
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2500);
    };

    window.addEventListener("scroll", handleScrollOrMove, { passive: true });
    window.addEventListener("touchstart", handleScrollOrMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollOrMove);
      window.removeEventListener("touchstart", handleScrollOrMove);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-x-0 bottom-0 z-[60] pointer-events-none flex justify-center items-end">
          <div className="layout-container relative h-20 md:h-24 flex justify-end items-end">
            <motion.button
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 16 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={scrollToTop}
              className={cn(
                "pointer-events-auto mb-5 md:mb-7 inline-flex items-center justify-center gap-1.5 h-10 w-10 sm:w-auto sm:px-3.5 rounded-full border backdrop-blur-xl transition-all cursor-pointer select-none outline-none",
                "shadow-[0_10px_26px_rgba(0,0,0,0.7),0_0_0_3px_rgba(168,85,247,0.12)] focus-visible:shadow-[0_10px_26px_rgba(0,0,0,0.7),0_0_0_4px_rgba(168,85,247,0.4)]",
                isDark
                  ? "bg-[#13112a]/90 border-purple-500/35 text-slate-100 hover:border-purple-400/60 hover:text-white"
                  : "bg-white/95 border-slate-200 text-slate-900 hover:border-purple-400"
              )}
              aria-label="Voltar ao topo"
              title="Voltar ao topo"
            >
              <ChevronUp className="w-4 h-4 text-purple-300 shrink-0" />
              <span className="hidden sm:inline font-retro text-[10px] font-semibold uppercase tracking-[0.14em]">
                Topo
              </span>
            </motion.button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
