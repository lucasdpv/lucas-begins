import React, { useState } from "react";
import { Sparkles, Loader2, Bot } from "lucide-react";
import { fetchGemini } from "../../lib/gemini";

/**
 * Widget lateral de recomendação de jogos via IA (Gemini).
 * O usuário digita um jogo e recebe 3 sugestões retrô similares.
 */
export default function RetroRecommender({ isDark }) {
  const [query, setQuery] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRecommend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setRecommendation("");
    try {
      const prompt = `O usuário do blog adora o jogo '${query}'. Como especialista da revista Ação Games, recomende 3 jogos retro semelhantes. Título e frase curta e animada para cada. Responda em PT-BR. Texto simples com hífens.`;
      setRecommendation(await fetchGemini(prompt));
    } catch {
      setRecommendation(
        "Erro de conexão. A IA deve estar assoprando o cartucho, tente novamente!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`p-8 rounded-3xl retro-card relative overflow-hidden bg-gradient-to-br ${
        isDark ? "from-gray-800 to-purple-900/40" : "from-purple-100 to-white"
      }`}
    >
      <div className="absolute -top-6 -right-6 p-4 opacity-10 pointer-events-none">
        <Bot className="w-48 h-48" />
      </div>

      <h3 className="font-retro font-bold text-2xl uppercase mb-4 flex items-center gap-3 relative z-10 drop-shadow-md">
        <Sparkles className="text-yellow-500 w-8 h-8" /> Guru Nostálgico
      </h3>
      <p className="text-base mb-8 font-medium relative z-10 leading-relaxed">
        Diga-nos um jogo que você adora e a IA vasculha o acervo para recomendar 3 pérolas retro!
      </p>

      <form onSubmit={handleRecommend} className="space-y-6 relative z-10">
        <input
          type="text"
          placeholder="Ex: Super Metroid..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full p-4 text-base font-bold rounded-xl outline-none border-2 focus:border-purple-500 transition-colors ${
            isDark
              ? "bg-gray-900 text-white border-gray-700"
              : "bg-white text-black border-black shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"
          }`}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-retro text-lg font-bold uppercase py-4 rounded-xl transition-colors retro-button border-black"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Sparkles className="w-6 h-6 text-yellow-300" />
          )}
          {isLoading ? "Consultando..." : "Descobrir Jogos"}
        </button>
      </form>

      {recommendation && (
        <div
          className={`mt-8 p-6 rounded-2xl text-base font-medium leading-relaxed whitespace-pre-line animate-in fade-in border-4 border-dashed relative z-10 ${
            isDark
              ? "bg-gray-900/80 border-purple-500/50 text-gray-200"
              : "bg-white border-purple-300 text-gray-800"
          }`}
        >
          {recommendation}
        </div>
      )}
    </div>
  );
}
