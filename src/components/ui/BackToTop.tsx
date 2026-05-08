import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useThemeStore } from '../../store/useThemeStore';

/**
 * Botão "Voltar ao Topo" estilizado como um botão de controle SNES.
 * Aparece após scroll de 300px.
 */
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

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95, shadow: "none" }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-8 right-8 z-[60] flex flex-col items-center",
            "group cursor-pointer select-none"
          )}
          aria-label="Voltar ao topo"
        >
          {/* Label estilo carcaça do console */}
          <span className={cn(
            "font-retro text-[8px] font-bold uppercase tracking-[0.3em] mb-2 drop-shadow-sm",
            isDark ? "text-purple-400" : "text-purple-700"
          )}>
            Power to Top
          </span>

          {/* O Botão Físico (Interruptor) */}
          <div className={cn(
            "w-28 h-10 md:w-32 md:h-11 rounded-sm border-[3px] border-black relative",
            "shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_rgba(0,0,0,1)]",
            "bg-[#6B46C1] transition-all duration-150"
          )}>
            {/* Chanfros laterais do interruptor */}
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-white/20" />
            <div className="absolute top-0 right-0 bottom-0 w-1 bg-black/30" />
            
            {/* Concavidade Central (Onde fica o texto) */}
            <div className="absolute inset-x-3 inset-y-1.5 bg-black/40 rounded-full border border-black/20 flex items-center justify-center overflow-hidden">
               {/* Reflexo de profundidade */}
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/5" />
               
               <span className="font-retro text-[10px] md:text-[11px] font-bold text-white tracking-[0.2em] z-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                 TOP
               </span>

               {/* Scanlines apenas dentro da concavidade */}
               <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />
            </div>

            {/* Brilho superior do botão plástico */}
            <div className="absolute top-0 inset-x-0 h-1 bg-white/30" />
          </div>

          {/* Sombra de projeção no 'chão' (opcional para profundidade) */}
          <div className="w-24 h-1 bg-black/20 blur-sm rounded-full mt-1 group-hover:scale-110 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
