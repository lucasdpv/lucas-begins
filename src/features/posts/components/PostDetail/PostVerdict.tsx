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
    <section className={cn(
      "border-2 overflow-hidden group clear-both",
      isDark ? "bg-gray-800/40 border-yellow-500/20" : "bg-snes-input border-snes-dark/10"
    )}>
      {/* Label topo */}
      <div className={cn(
        "px-5 py-2 border-b-2 flex items-center gap-2",
        isDark ? "border-yellow-500/20 bg-yellow-500/5" : "border-snes-dark/10 bg-yellow-50"
      )}>
        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
        <span className="font-retro text-[10px] md:text-xs font-bold uppercase tracking-widest text-yellow-500">
          Veredito da Redação
        </span>
      </div>

      {/* Conteúdo */}
      <div className="flex items-center gap-5 md:gap-8 p-5 md:p-7">
        <div className="relative shrink-0">
          <div className={cn(
            "w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] -rotate-2 group-hover:rotate-0 transition-transform flex flex-col items-center justify-center select-none",
            isDark
              ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
              : "border-yellow-600 bg-yellow-50 text-yellow-600"
          )}>
            <span className="font-retro font-black text-2xl md:text-4xl leading-none">
              {post.score}
            </span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black px-2 py-0.5 rounded-lg border-2 border-black font-retro font-bold text-[10px] shadow-[2px_2px_0px_rgba(0,0,0,1)] z-10">
            /10
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm md:text-base font-medium leading-snug italic",
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            "{post.verdict}"
          </p>
        </div>
      </div>
    </section>
  );
}
