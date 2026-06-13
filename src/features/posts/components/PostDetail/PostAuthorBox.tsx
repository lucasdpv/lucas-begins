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
    <section className={cn(
      "border-2 border-black rounded-none overflow-hidden group clear-both shadow-[6px_6px_0px_rgba(0,0,0,1)]",
      isDark ? "bg-[#1f1d35] text-gray-100" : "bg-white text-gray-900"
    )}>
      {/* Label topo */}
      <div className={cn(
        "px-5 py-2 border-b-2 border-black flex items-center gap-2",
        isDark ? "bg-purple-950/20" : "bg-purple-50"
      )}>
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        <span className="font-retro text-[10px] md:text-xs font-bold uppercase tracking-widest text-purple-500">
          Escrito por
        </span>
      </div>
      {/* Conteúdo */}
      <div className="flex items-center gap-5 md:gap-8 p-5 md:p-7">
        <div className="relative shrink-0">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-none overflow-hidden border-4 border-purple-600 shadow-[4px_4px_0px_rgba(0,0,0,1)] -rotate-2 group-hover:rotate-0 transition-transform relative">
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
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black px-2 py-0.5 rounded-none border-2 border-black font-retro font-bold text-[10px] shadow-[2px_2px_0px_rgba(0,0,0,1)] z-10">
            LV.{author.level || 1}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-retro font-bold text-base md:text-2xl uppercase tracking-wide truncate">
            {author.name}
          </h3>
          <p className={cn(
            "text-sm md:text-base font-medium mt-1 leading-snug line-clamp-2",
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            {author.bio}
          </p>
        </div>
      </div>
    </section>
  );
}
