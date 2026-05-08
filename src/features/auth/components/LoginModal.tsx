import React, { useEffect, useRef } from "react";
import { X, Gamepad2 } from "lucide-react";
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
    lightStyle: "bg-snes-surface text-snes-accent border-snes-mid hover:bg-snes-input",
    darkStyle: "bg-white text-gray-900 border-gray-300 hover:bg-gray-100",
  },
];

export default function LoginModal() {
  const { isDark } = useThemeStore();
  const { setIsLoginModalOpen } = useUIStore();
  const { login } = useAuth();
  const overlayRef = useRef<HTMLDivElement>(null);

  const handlers: Record<string, () => void> = { google: login };

  // Fechar com Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsLoginModalOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setIsLoginModalOpen]);

  // Fechar ao clicar fora
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) setIsLoginModalOpen(false);
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
    >
      <div
        className={cn(
          "w-full max-w-md rounded-3xl overflow-hidden retro-card relative",
          isDark ? "bg-gray-900 border-purple-500" : "bg-snes-surface border-snes-dark"
        )}
      >
        {/* Header decorativo */}
        <div className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 p-8 pb-6 overflow-hidden">
          {/* Scanline overlay para efeito retro */}
          <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />
          {/* Circles decorativos */}
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />

          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/15 border-2 border-white/30 flex items-center justify-center mb-4 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
              <Gamepad2 className="w-8 h-8 text-yellow-300" />
            </div>
            <h2 className="font-retro font-bold text-3xl uppercase tracking-tight text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              Insert Coin
            </h2>
            <p className="text-purple-200 text-sm mt-1 font-medium">
              Faça login para desbloquear tudo
            </p>
          </div>
        </div>

        {/* Corpo */}
        <div className="p-8 space-y-4">
          {/* Benefícios */}
          <div className={cn("grid grid-cols-3 gap-3 p-4 rounded-2xl text-center mb-2", isDark ? "bg-gray-800/60" : "bg-gray-50")}>
            {[
              { emoji: "❤️", label: "Curtir posts" },
              { emoji: "💬", label: "Comentar" },
              { emoji: "⭐", label: "Salvar favor." },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{b.emoji}</span>
                <span className={cn("text-[10px] font-bold uppercase font-retro tracking-wide", isDark ? "text-gray-400" : "text-gray-500")}>
                  {b.label}
                </span>
              </div>
            ))}
          </div>

          {/* Botões de login */}
          <div className="space-y-3">
            {PROVIDERS.map(({ key, label, icon: IconComponent, lightStyle, darkStyle }) => (
              <button
                key={key}
                onClick={async () => {
                  try {
                    await handlers[key]?.();
                    setIsLoginModalOpen(false);
                  } catch (err) {
                    // Erro já tratado no Provider
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-base transition-all duration-150 border-2 retro-button",
                  isDark ? darkStyle : lightStyle
                )}
              >
                <IconComponent className="w-5 h-5 shrink-0" />
                <span className="flex-1 text-left font-retro uppercase tracking-wide text-sm">
                  {label}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
