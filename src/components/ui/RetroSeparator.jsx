import React from "react";
import { cn } from "../../lib/utils";

/**
 * Separador Retro padronizado com estrela central e linhas horizontais.
 * Resolve o problema de visibilidade em diferentes temas.
 */
export default function RetroSeparator({ className = "", isDark = false }) {
  const lineColor = isDark 
    ? "bg-gradient-to-r from-transparent via-purple-500/80 to-transparent" 
    : "bg-gradient-to-r from-transparent via-purple-400 to-transparent";

  return (
    <div className={cn("my-12 flex items-center gap-4 w-full", className)}>
      <div className={cn("flex-1 h-[2px]", lineColor)} />
      <span className={cn(
        "font-retro text-xl leading-none select-none",
        isDark ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "text-purple-600"
      )}>
        ✦
      </span>
      <div className={cn("flex-1 h-[2px]", lineColor)} />
    </div>
  );
}
