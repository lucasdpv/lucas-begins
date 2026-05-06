import React from "react";
import { Gamepad2, Mail } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAppContext } from "../context/AppContext";
import { cn } from "../lib/utils";

/**
 * Página Sobre: hero, texto de origem do blog e perfil do autor.
 */
export default function AboutPage() {
  const { isDark } = useAppContext();
  return (    <div className="animate-in fade-in max-w-7xl mx-auto py-4 md:py-8 px-4">
      <Helmet>
        <title>A História | Lucas Begins</title>
        <meta name="description" content="Conheça a história de Player 1 por trás do Lucas Begins e porque amamos games retro." />
      </Helmet>
      {/* Hero */}
      <div className={cn(
        "w-full h-48 md:h-72 rounded-[2rem] md:rounded-[2.5rem] border-4 relative overflow-hidden mb-8 md:mb-12 flex items-center justify-center transition-all",
        isDark 
          ? "bg-gradient-to-br from-purple-900 to-indigo-950 border-purple-600 shadow-[8px_8px_0px_rgba(147,51,234,0.1)] md:shadow-[12px_12px_0px_rgba(147,51,234,0.1)]" 
          : "bg-gradient-to-br from-purple-800 to-indigo-900 border-snes-dark shadow-[8px_8px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_rgba(0,0,0,1)]"
      )}>
        <div className="absolute inset-0 scanline-overlay opacity-20" />
        <div className="text-center relative z-10 text-white p-4">
          <Gamepad2 className="w-12 h-12 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 text-yellow-400 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]" />
          <h1 className="font-retro font-bold text-3xl md:text-7xl uppercase tracking-widest drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            Sobre o Blog
          </h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className={cn(
        "p-6 md:p-16 rounded-[2rem] md:rounded-[2.5rem] border-4 max-w-none text-left transition-all",
        isDark 
          ? "bg-gray-900 border-gray-800 text-gray-300 shadow-xl shadow-purple-900/5" 
          : "bg-snes-surface border-snes-dark shadow-[10px_10px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_rgba(0,0,0,1)]"
      )}>
        <h2 className="font-retro text-2xl md:text-4xl mb-6 md:mb-8 text-purple-500 uppercase border-b-4 border-purple-500 inline-block pb-2 md:pb-3 drop-shadow-sm">
          A Origem
        </h2>
        <div className="space-y-4 md:space-y-6 text-base md:text-xl font-medium leading-relaxed mb-12 md:mb-16">
          <p>
            O <strong>Lucas Begins</strong> nasceu de uma vontade antiga de criar um cantinho na internet
            para documentar uma vida inteira dedicada aos videogames. É o lugar para falar sobre os jogos
            clássicos que moldaram uma geração e também compartilhar as experiências e jogatinas no mundo
            gamer atual.
          </p>
          <p>
            Eu acredito que a história dos jogos não deve ser esquecida, e que a estética daquela época
            continua tão relevante e mágica hoje quanto era nos dias de assoprar cartuchos e anotar
            passwords em cadernos espirais.
          </p>
        </div>

        <h2 className="font-retro text-2xl md:text-4xl mb-8 md:mb-10 text-purple-500 uppercase flex items-center gap-4">
          <span className="w-12 h-1 bg-purple-500 hidden md:block"></span>
          Player 1
          <span className="flex-1 h-1 bg-purple-500/20"></span>
        </h2>

        <div className={cn(
          "p-6 md:p-14 rounded-[2rem] md:rounded-[3rem] border-4 transition-all relative overflow-hidden",
          isDark 
            ? "bg-gray-800/50 border-gray-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-sm" 
            : "bg-white border-snes-mid shadow-[12px_12px_0px_rgba(0,0,0,1)]"
        )}>
          {/* Efeito de grade de fundo sutil */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 md:gap-16 relative z-10">
            {/* Avatar Container */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-5xl md:text-7xl shadow-[8px_8px_0px_rgba(0,0,0,1)] border-4 border-black transition-all group-hover:rotate-0 -rotate-3 overflow-hidden">
                <span className="relative z-10 filter drop-shadow-lg">👨‍💻</span>
                {/* Scanline Effect inside avatar */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
                <div className="absolute inset-0 bg-purple-400/20 animate-pulse" />
              </div>
              {/* Level Badge */}
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 border-4 border-black px-4 py-1 font-retro text-xs md:text-sm font-bold text-black rotate-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                LVL 33
              </div>
            </div>

            <div className="text-center lg:text-left flex-1 w-full">
              <h3 className="font-bold font-retro text-3xl md:text-6xl uppercase mb-1 text-purple-500 leading-none drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                Lucas Vieira
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-3 mb-6 md:mb-8">
                <p className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-60">
                  A.K.A. Lucas Begins 🎮🦇
                </p>
                <div className="hidden md:block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-retro text-green-500 font-bold uppercase tracking-widest hidden md:block">Online</span>
              </div>


              <div className="space-y-4 md:space-y-6 text-sm md:text-lg text-left md:text-justify font-medium leading-relaxed">
                <p>
                  Gamer de 33 anos, seguindo firme nessa jornada solo pelo universo dos videogames.
                  Minha história começou por volta de 1997, quando, aos 5 anos, ganhei meu primeiro
                  Super Nintendo. Foi ali que tudo começou: controles nas mãos, olhos brilhando e a
                  certeza de que os games fariam parte da minha vida pra sempre.
                </p>
                <p>
                  Desde então, tive a sorte de passar por praticamente todas as gerações de consoles,
                  criando uma conexão especial com cada fase dessa indústria incrível. Mas se existe uma
                  marca que conquistou meu coração de vez, essa marca foi a PlayStation.
                </p>
                <div className={cn(
                  "p-4 md:p-6 rounded-2xl border-l-8",
                  isDark ? "bg-purple-900/10 border-purple-600" : "bg-purple-50 border-purple-500"
                )}>
                   <p className="italic font-bold">
                    E entre tantos consoles lendários, o PlayStation 2 reina absoluto como meu favorito de
                    todos os tempos. Ganhei o meu por volta de 2003, e dali nasceram memórias
                    inesquecíveis.
                  </p>
                </div>
                <p>
                  Hoje em dia sigo firme no presente, encarando novas aventuras e desafios.
                  Tenho um carinho enorme por RPGs de ação e isométricos, especialmente no estilo Diablo,
                  daqueles que você "entra só pra jogar meia hora" e percebe que já amanheceu.
                </p>
                <p className="text-xs md:text-sm opacity-60 italic mt-6 border-l-4 border-purple-500 pl-4 md:pl-6 py-2">
                  E claro... o apelido Lucas Begins nasceu na época em que eu usava esse nome até no
                  e-mail, inspirado porque eu curti demais Batman Begins. O filme marcou, o nick pegou,
                  e ficou pra história. 🦇😆
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  {['RPG', 'Action', 'Retro', 'PlayStation', 'Loot Hunter'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-black/20 border border-purple-500/30 rounded-lg text-[10px] font-retro uppercase font-bold text-purple-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
