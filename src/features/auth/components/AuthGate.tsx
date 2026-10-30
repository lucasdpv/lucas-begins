import React from "react";
import { Lock, Gamepad2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useThemeStore } from "../../../store/useThemeStore";
import { useUIStore } from "../../../store/useUIStore";

interface AuthGateProps {
  variant?: "inline" | "banner" | "section";
  className?: string;
}

export default function AuthGate({ variant = "inline", className }: AuthGateProps) {
  const { isDark } = useThemeStore();
  const { setIsLoginModalOpen } = useUIStore();

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={() => setIsLoginModalOpen(true)}
        className={cn(
          "flex items-center justify-center gap-1.5 h-8 px-3 text-[10px] font-retro font-black uppercase tracking-wider rounded-xl border transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer",
          isDark
            ? "bg-purple-500/15 border-purple-500/35 text-purple-300 hover:bg-purple-600 hover:text-white"
            : "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white",
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
          "flex items-center justify-between gap-4 px-6 py-4 rounded-2xl border",
          isDark
            ? "bg-[#121024]/90 border-white/10"
            : "bg-purple-50 border-purple-200",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-6 h-6 shrink-0 text-purple-400" />
          <p className="text-sm font-bold font-retro uppercase tracking-wide text-slate-200">
            Faça login para curtir e comentar
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsLoginModalOpen(true)}
          className="shrink-0 px-5 py-2.5 rounded-xl font-retro text-xs font-black uppercase tracking-widest bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all cursor-pointer"
        >
          Entrar
        </button>
      </div>
    );
  }

  // variant === "section"
  return (
    <div
      className={cn(
        "py-14 px-8 text-center rounded-3xl border space-y-5",
        isDark
          ? "border-white/[0.08] bg-[#121024]/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.75)]"
          : "border-slate-200 bg-white shadow-md",
        className
      )}
    >
      <div className="relative inline-flex items-center justify-center w-20 h-20 mx-auto rounded-2xl bg-purple-500/15 border border-purple-500/30">
        <Gamepad2 className="w-10 h-10 text-purple-400" />
      </div>

      <div>
        <p className="font-retro font-black text-2xl uppercase tracking-wide mb-2 text-white">
          Entre para Comentar
        </p>
        <p className="text-sm md:text-base font-medium max-w-md mx-auto leading-relaxed text-slate-400">
          Faça login para participar da discussão, curtir respostas e interagir com a comunidade Begins.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsLoginModalOpen(true)}
        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-retro font-black text-sm uppercase tracking-widest bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/50 shadow-[0_10px_30px_rgba(168,85,247,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Lock className="w-4 h-4" />
        Fazer Login Agora
      </button>
    </div>
  );
}
