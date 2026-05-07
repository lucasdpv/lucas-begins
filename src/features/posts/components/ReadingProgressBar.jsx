import React, { useState, useEffect } from "react";
import { cn } from "../../../lib/utils";

export default function ReadingProgressBar({ isDark, targetSelector = "article" }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const element = document.querySelector(targetSelector);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Quando o topo do elemento entra na tela, começamos
      // Quando o fundo do elemento sai da tela, terminamos
      const totalHeight = element.clientHeight;
      const progressValue = Math.max(0, Math.min(100, ((-rect.top) / (totalHeight - windowHeight)) * 100));
      
      setProgress(progressValue);
    };

    window.addEventListener("scroll", updateProgress);
    // Chama uma vez para inicializar
    updateProgress();
    
    return () => window.removeEventListener("scroll", updateProgress);
  }, [targetSelector]);

  // Se o progresso for 0 ou 100, podemos esconder ou manter sutil
  if (progress <= 0) return null;

  return (
    <div className="fixed top-20 left-0 w-full z-[45] px-4 pointer-events-none animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto flex flex-col items-end">
        {/* Label Retro */}
        <div className={cn(
          "mb-1 px-3 py-0.5 rounded-t-lg font-retro text-[10px] font-bold uppercase tracking-widest border-2 border-b-0 border-black shadow-[2px_0px_0px_rgba(0,0,0,1)] transition-colors",
          isDark ? "bg-purple-600 text-white" : "bg-purple-500 text-white"
        )}>
          {progress >= 100 ? "Article Completed!" : `Reading: ${Math.round(progress)}%`}
        </div>
        
        {/* Container da Barra */}
        <div className={cn(
          "w-48 md:w-64 h-5 border-4 border-black rounded-sm overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-black/20 backdrop-blur-sm",
          isDark ? "bg-gray-900" : "bg-gray-200"
        )}>
          {/* A Barra de Energia em si */}
          <div 
            className={cn(
              "h-full transition-all duration-150 ease-out relative overflow-hidden",
              progress >= 100 ? "bg-blue-500" : progress > 70 ? "bg-green-500" : progress > 30 ? "bg-yellow-400" : "bg-red-500"
            )}
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0 left-0 w-full h-[30%] bg-white/30" />
            <div className="absolute bottom-0 left-0 w-full h-[20%] bg-black/20" />
            <div className="absolute inset-0 scanline-overlay opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
