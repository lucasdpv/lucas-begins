import React, { useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";
import { Sparkles, RefreshCw } from "lucide-react";
import { cn, slugify } from "../../../../lib/utils";
import { Post } from "../../schemas";

interface PostRelatedProps {
  posts: Post[];
  currentPostId: string;
  currentCategory?: string;
  isDark: boolean;
  isPreview?: boolean;
}

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededShuffle<T>(items: T[], seedStr: string): T[] {
  const arr = [...items];
  let seed = hashSeed(seedStr) || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PostRelated({
  posts,
  currentPostId,
  currentCategory,
  isDark,
  isPreview = false,
}: PostRelatedProps) {
  const [shuffleStep, setShuffleStep] = useState(0);

  const validPosts = useMemo(
    () => posts.filter((p) => p && p.id !== currentPostId && !p.isDraft),
    [posts, currentPostId]
  );

  const related = useMemo(() => {
    if (validPosts.length === 0) return [];

    const seedKey = `${currentPostId || "default"}-${shuffleStep}`;
    const sameCategory = validPosts.filter(
      (p) =>
        currentCategory &&
        p.category?.toLowerCase() === currentCategory.toLowerCase()
    );
    const otherCategories = validPosts.filter(
      (p) =>
        !currentCategory ||
        p.category?.toLowerCase() !== currentCategory.toLowerCase()
    );

    const shuffledSame = seededShuffle(sameCategory, `${seedKey}-same`);
    const shuffledOthers = seededShuffle(otherCategories, `${seedKey}-other`);

    // No passo inicial (0), prioriza até 2 da mesma categoria + 1 de outra categoria para variedade.
    // Ao clicar em "Trocar sugestões", embaralha todo o catálogo disponível de forma dinâmica.
    if (shuffleStep === 0 && shuffledSame.length > 0) {
      const combined = [
        ...shuffledSame.slice(0, 2),
        ...shuffledOthers,
        ...shuffledSame.slice(2),
      ];
      return combined.slice(0, 3);
    }

    return seededShuffle(validPosts, `${seedKey}-all`).slice(0, 3);
  }, [validPosts, currentPostId, currentCategory, shuffleStep]);

  if (related.length === 0) return null;

  return (
    <div className="space-y-10 pt-6 border-t border-white/[0.08]">
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-retro font-black text-xl md:text-2xl uppercase tracking-wide text-white leading-none">
                Continue Explorando
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400 mt-1">
                Recomendações dinâmicas por universo & catálogo
              </p>
            </div>
          </div>

          {validPosts.length > 3 && !isPreview && (
            <button
              type="button"
              onClick={() => setShuffleStep((s) => s + 1)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[10px] font-retro font-black uppercase tracking-widest bg-white/[0.04] hover:bg-purple-500/15 text-slate-300 hover:text-purple-300 border border-white/[0.08] hover:border-purple-500/40 transition-all cursor-pointer active:scale-95 group/refresh"
              title="Sortear novas matérias recomendadas"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-400 transition-transform duration-500 group-hover/refresh:rotate-180" />
              Outras Sugestões
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {related.map((p) => (
            <Link
              to={isPreview ? "#" : `/post/${p.slug || slugify(p.title)}`}
              key={p.id}
              className={cn(
                "group rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col hover:-translate-y-1.5",
                isDark
                  ? "bg-[#121024]/90 border-white/[0.08] hover:border-purple-500/50 shadow-[0_14px_34px_-12px_rgba(0,0,0,0.75)]"
                  : "bg-white border-slate-200 hover:border-purple-400 shadow-sm",
                isPreview && "cursor-default opacity-50 grayscale"
              )}
              onClick={(e: React.MouseEvent) => isPreview && e.preventDefault()}
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-[#181336] to-[#090812]" />
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="relative z-[1] w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                ) : null}
                <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#121024] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 z-[3] px-2.5 py-0.5 rounded-full text-[9px] font-retro font-bold uppercase tracking-wider bg-black/60 text-purple-300 border border-white/10 backdrop-blur-md">
                  {p.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h4 className="font-retro font-bold text-sm uppercase text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug">
                  {p.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
