import React, { useEffect } from "react";
import { Gamepad2, TrendingUp, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Carousel from "../features/posts/components/Carousel";
import PostCard from "../features/posts/components/PostCard";
import PostSkeleton from "../features/posts/components/PostSkeleton";
import CarouselSkeleton from "../features/posts/components/CarouselSkeleton";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { useAllPosts } from "../features/posts/hooks/usePostsQuery";
import { usePostsFilter } from "../hooks/usePostsFilter";
import { cn, slugify, formatNumber } from "../lib/utils";
import { Post } from "../features/posts/schemas";
import { ScoreBadge } from "../components/ui/Badge";
import { BRUTAL_DESIGN } from "../constants";

const { BORDER, SHADOW_LG, ROUNDED, TRANSITION } = BRUTAL_DESIGN;

export default function HomePage() {
  const { isDark } = useThemeStore();
  const { activeCategory, searchQuery } = useUIStore();
  const { data: allPosts = [], isLoading: isLoadingPosts } = useAllPosts();
  const posts = allPosts as Post[];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory, searchQuery]);

  const { filteredPosts, featuredPosts, mostViewedPosts } = usePostsFilter(
    posts,
    activeCategory,
    searchQuery
  );

  const isDefaultView = activeCategory === "Todos" && searchQuery === "";

  // Grid always shows 3 most recent posts (no deduplication — carousel is a separate editorial section)
  const gridPosts = filteredPosts.slice(0, 3);

  // Reviews for the bottom band
  const reviewPosts = posts.filter((p) => p.score && !p.isDraft).slice(0, 4);

  return (
    <div className="flex flex-col gap-12">
      {/* ── SEO ─────────────────────────────────────────── */}
      <Helmet>
        <title>Lucas Begins | Portal de Games, Reviews e Cultura Pop</title>
        <meta
          name="description"
          content="Seu portal premium de games e cultura pop. Reviews profundos, nostalgia, RPG, cinema e as últimas novidades da cultura gamer brasileira."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lucasbegins.com.br/" />
        <meta property="og:title" content="Lucas Begins | Portal de Games e Cultura Pop" />
        <meta property="og:description" content="Reviews, nostalgia e cultura gamer. Onde a era de ouro dos videogames vive." />
        <meta property="og:image" content="https://lucasbegins.com.br/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lucas Begins | Portal de Games e Cultura Pop" />
        <meta name="twitter:description" content="Reviews, nostalgia e cultura gamer brasileira." />
        <meta name="twitter:image" content="https://lucasbegins.com.br/og-image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Lucas Begins",
            url: "https://lucasbegins.com.br/",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://lucasbegins.com.br/?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
      </Helmet>

      {/* ── 1. HERO: Carousel + Mais Acessados ─────────── */}
      {isLoadingPosts && isDefaultView ? (
        <CarouselSkeleton isDark={isDark} />
      ) : !isLoadingPosts && isDefaultView && posts.length > 0 ? (
        <section>
          {/* Section labels row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-6">
            <div className="lg:col-span-3 flex items-center gap-3">
              <div className={cn("w-1.5 h-8 rounded-none", isDark ? "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.7)]" : "bg-purple-600")} />
              <div>
                <h2 className="font-retro text-2xl md:text-3xl font-black uppercase tracking-wide text-glow leading-none">
                  Em Destaque
                </h2>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mt-0.5">
                  Seleção Editorial
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <div className={cn("w-1.5 h-8 rounded-none", isDark ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]" : "bg-amber-500")} />
              <div>
                <h2 className="font-retro text-2xl md:text-3xl font-black uppercase tracking-wide text-glow-amber leading-none">
                  Mais Lidos
                </h2>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mt-0.5">
                  Em Alta no Portal
                </p>
              </div>
            </div>
          </div>

          {/* Carousel + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Carousel posts={featuredPosts.slice(0, 5)} isDark={isDark} />
            </div>

            <aside className="hidden lg:block lg:col-span-1">
              <div
                className={cn(
                  "h-full md:h-[560px] p-8 rounded-none flex flex-col relative overflow-hidden transition-all duration-500",
                  isDark
                    ? "bg-[#161b2c] border border-white/5 shadow-xl"
                    : "bg-snes-surface border-2 border-snes-dark shadow-[4px_4px_0px_0px_#2D1B69]"
                )}
              >
                {/* Efeito de luz de fundo sutil */}
                {isDark && (
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />
                )}

                <div className="flex flex-col justify-between h-full relative z-10 gap-1">
                  {mostViewedPosts.map((post, idx) => (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug || slugify(post.title)}`}
                      className={cn(
                        "flex items-center gap-5 cursor-pointer group py-3 border-b last:border-0 last:pb-0 transition-all duration-300 hover:translate-x-2",
                        isDark ? "border-white/5" : "border-snes-mid/30"
                      )}
                    >
                      <span className={cn(
                        "text-2xl font-retro font-bold trending-number transition-all duration-300 min-w-[40px]",
                        isDark ? "text-purple-500/50" : "text-purple-600/30"
                      )}>
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "font-bold text-[14px] leading-tight line-clamp-2 transition-colors",
                          isDark ? "text-white group-hover:text-purple-200" : "text-snes-accent group-hover:text-purple-700"
                        )}>
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5 opacity-40 text-[10px] font-bold uppercase tracking-wider">
                          <span>{formatNumber(post.views || 0)} visualizações</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      ) : null}

      {/* ── 2. GRID DE NOTÍCIAS ──────────────────────────── */}
      <section>
        <div
          className={cn(
            "flex items-center justify-between mb-8 pb-5",
            isDark ? "border-b border-white/5" : "border-b-2 border-snes-dark"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn("w-1.5 h-8 rounded-none", isDark ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]" : "bg-blue-600")} />
            <div>
              <h2 className="font-retro text-2xl md:text-3xl font-black uppercase tracking-wide text-glow-blue leading-none">
                {isLoadingPosts
                  ? "Carregando Fases..."
                  : searchQuery
                  ? `Resultados: "${searchQuery}"`
                  : activeCategory !== "Todos"
                  ? activeCategory
                  : "Últimas Notícias"}
              </h2>
              {!isLoadingPosts && (
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mt-0.5">
                  {searchQuery
                    ? `${filteredPosts.length} resultado${filteredPosts.length !== 1 ? "s" : ""}`
                    : activeCategory !== "Todos"
                    ? "Filtrando por categoria"
                    : "Mais recentes do portal"}
                </p>
              )}
            </div>
          </div>

          {/* Ver Todos — inline com o header */}
          {!isLoadingPosts && (
            <Link
              to="/archive"
              className={cn(
                "flex items-center gap-2 px-4 py-2 font-retro font-black text-xs uppercase tracking-widest border-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0",
                isDark
                  ? "border-blue-500 text-blue-400 shadow-[4px_4px_0px_0px_rgba(59,130,246,0.3)] hover:bg-blue-500 hover:text-white"
                  : "border-blue-600 text-blue-600 shadow-[4px_4px_0px_0px_#2563eb] hover:bg-blue-600 hover:text-white"
              )}
            >
              Ver Todos <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {isLoadingPosts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => <PostSkeleton key={i} isDark={isDark} />)}
          </div>
        ) : gridPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4), type: "spring", stiffness: 80 }}
                  className="h-full"
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div
            className={cn(
              "p-16 text-center retro-card",
              isDark ? "bg-gray-800/40" : "bg-snes-surface border-2 border-snes-dark"
            )}
          >
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-30 text-purple-500" />
            <p className="font-retro text-xl mb-2 font-bold uppercase">Nenhum artigo encontrado.</p>
            <p className="opacity-50 font-medium tracking-tight text-sm">
              Tente buscar por outro termo ou categoria.
            </p>
          </div>
        )}
      </section>

      {/* ── 3. HALL OF FAME: Reviews ────────────────────── */}
      {reviewPosts.length > 0 && isDefaultView && (
        <section
          className={cn(
            "relative w-screen left-1/2 -translate-x-1/2 overflow-hidden py-16",
            isDark ? "bg-gray-950 border-y-2 border-purple-900/30" : "bg-snes-mid border-y-4 border-snes-dark"
          )}
        >
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 rounded-none bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.7)]" />
                <div>
                  <h2 className="font-retro text-2xl md:text-3xl font-black uppercase tracking-wide text-white leading-none">
                    Hall of Fame
                  </h2>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-500 mt-0.5">
                    Análises com Nota
                  </p>
                </div>
              </div>
              <Link
                to="/category/Reviews"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 font-retro font-black text-xs uppercase tracking-widest border-2 border-yellow-500 text-yellow-500 transition-all duration-200 hover:bg-yellow-500 hover:text-black",
                  SHADOW_LG
                )}
              >
                Ver Ranking <TrendingUp className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {reviewPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 80 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  className="group cursor-pointer"
                >
                  <Link to={`/post/${post.slug || slugify(post.title)}`}>
                    <div
                      className={cn(
                        "aspect-[3/4] overflow-hidden relative mb-4",
                        BORDER,
                        SHADOW_LG,
                        "group-hover:shadow-[6px_6px_0px_0px_rgba(234,179,8,0.5)] transition-shadow duration-300"
                      )}
                    >
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        <ScoreBadge score={post.score!} />
                      </div>
                    </div>
                    <h3
                      className={cn(
                        "font-retro font-bold text-sm leading-snug line-clamp-2 transition-colors duration-300 uppercase",
                        isDark ? "text-slate-200 group-hover:text-yellow-400" : "text-gray-900 group-hover:text-yellow-600"
                      )}
                    >
                      {post.title}
                    </h3>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
