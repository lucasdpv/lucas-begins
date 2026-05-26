import React from "react";
import { Gamepad2, ChevronRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { XIcon, ThreadsIcon, InstagramIcon } from "../icons/SocialIcons";
import { useThemeStore } from "../../store/useThemeStore";
import { cn } from "../../lib/utils";

import pkg from "../../../package.json";
const version = pkg.version;

export default function Footer() {
  const { isDark } = useThemeStore();

  return (
    <footer
      className={cn(
        "border-t-4 mt-6 pt-4 pb-4 transition-colors duration-300",
        isDark ? "border-purple-600 bg-gray-900" : "border-black bg-white"
      )}
    >
      {/* === MOBILE: layout compacto em 2 colunas === */}
      <div className="md:hidden max-w-7xl mx-auto px-4 mb-4">
        {/* Linha 1: Marca + Sociais */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center gap-2 cursor-pointer w-fit">
            <Gamepad2 className={cn("w-6 h-6 shrink-0", isDark ? "text-purple-400" : "text-purple-600")} />
            <span className="font-retro font-bold text-xl tracking-wider uppercase notranslate" translate="no">
              <span className={isDark ? "text-white" : "text-black"}>Begins</span>
              <span className={isDark ? "text-purple-400" : "text-purple-600"}>Project</span>
            </span>
          </Link>
          {/* Sociais inline */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/beginsproject/"
              target="_blank" rel="noopener noreferrer"
              className={cn("p-2.5 rounded-lg retro-button border-black transition-all", isDark ? "bg-gray-800 text-white border-purple-500" : "bg-white text-black")}
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.threads.com/@beginsproject"
              target="_blank" rel="noopener noreferrer"
              className={cn("p-2.5 rounded-lg retro-button border-black transition-all", isDark ? "bg-gray-800 text-white border-purple-500" : "bg-white text-black")}
              title="Threads"
            >
              <ThreadsIcon className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/beginsproject"
              target="_blank" rel="noopener noreferrer"
              className={cn("p-2.5 rounded-lg retro-button border-black transition-all", isDark ? "bg-gray-800 text-white border-purple-500" : "bg-white text-black")}
              title="X (Twitter)"
            >
              <XIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Linha 2: Links rápidos inline */}
        <div className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-retro font-bold uppercase tracking-wider", isDark ? "text-gray-400" : "text-gray-500")}>
          <Link to="/about" className="hover:text-purple-500 transition-colors flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-purple-500" /> Sobre Nós
          </Link>
          <span className="opacity-30">|</span>
          <Link to="/contact" className="hover:text-purple-500 transition-colors flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-purple-500" /> Contatos
          </Link>
          <span className="opacity-30">|</span>
          <Link to="/privacy" className="hover:text-purple-500 transition-colors flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-purple-500" /> Privacidade
          </Link>
        </div>
      </div>

      {/* === DESKTOP: layout ultra slim em linha === */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 items-center justify-between mb-4">
        {/* Marca */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer shrink-0">
          <Gamepad2 className={cn("w-7 h-7 shrink-0 hover:rotate-12 transition-transform", isDark ? "text-purple-400" : "text-purple-600")} />
          <h2 className="font-retro font-bold text-2xl tracking-wider uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)] notranslate" translate="no">
            <span className={isDark ? "text-white" : "text-black"}>Begins</span>
            <span className={isDark ? "text-purple-400" : "text-purple-600"}>Project</span>
          </h2>
        </Link>

        {/* Agrupamento: Links + Sociais na Direita */}
        <div className="flex items-center gap-8">
          {/* Links Inline */}
          <div className={cn("flex items-center gap-6 text-xs font-retro font-bold uppercase tracking-wider", isDark ? "text-gray-400" : "text-gray-600")}>
            <Link to="/about" className="hover:text-purple-500 transition-colors flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-purple-500" /> Sobre Nós
            </Link>
            <Link to="/contact" className="hover:text-purple-500 transition-colors flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-purple-500" /> Contatos
            </Link>
            <Link to="/privacy" className="hover:text-purple-500 transition-colors flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-purple-500" /> Privacidade
            </Link>
          </div>

          {/* Divisor */}
          <div className={cn("w-px h-6", isDark ? "bg-white/10" : "bg-black/10")} />

          {/* Sociais */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://www.instagram.com/beginsproject"
              target="_blank" rel="noopener noreferrer"
              className={cn("p-2.5 rounded-xl retro-button border-black transition-all hover:scale-110", isDark ? "bg-gray-800 text-white border-purple-500 hover:border-pink-500" : "bg-white text-black hover:border-pink-600")}
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4 shrink-0" />
            </a>
            <a
              href="https://www.threads.com/@beginsproject"
              target="_blank" rel="noopener noreferrer"
              className={cn("p-2.5 rounded-xl retro-button border-black transition-all hover:scale-110", isDark ? "bg-gray-800 text-white border-purple-500 hover:border-white" : "bg-white text-black hover:border-purple-600")}
              title="Threads"
            >
              <ThreadsIcon className="w-4 h-4 shrink-0" />
            </a>
            <a
              href="https://x.com/beginsproject"
              target="_blank" rel="noopener noreferrer"
              className={cn("p-2.5 rounded-xl retro-button border-black transition-all hover:scale-110", isDark ? "bg-gray-800 text-white border-purple-500 hover:border-white" : "bg-white text-black hover:border-purple-600")}
              title="X (Twitter)"
            >
              <XIcon className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* Linha de Copyright */}
      <div
        className={cn(
          "max-w-7xl mx-auto px-4 pt-3 md:pt-3 border-t flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-[9px] md:text-[10px] font-retro font-bold uppercase tracking-widest",
          isDark ? "border-gray-800 text-gray-500" : "border-gray-300 text-gray-500"
        )}
      >
        <p className="opacity-70 notranslate" translate="no">© {new Date().getFullYear()} BeginsProject</p>
        
        <span className="opacity-20 hidden md:inline">|</span>
        <span className="opacity-40 hidden md:inline">Insert Coin to Continue.</span>
        
        <span className="opacity-20 hidden md:inline">|</span>
        <span className="opacity-50 hidden md:inline">v{version}</span>
        
        <span className="opacity-20 hidden md:inline">|</span>
        <p className="flex items-center gap-1.5 opacity-80">
          Feito com <Heart className="w-3 h-3 text-red-500 fill-red-500 shrink-0" /> e nostalgia
        </p>
      </div>
    </footer>
  );
}
