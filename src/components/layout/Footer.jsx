import React from "react";
import { Gamepad2, ChevronRight, Heart } from "lucide-react";
import { XIcon, ThreadsIcon, InstagramIcon, YoutubeIcon, TwitchIcon } from "../icons/SocialIcons";

/**
 * Rodapé do site com marca, links rápidos e redes sociais.
 */
export default function Footer({ isDark, onAbout, onContact }) {
  return (
    <footer
      className={`border-t-4 mt-16 pt-16 pb-8 transition-colors duration-300 ${isDark ? "border-purple-600 bg-gray-900" : "border-black bg-white"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

        {/* Marca e Descrição */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-3 group cursor-pointer w-fit">
            <Gamepad2
              className={`w-8 h-8 shrink-0 ${isDark ? "text-purple-400" : "text-purple-600"} group-hover:rotate-12 transition-transform`}
            />
            <h2 className="font-retro font-bold text-2xl sm:text-3xl tracking-wider uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
              <span className={isDark ? "text-white" : "text-black"}>Lucas</span>
              <span className={isDark ? "text-purple-400" : "text-purple-600"}>Begins</span>
            </h2>
          </div>
          <p className={`text-base font-medium leading-relaxed max-w-sm pl-11 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Sua revista digital para a era de ouro dos videogames. Análises críticas, memórias
            inesquecíveis e as últimas novidades do mundo retro.
          </p>
        </div>

        {/* Links Rápidos */}
        <div>
          <h3 className="font-retro font-bold text-lg uppercase tracking-wider mb-6 flex items-center gap-3">
            <span className={`w-3 h-6 shrink-0 retro-card ${isDark ? "bg-purple-500" : "bg-purple-600"}`} />
            <span>Diretório</span>
          </h3>
          <ul className={`space-y-4 text-base font-bold font-retro uppercase pl-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            <li>
              <button onClick={onAbout} className="hover:text-purple-500 transition-all hover:translate-x-2 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-purple-500" /> Sobre Nós
              </button>
            </li>
            <li>
              <button onClick={onContact} className="hover:text-purple-500 transition-all hover:translate-x-2 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-purple-500" /> Contatos
              </button>
            </li>
          </ul>
        </div>

        {/* Redes Sociais */}
        <div>
          <h3 className="font-retro font-bold text-lg uppercase tracking-wider mb-6 flex items-center gap-3">
            <span className={`w-3 h-6 shrink-0 retro-card ${isDark ? "bg-yellow-400" : "bg-yellow-500"}`} />
            <span>Multiplayer</span>
          </h3>
          <div className="flex flex-wrap gap-4 pl-6">
            <a
              href="#"
              className={`p-4 rounded-xl retro-button ${isDark ? "bg-gray-800 text-white border-purple-500 hover:bg-purple-600" : "bg-white text-black border-black hover:bg-purple-500 hover:text-white"}`}
              title="X (Antigo Twitter)"
            >
              <XIcon className="w-5 h-5 shrink-0" />
            </a>
            <a
              href="#"
              className={`p-4 rounded-xl retro-button ${isDark ? "bg-gray-800 text-white border-purple-500 hover:bg-purple-600" : "bg-white text-black border-black hover:bg-purple-500 hover:text-white"}`}
              title="Threads"
            >
              <ThreadsIcon className="w-5 h-5 shrink-0" />
            </a>
            <a
              href="#"
              className={`p-4 rounded-xl retro-button ${isDark ? "bg-gray-800 text-white border-purple-500 hover:bg-purple-600" : "bg-white text-black border-black hover:bg-purple-500 hover:text-white"}`}
              title="Instagram"
            >
              <InstagramIcon className="w-5 h-5 shrink-0" />
            </a>
            <a
              href="#"
              className={`p-4 rounded-xl retro-button ${isDark ? "bg-gray-800 text-white border-purple-500 hover:bg-red-600" : "bg-white text-black border-black hover:bg-red-600 hover:text-white"}`}
              title="YouTube"
            >
              <YoutubeIcon className="w-5 h-5 shrink-0" />
            </a>
            <a
              href="#"
              className={`p-4 rounded-xl retro-button ${isDark ? "bg-gray-800 text-white border-purple-500 hover:bg-purple-500" : "bg-white text-black border-black hover:bg-purple-500 hover:text-white"}`}
              title="Twitch"
            >
              <TwitchIcon className="w-5 h-5 shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* Linha de Copyright */}
      <div
        className={`max-w-7xl mx-auto px-4 pt-8 border-t-2 flex flex-col md:flex-row items-center justify-between gap-6 text-xs sm:text-sm font-retro font-bold uppercase tracking-widest ${isDark ? "border-gray-800 text-gray-500" : "border-gray-300 text-gray-500"
          }`}
      >
        <p>© {new Date().getFullYear()} Lucas Begins. Insert Coin to Continue.</p>
        <p className="flex items-center gap-2">
          Feito com <Heart className="w-4 h-4 text-red-500 fill-red-500 shrink-0" /> e nostalgia
        </p>
      </div>
    </footer>
  );
}
