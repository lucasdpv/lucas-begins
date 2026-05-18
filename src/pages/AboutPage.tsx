import React from "react";
import { Helmet } from "react-helmet-async";
import { useThemeStore } from "../store/useThemeStore";
import RetroSeparator from "../components/ui/RetroSeparator";
import { cn } from "../lib/utils";

/**
 * Página Sobre: hero, texto de origem do blog e perfil do autor.
 * Visual alinhado ao padrão da ContactPage.
 */
export default function AboutPage() {
  const { isDark } = useThemeStore();

  return (
    <div className="min-h-[85vh] flex items-start justify-center py-12 md:py-20 px-4 relative overflow-hidden">
      <Helmet>
        <title>A História | BeginsProject</title>
        <link rel="canonical" href="https://lucasbegins.com.br/about" />
        <meta name="description" content="Conheça a história e os bastidores do BeginsProject (Lucas Begins), um portal dedicado à nostalgia gamer, reviews de jogos retro e à preservação da história dos videogames." />
        <meta name="keywords" content="BeginsProject, Lucas Begins, História do Portal, Sobre o Blog, Lucas Vieira, Retro Gaming Blog, Nostalgia Gamer, Preservação de Games" />
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

        {/* Card principal — unificado */}
        <div className={cn(
          "p-6 md:p-12 border-4 md:border-[8px] shadow-[10px_10px_0px_rgba(0,0,0,1)] md:shadow-[20px_20px_0px_rgba(0,0,0,1)] relative transition-all overflow-hidden",
          isDark
            ? "bg-gray-900/80 backdrop-blur-sm border-purple-600"
            : "bg-snes-surface border-snes-dark"
        )}>
          {/* Grade de fundo sutil */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

          <div className="relative z-10 space-y-10">
            {/* --- PROFILE HEADER: Avatar & Quick Info --- */}
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-12 pb-10 border-b-2 border-black/10">
              {/* Avatar Square Style with Zoom */}
              <div className="relative shrink-0">
                <div className="w-40 h-40 md:w-56 md:h-56 border-4 md:border-[6px] border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_rgba(0,0,0,1)] relative overflow-hidden group rotate-1">
                  <img 
                    src="/lucas-profile.jpg" 
                    alt="Lucas Vieira" 
                    className="w-full h-full object-cover scale-[1.3] origin-center transition-transform group-hover:scale-[1.4]"
                    style={{ objectPosition: 'center 20%' }}
                    onError={(e) => {
                      e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas";
                    }}
                  />
                  {/* Scanlines on Avatar */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />
                  {/* Inner Border/Glow effect */}
                  <div className="absolute inset-0 border-[8px] border-white/5 pointer-events-none" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left flex flex-col justify-between py-2">
                <div>
                  <h3 className="font-bold font-retro text-3xl md:text-6xl uppercase mb-2 text-purple-500 leading-none drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                    Lucas Vieira
                  </h3>
                  <p className="text-xs md:text-base font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-60 mb-8 md:mb-12">
                    A.K.A. Lucas Begins 🎮🦇
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  {/* Prominent Stat Boxes */}
                  <div className={cn(
                    "p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-1",
                    isDark ? "bg-purple-900/20" : "bg-purple-50"
                  )}>
                    <span className="text-[10px] font-retro opacity-50 uppercase tracking-tighter">Classe</span>
                    <span className="text-xs md:text-sm font-black uppercase text-purple-400">Loot Hunter</span>
                  </div>
                  <div className={cn(
                    "p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-1",
                    isDark ? "bg-blue-900/20" : "bg-blue-50"
                  )}>
                    <span className="text-[10px] font-retro opacity-50 uppercase tracking-tighter">Main</span>
                    <span className="text-xs md:text-sm font-black uppercase text-blue-400">PlayStation</span>
                  </div>
                  <div className={cn(
                    "p-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-1",
                    isDark ? "bg-green-900/20" : "bg-green-50"
                  )}>
                    <span className="text-[10px] font-retro opacity-50 uppercase tracking-tighter">Status</span>
                    <span className="text-xs md:text-sm font-black uppercase text-green-500 animate-pulse">Online Now</span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- BIO BODY: Full Width Content (Post Behavior) --- */}
            <div className="space-y-6 text-base md:text-xl font-medium leading-loose text-left">
              <p>
                Fala galera!!! O <strong>BeginsProject</strong> nasceu de uma vontade antiga de criar um cantinho na internet
                para documentar uma vida dedicada aos games e compartilhar a alegria de dividir grandes momentos através de um controle.
                Minha jornada começou com o som icônico de um console ligando na sala de casa, e desde então, os videogames deixaram de ser
                apenas pixels na tela para se tornarem um lugar onde fiz amizades e vivi histórias inesquecíveis.
              </p>
              <p>
                Acredito que a história dos jogos não deve ser esquecida, e que a estética de assoprar cartuchos e anotar passwords
                continua tão relevante e mágica hoje quanto era antigamente. Para mim, jogar é muito mais legal quando é compartilhado.
                Sou fã da era de ouro dos 128-bits, mas o que eu curto mesmo é sentar com os amigos, bater um papo e aproveitar um bom jogo casual.
              </p>
              
              <div className={cn(
                "relative p-6 md:p-10 rounded-none border-4", 
                isDark ? "bg-purple-900/10 border-purple-600 shadow-[4px_4px_0_rgba(168,85,247,0.4)]" : "bg-purple-50 border-purple-500 shadow-[4px_4px_0_rgba(168,85,247,0.4)]"
              )}>
                <p className="italic font-bold text-lg md:text-2xl text-center">
                  "O BeginsProject nasceu para ser o nosso ponto de encontro — um lugar leve para trocar uma ideia,
                  relembrar os clássicos e compartilhar a alegria de ser gamer com quem entende do assunto."
                </p>
              </div>

              <p>
                Hoje, sigo criando este cantinho para que a gente possa conversar sobre o que realmente importa: a diversão pura.
                Seja você um veterano das locadoras ou alguém que acabou de apertar o 'Start', você é muito bem-vindo por aqui.
              </p>
              
              <p className="text-xs md:text-sm opacity-60 italic border-l-4 border-purple-500 pl-4 md:pl-6 py-2">
                O apelido Lucas Begins nasceu de uma admiração por recomeços e grandes histórias.
                Para mim, cada vez que ligamos um console, é um novo começo. 🎮✨
              </p>

              <div className="flex flex-wrap gap-3 pt-6">
                {['RPG', 'Action', 'Retro', 'PlayStation', 'Loot Hunter'].map(tag => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-black/20 border-2 border-purple-500/30 font-retro text-[10px] md:text-xs uppercase font-bold text-purple-400 shadow-[2px_2px_0px_rgba(0,0,0,0.4)]"
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
