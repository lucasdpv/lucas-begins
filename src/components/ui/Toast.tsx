import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

type ToastType = 'success' | 'error' | 'warning' | 'info';

const icons: Record<string, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 shrink-0" />,
  error: <AlertTriangle className="w-5 h-5 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 shrink-0" />,
  info: <CheckCircle2 className="w-5 h-5 shrink-0" />,
};

const styles: Record<string, string> = {
  success: "bg-purple-600 text-white border-purple-800",
  error: "bg-red-500 text-white border-red-700",
  warning: "bg-yellow-400 text-black border-yellow-600",
  info: "bg-blue-500 text-white border-blue-700",
};

interface ToastProps {
  toast: {
    message: string;
    type: ToastType;
    visible: boolean;
  } | null;
  isDark?: boolean;
}

/**
 * Exibe uma notificação temporária (toast) no canto inferior direito.
 */
export default function Toast({ toast, isDark }: ToastProps) {
  if (!toast || !toast.visible) return null;

  const type = toast.type || "success";

  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl retro-card animate-toast font-bold uppercase tracking-wider font-retro text-sm border-2 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] max-w-sm ${styles[type]}`}
      role="alert"
      aria-live="assertive"
    >
      {icons[type]}
      <span className="leading-tight">{toast.message}</span>
    </div>
  );
}
