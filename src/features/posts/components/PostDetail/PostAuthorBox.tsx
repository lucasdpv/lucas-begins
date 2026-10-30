import React from "react";
import Image from "next/image";
import { cn } from "../../../../lib/utils";

interface PostAuthorBoxProps {
  author: any;
  isDark: boolean;
}

export default function PostAuthorBox({ author, isDark }: PostAuthorBoxProps) {
  if (!author) return null;

  return (
    <section
      className={cn(
        "rounded-2xl border overflow-hidden group clear-both transition-all",
        isDark
          ? "bg-[#121024]/90 border-white/[0.08] text-slate-100 shadow-[0_18px_40px_-15px_rgba(0,0,0,0.7)]"
          : "bg-white border-slate-200/80 text-slate-900 shadow-md"
      )}
    >
      <div
        className={cn(
          "px-6 py-3 border-b flex items-center gap-2.5",
          isDark ? "border-white/[0.06] bg-white/[0.02]" : "border-slate-100 bg-purple-50/50"
        )}
      >
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        <span className="font-retro text-xs font-black uppercase tracking-widest text-purple-400">
          Escrito por
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-7 p-5 sm:p-6 md:p-8">
        <div className="flex items-center gap-4 sm:block">
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border border-purple-500/40 shadow-lg relative">
              {author.avatar && (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 64px, 80px"
                  unoptimized={true}
                />
              )}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full border border-amber-300 font-retro font-black text-[9px] sm:text-[10px] shadow-md z-10">
              LV.{author.level || 1}
            </div>
          </div>
          <h3 className="sm:hidden font-retro font-black text-base uppercase tracking-wide text-white leading-tight">
            {author.name}
          </h3>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="hidden sm:block font-retro font-black text-lg md:text-2xl uppercase tracking-wide text-white">
            {author.name}
          </h3>
          <p
            className={cn(
              "text-xs sm:text-sm md:text-base font-medium sm:mt-1.5 leading-relaxed article-paragraph",
              isDark ? "text-slate-300" : "text-slate-600"
            )}
          >
            {author.bio}
          </p>
        </div>
      </div>
    </section>
  );
}
