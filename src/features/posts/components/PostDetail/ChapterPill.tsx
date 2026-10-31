import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../../lib/utils";

interface ChapterPillProps {
  headings: { id: string; label: string }[];
  activeHeadingId: string;
  isVisible: boolean;
  isDark: boolean;
}

const RING_RADIUS = 15;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export default function ChapterPill({ headings, activeHeadingId, isVisible, isDark }: ChapterPillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIndex = Math.max(0, headings.findIndex((h) => h.id === activeHeadingId));
  const active = headings[activeIndex];
  const progress = (activeIndex + 1) / headings.length;

  useEffect(() => {
    if (!isVisible) setIsOpen(false);
  }, [isVisible]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsOpen(false);
  };

  if (headings.length < 2 || !active || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-x-0 bottom-0 z-[60] pointer-events-none flex justify-center items-end">
          <div className="layout-container relative flex justify-start items-end">
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="pointer-events-auto relative mb-6 md:mb-8 max-w-[calc(100vw-9rem)] sm:max-w-sm"
            >
              <AnimatePresence>
                {isOpen && (
                  <motion.nav
                    aria-label="Capítulos da matéria"
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className={cn(
                      "absolute bottom-full left-0 mb-3 w-[min(22rem,calc(100vw-2rem))] origin-bottom-left rounded-2xl border p-2 backdrop-blur-2xl",
                      isDark
                        ? "bg-[#141226]/95 border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.85)]"
                        : "bg-white/95 border-slate-200 shadow-2xl"
                    )}
                  >
                    <p className="px-3 pt-2 pb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">
                      Capítulos
                    </p>
                    <ul className="max-h-[50vh] overflow-y-auto flex flex-col gap-1">
                      {headings.map((h, idx) => {
                        const isActive = idx === activeIndex;
                        const isRead = idx < activeIndex;
                        return (
                          <li key={h.id}>
                            <button
                              type="button"
                              onClick={() => goTo(h.id)}
                              aria-current={isActive ? "true" : undefined}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer",
                                isActive
                                  ? "bg-purple-600 text-white"
                                  : isDark
                                  ? "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                                  : "text-slate-700 hover:bg-purple-50"
                              )}
                            >
                              <span
                                className={cn(
                                  "font-mono text-[10px] font-black w-7 h-7 shrink-0 rounded-full flex items-center justify-center border",
                                  isActive
                                    ? "bg-white/20 border-white/30 text-white"
                                    : isRead
                                    ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                                    : isDark
                                    ? "border-white/10 text-slate-500"
                                    : "border-slate-200 text-slate-400"
                                )}
                              >
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                              <span className="font-retro text-[11px] font-bold uppercase tracking-wider leading-snug line-clamp-2">
                                {h.label}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.nav>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setIsOpen((o) => !o)}
                aria-expanded={isOpen}
                aria-label={`Capítulo ${activeIndex + 1} de ${headings.length}: ${active.label}. Ver capítulos`}
                className={cn(
                  "group w-full flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full border backdrop-blur-xl transition-all cursor-pointer select-none",
                  isDark
                    ? "bg-[#141226]/90 border-purple-500/40 text-white hover:border-purple-400 shadow-[0_14px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(168,85,247,0.3)]"
                    : "bg-white/95 border-slate-200 text-slate-900 hover:border-purple-400 shadow-lg",
                  isOpen && "border-purple-400"
                )}
              >
                <span className="relative w-9 h-9 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
                    <circle cx="18" cy="18" r={RING_RADIUS} fill="none" strokeWidth="3" className="stroke-purple-500/20" />
                    <circle
                      cx="18"
                      cy="18"
                      r={RING_RADIUS}
                      fill="none"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="stroke-purple-400 transition-[stroke-dashoffset] duration-500 ease-out"
                      strokeDasharray={RING_LENGTH}
                      strokeDashoffset={RING_LENGTH * (1 - progress)}
                    />
                  </svg>
                  <span className="font-mono text-[10px] font-black text-purple-300">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                </span>
                <span className="flex flex-col min-w-0 text-left">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-purple-400 leading-none">
                    Capítulo {activeIndex + 1} de {headings.length}
                  </span>
                  <span className="font-retro text-[11px] font-bold uppercase tracking-wider truncate mt-1 leading-none">
                    {active.label}
                  </span>
                </span>
                <ChevronUp
                  className={cn(
                    "w-4 h-4 shrink-0 text-purple-300 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
