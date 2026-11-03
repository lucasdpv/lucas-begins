import Image from "next/image";
import { cn, splitTitle } from "../../../../lib/utils";
import { CategoryBadge, ScoreBadge } from "../../../../components/ui/Badge";
import { Post } from "../../schemas";

interface PostHeroProps {
  post: Post;
  imgError: boolean;
  onImageError?: () => void;
}

export default function PostHero({ post, imgError, onImageError }: PostHeroProps) {
  const { mainTitle, subtitle } = splitTitle(post.title);

  const aspectClass =
    post.imageAspect === "1:1"
      ? "aspect-square max-w-2xl mx-auto w-full"
      : post.imageAspect === "4:5"
      ? "aspect-[4/5] max-w-xl mx-auto w-full"
      : post.imageAspect === "16:9"
      ? "aspect-video w-full max-h-[560px]"
      : "h-[360px] md:h-[560px] w-full";

  return (
    <div className={cn("relative", aspectClass)}>
      <div
        className={cn(
          "w-full h-full rounded-2xl md:rounded-3xl relative overflow-hidden flex items-center justify-center border border-white/[0.1] shadow-[0_28px_70px_-15px_rgba(0,0,0,0.85)] bg-[#090812] transform-gpu",
          (!post.imageUrl || imgError) &&
            `bg-gradient-to-br ${(post as any).gradient || "from-slate-900 to-purple-950"}`
        )}
      >
        {post.imageUrl && !imgError && (
          <Image
            src={post.imageUrl}
            alt={post.title}
            className="object-cover"
            style={{ objectPosition: post.imagePosition || "center" }}
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1280px"
            onError={onImageError}
          />
        )}

        {imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10 bg-black/60">
            <div className="text-rose-400 font-retro text-xl md:text-3xl mb-4 animate-pulse border border-rose-500/40 px-6 py-2 rounded-2xl bg-black/80">
              ⚠️ SINAL INTERROMPIDO
            </div>
            <p className="font-retro text-sm md:text-base uppercase tracking-widest text-slate-300 max-w-2xl leading-relaxed">
              A transmissão do setor {post.category} está sendo recalibrada.
            </p>
          </div>
        )}

        <div className="absolute -inset-px bg-gradient-to-t from-[#090812] via-[#090812]/55 to-transparent z-[5]" />
        <div className="absolute -inset-px bg-gradient-to-r from-[#090812]/70 via-transparent to-transparent z-[5]" />

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 text-white w-full z-[10] pointer-events-none text-left">
          <div className="flex flex-row flex-wrap justify-start items-center gap-2.5 mb-3 md:mb-5 pointer-events-auto">
            <CategoryBadge size="md" className="rounded-full px-3.5 py-1 border-white/15 backdrop-blur-md">
              {post.category}
            </CategoryBadge>
            {post.score && (
              <ScoreBadge score={post.score} size="md" className="rounded-full shrink-0" />
            )}
          </div>
          {mainTitle ? (
            <div className="flex flex-col gap-1 md:gap-2">
              <h1 className="font-retro font-black text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] tracking-tight">
                {mainTitle}
              </h1>
              <span
                className={cn(
                  "font-sans text-sm sm:text-lg md:text-xl leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] font-semibold",
                  (() => {
                    const cat = post.category.toLowerCase();
                    if (cat.includes("review")) return "text-amber-300";
                    if (cat.includes("dossi")) return "text-sky-300";
                    if (cat.includes("retro")) return "text-orange-300";
                    if (cat.includes("anime") || cat.includes("nostalgia")) return "text-pink-300";
                    if (cat.includes("pop") || cat.includes("cultura")) return "text-emerald-300";
                    if (cat.includes("rpg") || cat.includes("mmo")) return "text-cyan-300";
                    return "text-purple-300";
                  })()
                )}
              >
                {subtitle}
              </span>
            </div>
          ) : (
            <h1 className="font-retro font-black text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] tracking-tight">
              {subtitle}
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}
