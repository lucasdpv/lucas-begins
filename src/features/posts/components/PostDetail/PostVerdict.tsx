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
    <section
      className={cn(
        "rounded-2xl border overflow-hidden my-8 transition-all clear-both",
        isDark
          ? "bg-[#121024]/90 border-amber-500/25 text-slate-100 shadow-[0_18px_40px_-15px_rgba(0,0,0,0.75)]"
          : "bg-white border-amber-200 text-slate-900 shadow-md"
      )}
    >
      {/* Cabeçalho limpo e direto */}
      <div
        className={cn(
          "px-6 py-3 border-b flex items-center gap-2",
          isDark ? "border-white/[0.06] bg-amber-500/10" : "border-amber-100 bg-amber-50"
        )}
      >
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span className="font-retro text-xs font-black uppercase tracking-widest text-amber-400">
          Veredito Oficial Begins
        </span>
      </div>

      <div className="p-6 sm:p-8 flow-root">
        {/* Nota em destaque à direita: formato quadrado, número protagonista e selo /10 na quina */}
        <div className="float-right ml-4 mb-3 sm:ml-6 sm:mb-4 select-none relative">
          <div
            className={cn(
              "w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center border transition-all",
              isDark
                ? "bg-amber-400/10 border-amber-400/30 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.15)]"
                : "bg-amber-50 border-amber-200 text-amber-600 shadow-sm"
            )}
          >
            <span className="font-retro font-black text-4xl sm:text-5xl leading-none text-amber-400">
              {post.score}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-retro font-black text-[11px] sm:text-xs shadow-md z-10">
            /10
          </div>
        </div>

        {/* Texto fluindo naturalmente ao redor da nota */}
        {post.verdict && (
          <p
            className={cn(
              "text-[15px] sm:text-base md:text-lg font-medium leading-relaxed italic article-paragraph m-0",
              isDark ? "text-slate-200" : "text-slate-700"
            )}
          >
            "{post.verdict}"
          </p>
        )}
      </div>
    </section>
  );
}
