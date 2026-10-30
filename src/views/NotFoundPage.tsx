import React, { useState, useEffect } from "react";
import { Home, RotateCcw, AlertTriangle } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function NotFoundPage() {
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
    "> SYSTEM HALTED.",
  ];

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < systemLogs.length) {
        setLogs((prev) => [...prev, systemLogs[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowContent(true), 400);
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-left px-4 py-10">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0d0b1a]/95 shadow-[0_28px_70px_rgba(0,0,0,0.85)] font-mono overflow-hidden flex flex-col backdrop-blur-2xl">
        {/* Barra de Título do Terminal */}
        <div className="bg-white/[0.04] border-b border-white/[0.08] px-4 py-3 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-[11px] text-slate-400 ml-2 font-retro uppercase tracking-widest">
            begins_os_v5.1.exe
          </span>
        </div>

        {/* Área de Logs */}
        <div className="p-6 md:p-10 space-y-2 min-h-[280px] relative text-emerald-400">
          <AnimatePresence>
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "text-xs md:text-sm tracking-tight",
                  log && (log.includes("ERROR") || log.includes("FAILED")) ? "text-rose-400" : ""
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
              className="mt-8 pt-8 border-t border-white/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-8 h-8 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <h1 className="font-retro text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                    404 · Fase Não Encontrada
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">
                    A página que você procura foi movida ou nunca existiu no catálogo.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/"
                  className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-retro font-black uppercase text-xs tracking-widest transition-all border border-purple-400/50 shadow-[0_10px_25px_rgba(168,85,247,0.4)]"
                >
                  <Home size={17} /> Voltar ao Início
                </Link>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 font-retro font-black uppercase text-xs tracking-widest transition-all border border-white/10"
                >
                  <RotateCcw size={17} /> Recarregar Sistema
                </button>
              </div>
            </motion.div>
          )}

          {!showContent && <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1" />}
        </div>

        {/* Footer do Terminal */}
        <div className="bg-white/[0.02] border-t border-white/[0.06] py-2.5 px-5 text-[10px] uppercase font-mono text-slate-500 flex justify-between">
          <span>Status: Error_404</span>
          <span>SYS://CATALOG/404</span>
        </div>
      </div>
    </div>
  );
}
