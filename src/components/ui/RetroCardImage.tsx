import React, { useState } from "react";
import Image from "next/image";
import { Gamepad2, Sparkles, Coffee, BookOpen, Star } from "lucide-react";
import { cn, isValidImageUrl } from "../../lib/utils";

export type CardTone = "orange" | "sky" | "amber" | "purple" | "default";

interface RetroCardImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  tone?: CardTone;
  imagePosition?: string;
  style?: React.CSSProperties;
}

const toneStyles: Record<
  CardTone,
  {
    gradient: string;
    shimmer: string;
    iconColor: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  orange: {
    gradient: "from-orange-950/50 via-amber-950/25 to-[#090812]",
    shimmer: "via-orange-400/10",
    iconColor: "text-orange-400/25",
    Icon: Coffee,
  },
  sky: {
    gradient: "from-sky-950/50 via-blue-950/25 to-[#090812]",
    shimmer: "via-sky-400/10",
    iconColor: "text-sky-400/25",
    Icon: BookOpen,
  },
  amber: {
    gradient: "from-amber-950/50 via-yellow-950/25 to-[#090812]",
    shimmer: "via-amber-400/10",
    iconColor: "text-amber-400/25",
    Icon: Star,
  },
  purple: {
    gradient: "from-purple-950/50 via-indigo-950/25 to-[#090812]",
    shimmer: "via-purple-400/10",
    iconColor: "text-purple-400/25",
    Icon: Gamepad2,
  },
  default: {
    gradient: "from-slate-900/60 via-purple-950/20 to-[#090812]",
    shimmer: "via-white/10",
    iconColor: "text-purple-400/20",
    Icon: Sparkles,
  },
};

export default function RetroCardImage({
  src,
  alt,
  fill = true,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className,
  priority = false,
  tone = "default",
  imagePosition,
  style,
}: RetroCardImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const currentTone = toneStyles[tone] || toneStyles.default;
  const ToneIcon = currentTone.Icon;
  const valid = src && isValidImageUrl(src) && !hasError;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* ── 1. SKELETON SHIMMER PLACEHOLDER (Ativo enquanto a imagem baixa) ── */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-700 ease-out z-0 flex items-center justify-center",
          currentTone.gradient,
          isLoaded && valid ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        {/* Shimmer sweep animation */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-transparent to-transparent animate-pulse",
            currentTone.shimmer
          )}
        />
        {/* Retro watermarked icon */}
        <ToneIcon className={cn("w-10 h-10 animate-pulse transition-transform", currentTone.iconColor)} />
      </div>

      {/* ── 2. NEXT.JS IMAGE COM FADE-IN ELEGANTE ── */}
      {valid && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          sizes={sizes}
          priority={priority}
          style={{
            objectPosition: imagePosition || "center",
            ...style,
          }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            "object-cover transition-all duration-700 ease-out",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]",
            className
          )}
        />
      )}

      {/* ── 3. FALLBACK SE A IMAGEM FALHAR TOTALMENTE ── */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-500 gap-1.5 p-3 text-center">
          <Gamepad2 className="w-6 h-6 opacity-40 text-purple-400" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Arte Indisponível</span>
        </div>
      )}
    </div>
  );
}

