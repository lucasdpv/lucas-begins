import React from "react";
import { Gamepad2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAppContext } from "../context/AppContext";
import RetroSeparator from "../components/ui/RetroSeparator";
import { cn } from "../lib/utils";

/**
 * Página Sobre: hero, texto de origem do blog e perfil do autor.
 * Visual alinhado ao padrão da ContactPage.
 */
export default function AboutPage() {
  const { isDark } = useAppContext();

  return (
    <div className="min-h-[85vh] flex items-start justify-center py-12 md:py-20 px-4 relative overflow-hidden">
      <Helmet>
        <title>A História | Lucas Begins</title>
        <meta name="description" content="Conheça a história de Player 1 por trás do Lucas Begins e porque amamos games retro." />
      </Helmet>

      {/* Efeito de Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Título estilo retro — mesmo padrão do Contact */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block px-6 md:px-10 py-3 md:py-4 bg-purple-600 border-4 md:border-[6px] border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_rgba(0,0,0,1)] mb-6 md:mb-8">
            <h1 className="font-retro font-bold text-2xl md:text-6xl text-white uppercase tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] md:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              Sobre <span className="text-yellow-400">Nós</span>
            </h1>
          </div>
          <p className={cn(
            "font-retro text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold drop-shadow-sm",
            isDark ? "text-purple-400" : "text-purple-900"
          )}>
            Player 1 has entered the game
          </p>
        </div>

        {/* Card principal — mesmo padrão do Contact */}
        <div className={cn(
          "p-6 md:p-16 border-4 md:border-[8px] shadow-[10px_10px_0px_rgba(0,0,0,1)] md:shadow-[20px_20px_0px_rgba(0,0,0,1)] relative transition-all",
          isDark
            ? "bg-gray-900/80 backdrop-blur-sm border-purple-600"
            : "bg-snes-surface border-snes-dark"
        )}>
          {/* A Origem */}
          <div className="mb-10 md:mb-14">
            <h2 className="font-retro text-xl md:text-3xl mb-5 md:mb-7 text-purple-500 uppercase border-b-4 border-purple-500 inline-block pb-2 md:pb-3 drop-shadow-sm">
              A Origem
            </h2>
            <div className="space-y-4 md:space-y-6 text-base md:text-lg font-medium leading-relaxed">
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
          </div>

          {/* Separador estilo retro */}
          <RetroSeparator isDark={isDark} className="mb-10 md:mb-14" />

          {/* Card do perfil — mesmo estilo de borda/sombra do card principal */}
          <div className={cn(
            "p-6 md:p-12 border-4 md:border-[6px] shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_rgba(0,0,0,1)] relative overflow-hidden transition-all",
            isDark
              ? "bg-gray-800/60 border-gray-700 backdrop-blur-sm"
              : "bg-white border-snes-mid"
          )}>
            {/* Grade de fundo sutil */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 md:gap-14 relative z-10">
              {/* Avatar */}
              <div className="relative group shrink-0">
                <div className="w-32 h-32 md:w-44 md:h-44 bg-gradient-to-br from-purple-600 to-indigo-700 border-4 md:border-[6px] border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_rgba(0,0,0,1)] flex items-center justify-center text-5xl md:text-7xl transition-all -rotate-3 group-hover:rotate-0 overflow-hidden">
                  <span className="relative z-10 filter drop-shadow-lg">👨‍💻</span>
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
                  <div className="absolute inset-0 bg-purple-400/20 animate-pulse" />
                </div>
                {/* Level Badge */}
                <div className="absolute -bottom-4 -right-4 bg-yellow-400 border-4 border-black px-4 py-1 font-retro text-xs md:text-sm font-bold text-black rotate-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  LVL 33
                </div>
              </div>

              {/* Bio */}
              <div className="text-center lg:text-left flex-1 w-full">
                <h3 className="font-bold font-retro text-3xl md:text-5xl uppercase mb-1 text-purple-500 leading-none drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  Lucas Vieira
                </h3>
                <div className="flex flex-col md:flex-row items-center gap-3 mb-6 md:mb-8">
                  <p className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-60">
                    A.K.A. Lucas Begins 🎮🦇
                  </p>
                  <div className="hidden md:block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-retro text-green-500 font-bold uppercase tracking-widest hidden md:block">Online</span>
                </div>

                <div className="space-y-4 md:space-y-5 text-sm md:text-base font-medium leading-relaxed text-left">
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
                    "p-4 md:p-5 border-l-8",
                    isDark ? "bg-purple-900/10 border-purple-600" : "bg-purple-50 border-purple-500"
                  )}>
                    <p className="italic font-bold">
                      E entre tantos consoles lendários, o PlayStation 2 reina absoluto como meu favorito de
                      todos os tempos. Ganhei o meu por volta de 2003, e dali nasceram memórias inesquecíveis.
                    </p>
                  </div>
                  <p>
                    Hoje em dia sigo firme no presente, encarando novas aventuras e desafios.
                    Tenho um carinho enorme por RPGs de ação e isométricos, especialmente no estilo Diablo,
                    daqueles que você "entra só pra jogar meia hora" e percebe que já amanheceu.
                  </p>
                  <p className="text-xs md:text-sm opacity-60 italic border-l-4 border-purple-500 pl-4 md:pl-6 py-2">
                    E claro... o apelido Lucas Begins nasceu na época em que eu usava esse nome até no
                    e-mail, inspirado porque eu curti demais Batman Begins. O filme marcou, o nick pegou,
                    e ficou pra história. 🦇😆
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {['RPG', 'Action', 'Retro', 'PlayStation', 'Loot Hunter'].map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-black/20 border-2 border-purple-500/30 font-retro text-[10px] uppercase font-bold text-purple-400 shadow-[2px_2px_0px_rgba(0,0,0,0.4)]"
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
      </div>
    </div>
  );
}
