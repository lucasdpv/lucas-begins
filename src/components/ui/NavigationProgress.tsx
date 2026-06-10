"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Barra de progresso de navegação estilo YouTube/GitHub.
 * Aparece no topo da página quando o usuário clica em um link interno,
 * dando feedback visual imediato antes do conteúdo da nova página aparecer.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPathname = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const startProgress = useCallback(() => {
    setIsLoading(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    // Simula progresso crescente que desacelera: 0→85% rapidamente, depois fica estagnado
    let current = 0;
    timerRef.current = setInterval(() => {
      current += (85 - current) * 0.08;
      setProgress(Math.min(current, 85));
    }, 50);
  }, []);

  const finishProgress = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);
    // Remove após a animação de saída
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 400);
  }, []);

  // Detecta cliques em links internos para iniciar a barra imediatamente
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("#")) return;
      if (href === pathname) return; // mesma página

      startProgress();
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, [pathname, startProgress]);

  // Quando o pathname muda, a página carregou — completa a barra
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      finishProgress();
    }
  }, [pathname, finishProgress]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <motion.div
            className="h-full bg-purple-500 origin-left"
            style={{
              width: `${progress}%`,
              boxShadow: "0 0 8px rgba(168, 85, 247, 0.8), 0 0 20px rgba(168, 85, 247, 0.4)",
              transition: progress === 100 ? "width 0.15s ease-out" : "width 0.1s linear",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
