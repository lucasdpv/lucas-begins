import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { cn } from "../../../../lib/utils";

interface Chapter {
  id: string;
  label: string;
  minutes: number;
}

interface ChapterPillProps {
  headings: Chapter[];
  activeHeadingId: string;
  isVisible: boolean;
  isDark: boolean;
}

const RING_RADIUS = 12.5;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const SHEET_BG = "#13112a";

interface ChapterListProps {
  headings: Chapter[];
  activeIndex: number;
  totalMinutes: number;
  onSelect: (id: string) => void;
  listClassName?: string;
}

function ChapterList({ headings, activeIndex, totalMinutes, onSelect, listClassName }: ChapterListProps) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-4 px-[18px] pt-4 pb-3">
        <div>
          <span className="font-retro font-semibold italic text-[13px] tracking-[0.22em] uppercase text-slate-100">
            Sumário
          </span>
          <span className="block w-[22px] h-0.5 mt-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
        </div>
        <span className="font-mono text-[10.5px] text-slate-400 whitespace-nowrap">
          {headings.length} capítulos · {totalMinutes} min
        </span>
      </div>

      <ol className={cn("relative list-none m-0 px-2 pb-2 overflow-y-auto retro-scrollbar", listClassName)}>
        {headings.map((h, idx) => {
          const isActive = idx === activeIndex;
          const isRead = idx < activeIndex;
          const isLast = idx === headings.length - 1;
          return (
            <li key={h.id} className="relative">
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[17px] top-1/2 h-full w-px pointer-events-none",
                    isRead ? "bg-gradient-to-b from-purple-500 to-pink-500" : "bg-white/[0.08]"
                  )}
                />
              )}
              <button
                type="button"
                onClick={() => onSelect(h.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative w-full grid grid-cols-[18px_1fr_auto] items-center gap-3 py-2.5 pl-2 pr-2.5 rounded-xl text-left transition-colors cursor-pointer outline-none focus-visible:bg-white/[0.06]",
                  isActive ? "bg-purple-500/10" : "hover:bg-white/[0.04]"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "justify-self-center rounded-full border relative",
                    isActive
                      ? "w-[11px] h-[11px] bg-white border-white shadow-[0_0_0_4px_rgba(168,85,247,0.28)]"
                      : isRead
                      ? "w-[9px] h-[9px] bg-purple-500 border-purple-500"
                      : "w-[9px] h-[9px] border-white/25"
                  )}
                  style={!isActive && !isRead ? { background: SHEET_BG } : undefined}
                />
                <span className="flex flex-col gap-0.5 min-w-0">
                  <span
                    className={cn(
                      "font-mono text-[10px] tracking-[0.08em]",
                      isActive ? "text-purple-300" : "text-slate-500"
                    )}
                  >
                    {String(idx + 1).padStart(2, "0")}
                    {isActive && " · lendo agora"}
                  </span>
                  <span
                    className={cn(
                      "text-[13.5px] leading-snug font-medium [text-wrap:pretty]",
                      isActive ? "text-white" : isRead ? "text-slate-400" : "text-slate-300"
                    )}
                  >
                    {h.label}
                  </span>
                </span>
                <span className={cn("font-mono text-[10.5px] whitespace-nowrap", isRead ? "text-purple-300" : "text-slate-500")}>
                  {isRead ? "✓" : `${h.minutes} min`}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div
        aria-hidden="true"
        className="h-7 -mt-7 relative pointer-events-none"
        style={{ background: `linear-gradient(transparent, ${SHEET_BG})` }}
      />
    </>
  );
}

