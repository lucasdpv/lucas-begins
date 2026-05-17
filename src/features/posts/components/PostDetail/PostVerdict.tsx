import React from "react";
import { Star } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { Post } from "../../schemas";

interface PostVerdictProps {
  post: Post;
  isDark: boolean;
}

export default function PostVerdict({ post, isDark }: PostVerdictProps) {
  if (!post.score) return null;

  return (
    <div className={cn(
      "border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden clear-both",
      isDark ? "bg-gray-900" : "bg-snes-surface"
    )}>
      {/* Header da seção */}
      <div className="bg-yellow-400 px-5 py-2.5 flex items-center gap-3 border-b-4 border-black">
        <Star className="w-5 h-5 text-black" fill="currentColor" />
        <span className="font-retro font-black text-xs md:text-sm uppercase tracking-widest text-black">
          Veredito da Redação
        </span>
      </div>

      {/* Corpo: nota + texto */}
      <div className="flex items-stretch">
        {/* Nota */}
        <div className="flex flex-col items-center justify-center px-6 md:px-10 py-6 bg-yellow-400 border-r-4 border-black shrink-0">
          <span className="font-retro font-black text-[9px] md:text-[10px] uppercase text-yellow-400 bg-black px-2 py-0.5 rounded-none tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,0.15)] select-none">
            SCORE
          </span>
          <div className="flex items-baseline gap-0.5 mt-2.5">
            <span className="font-retro font-black text-5xl md:text-7xl leading-none text-black tracking-tighter">
              {post.score}
            </span>
            <span className="font-retro font-black text-base md:text-xl text-black/95 select-none">
              /10
            </span>
          </div>
        </div>

        {/* Texto do veredito */}
        <div className={cn("flex items-center px-6 md:px-10 py-5 flex-1", isDark ? "bg-yellow-500/5" : "bg-yellow-500/10")}>
          <p className={cn(
            "font-retro font-black text-sm md:text-lg uppercase tracking-wide leading-relaxed",
            isDark ? "text-yellow-300 text-glow-retro" : "text-black"
          )}>
            {post.verdict}
          </p>
        </div>
      </div>
    </div>
  );
}
