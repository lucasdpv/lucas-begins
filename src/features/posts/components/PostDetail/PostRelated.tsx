import React from "react";
import { Link } from "@/lib/router-compat";
import { Star } from "lucide-react";
import { cn, slugify } from "../../../../lib/utils";
import { Post } from "../../schemas";

interface PostRelatedProps {
  posts: Post[];
  currentPostId: string;
  isDark: boolean;
  isPreview?: boolean;
}

export default function PostRelated({ posts, currentPostId, isDark, isPreview = false }: PostRelatedProps) {
  const related = [...posts]
    .filter((p) => p.id !== currentPostId && !p.isDraft)
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="space-y-12">
      {/* Separador retro */}
      <div className="flex items-center gap-4 py-2">
        <span className={cn("flex-1 border-t-4 border-dashed", isDark ? "border-gray-700" : "border-gray-300")} />
        <span className={cn(
          "font-retro text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 border-2 shrink-0",
          isDark ? "border-gray-700 text-gray-600 bg-gray-900" : "border-gray-300 text-gray-400 bg-white"
        )}>
          ● ● ●
        </span>
        <span className={cn("flex-1 border-t-4 border-dashed", isDark ? "border-gray-700" : "border-gray-300")} />
      </div>

      <section>
        <h3 className={cn("font-retro font-bold text-xl md:text-2xl uppercase mb-6 md:mb-8 flex items-center gap-3", isDark ? "text-purple-400" : "text-purple-600")}>
          <Star className="w-5 h-5 md:w-7 md:h-7 text-yellow-500" fill="currentColor" />
          Próximas Fases
          <span className={cn("font-retro text-[10px] md:text-xs font-bold uppercase tracking-widest ml-1 px-2 py-0.5 border", isDark ? "border-purple-700 text-purple-600" : "border-purple-300 text-purple-400")}>
            Recomendados
          </span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {related.map((p) => (
            <Link 
              to={isPreview ? "#" : `/post/${p.slug || slugify(p.title)}`} 
              key={p.id} 
              className={cn("block group", isPreview && "cursor-default opacity-50 grayscale")}
              onClick={(e: React.MouseEvent) => isPreview && e.preventDefault()}
            >
              <div
                className={cn(
                  "h-36 md:h-40 w-full mb-3 bg-cover bg-center border-2 border-black rounded-none overflow-hidden shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all duration-300",
                  !isPreview && "group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_rgba(168,85,247,1)] group-hover:border-black",
                  !p.imageUrl && `bg-gradient-to-br ${(p as any).gradient || 'from-gray-900 to-purple-900'}`
                )}
                style={p.imageUrl ? { backgroundImage: `url(${p.imageUrl})` } : {}}
              >
                <div className="w-full h-full bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              <h4 className="font-retro font-bold text-xs md:text-sm uppercase group-hover:text-purple-500 transition-colors line-clamp-2 leading-snug">
                {p.title}
              </h4>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