export default function ChapterPill({ headings, activeHeadingId, isVisible, isDark }: ChapterPillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pillAreaRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const activeIndex = Math.max(0, headings.findIndex((h) => h.id === activeHeadingId));
  const active = headings[activeIndex];
  const progress = (activeIndex + 1) / headings.length;
  const totalMinutes = headings.reduce((sum, h) => sum + h.minutes, 0);
  const remainingMinutes = headings.slice(activeIndex).reduce((sum, h) => sum + h.minutes, 0);

  useEffect(() => {
    if (!isVisible) setIsOpen(false);
  }, [isVisible]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (pillAreaRef.current?.contains(target) || sheetRef.current?.contains(target)) return;
      setIsOpen(false);
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

  const listProps = { headings, activeIndex, totalMinutes, onSelect: goTo };

  return createPortal(
    <>
      {/* Celular: folha que sobe do rodapé (fora do container animado para o `fixed` valer na tela) */}
      <AnimatePresence>
        {isVisible && isOpen && (
          <motion.div
            key="chapter-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden fixed inset-0 z-[58] bg-[#05040c]/60"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isVisible && isOpen && (
          <motion.nav
            key="chapter-sheet"
            ref={sheetRef}
            aria-label="Capítulos da matéria"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 500) setIsOpen(false);
            }}
            className="sm:hidden fixed inset-x-0 bottom-0 z-[59] rounded-t-[22px] border border-b-0 border-white/[0.08] shadow-[0_-20px_50px_rgba(0,0,0,0.6)]"
            style={{ background: SHEET_BG }}
          >
            <div
              className="pt-2.5 pb-0.5 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-9 h-1 rounded-full bg-white/20 mx-auto" />
            </div>
            <ChapterList {...listProps} listClassName="max-h-[52vh]" />
            {/* Espaço para a linha da pílula + botão Topo, que ficam por cima da folha */}
            <div style={{ height: "calc(74px + env(safe-area-inset-bottom, 0px))" }} />
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Pílula (todas as larguras) + painel flutuante (computador) */}
      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-x-0 bottom-0 z-[60] pointer-events-none flex justify-center items-end">
            <div className="layout-container relative flex justify-start items-end">
              <motion.div
                ref={pillAreaRef}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="pointer-events-auto relative mb-6 md:mb-8 w-[calc(100%-5.75rem)] sm:w-80"
              >
                <AnimatePresence>
                  {isOpen && (
                    <motion.nav
                      aria-label="Capítulos da matéria"
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="hidden sm:block absolute bottom-full left-0 mb-3 w-[22rem] origin-bottom-left rounded-[18px] border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.75)] overflow-hidden"
                      style={{ background: SHEET_BG }}
                    >
                      <ChapterList {...listProps} listClassName="max-h-[min(50vh,420px)]" />
                    </motion.nav>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => setIsOpen((o) => !o)}
                  aria-expanded={isOpen}
                  aria-label={`Capítulo ${activeIndex + 1} de ${headings.length}: ${active.label}. Ver sumário`}
                  className={cn(
                    "w-full flex items-center gap-2.5 pl-[5px] pr-3.5 py-[5px] rounded-full border backdrop-blur-xl transition-colors cursor-pointer select-none outline-none",
                    "shadow-[0_10px_26px_rgba(0,0,0,0.7),0_0_0_4px_rgba(168,85,247,0.12)] focus-visible:shadow-[0_10px_26px_rgba(0,0,0,0.7),0_0_0_4px_rgba(168,85,247,0.4)]",
                    isDark
                      ? "bg-[#13112a]/90 text-white border-purple-500/35 hover:border-purple-400/60"
                      : "bg-white/95 text-slate-900 border-slate-200 hover:border-purple-400",
                    isOpen && "border-purple-400/60"
                  )}
                >
                  <span className="relative w-[30px] h-[30px] shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 30 30" className="absolute inset-0 -rotate-90" aria-hidden="true">
                      <circle cx="15" cy="15" r={RING_RADIUS} fill="none" strokeWidth="2" className="stroke-purple-500/20" />
                      <circle
                        cx="15"
                        cy="15"
                        r={RING_RADIUS}
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="stroke-purple-300 transition-[stroke-dashoffset] duration-500 ease-out"
                        strokeDasharray={RING_LENGTH}
                        strokeDashoffset={RING_LENGTH * (1 - progress)}
                      />
                    </svg>
                    <span className="font-mono text-[9.5px] text-purple-300">
                      {String(activeIndex + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="flex flex-col gap-0.5 min-w-0 flex-1 text-left">
                    <span className="font-mono text-[9.5px] tracking-[0.04em] text-slate-400 leading-none">
                      {activeIndex + 1} de {headings.length} · ~{remainingMinutes} min
                      <span className="hidden sm:inline"> restantes</span>
                    </span>
                    <span className="text-[12.5px] font-medium truncate leading-tight">{active.label}</span>
                  </span>
                  <ChevronDown
                    className={cn("w-3.5 h-3.5 shrink-0 text-purple-300 transition-transform duration-200", !isOpen && "rotate-180")}
                  />
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
