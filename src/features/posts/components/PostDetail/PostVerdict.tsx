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
      "border-4 border-yellow-400 shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden",
      isDark ? "bg-gray-900" : "bg-snes-surface"
    )}>
      {/* Header da seção */}
      <div className="bg-yellow-400 px-5 py-2 flex items-center gap-3">
        <Star className="w-4 h-4 text-black" fill="currentColor" />
        <span className="font-retro font-bold text-xs md:text-sm uppercase tracking-widest text-black">
          Veredito da Redação
        </span>
      </div>

      {/* Corpo: nota + texto */}
      <div className="flex items-stretch">
        {/* Nota */}
        <div className="flex flex-col items-center justify-center px-6 md:px-10 py-5 bg-yellow-400 border-r-4 border-black shrink-0 gap-0.5">
          <span className="font-retro font-bold text-[10px] md:text-xs uppercase text-black/70 tracking-widest leading-none">Score</span>
          <span className="font-retro font-bold text-5xl md:text-7xl leading-none text-black">{post.score}</span>
          <span className="font-retro text-[9px] text-black/50 uppercase tracking-wider leading-none">/10</span>
        </div>

        {/* Texto do veredito */}
        <div className="flex items-center px-6 md:px-10 py-5 flex-1">
          <p className={cn(
            "font-retro font-bold text-sm md:text-lg uppercase tracking-wide leading-relaxed",
            isDark ? "text-gray-100" : "text-gray-800"
          )}>
            {post.verdict}
          </p>
        </div>
      </div>
    </div>
  );
}
