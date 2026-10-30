"use client";

import React from "react";
import { Sparkles, Gamepad2, Trophy, Wifi } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { cn } from "../lib/utils";

/**
 * Página Sobre Nós — Redesign Cyber-Editorial + Streaming Geek
 */
export default function AboutPage() {
  const { isDark } = useThemeStore();

  return (
    <div className="min-h-[80vh] flex items-start justify-center py-6 md:py-12 relative">
      <div className="w-full max-w-5xl relative z-10 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-retro font-black uppercase tracking-widest bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Player 1 Has Entered The Game
          </span>
          <h1 className="font-retro font-black text-3xl md:text-5xl text-white uppercase tracking-tight">
            Sobre o <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">BeginsProject</span>
          </h1>
        </div>

        {/* Main Card */}
        <div
          className={cn(
            "p-6 sm:p-10 md:p-12 rounded-3xl border relative overflow-hidden",
            isDark
              ? "bg-[#121024]/90 border-white/[0.08] text-slate-100 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)]"
              : "bg-white border-slate-200 text-slate-900 shadow-xl"
          )}
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-10">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-10 pb-10 border-b border-white/[0.08]">
              <div className="relative shrink-0">
                <div className="w-40 h-40 md:w-52 md:h-52 rounded-3xl border border-purple-500/40 shadow-[0_20px_50px_-10px_rgba(168,85,247,0.3)] relative overflow-hidden group">
                  <img
                    src="/lucas-profile.jpg"
                    alt="Lucas Vieira"
                    className="w-full h-full object-cover scale-[1.25] origin-center transition-transform duration-500 group-hover:scale-[1.32]"
                    style={{ objectPosition: "center 20%" }}
                    onError={(e) => {
                      e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas";
                    }}
                  />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left flex flex-col justify-between py-1">
                <div>
                  <h2 className="font-retro font-black text-3xl md:text-5xl uppercase mb-2 text-white tracking-tight">
                    Lucas Vieira
                  </h2>
                  <p className="font-mono text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-purple-400 mb-8">
                    A.K.A. Lucas Begins 🎮🦇
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
                  <div className="p-4 rounded-2xl border border-purple-500/25 bg-purple-500/10 flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300/70 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-purple-400" /> Classe
                    </span>
                    <span className="text-sm font-retro font-black uppercase text-purple-300">
                      Loot Hunter
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl border border-sky-500/25 bg-sky-500/10 flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-sky-300/70 flex items-center gap-1.5">
                      <Gamepad2 className="w-3.5 h-3.5 text-sky-400" /> Main
                    </span>
                    <span className="text-sm font-retro font-black uppercase text-sky-300">
                      PlayStation
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300/70 flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-emerald-400" /> Status
                    </span>
                    <span className="text-sm font-retro font-black uppercase text-emerald-400 animate-pulse">
                      Online Now
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Body */}
            <div className="space-y-6 text-base md:text-lg font-medium leading-relaxed text-slate-200 text-left">
              <p className="article-paragraph">
                Fala galera!!! O <strong className="text-white notranslate" translate="no">BeginsProject</strong> nasceu de uma vontade antiga de criar um cantinho na internet
                para documentar uma vida dedicada aos games e compartilhar a alegria de dividir grandes momentos através de um controle.
                Minha jornada começou com o som icônico de um console ligando na sala de casa, e desde então, os videogames deixaram de ser
                apenas pixels na tela para se tornarem um lugar onde fiz amizades e vivi histórias inesquecíveis.
              </p>
              <p className="article-paragraph">
                Acredito que a história dos jogos não deve ser esquecida, e que a estética de assoprar cartuchos e anotar passwords
                continua tão relevante e mágica hoje quanto era antigamente. Para mim, jogar é muito mais legal quando é compartilhado.
                Sou fã da era de ouro dos 128-bits, mas o que eu curto mesmo é sentar com os amigos, bater um papo e aproveitar um bom jogo casual.
              </p>

              <div className="relative p-6 md:p-8 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 via-purple-900/10 to-transparent">
                <p className="italic font-semibold text-lg md:text-xl text-center text-purple-200">
                  "O <span className="notranslate" translate="no">BeginsProject</span> nasceu para ser o nosso ponto de encontro — um lugar leve para trocar uma ideia,
                  relembrar os clássicos e compartilhar a alegria de ser gamer com quem entende do assunto."
                </p>
              </div>

              <p className="article-paragraph">
                Hoje, sigo criando este cantinho para que a gente possa conversar sobre o que realmente importa: a diversão pura.
                Seja você um veterano das locadoras ou alguém que acabou de apertar o 'Start', você é muito bem-vindo por aqui.
              </p>

              <p className="text-sm italic border-l-2 border-purple-500 pl-4 py-1 text-slate-400">
                O apelido Lucas Begins nasceu de uma admiração por recomeços e grandes histórias.
                Para mim, cada vez que ligamos um console, é um novo começo. 🎮✨
              </p>

              <div className="flex flex-wrap gap-2.5 pt-4">
                {["RPG", "Action", "Retro", "PlayStation", "Loot Hunter", "Anime", "Nostalgia"].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 font-retro text-xs uppercase font-bold text-purple-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
