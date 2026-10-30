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

export default function LanguageSelector({
  align = "right",
  isMobileLayout = false,
  onLanguageChange,
}: LanguageSelectorProps) {
  const { language, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

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
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-[10px] font-bold uppercase transition-all duration-150 h-16",
                  isSelected
                    ? "bg-purple-600 text-white border-purple-400 shadow-[0_0_16px_rgba(168,85,247,0.4)]"
                    : "bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:border-purple-500/40"
                )}
              >
                <span className="font-retro text-xs font-black text-purple-300 bg-purple-500/15 border border-purple-500/30 px-1.5 py-0.5 rounded-md mb-1">
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
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 hover:bg-white/[0.05] select-none cursor-pointer",
          "text-purple-600 dark:text-purple-400",
          isOpen && "bg-purple-500/10"
        )}
        title="Trocar Idioma / Translation"
      >
        <Globe size={17} className="shrink-0" />
        <span className="font-retro text-xs font-black uppercase tracking-widest leading-none">
          {currentLang.code}
        </span>
        <ChevronDown
          size={13}
          className={cn("transition-transform duration-200", isOpen && "rotate-180 text-purple-400")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className={cn(
              "absolute z-[100] mt-2 w-48 rounded-2xl border p-1.5 focus:outline-none backdrop-blur-2xl",
              "bg-[#121024]/95 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)]",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            <div className="relative flex flex-col gap-1 py-1 font-retro">
              <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest text-purple-400/80 border-b border-white/[0.08] mb-1 font-bold">
                Selecionar Idioma
              </div>

              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all duration-150 uppercase tracking-wide cursor-pointer",
                      isSelected
                        ? "bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.35)]"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "font-retro text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 w-7 text-center border",
                          isSelected
                            ? "bg-white/20 text-white border-white/30"
                            : "text-purple-400 bg-purple-500/10 border-purple-500/30"
                        )}
                      >
                        {lang.code}
                      </span>
                      <span className="text-[10px] tracking-[0.1em]">{lang.name}</span>
                    </span>
                    {isSelected && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-bold leading-none">
                        ON
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
