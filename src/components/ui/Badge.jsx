import React from "react";
import { cn } from "../../lib/utils";

export default function Badge({ children, variant = "default", isDark, className, ...props }) {
  const baseStyle = "px-4 py-1.5 rounded-full font-retro text-xs font-bold uppercase tracking-wider border-2 transition-all";

  const variants = {
    default: isDark
      ? "bg-gray-800 text-gray-300 border-gray-600 hover:border-purple-500"
      : "bg-gray-100 text-gray-600 border-gray-300 hover:border-black",
    active: isDark
      ? "bg-purple-600 text-white border-purple-500"
      : "bg-purple-600 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
  };

  return (
    <span
      className={cn(baseStyle, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
