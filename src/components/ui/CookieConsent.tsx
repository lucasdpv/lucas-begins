import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../../store/useThemeStore";
import { cn } from "../../lib/utils";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark } = useThemeStore();

  useEffect(() => {
    // Verifica se o usuário já aceitou
    const consent = localStorage.getItem("lucasBeginsCookieConsent");
    if (!consent) {
      // Pequeno delay para não assustar o usuário assim que a página abre
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("lucasBeginsCookieConsent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className={cn(
            "p-5 rounded-2xl retro-card relative overflow-hidden",
            isDark ? "bg-gray-800 text-white" : "bg-white text-black"
          )}>
            {/* Decoração sutil ao fundo */}
            <Cookie className={cn(
              "absolute -right-4 -top-4 w-24 h-24 opacity-5 rotate-12",
              isDark ? "text-white" : "text-black"
            )} />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="w-5 h-5 text-purple-500" />
                <h3 className="font-retro font-bold uppercase tracking-wider text-sm">Aviso de Cookies</h3>
              </div>
              
              <p className="text-xs opacity-80 leading-relaxed mb-4">
                Utilizamos cookies para métricas e veiculação de anúncios. Ao continuar navegando, você concorda com nossa{" "}
                <Link to="/privacy" className="text-purple-500 hover:underline font-bold">Política de Privacidade</Link>.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 py-2 bg-purple-600 text-white font-retro font-black text-[10px] uppercase tracking-widest rounded-xl retro-button hover:bg-purple-500 transition-colors"
                >
                  Entendi e Aceito
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className={cn(
                    "p-2 rounded-xl border-2 transition-colors retro-button",
                    isDark ? "border-gray-600 text-gray-400 hover:text-white" : "border-gray-300 text-gray-500 hover:text-black"
                  )}
                  title="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
