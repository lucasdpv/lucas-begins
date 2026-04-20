import React from "react";
import { Gamepad2, Mail } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAppContext } from "../context/AppContext";

/**
 * Página Sobre: hero, texto de origem do blog e perfil do autor.
 */
export default function AboutPage() {
  const { isDark } = useAppContext();
  return (
    <div className="animate-in fade-in max-w-4xl mx-auto py-8">
      <Helmet>
        <title>A História | Lucas Begins</title>
        <meta name="description" content="Conheça a história de Player 1 por trás do Lucas Begins e porque amamos games retro." />
      </Helmet>
      {/* Hero */}
      <div className="w-full h-64 rounded-2xl relative overflow-hidden mb-12 retro-card bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="absolute inset-0 scanline-overlay opacity-40" />
        <div className="text-center relative z-10 text-white">
          <Gamepad2 className="w-20 h-20 mx-auto mb-4 text-yellow-400 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]" />
          <h1 className="font-retro font-bold text-5xl md:text-6xl uppercase tracking-widest drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
            Sobre o Blog
          </h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className={`p-8 md:p-12 rounded-2xl retro-card prose sm:prose-lg max-w-none text-justify ${isDark ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"}`}>
        <h2 className="font-retro text-3xl mb-6 text-purple-500 uppercase border-b-4 border-purple-500 inline-block pb-2">
          A Origem
        </h2>
        <p className="font-medium leading-relaxed">
          O <strong>Lucas Begins</strong> nasceu de uma vontade antiga de criar um cantinho na internet
          para documentar uma vida inteira dedicada aos videogames. É o lugar para falar sobre os jogos
          clássicos que moldaram uma geração e também compartilhar as experiências e jogatinas no mundo
          gamer atual.
        </p>
        <p className="font-medium leading-relaxed">
          Eu acredito que a história dos jogos não deve ser esquecida, e que a estética daquela época
          continua tão relevante e mágica hoje quanto era nos dias de assoprar cartuchos e anotar
          passwords em cadernos espirais.
        </p>

        <h2 className="font-retro text-3xl mt-16 mb-8 text-purple-500 uppercase border-b-4 border-purple-500 inline-block pb-2">
          Player 1
        </h2>

        <div className={`p-6 md:p-10 rounded-2xl border-2 shadow-inner ${isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-300"}`}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 shrink-0 rounded-2xl bg-purple-600 flex items-center justify-center text-6xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              👨‍💻
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="font-bold font-retro text-3xl md:text-4xl uppercase mb-1 text-purple-500 leading-none">
                Lucas Vieira
              </h3>
              <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-6">
                A.K.A. Lucas Begins 🎮🦇
              </p>
              <div className="space-y-4">
                <p className="font-medium leading-relaxed text-base">
                  Gamer de 33 anos, seguindo firme nessa jornada solo pelo universo dos videogames.
                  Minha história começou por volta de 1997, quando, aos 5 anos, ganhei meu primeiro
                  Super Nintendo. Foi ali que tudo começou: controles nas mãos, olhos brilhando e a
                  certeza de que os games fariam parte da minha vida pra sempre.
                </p>
                <p className="font-medium leading-relaxed text-base">
                  Desde então, tive a sorte de passar por praticamente todas as gerações de consoles,
                  criando uma conexão especial com cada fase dessa indústria incrível. Mas se existe uma
                  marca que conquistou meu coração de vez, essa marca foi a PlayStation.
                </p>
                <p className="font-medium leading-relaxed text-base">
                  E entre tantos consoles lendários, o PlayStation 2 reina absoluto como meu favorito de
                  todos os tempos. Ganhei o meu por volta de 2003, e dali nasceram memórias
                  inesquecíveis. Foram madrugadas inteiras tunando carros em Need for Speed Underground
                  2, explorando mundos épicos em Final Fantasy X e Final Fantasy XII, vivendo aventuras
                  mágicas em Kingdom Hearts, enfrentando demônios em Onimusha 3 e mergulhando no
                  cooperativo viciante de Champions of Norrath.
                </p>
                <p className="font-medium leading-relaxed text-base">
                  Mas engana-se quem pensa que vivo apenas de nostalgia. A paixão continua mais viva do
                  que nunca. Hoje em dia sigo firme no presente, encarando novas aventuras e desafios.
                  Tenho um carinho enorme por RPGs de ação e isométricos, especialmente no estilo Diablo,
                  daqueles que você "entra só pra jogar meia hora" e percebe que já amanheceu. Inclusive,
                  passo horas e horas detonando hordas demoníacas em Diablo IV, sempre em busca de loot
                  melhor e builds cada vez mais insanas.
                </p>
                <p className="font-medium leading-relaxed text-base">
                  Também curto jogos com progressão viciante, mundos ricos em detalhes, combates
                  intensos e aquela sensação boa de evolução constante. Seja em RPGs, aventuras épicas
                  ou clássicos inesquecíveis, o importante pra mim sempre foi uma coisa: se divertir e
                  viver grandes histórias.
                </p>
                <p className="font-medium leading-relaxed text-base text-sm opacity-60 italic mt-4">
                  E claro... o apelido Lucas Begins nasceu na época em que eu usava esse nome até no
                  e-mail, inspirado porque eu curti demais Batman Begins. O filme marcou, o nick pegou,
                  e ficou pra história. 🦇😆
                </p>
                <p className="font-bold font-retro uppercase text-purple-500 mt-4 tracking-wide">
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
