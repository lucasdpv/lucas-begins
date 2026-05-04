import React from "react";
import { Lock, Gamepad2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAppContext } from "../../context/AppContext";

/**
 * AuthGate — exibido em ações que exigem autenticação.
 * 
 * Variantes:
 *  - "inline"  : pequeno chip/tooltip, ideal para botões de curtir
 *  - "banner"  : banner horizontal compacto, ideal antes de seções
 *  - "section" : bloco grande centralizado para seções de comentários
 */
export default function AuthGate({ variant = "inline", className }) {
  const { isDark, setIsLoginModalOpen } = useAppContext();

  if (variant === "inline") {
    return (
      <button
        onClick={() => setIsLoginModalOpen(true)}
        className={cn(
          "flex items-center justify-center gap-2 h-9 px-3 text-[10px] font-retro font-bold uppercase tracking-wider rounded-lg border-2 transition-all hover:scale-105 active:scale-95",
          isDark
            ? "bg-gray-800/40 border-purple-500/50 text-purple-400/80 hover:bg-purple-600 hover:text-white hover:border-black shadow-[2px_2px_0px_rgba(168,85,247,0.2)]"
            : "bg-purple-50/50 border-purple-300/50 text-purple-600/80 hover:bg-purple-600 hover:text-white hover:border-black shadow-[2px_2px_0px_rgba(147,51,234,0.1)]",
          className
        )}
        title="Faça login para interagir"
      >
        <Lock className="w-3.5 h-3.5 shrink-0" />
        Login
      </button>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-4 px-6 py-4 rounded-2xl border-2 border-dashed",
          isDark ? "bg-gray-800/60 border-purple-500/30" : "bg-purple-50 border-purple-200",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <Gamepad2 className={cn("w-6 h-6 shrink-0", isDark ? "text-purple-400" : "text-purple-500")} />
          <p className={cn("text-sm font-bold font-retro uppercase tracking-wide", isDark ? "text-gray-300" : "text-gray-700")}>
            Faça login para curtir e comentar
          </p>
        </div>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className={cn(
            "shrink-0 px-5 py-2 rounded-xl font-retro text-xs font-bold uppercase tracking-wider border-2 retro-button transition-all",
            isDark
              ? "bg-purple-600 text-white border-black hover:bg-purple-500"
              : "bg-purple-600 text-white border-black hover:bg-purple-700"
          )}
        >
          Entrar
        </button>
      </div>
    );
  }

  // variant === "section" (comentários)
  return (
    <div
      className={cn(
        "py-16 px-8 text-center rounded-3xl border-4 border-dashed space-y-6",
        isDark ? "border-gray-700 bg-gray-800/40" : "border-purple-200 bg-purple-50/50",
        className
      )}
    >
      <div className="relative inline-flex items-center justify-center w-24 h-24 mx-auto">
        <div className={cn("absolute inset-0 rounded-full animate-pulse opacity-20", isDark ? "bg-purple-500" : "bg-purple-400")} />
        <Gamepad2 className={cn("w-12 h-12 relative z-10", isDark ? "text-purple-400" : "text-purple-500")} />
      </div>

      <div>
        <p className="font-retro font-bold text-2xl uppercase tracking-wide mb-2">
          Insert Coin para Comentar
        </p>
        <p className={cn("text-base font-medium max-w-xs mx-auto leading-relaxed", isDark ? "text-gray-400" : "text-gray-500")}>
          Faça login para participar da discussão, curtir respostas e fazer parte da comunidade.
        </p>
      </div>

      <button
        onClick={() => setIsLoginModalOpen(true)}
        className={cn(
          "inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-retro font-bold text-lg uppercase tracking-wider border-2 retro-button transition-all hover:scale-105 active:scale-95",
          isDark
            ? "bg-purple-600 text-white border-black hover:bg-purple-500"
            : "bg-purple-600 text-white border-black hover:bg-purple-700"
        )}
      >
        <Lock className="w-5 h-5" />
        Fazer Login Agora
      </button>

      <p className={cn("text-xs font-medium opacity-50", isDark ? "text-gray-400" : "text-gray-500")}>
        It's dangerous to go alone! Take this.
      </p>
    </div>
  );
}
