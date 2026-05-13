import React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";
import { BRUTAL_DESIGN } from "../../../constants";
import { getCategoryIcon } from "../../../features/posts/utils/categoryIcons";

interface NavCategoryMenuProps {
  categories: string[];
  activeCategory: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSelect: (cat: string) => void;
  isDark: boolean;
}

export default function NavCategoryMenu({
  categories,
  activeCategory,
  isOpen,
  setIsOpen,
  onSelect,
  isDark
}: NavCategoryMenuProps) {
  return (
    <div className="relative">
      <button
        className={cn(
          "px-3 py-2 font-retro font-bold uppercase tracking-widest transition-all text-sm flex items-center gap-2 rounded-xl",
          isOpen
            ? (isDark ? "text-purple-500 bg-purple-500/10" : "text-snes-dark bg-snes-input")
            : (isDark ? "hover:text-purple-500" : "hover:text-snes-dark hover:bg-snes-surface")
        )}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        Categorias <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute top-full left-0 mt-0 pt-4 w-[480px] z-50"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {/* Ponteiro (Triângulo) */}
            <div className={cn(
              "absolute top-2 left-8 w-4 h-4 rotate-45 border-l-4 border-t-4 z-10",
              isDark ? "bg-gray-800 border-purple-500" : "bg-white border-purple-200"
            )} />

            <div className={cn(
              "overflow-hidden p-5 grid grid-cols-2 gap-4 relative",
              BRUTAL_DESIGN.ROUNDED, BRUTAL_DESIGN.BORDER_THICK, BRUTAL_DESIGN.SHADOW,
              isDark ? "bg-gray-800" : "bg-white"
            )}>
              {["Todos", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelect(cat)}
                  className={cn(
                    "group flex items-center gap-3.5 p-3 rounded-2xl border-2 border-transparent transition-all text-left w-full",
                    activeCategory === cat
                      ? (isDark ? "bg-purple-600 text-white shadow-lg" : "bg-snes-dark text-white shadow-lg")
                      : isDark
                        ? "hover:bg-purple-500/10 text-gray-300"
                        : "hover:bg-snes-input text-snes-accent"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 shrink-0 flex items-center justify-center transition-all duration-300",
                    BRUTAL_DESIGN.ROUNDED_MODERN, BRUTAL_DESIGN.BORDER,
                    activeCategory === cat ? "bg-white/20 border-white/40" : isDark ? "bg-gray-700 border-white/5" : "bg-gray-100 border-black/5",
                    "group-hover:scale-110"
                  )}>
                    <div className="opacity-80 group-hover:opacity-100">
                      {getCategoryIcon(cat, 18)}
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-retro font-bold text-xs uppercase tracking-wider truncate">
                      {cat}
                    </span>
                    <span className="text-[9px] opacity-50 font-bold uppercase tracking-tight">
                      Explorar
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
