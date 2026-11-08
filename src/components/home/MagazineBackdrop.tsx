import type { CSSProperties } from "react";

const TONES = {
  orange: {
    glow: "rgba(249,115,22,0.12)",
    dot: "rgba(249,115,22,0.28)",
    bar: "#f97316",
  },
  amber: {
    glow: "rgba(245,158,11,0.12)",
    dot: "rgba(245,158,11,0.28)",
    bar: "#f59e0b",
  },
  sky: {
    glow: "rgba(56,189,248,0.12)",
    dot: "rgba(56,189,248,0.28)",
    bar: "#38bdf8",
  },
} as const;

interface MagazineBackdropProps {
  tone: keyof typeof TONES;
}

// Fundo das seções editoriais da Home inspirado nas revistas de games dos anos 90.
// Camada única estática (sem mask-image composto nem blur) para rolagem a 60/120 FPS em GPUs integradas.
export default function MagazineBackdrop({ tone }: MagazineBackdropProps) {
  const colors = TONES[tone];
  const vars = { "--mag-dot": colors.dot } as CSSProperties;

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden" style={vars}>
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse 60% 75% at 100% 0%, ${colors.glow}, transparent 70%)` }}
      />
      <div className="mag-halftone absolute top-0 right-0 w-72 h-56 pointer-events-none" />
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: `linear-gradient(90deg, ${colors.bar}, ${colors.bar}66 45%, transparent 85%)` }}
      />
    </div>
  );
}
