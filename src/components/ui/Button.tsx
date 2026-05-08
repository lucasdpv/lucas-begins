import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "warning";
  isDark?: boolean;
}

/**
 * Componente de Botão Retro padronizado.
 * Utilizado para centralizar a lógica de "retro-button".
 */
export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  isDark = true,
  className,
  disabled = false,
  ...props
}: ButtonProps) {
  const baseStyle = "flex items-center gap-2 rounded-xl font-retro font-bold uppercase transition-all retro-button";

  const variants = {
    primary: "bg-purple-600 text-white hover:bg-purple-500 border-black",
    secondary: isDark
      ? "bg-gray-800 text-white hover:border-purple-500 border-gray-600"
      : "bg-snes-surface text-snes-accent hover:border-snes-dark border-snes-mid",
    danger: "bg-red-500 text-white hover:bg-red-600 border-black",
    warning: "bg-yellow-400 text-black hover:bg-yellow-300 border-black",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyle,
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
