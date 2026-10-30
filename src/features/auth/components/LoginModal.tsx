import React, { useEffect, useRef } from "react";
import { X, Gamepad2 } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { useAuth } from "../../../context/AuthProvider";
import { useThemeStore } from "../../../store/useThemeStore";
import { useUIStore } from "../../../store/useUIStore";
import { cn } from "../../../lib/utils";

interface GoogleIconProps {
  className?: string;
}

function GoogleIcon({ className }: GoogleIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

interface Provider {
  key: "google";
  label: string;
  icon: React.FC<{ className?: string }>;
  lightStyle: string;
  darkStyle: string;
}

const PROVIDERS: Provider[] = [
  {
    key: "google",
    label: "Entrar com Google",
    icon: GoogleIcon,
    lightStyle: "bg-slate-900 text-white border-slate-800 hover:bg-purple-600",
    darkStyle: "bg-white text-slate-950 border-white/20 hover:bg-purple-600 hover:text-white shadow-[0_10px_25px_rgba(255,255,255,0.12)]",
  },
];

export default function LoginModal() {
  const { isDark } = useThemeStore();
  const { setIsLoginModalOpen } = useUIStore();
  const { login } = useAuth();
  const overlayRef = useRef<HTMLDivElement>(null);

  const handlers: Record<string, () => void> = { google: login };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLoginModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setIsLoginModalOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) setIsLoginModalOpen(false);
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
    >
      <div
        className={cn(
          "w-full max-w-md rounded-3xl overflow-hidden border relative backdrop-blur-2xl shadow-[0_32px_80px_-15px_rgba(0,0,0,0.9)]",
          isDark ? "bg-[#121024] border-white/[0.1]" : "bg-white border-slate-200"
        )}
      >
        <div className="relative bg-gradient-to-br from-purple-700/90 via-[#1a1338] to-[#121024] p-8 pb-6 overflow-hidden border-b border-white/[0.08]">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

          <div className="relative flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(168,85,247,0.4)]">
              <Gamepad2 className="w-7 h-7 text-amber-300" />
            </div>
            <h2 className="font-retro font-black text-2xl md:text-3xl uppercase tracking-tight text-white">
              Press Start
            </h2>
            <p className="text-purple-200/80 text-xs font-mono uppercase tracking-widest mt-1.5">
              Faça login para desbloquear tudo
            </p>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/15 text-slate-300 hover:text-white transition-all border border-white/10 z-50 cursor-pointer active:scale-90"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <div
            className={cn(
              "grid grid-cols-3 gap-3 p-4 rounded-2xl border text-center",
              isDark ? "bg-white/[0.03] border-white/[0.06]" : "bg-slate-50 border-slate-100"
            )}
          >
            {[
              { emoji: "❤️", label: "Curtir posts" },
              { emoji: "💬", label: "Comentar" },
              { emoji: "⭐", label: "Salvar favor." },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1.5">
                <span className="text-xl">{b.emoji}</span>
                <span className="text-[10px] font-bold uppercase font-retro tracking-wider text-slate-300">
                  {b.label}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {PROVIDERS.map(({ key, label, icon: IconComponent, lightStyle, darkStyle }) => (
              <button
                key={key}
                onClick={async () => {
                  try {
                    await handlers[key]?.();
                    setIsLoginModalOpen(false);
                  } catch {
                    // Erro já tratado no Provider
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 border cursor-pointer active:scale-[0.98]",
                  isDark ? darkStyle : lightStyle
                )}
              >
                <IconComponent className="w-5 h-5 shrink-0" />
                <span className="flex-1 text-left font-retro font-black uppercase tracking-widest text-xs">
                  {label}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-1 text-center">
            <p className="text-[10px] uppercase font-retro tracking-wider text-slate-400">
              Ao entrar, você concorda com a nossa{" "}
              <Link
                to="/privacy"
                onClick={() => setIsLoginModalOpen(false)}
                className="text-purple-400 hover:underline font-bold"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
