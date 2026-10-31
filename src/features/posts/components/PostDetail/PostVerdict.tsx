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
        "rounded-2xl border overflow-hidden group clear-both transition-all",
        isDark
          ? "bg-[#121024]/90 border-amber-500/25 text-slate-100 shadow-[0_18px_40px_-15px_rgba(0,0,0,0.75)]"
          : "bg-white border-amber-200 text-slate-900 shadow-md"
      )}
    >
      <div
        className={cn(
          "px-6 py-3 border-b flex items-center gap-2.5",
          isDark ? "border-white/[0.06] bg-amber-500/10" : "border-amber-100 bg-amber-50"
        )}
      >
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span className="font-retro text-xs font-black uppercase tracking-widest text-amber-400">
          Veredito Oficial Begins
        </span>
      </div>

      <div className="flex items-start sm:items-center gap-4 sm:gap-6 md:gap-8 p-5 sm:p-6 md:p-8">
        <div className="relative shrink-0">
          <div className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] md:w-[5.5rem] md:h-[5.5rem] rounded-2xl overflow-hidden border border-amber-400/50 bg-gradient-to-br from-amber-400/20 to-amber-600/10 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center select-none p-3 sm:p-4">
            <span className="font-retro font-black text-2xl sm:text-3xl md:text-4xl leading-none">
              {post.score}
            </span>
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-retro font-black text-[9px] sm:text-[10px] shadow-md z-10">
            /10
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-xs sm:text-base md:text-lg font-medium leading-relaxed italic article-paragraph",
              isDark ? "text-slate-200" : "text-slate-700"
            )}
          >
            "{post.verdict}"
          </p>
        </div>
      </div>
    </section>
  );
}
