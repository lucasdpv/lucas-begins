import React from "react";
import { Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";

const icons = {
  success: <CheckCircle2 className="w-5 h-5 shrink-0" />,
  error: <AlertTriangle className="w-5 h-5 shrink-0" />,
};

const styles = {
  success: "bg-purple-600 text-white border-purple-800",
  error: "bg-red-500 text-white border-red-700",
};

/**
 * Exibe uma notificação temporária (toast) no canto inferior direito.
 */
export default function Toast({ toast }) {
  if (!toast) return null;

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
