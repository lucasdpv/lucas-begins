import React from "react";
import { Wrench, RefreshCcw, Trash2, Loader2, Database } from "lucide-react";
import { cn } from "../../../lib/utils";

interface TabToolsProps {
  onResetViews: () => void;
  onResetAllMetrics: () => void;
  isResettingViews: boolean;
  isResettingAll: boolean;
  isDark: boolean;
}

export default function TabTools({
  onResetViews,
  onResetAllMetrics,
  isResettingViews,
  isResettingAll,
  isDark
}: TabToolsProps) {
  return (
    <div className="max-w-2xl animate-in slide-in-from-bottom-4 duration-500">
      <div className={cn(
        "p-6 md:p-10 rounded-[2rem] border-4 relative overflow-hidden",
        isDark ? "bg-gray-800 border-purple-500/30" : "bg-white border-snes-dark shadow-[8px_8px_0px_rgba(0,0,0,1)]"
      )}>
        <div className="relative z-10">
          <h3 className="font-retro text-xl md:text-3xl font-bold uppercase mb-4 flex items-center gap-3">
            <Wrench className="text-purple-500" /> Manutenção do Sistema
          </h3>
          <p className={cn("text-sm md:text-base mb-8 opacity-70 leading-relaxed", isDark ? "text-gray-300" : "text-gray-600")}>
            Utilize estas ferramentas para corrigir dados inflados ou realizar limpezas periódicas no banco de dados. 
            <strong className="block mt-2 text-red-500 uppercase text-xs font-retro">Atenção: Estas ações são permanentes.</strong>
          </p>

          <div className="space-y-6">
            {/* Reset de Views */}
            <div className={cn(
              "p-6 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-6",
              isDark ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-200"
            )}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                  <RefreshCcw size={24} className={cn(isResettingViews && "animate-spin")} />
                </div>
                <div>
                  <h4 className="font-retro text-sm font-bold uppercase">Resetar Visualizações</h4>
                  <p className="text-xs opacity-60">Recalcula visitas baseado nas curtidas reais.</p>
                </div>
              </div>
              
              <button
                onClick={onResetViews}
                disabled={isResettingViews}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-retro text-xs font-bold uppercase transition-all active:scale-95 disabled:opacity-50",
                  isDark 
                    ? "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/20" 
                    : "bg-black text-white hover:bg-gray-800 shadow-[4px_4px_0px_rgba(168,85,247,0.5)]"
                )}
              >
                {isResettingViews ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Processando...
                  </>
                ) : (
                  "Executar Reset"
                )}
              </button>
            </div>

            {/* Zerar Métricas */}
            <div className={cn(
              "p-6 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-6",
              isDark ? "bg-red-900/10 border-red-500/30" : "bg-red-50 border-red-200"
            )}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
                  <Trash2 size={24} className={cn(isResettingAll && "animate-pulse")} />
                </div>
                <div>
                  <h4 className="font-retro text-sm font-bold uppercase text-red-600">Zerar Engajamento</h4>
                  <p className="text-xs opacity-60">Zera Likes e Views de todos os artigos.</p>
                </div>
              </div>
              
              <button
                onClick={onResetAllMetrics}
                disabled={isResettingAll}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-retro text-xs font-bold uppercase transition-all active:scale-95 disabled:opacity-50",
                  "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20"
                )}
              >
                {isResettingAll ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Zerando...
                  </>
                ) : (
                  "Zerar Tudo"
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-yellow-500/10 border-2 border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-[10px] uppercase font-bold flex items-start gap-3">
              <Database size={14} className="mt-0.5 shrink-0" />
              <p>
                Dica: Rode este comando sempre que notar anomalias nos contadores. 
                Isso ajuda a manter o ranking da comunidade justo e realista.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-10 -right-10 opacity-5">
          <Database size={200} />
        </div>
      </div>
    </div>
  );
}
