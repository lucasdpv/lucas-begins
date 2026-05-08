import React from "react";
import { cn } from "../../lib/utils";

interface SkeletonItemProps {
  width?: string;
  height?: string;
  className?: string;
  isDark?: boolean;
  variant?: 'rect' | 'circle' | 'line';
}

/**
 * Componente utilitário para Skeletons
 * @param {string} width - Largura (ex: 'w-full', 'w-20')
 * @param {string} height - Altura (ex: 'h-4', 'h-20')
 * @param {string} className - Classes adicionais
 * @param {boolean} isDark - Se o tema é escuro
 * @param {'rect' | 'circle' | 'line'} variant - Formato do skeleton
 */
export default function SkeletonItem({ 
  width = "w-full", 
  height = "h-4", 
  className = "", 
  isDark = false,
  variant = "rect" 
}: SkeletonItemProps) {
  const baseColor = isDark ? "bg-gray-800" : "bg-gray-200";

  return (
    <div
      className={cn(
        "animate-pulse",
        variant === "circle" ? "rounded-full" : "rounded-none",
        className.includes("bg-") ? "" : baseColor, // Permite sobrescrever a cor
        width,
        height,
        className
      )}
    />
  );
}
