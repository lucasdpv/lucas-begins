import React, { useState, useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../../store/useThemeStore";
import { cn } from "../../lib/utils";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark } = useThemeStore();

  useEffect(() => {
    const consent = localStorage.getItem("lucasBeginsCookieConsent");
    if (!consent) {
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
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:w-96 z-50"
        >
          <div
            className={cn(
              "p-5 rounded-2xl border relative overflow-hidden backdrop-blur-2xl",
              isDark
                ? "bg-[#121024]/95 border-white/[0.1] text-white shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85)]"
                : "bg-white border-slate-200 text-slate-900 shadow-xl"
            )}
          >
            <Cookie
              className={cn(
                "absolute -right-4 -top-4 w-24 h-24 opacity-5 rotate-12",
                isDark ? "text-white" : "text-black"
              )}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="w-5 h-5 text-purple-400" />
                <h3 className="font-retro font-bold uppercase tracking-wider text-sm">
                  Aviso de Cookies
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Utilizamos cookies para métricas e veiculação de anúncios. Ao continuar navegando, você concorda com nossa{" "}
                <Link to="/privacy" className="text-purple-400 hover:underline font-bold">
                  Política de Privacidade
                </Link>
                .
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 py-2.5 bg-purple-600 text-white font-retro font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-purple-500 transition-colors shadow-[0_0_20px_rgba(168,85,247,0.35)] cursor-pointer"
                >
                  Entendi e Aceito
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className={cn(
                    "p-2.5 rounded-xl border transition-colors cursor-pointer",
                    isDark
                      ? "border-white/10 bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/10"
                      : "border-slate-200 text-slate-500 hover:text-slate-900"
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
