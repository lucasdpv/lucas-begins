import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

const icons: Record<string, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 shrink-0 text-purple-300" />,
  error: <AlertTriangle className="w-5 h-5 shrink-0 text-rose-300" />,
  warning: <AlertTriangle className="w-5 h-5 shrink-0 text-amber-300" />,
  info: <CheckCircle2 className="w-5 h-5 shrink-0 text-sky-300" />,
};

const styles: Record<string, string> = {
  success: "bg-[#141226]/95 text-white border-purple-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_24px_rgba(168,85,247,0.3)]",
  error: "bg-[#1a0f18]/95 text-white border-rose-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_24px_rgba(244,63,94,0.3)]",
  warning: "bg-[#1a160f]/95 text-amber-200 border-amber-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_24px_rgba(245,158,11,0.25)]",
  info: "bg-[#0f1624]/95 text-white border-sky-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_24px_rgba(56,189,248,0.25)]",
};

interface ToastProps {
  toast: {
    message: string;
    type: ToastType;
    visible: boolean;
  } | null;
  isDark?: boolean;
}

export default function Toast({ toast }: ToastProps) {
  if (!toast || !toast.visible) return null;

  const type = toast.type || "success";

  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-2xl animate-toast font-bold uppercase tracking-wider font-retro text-xs max-w-sm ${styles[type]}`}
      role="alert"
      aria-live="assertive"
    >
      {icons[type]}
      <span className="leading-snug">{toast.message}</span>
    </div>
  );
}
