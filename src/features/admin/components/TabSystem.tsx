import React, { useState } from "react";
import { RefreshCw, RotateCcw, BarChart2 } from "lucide-react";
import { PostService } from "../../../services/postService";
import { useUIStore } from "../../../store/useUIStore";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "../../../lib/utils";

interface TabSystemProps {
  isDark: boolean;
}

export default function TabSystem({ isDark }: TabSystemProps) {
  const { showToast } = useUIStore();
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isNormalizing, setIsNormalizing] = useState(false);

  const handleSyncComments = async () => {
    setIsSyncing(true);
    try {
      await PostService.syncAllCommentsCounts();
      showToast("Comentários sincronizados com sucesso! 🎮");
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    } catch (err) {
      showToast("Erro ao sincronizar comentários.", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResetMetrics = async () => {
    if (!window.confirm("Deseja realmente ZERAR as métricas (likes, views, favorites) de TODOS os posts? Essa ação não pode ser desfeita.")) {
      return;
    }
    setIsResetting(true);
    try {
      await PostService.resetAllMetrics();
      showToast("Métricas zeradas com sucesso! 🗑️");
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (err) {
      showToast("Erro ao zerar métricas.", "error");
    } finally {
      setIsResetting(false);
    }
  };

  const handleNormalizeViews = async () => {
    if (!window.confirm("Deseja normalizar as visualizações de todos os posts? Isso gerará métricas aleatórias baseadas nos likes.")) {
      return;
    }
    setIsNormalizing(true);
    try {
      await PostService.normalizeAllPostViews();
      showToast("Visualizações normalizadas com sucesso! 📈");
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (err) {
      showToast("Erro ao normalizar visualizações.", "error");
    } finally {
      setIsNormalizing(false);
    }
  };

  const toolCardClass = cn(
    "p-6 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-full relative overflow-hidden",
    isDark ? "bg-[#1f1d35] text-white" : "bg-white text-gray-900"
  );

  const buttonClass = (colorClass: string) => cn(
    "w-full group flex items-center justify-center gap-3 px-6 py-3.5 border-4 border-black font-retro text-sm font-bold uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-black",
    colorClass
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 1. Sincronizar Comentários */}
        <div className={toolCardClass}>
          <div>
            <h4 className="font-retro text-lg font-bold uppercase mb-3 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-purple-500" /> Sincronizar Comentários
            </h4>
            <p className="text-xs opacity-75 leading-relaxed mb-6">
              Recalcula as contagens de comentários de todos os posts e usuários no Firestore com base nos dados reais existentes. Útil para corrigir dados legados ou inconsistências.
            </p>
          </div>
          <button
            onClick={handleSyncComments}
            disabled={isSyncing || isResetting || isNormalizing}
            className={buttonClass("bg-yellow-400 hover:bg-yellow-350")}
          >
            <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
            {isSyncing ? "Sincronizando..." : "Sincronizar"}
          </button>
        </div>

        {/* 2. Normalizar Visualizações */}
        <div className={toolCardClass}>
          <div>
            <h4 className="font-retro text-lg font-bold uppercase mb-3 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-500" /> Normalizar Visualizações
            </h4>
            <p className="text-xs opacity-75 leading-relaxed mb-6">
              Gera contagens de visualizações coerentes para todos os posts cadastrados (baseados nos likes + um fator aleatório), deixando as listagens com dados mais reais para demonstração.
            </p>
          </div>
          <button
            onClick={handleNormalizeViews}
            disabled={isSyncing || isResetting || isNormalizing}
            className={buttonClass("bg-blue-400 hover:bg-blue-350")}
          >
            <BarChart2 className={cn("w-4 h-4", isNormalizing && "animate-spin")} />
            {isNormalizing ? "Processando..." : "Normalizar"}
          </button>
        </div>

        {/* 3. Zerar Métricas */}
        <div className={toolCardClass}>
          <div>
            <h4 className="font-retro text-lg font-bold uppercase mb-3 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-red-500" /> Resetar Métricas
            </h4>
            <p className="text-xs opacity-75 leading-relaxed mb-6">
              Zera todas as estatísticas de likes, views, e favoritos de todos os posts do blog no banco de dados. Atenção: Esta ação é destrutiva e não pode ser desfeita!
            </p>
          </div>
          <button
            onClick={handleResetMetrics}
            disabled={isSyncing || isResetting || isNormalizing}
            className={buttonClass("bg-red-500 hover:bg-red-450 !text-white")}
          >
            <RotateCcw className={cn("w-4 h-4", isResetting && "animate-spin")} />
            {isResetting ? "Limpando..." : "Zerar Tudo"}
          </button>
        </div>
      </div>
    </div>
  );
}
