import React from "react";
import { cn } from "../../lib/utils";

const retroSizes = {
  sm: "text-xs px-4 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]",
  md: "text-xs md:text-sm px-5 py-2 shadow-[3px_3px_0px_rgba(0,0,0,1)]",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: keyof typeof retroSizes;
  isDark?: boolean;
}

export function CategoryBadge({ children, size = "sm", className }: BadgeProps) {
  return (
    <span className={cn("bg-purple-600 text-white font-retro font-bold uppercase tracking-widest rounded-none border-2 border-black transition-all", retroSizes[size], className)}>
      {children}
    </span>
  );
}

interface ScoreBadgeProps extends BadgeProps {
  score: string | number;
}

export function ScoreBadge({ score, size = "sm", className }: ScoreBadgeProps) {
  return (
    <span className={cn("bg-yellow-400 text-black font-retro font-bold rounded-none border-2 border-black flex items-center gap-1 transition-all", retroSizes[size], className)}>
      ★ {score}
    </span>
  );
}

interface DefaultBadgeProps extends BadgeProps {
  variant?: "default" | "active";
}

export default function Badge({ children, variant = "default", isDark, className, ...props }: DefaultBadgeProps) {
  const baseStyle = "px-4 py-1.5 rounded-none font-retro text-xs font-bold uppercase tracking-wider border-2 transition-all";

  const variants = {
    default: isDark
      ? "bg-gray-800 text-gray-300 border-gray-600 hover:border-purple-500"
      : "bg-snes-input text-snes-muted border-snes-mid hover:border-snes-dark",
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
