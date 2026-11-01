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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className={cn(
                "pointer-events-auto mb-6 md:mb-8 inline-flex items-center gap-1.5 h-[42px] px-4 rounded-full border backdrop-blur-xl transition-colors cursor-pointer select-none outline-none",
                "shadow-[0_10px_26px_rgba(0,0,0,0.7),0_0_0_4px_rgba(168,85,247,0.12)] focus-visible:shadow-[0_10px_26px_rgba(0,0,0,0.7),0_0_0_4px_rgba(168,85,247,0.4)]",
                isDark
                  ? "bg-[#13112a]/90 border-purple-500/35 text-slate-100 hover:border-purple-400/60 hover:text-white"
                  : "bg-white/95 border-slate-200 text-slate-900 hover:border-purple-400"
              )}
              aria-label="Voltar ao topo"
            >
              <ChevronUp className="w-3.5 h-3.5 text-purple-300" />
              <span className="font-retro text-[10px] font-semibold uppercase tracking-[0.14em]">Topo</span>
            </motion.button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
