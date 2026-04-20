import React from "react";
import { Sparkles } from "lucide-react";

/**
 * Exibe uma notificação temporária (toast) no canto inferior direito.
 */
export default function Toast({ toast, isDark }) {
  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-lg retro-card animate-toast font-bold uppercase tracking-wider font-retro text-sm ${
        toast.type === "error"
          ? "bg-red-500 text-white"
          : isDark
          ? "bg-purple-600 text-white"
          : "bg-purple-500 text-white"
      }`}
    >
      {toast.type === "success" ? <Sparkles className="w-5 h-5" /> : null}
      {toast.message}
    </div>
  );
}
