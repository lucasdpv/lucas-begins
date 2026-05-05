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
  return (
    <div className="animate-in fade-in max-w-7xl mx-auto py-8">
      <Helmet>
        <title>A História | Lucas Begins</title>
        <meta name="description" content="Conheça a história de Player 1 por trás do Lucas Begins e porque amamos games retro." />
      </Helmet>
      {/* Hero */}
      <div className={cn(
        "w-full h-72 rounded-[2.5rem] border-4 relative overflow-hidden mb-12 flex items-center justify-center transition-all",
        isDark 
          ? "bg-gradient-to-br from-purple-900 to-indigo-950 border-purple-600 shadow-[12px_12px_0px_rgba(147,51,234,0.1)]" 
          : "bg-gradient-to-br from-purple-800 to-indigo-900 border-snes-dark shadow-[12px_12px_0px_rgba(0,0,0,1)]"
      )}>
        <div className="absolute inset-0 scanline-overlay opacity-20" />
        <div className="text-center relative z-10 text-white p-6">
          <Gamepad2 className="w-20 h-20 mx-auto mb-6 text-yellow-400 drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]" />
          <h1 className="font-retro font-bold text-5xl md:text-7xl uppercase tracking-widest drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]">
            Sobre o Blog
          </h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className={cn(
        "p-10 md:p-16 rounded-[2.5rem] border-4 max-w-none text-left transition-all",
        isDark 
          ? "bg-gray-900 border-gray-800 text-gray-300 shadow-xl shadow-purple-900/5" 
          : "bg-snes-surface border-snes-dark shadow-[16px_16px_0px_rgba(0,0,0,1)]"
      )}>
        <h2 className="font-retro text-4xl mb-8 text-purple-500 uppercase border-b-4 border-purple-500 inline-block pb-3 drop-shadow-sm">
          A Origem
        </h2>
        <div className="space-y-6 text-lg md:text-xl font-medium leading-relaxed mb-16">
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

        <h2 className="font-retro text-4xl mb-10 text-purple-500 uppercase border-b-4 border-purple-500 inline-block pb-3 drop-shadow-sm">
          Player 1
        </h2>

        <div className={cn(
          "p-8 md:p-14 rounded-[2.5rem] border-4 transition-all",
          isDark ? "bg-gray-800 border-gray-700 shadow-inner" : "bg-snes-input border-snes-mid shadow-inner"
        )}>
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
            <div className="w-40 h-40 shrink-0 rounded-3xl bg-purple-600 flex items-center justify-center text-7xl shadow-[8px_8px_0px_rgba(0,0,0,1)] border-4 border-black -rotate-3 hover:rotate-0 transition-transform">
              👨‍💻
            </div>
            <div className="text-center lg:text-left flex-1">
              <h3 className="font-bold font-retro text-4xl md:text-5xl uppercase mb-2 text-purple-500 leading-none drop-shadow-sm">
                Lucas Vieira
              </h3>
              <p className="text-sm md:text-base font-bold uppercase tracking-[0.3em] opacity-50 mb-10">
                A.K.A. Lucas Begins 🎮🦇
              </p>
              <div className="space-y-6 text-base md:text-lg">
                <p className="leading-relaxed">
                  Gamer de 33 anos, seguindo firme nessa jornada solo pelo universo dos videogames.
                  Minha história começou por volta de 1997, quando, aos 5 anos, ganhei meu primeiro
                  Super Nintendo. Foi ali que tudo começou: controles nas mãos, olhos brilhando e a
                  certeza de que os games fariam parte da minha vida pra sempre.
                </p>
                <p className="leading-relaxed">
                  Desde então, tive a sorte de passar por praticamente todas as gerações de consoles,
                  criando uma conexão especial com cada fase dessa indústria incrível. Mas se existe uma
                  marca que conquistou meu coração de vez, essa marca foi a PlayStation.
                </p>
                <p className="leading-relaxed">
                  E entre tantos consoles lendários, o PlayStation 2 reina absoluto como meu favorito de
                  todos os tempos. Ganhei o meu por volta de 2003, e dali nasceram memórias
                  inesquecíveis. Foram madrugadas inteiras tunando carros em Need for Speed Underground
                  2, explorando mundos épicos em Final Fantasy X e Final Fantasy XII, vivendo aventuras
                  mágicas em Kingdom Hearts, enfrentando demônios em Onimusha 3 e mergulhando no
                  cooperativo viciante de Champions of Norrath.
                </p>
                <p className="leading-relaxed">
                  Mas engana-se quem pensa que vivo apenas de nostalgia. A paixão continua mais viva do
                  que nunca. Hoje em dia sigo firme no presente, encarando novas aventuras e desafios.
                  Tenho um carinho enorme por RPGs de ação e isométricos, especialmente no estilo Diablo,
                  daqueles que você "entra só pra jogar meia hora" e percebe que já amanheceu. Inclusive,
                  passo horas e horas detonando hordas demoníacas em Diablo IV, sempre em busca de loot
                  melhor e builds cada vez mais insanas.
                </p>
                <p className="leading-relaxed">
                  Também curto jogos com progressão viciante, mundos ricos em detalhes, combates
                  intensos e aquela sensação boa de evolução constante. Seja em RPGs, aventuras épicas
                  ou clássicos inesquecíveis, o importante pra mim sempre foi uma coisa: se divertir e
                  viver grandes histórias.
                </p>
                <p className="text-sm opacity-60 italic mt-6 border-l-4 border-purple-500 pl-6 py-2">
                  E claro... o apelido Lucas Begins nasceu na época em que eu usava esse nome até no
                  e-mail, inspirado porque eu curti demais Batman Begins. O filme marcou, o nick pegou,
                  e ficou pra história. 🦇😆
                </p>
                <p className="font-bold font-retro uppercase text-purple-500 mt-8 tracking-wider text-xl">
                  Resumindo: um cara apaixonado por games desde criança, colecionando memórias, zerando
                  histórias e sempre pronto pro próximo save.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
