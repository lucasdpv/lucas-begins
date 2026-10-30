import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/useThemeStore";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark } = useThemeStore();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
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
          <div className="layout-container relative h-24 md:h-28 flex justify-end items-end">
            <motion.button
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.94 }}
              onClick={scrollToTop}
              className={cn(
                "pointer-events-auto mb-6 md:mb-8 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer select-none",
                isDark
                  ? "bg-[#141226]/90 border-purple-500/40 text-white hover:bg-purple-600 hover:border-purple-400 shadow-[0_14px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(168,85,247,0.3)]"
                  : "bg-white/95 border-slate-200 text-slate-900 hover:bg-purple-600 hover:text-white shadow-lg"
              )}
              aria-label="Voltar ao topo"
            >
              <ChevronUp className="w-4 h-4 text-purple-300" />
              <span className="font-retro text-[10px] font-black uppercase tracking-widest">
                Topo
              </span>
            </motion.button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
