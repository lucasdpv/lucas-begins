import React, { useRef } from "react";
import Image from "next/image";
import { Link } from "@/lib/router-compat";
import { ChevronRight, ChevronLeft, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Post } from "../schemas";
import { cn, slugify, calculateReadingTime, splitTitle } from "../../../lib/utils";
import { CategoryBadge, ScoreBadge } from "../../../components/ui/Badge";

interface CategoryRowProps {
  title: string;
  subtitle?: string;
  category: string;
  posts: Post[];
  accentClass?: string;
  glowClass?: string;
  isDark?: boolean;
}

export default function CategoryRow({
  title,
  subtitle,
  category,
  posts,
  accentClass = "bg-purple-500",
  glowClass = "shadow-[0_0_12px_rgba(168,85,247,0.8)]",
  isDark = true,
}: CategoryRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const categoryPosts = posts.filter((p) => {
    if (p.isDraft) return false;
    const normalize = (cat: string) => 
      cat.toLowerCase()
         .normalize("NFD")
         .replace(/[\u0300-\u036f]/g, "")
         .replace(/s$/, "");
    return normalize(p.category) === normalize(category);
  });

  if (categoryPosts.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.85;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="relative group/row">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={cn("w-1.5 h-8 rounded-full", accentClass, glowClass)} />
          <div>
            <h2 className="font-retro text-2xl md:text-3xl font-black uppercase tracking-tight text-glow leading-none">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mt-1 pl-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <Link
          to={`/category/${category}`}
          className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-purple-500/50 transition-all text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white"
        >
          Ver Todos <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Scroll Nav Buttons (desktop) */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-[-20px] top-1/2 translate-y-3 z-20 p-2.5 rounded-full bg-black/70 border border-white/10 opacity-0 group-hover/row:opacity-100 transition-all hover:scale-110 hidden lg:flex items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-[-20px] top-1/2 translate-y-3 z-20 p-2.5 rounded-full bg-black/70 border border-white/10 opacity-0 group-hover/row:opacity-100 transition-all hover:scale-110 hidden lg:flex items-center justify-center"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Cards Row */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categoryPosts.map((post) => (
          <motion.article
            key={post.id}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex-shrink-0 w-[260px] md:w-[300px] cursor-pointer"
          >
            <Link to={`/post/${post.slug || slugify(post.title)}`}>
              <div
                className={cn(
                  "aspect-[2/3] rounded-2xl overflow-hidden relative mb-4 border border-white/5 shadow-xl",
                  isDark ? "bg-[#131927]" : "bg-gray-200"
                )}
              >
                {post.imageUrl && (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 260px, 300px"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* Score badge */}
                {post.score && (
                  <div className="absolute top-3 right-3">
                    <ScoreBadge score={post.score} />
                  </div>
                )}

                {/* Category */}
                <div className="absolute top-3 left-3">
                  <CategoryBadge>{post.category}</CategoryBadge>
                </div>

                {/* Reading time overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-white/60">
                  <Clock className="w-3 h-3" />
                  {calculateReadingTime(post.content || "").replace(" min de leitura", "m")}
                </div>
              </div>

              {(() => {
                const { mainTitle, subtitle } = splitTitle(post.title);
                return mainTitle ? (
                  <div className="flex flex-col gap-0.5">
                    <h3 className={cn(
                      "font-retro font-bold text-[13px] leading-snug line-clamp-2 transition-colors duration-300",
                      isDark ? "text-slate-200 hover:text-purple-300" : "text-gray-900 hover:text-purple-700"
                    )}>
                      {mainTitle}
                    </h3>
                    <span className={cn(
                      "font-sans text-[10px] leading-tight font-semibold mt-0.5",
                      category.toLowerCase().includes("reviews") ? "text-amber-600 dark:text-amber-400" :
                      category.toLowerCase().includes("dossi") ? "text-blue-600 dark:text-blue-400" :
                      category.toLowerCase().includes("retro") ? "text-orange-600 dark:text-orange-400" : "text-purple-600 dark:text-purple-400"
                    )}>
                      {subtitle}
                    </span>
                  </div>
                ) : (
                  <h3
                    className={cn(
                      "font-retro font-bold text-[14px] leading-snug line-clamp-2 transition-colors duration-300",
                      isDark ? "text-slate-200 hover:text-purple-300" : "text-gray-900 hover:text-purple-700"
                    )}
                  >
                    {subtitle}
                  </h3>
                );
              })()}
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
