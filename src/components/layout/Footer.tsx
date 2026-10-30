import React from "react";
import Image from "next/image";
import { ChevronRight, Heart } from "lucide-react";
import { Link } from "@/lib/router-compat";
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
        "border-t mt-12 pt-8 pb-6 transition-colors duration-300 relative overflow-hidden",
        isDark
          ? "border-white/[0.08] bg-[#07060e]"
          : "border-slate-200/80 bg-white"
      )}
    >
      {/* Subtle Top Glow */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent pointer-events-none" />

      {/* === MOBILE === */}
      <div className="md:hidden max-w-7xl mx-auto px-4 mb-5">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer w-fit">
            <Image
              src="/icon-bp.png"
              alt="BeginsProject Logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-retro font-black text-xl tracking-tight uppercase notranslate leading-none" translate="no">
                <span className={isDark ? "text-white" : "text-slate-900"}>Begins</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Project</span>
              </span>
              <span className="text-[7px] font-mono uppercase tracking-[0.25em] text-purple-400/80 mt-0.5">
                GAMES · ANIMES · NOSTALGIA
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/beginsproject/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "p-2.5 rounded-xl border transition-all",
                isDark
                  ? "bg-white/[0.04] text-white border-white/10 hover:border-purple-500/50"
                  : "bg-slate-100 text-slate-800 border-slate-200"
              )}
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.threads.com/@beginsproject"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "p-2.5 rounded-xl border transition-all",
                isDark
                  ? "bg-white/[0.04] text-white border-white/10 hover:border-purple-500/50"
                  : "bg-slate-100 text-slate-800 border-slate-200"
              )}
              title="Threads"
            >
              <ThreadsIcon className="w-4 h-4" />
            </a>
            <a
              href="https://x.com/beginsproject"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "p-2.5 rounded-xl border transition-all",
                isDark
                  ? "bg-white/[0.04] text-white border-white/10 hover:border-purple-500/50"
                  : "bg-slate-100 text-slate-800 border-slate-200"
              )}
              title="X (Twitter)"
            >
              <XIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-retro font-bold uppercase tracking-wider",
            isDark ? "text-slate-400" : "text-slate-500"
          )}
        >
          <Link to="/about" className="hover:text-purple-400 transition-colors flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-purple-500" /> Sobre Nós
          </Link>
          <span className="opacity-30">·</span>
          <Link to="/contact" className="hover:text-purple-400 transition-colors flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-purple-500" /> Contatos
          </Link>
          <span className="opacity-30">·</span>
          <Link to="/privacy" className="hover:text-purple-400 transition-colors flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-purple-500" /> Privacidade
          </Link>
        </div>
      </div>

      {/* === DESKTOP === */}
      <div className="hidden md:flex layout-container items-center justify-between mb-6">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer shrink-0">
          <Image
            src="/icon-bp.png"
            alt="BeginsProject Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <h2 className="font-retro font-black text-xl md:text-2xl tracking-tight uppercase notranslate leading-none" translate="no">
              <span className={isDark ? "text-white" : "text-slate-900"}>Begins</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Project</span>
            </h2>
            <span className="text-[8px] font-mono uppercase tracking-[0.28em] text-purple-400/80 mt-0.5">
              GAMES · ANIMES · NOSTALGIA
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-8">
          <div
            className={cn(
              "flex items-center gap-6 text-xs font-retro font-bold uppercase tracking-wider",
              isDark ? "text-slate-400" : "text-slate-600"
            )}
          >
            <Link to="/archive" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-purple-500" /> Catálogo
            </Link>
            <Link to="/about" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-purple-500" /> Sobre Nós
            </Link>
            <Link to="/contact" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-purple-500" /> Contatos
            </Link>
            <Link to="/privacy" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-purple-500" /> Privacidade
            </Link>
          </div>

          <div className={cn("w-px h-6", isDark ? "bg-white/10" : "bg-slate-200")} />

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://www.instagram.com/beginsproject"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "p-2.5 rounded-xl border transition-all hover:-translate-y-0.5",
                isDark
                  ? "bg-white/[0.04] text-slate-300 border-white/10 hover:border-pink-500/50 hover:text-white hover:bg-pink-500/10"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:border-pink-500"
              )}
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4 shrink-0" />
            </a>
            <a
              href="https://www.threads.com/@beginsproject"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "p-2.5 rounded-xl border transition-all hover:-translate-y-0.5",
                isDark
                  ? "bg-white/[0.04] text-slate-300 border-white/10 hover:border-purple-500/50 hover:text-white hover:bg-purple-500/10"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:border-purple-500"
              )}
              title="Threads"
            >
              <ThreadsIcon className="w-4 h-4 shrink-0" />
            </a>
            <a
              href="https://x.com/beginsproject"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "p-2.5 rounded-xl border transition-all hover:-translate-y-0.5",
                isDark
                  ? "bg-white/[0.04] text-slate-300 border-white/10 hover:border-purple-500/50 hover:text-white hover:bg-purple-500/10"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:border-purple-500"
              )}
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
          "layout-container pt-4 border-t flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-[10px] font-retro font-bold uppercase tracking-widest",
          isDark ? "border-white/[0.06] text-slate-500" : "border-slate-200 text-slate-500"
        )}
      >
        <p className="opacity-80 notranslate" translate="no">© {new Date().getFullYear()} BeginsProject</p>
        <span className="opacity-20 hidden md:inline">·</span>
        <span className="opacity-50 hidden md:inline">Press Start to Continue</span>
        <span className="opacity-20 hidden md:inline">·</span>
        <span className="opacity-50 hidden md:inline">v{version}</span>
        <span className="opacity-20 hidden md:inline">·</span>
        <p className="flex items-center gap-1.5 opacity-80">
          Feito com <Heart className="w-3 h-3 text-rose-500 fill-rose-500 shrink-0" /> e nostalgia
        </p>
      </div>
    </footer>
  );
}
