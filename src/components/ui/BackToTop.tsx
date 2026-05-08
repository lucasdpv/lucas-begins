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
        <div className="fixed inset-x-0 bottom-0 z-[60] pointer-events-none flex justify-center">
          {/* Container maior que os artigos (1600px vs 1280px) para o botão ficar 'por fora' */}
          <div className="w-full max-w-[1600px] px-6 sm:px-10 relative h-24 md:h-32 flex justify-end items-end">
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className={cn(
                "pointer-events-auto mb-6 md:mb-8 flex flex-col items-center",
                "group cursor-pointer select-none"
              )}
              aria-label="Voltar ao topo"
            >
              {/* O Botão Físico (Interruptor) - Mais compacto no Mobile */}
              <div className={cn(
                "w-20 h-8 md:w-32 md:h-11 rounded-sm border-[2px] md:border-[3px] border-black relative",
                "shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_rgba(0,0,0,1)]",
                "bg-[#6B46C1] transition-all duration-150"
              )}>
                {/* Chanfros laterais do interruptor */}
                <div className="absolute top-0 left-0 bottom-0 w-0.5 md:w-1 bg-white/20" />
                <div className="absolute top-0 right-0 bottom-0 w-0.5 md:w-1 bg-black/30" />
                
                {/* Concavidade Central (Onde fica o texto) */}
                <div className="absolute inset-x-2 inset-y-1 md:inset-x-3 md:inset-y-1.5 bg-black/40 rounded-full border border-black/20 flex items-center justify-center overflow-hidden">
                   <span className="font-retro text-[8px] md:text-[11px] font-bold text-white tracking-[0.1em] md:tracking-[0.2em] z-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                     TOP
                   </span>
                   {/* Scanlines apenas dentro da concavidade */}
                   <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />
                </div>

                {/* Brilho superior do botão plástico */}
                <div className="absolute top-0 inset-x-0 h-1 bg-white/30" />
              </div>

              {/* Sombra de projeção no 'chão' */}
              <div className="w-16 md:w-24 h-1 bg-black/20 blur-sm rounded-full mt-1 group-hover:scale-110 transition-transform" />
            </motion.button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
