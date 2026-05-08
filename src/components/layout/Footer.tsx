import React from "react";
import { Gamepad2, ChevronRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { XIcon, ThreadsIcon, InstagramIcon, YoutubeIcon, TwitchIcon } from "../icons/SocialIcons";
import { useThemeStore } from "../../store/useThemeStore";
import { cn } from "../../lib/utils";

import pkg from "../../../package.json";
const version = pkg.version;

export default function Footer() {
  const { isDark } = useThemeStore();

  return (
    <footer
      className={cn(
        "border-t-4 mt-16 pt-16 pb-8 transition-colors duration-300",
        isDark ? "border-purple-600 bg-gray-900" : "border-black bg-white"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Marca e Descrição */}
        <div className="col-span-1 md:col-span-2 space-y-8">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer w-fit">
            <Gamepad2
              className={cn("w-8 h-8 shrink-0 hover:rotate-12 transition-transform", isDark ? "text-purple-400" : "text-purple-600")}
            />
            <h2 className="font-retro font-bold text-2xl sm:text-3xl tracking-wider uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
              <span className={isDark ? "text-white" : "text-black"}>Lucas</span>
              <span className={isDark ? "text-purple-400" : "text-purple-600"}>Begins</span>
            </h2>
          </Link>
          <p className={cn("text-base font-medium leading-relaxed max-w-sm pl-11", isDark ? "text-gray-400" : "text-gray-600")}>
            Sua revista digital para a era de ouro dos videogames. Análises críticas, memórias
            inesquecíveis e as últimas novidades do mundo retro.
          </p>
        </div>

        {/* Links Rápidos */}
        <div>
          <h3 className="font-retro font-bold text-lg uppercase tracking-wider mb-6 flex items-center gap-3">
            <span className={cn("w-3 h-6 shrink-0 retro-card", isDark ? "bg-purple-500" : "bg-purple-600")} />
            <span>Diretório</span>
          </h3>
          <ul className={cn("space-y-4 text-base font-bold font-retro uppercase pl-6", isDark ? "text-gray-400" : "text-gray-600")}>
            <li>
              <Link to="/about" className="hover:text-purple-500 transition-all hover:translate-x-2 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-purple-500" /> Sobre Nós
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-purple-500 transition-all hover:translate-x-2 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-purple-500" /> Contatos
              </Link>
            </li>
          </ul>
        </div>

        {/* Redes Sociais */}
        <div>
          <h3 className="font-retro font-bold text-lg uppercase tracking-wider mb-6 flex items-center gap-3">
            <span className={cn("w-3 h-6 shrink-0 retro-card", isDark ? "bg-yellow-400" : "bg-yellow-500")} />
            <span>Multiplayer <span className="text-[10px] opacity-70">(Em Breve)</span></span>
          </h3>
          <div className="flex flex-wrap gap-4 pl-6 opacity-40 pointer-events-none filter grayscale">
            <a
              href="#"
              className={cn("p-4 rounded-xl retro-button border-black", isDark ? "bg-gray-800 text-white border-purple-500" : "bg-white text-black")}
              title="X (Antigo Twitter)"
            >
              <XIcon className="w-5 h-5 shrink-0" />
            </a>
            <a
              href="#"
              className={cn("p-4 rounded-xl retro-button border-black", isDark ? "bg-gray-800 text-white border-purple-500" : "bg-white text-black")}
              title="Threads"
            >
              <ThreadsIcon className="w-5 h-5 shrink-0" />
            </a>
            <a
              href="#"
              className={cn("p-4 rounded-xl retro-button border-black", isDark ? "bg-gray-800 text-white border-purple-500" : "bg-white text-black")}
              title="Instagram"
            >
              <InstagramIcon className="w-5 h-5 shrink-0" />
            </a>
            <a
              href="#"
              className={cn("p-4 rounded-xl retro-button border-black", isDark ? "bg-gray-800 text-white border-purple-500" : "bg-white text-black")}
              title="YouTube"
            >
              <YoutubeIcon className="w-5 h-5 shrink-0" />
            </a>
            <a
              href="#"
              className={cn("p-4 rounded-xl retro-button border-black", isDark ? "bg-gray-800 text-white border-purple-500" : "bg-white text-black")}
              title="Twitch"
            >
              <TwitchIcon className="w-5 h-5 shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* Linha de Copyright */}
      <div
        className={cn(
          "max-w-7xl mx-auto px-4 pt-8 border-t-2 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] sm:text-xs font-retro font-bold uppercase tracking-widest",
          isDark ? "border-gray-800 text-gray-500" : "border-gray-300 text-gray-500"
        )}
      >
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
          <p>© {new Date().getFullYear()} Lucas Begins. Insert Coin to Continue.</p>
          <span className="hidden md:inline opacity-30">|</span>
          <span className="opacity-50">Version {version}</span>
        </div>
        <p className="flex items-center gap-2">
          Feito com <Heart className="w-4 h-4 text-red-500 fill-red-500 shrink-0" /> e nostalgia
        </p>
      </div>
    </footer>
  );
}
