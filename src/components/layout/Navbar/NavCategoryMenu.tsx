import React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../lib/utils";
import { getCategoryIcon } from "../../../features/posts/utils/categoryIcons";
import { getCategoryTagline } from "../../../features/posts/utils/categoryInfo";

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
  isDark,
}: NavCategoryMenuProps) {
  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          "px-3.5 py-2 font-retro font-black text-xs uppercase tracking-widest leading-none transition-all flex items-center gap-1.5 rounded-xl cursor-pointer",
          isOpen
            ? isDark
              ? "text-purple-400 bg-purple-500/10"
              : "text-purple-700 bg-purple-50"
            : isDark
            ? "text-slate-200 hover:text-purple-400 hover:bg-white/[0.04]"
            : "text-slate-700 hover:text-purple-700 hover:bg-slate-100"
        )}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <span>Categorias</span>
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isOpen && "rotate-180 text-purple-400")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 mt-0 pt-3 w-72 z-50"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div
              className={cn(
                "overflow-hidden p-2 flex flex-col gap-1 relative rounded-2xl border backdrop-blur-2xl",
                isDark
                  ? "bg-[#121024]/95 border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.85)]"
                  : "bg-white/95 border-slate-200/90 shadow-2xl"
              )}
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onSelect(cat)}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left w-full cursor-pointer",
                      isActive
                        ? "bg-purple-600 text-white border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.35)]"
                        : isDark
                        ? "border-transparent hover:border-white/10 hover:bg-white/[0.05] text-slate-200"
                        : "border-transparent hover:border-slate-200 hover:bg-purple-50/60 text-slate-800"
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 shrink-0 flex items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105",
                        isActive
                          ? "bg-white/20 border-white/30 text-white"
                          : isDark
                          ? "bg-white/[0.05] border-white/10 text-purple-400"
                          : "bg-slate-100 border-slate-200 text-purple-600"
                      )}
                    >
                      {getCategoryIcon(cat, 17)}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-retro font-bold text-xs uppercase tracking-wider truncate">
                        {cat}
                      </span>
                      <span className="text-[11px] opacity-60 mt-0.5 truncate">{getCategoryTagline(cat)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
