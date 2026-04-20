import React from "react";
import { Gamepad2, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAppContext } from "../context/AppContext";
import { cn } from "../lib/utils";

export default function NotFoundPage() {
  const { isDark } = useAppContext();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-500">
      <Helmet>
        <title>404 Game Over | Lucas Begins</title>
        <meta name="description" content="Página não encontrada no Lucas Begins." />
      </Helmet>

      <div className={cn("p-12 md:p-16 rounded-3xl retro-card border-4 relative overflow-hidden max-w-2xl w-full", isDark ? "bg-gray-900 border-red-500" : "bg-white border-red-600")}>
        <div className="absolute inset-0 scanline-overlay opacity-50" />
        
        <Gamepad2 className="w-24 h-24 mx-auto mb-8 text-red-500 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-bounce" />
        
        <h1 className="font-retro font-bold text-6xl md:text-8xl text-red-500 uppercase tracking-widest drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-4">
          404
        </h1>
        <h2 className="font-retro font-bold text-3xl md:text-4xl uppercase mb-6 drop-shadow-md">
          Game Over
        </h2>
        
        <p className="font-medium text-lg md:text-xl mb-12 opacity-80 leading-relaxed font-body">
          O cartucho falhou ao carregar a fase. O link está quebrado ou a princesa está em outro castelo!
        </p>

        <div className="flex justify-center relative z-10">
          <Link
            to="/"
            className="flex items-center gap-3 px-8 py-4 bg-purple-600 text-white rounded-xl font-retro font-bold text-xl uppercase retro-button hover:bg-purple-500 transition-colors border-2 border-black"
          >
            <Home className="w-6 h-6" /> Continue (Insert Coin)
          </Link>
        </div>
      </div>
    </div>
  );
}
