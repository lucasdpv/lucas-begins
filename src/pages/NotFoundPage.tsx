import React, { useState, useEffect } from "react";
import { Terminal, Home, RotateCcw, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useThemeStore } from "../store/useThemeStore";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function NotFoundPage() {
  const { isDark } = useThemeStore();
  const [logs, setLogs] = useState<string[]>([]);
  const [showContent, setShowContent] = useState(false);

  const systemLogs = [
    "> INITIALIZING SYSTEM BOOT...",
    "> LOADING CORE KERNEL...",
    "> CHECKING MEMORY... 640KB OK",
    "> MOUNTING DISK... FAILED!",
    "> ERROR 0x0000404: LEVEL_NOT_FOUND",
    "> ATTEMPTING RECOVERY...",
    "> RECOVERY FAILED. THE PRINCESS IS IN ANOTHER CASTLE.",
    "> SYSTEM HALTED."
  ];

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < systemLogs.length) {
        setLogs(prev => [...prev, systemLogs[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowContent(true), 500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-left px-4">
      <Helmet>
        <title>ERROR 404 | System Corrupted</title>
      </Helmet>

      <div className={cn(
        "w-full max-w-3xl rounded-none border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] font-mono overflow-hidden flex flex-col",
        isDark ? "bg-black text-green-500" : "bg-[#1a1a1a] text-green-400"
      )}>
        {/* Barra de Título do Terminal */}
        <div className="bg-gray-800 border-b-4 border-black p-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 border border-black" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 border border-black" />
          <div className="w-3 h-3 rounded-full bg-green-500 border border-black" />
          <span className="text-[10px] text-gray-400 ml-2 font-retro uppercase">lucas_begins_os_v2.4.exe</span>
        </div>

        {/* Área de Logs */}
        <div className="p-6 md:p-10 space-y-2 min-h-[300px] relative">
          <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />
          
          <AnimatePresence>
            {logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "text-xs md:text-sm tracking-tighter",
                  log && (log.includes("ERROR") || log.includes("FAILED")) ? "text-red-500" : ""
                )}
              >
                {log}
              </motion.div>
            ))}
          </AnimatePresence>

          {showContent && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 pt-8 border-t-2 border-green-900/30"
            >
              <div className="flex items-center gap-4 mb-6">
                <AlertTriangle className="w-12 h-12 text-yellow-500 animate-pulse" />
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">GAME OVER</h1>
                  <p className="text-xs md:text-sm opacity-70">A fase que você procura foi deletada ou nunca existiu.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/"
                  className="flex items-center justify-center gap-3 p-4 bg-green-500 text-black font-bold uppercase text-sm hover:bg-green-400 transition-colors border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"
                >
                  <Home size={18} /> {">"} GOTO_HOME
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center justify-center gap-3 p-4 bg-gray-700 text-white font-bold uppercase text-sm hover:bg-gray-600 transition-colors border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"
                >
                  <RotateCcw size={18} /> {">"} REBOOT_SYSTEM
                </button>
              </div>
            </motion.div>
          )}

          {/* Cursor Piscando */}
          {!showContent && <span className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-1" />}
        </div>

        {/* Footer do Terminal */}
        <div className="bg-gray-800/50 p-2 text-[9px] uppercase font-bold flex justify-between px-4">
          <span>Status: Critical_Error</span>
          <span>C:\SYS\LEVELS\404.DAT</span>
        </div>
      </div>

      <p className="mt-8 text-[10px] font-retro uppercase font-bold opacity-30 animate-pulse">
        Press any key to (do nothing)
      </p>
    </div>
  );
}
