import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation, LANGUAGES } from "../../context/TranslationContext";
import { cn } from "../../lib/utils";

interface LanguageSelectorProps {
  align?: "left" | "right";
  isMobileLayout?: boolean;
  onLanguageChange?: () => void;
}

export default function LanguageSelector({ align = "right", isMobileLayout = false, onLanguageChange }: LanguageSelectorProps) {
  const { language, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: string) => {
    changeLanguage(code);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange();
    }
  };

  if (isMobileLayout) {
    return (
      <div className="w-full flex flex-col gap-2 mt-2 font-retro notranslate" translate="no">
        <div className="text-[10px] uppercase tracking-widest text-purple-400 font-bold px-1 mb-1 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" /> IDIOMA DO SISTEMA
        </div>
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 border-2 text-[10px] font-bold uppercase transition-all duration-100 h-16",
                  isSelected
                    ? "bg-purple-600 text-white border-purple-400 shadow-[2px_2px_0px_rgba(0,0,0,1)] scale-[0.98]"
                    : "bg-gray-800/40 border-purple-500/20 text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-gray-800/80 shadow-[2px_2px_0px_rgba(168,85,247,0.1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(168,85,247,0.1)]"
                )}
              >
                <span className="font-retro text-xs font-black text-purple-400 bg-purple-500/10 border border-purple-500/30 px-1.5 py-0.5 rounded-sm mb-1">
                  {lang.code.toUpperCase()}
                </span>
                <span className="text-[9px] tracking-wide truncate max-w-full px-1">{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left notranslate" translate="no" ref={dropdownRef}>
      {/* Trigger Button - Styled with pixel-perfect similarity to theme toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 flex items-center gap-1.5 transition-all active:scale-90 hover:bg-purple-500/10 border-2 border-transparent hover:border-purple-500/20 select-none",
          "text-purple-600 dark:text-purple-400",
          isOpen && "border-purple-500 bg-purple-500/10"
        )}
        title="Trocar Idioma / Translation"
      >
        <Globe size={18} className="shrink-0" />
        <span className="font-retro text-xs font-black uppercase tracking-widest leading-none">
          {currentLang.code}
        </span>
        <ChevronDown
          size={12}
          className={cn("transition-transform duration-300", isOpen && "rotate-180 text-purple-400")}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "absolute z-[100] mt-2 w-48 rounded-none border-2 p-1 focus:outline-none",
              "bg-gray-900 border-purple-500 shadow-[6px_6px_0px_rgba(0,0,0,1)]",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            {/* Scanline pattern inside dropdown */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            
            <div className="relative flex flex-col gap-1 py-1 font-retro">
              <div className="px-2.5 py-1 text-[9px] uppercase tracking-widest text-purple-400/70 border-b border-purple-500/15 mb-1 font-bold">
                Selecionar Idioma
              </div>

              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-left transition-all duration-100 uppercase tracking-wide",
                      isSelected
                        ? "bg-purple-600/90 text-white font-bold border-l-4 border-purple-400 pl-3 shadow-[inset_2px_0px_6px_rgba(0,0,0,0.4)]"
                        : "text-gray-300 hover:text-white hover:bg-purple-500/10 hover:translate-x-1"
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="font-retro text-[9px] font-black text-purple-400 bg-purple-500/10 border border-purple-500/30 px-1 py-0.5 rounded-sm shrink-0 w-6 text-center">
                        {lang.code}
                      </span>
                      <span className="text-[10px] tracking-[0.1em]">{lang.name}</span>
                    </span>
                    {isSelected && (
                      <span className="text-[8px] px-1 py-0.5 bg-purple-500 text-white font-bold leading-none">
                        ACT
                      </span>
                    )}
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
