import React from "react";
import { cn } from "../../../../lib/utils";
import { CategoryBadge, ScoreBadge } from "../../../../components/ui/Badge";
import { Post } from "../../schemas";

interface PostHeroProps {
  post: Post;
  imgError: boolean;
  heroStyle: React.CSSProperties;
}

export default function PostHero({ post, imgError, heroStyle }: PostHeroProps) {
  return (
    <div
      className={cn(
        "w-full h-[350px] md:h-[550px] rounded-3xl relative overflow-hidden flex items-center justify-center border-2 border-black dark:border-purple-500/15 shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_rgba(168,85,247,0.15)] glass-card",
        (!post.imageUrl || imgError) && `bg-gradient-to-br ${(post as any).gradient || 'from-gray-900 to-purple-900'}`
      )}
      style={heroStyle}
    >
      {imgError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10 bg-black/60">
          <div className="text-red-500 font-retro text-2xl md:text-4xl mb-4 animate-pulse border-2 border-red-500 px-6 py-2 rounded bg-black/80">
            ⚠️ DATA_CORRUPTION_DETECTED
          </div>
          <p className="font-retro text-sm md:text-lg uppercase tracking-widest text-gray-300 max-w-2xl leading-relaxed">
            A transmissão de alta fidelidade do setor {post.category} foi interrompida. 
            Nossos técnicos estão recalibrando os lasers de projeção.
          </p>
        </div>
      )}
      <div className="absolute inset-0 scanline-overlay opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent z-[5]" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 text-white w-full z-[10] pointer-events-none text-center md:text-left">
        <div className="flex flex-row flex-wrap justify-center md:justify-start items-center gap-3 mb-4 md:mb-6 pointer-events-auto">
          <CategoryBadge size="md" className="shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-black">
            {post.category}
          </CategoryBadge>
          {post.score && (
            <ScoreBadge score={post.score} size="md" className="shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-black shrink-0" />
          )}
        </div>
        <h1 className="font-retro font-bold text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-snug md:leading-tight text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-glow tracking-tight">
          {post.title}
        </h1>
      </div>
    </div>
  );
}
