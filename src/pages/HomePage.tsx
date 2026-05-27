import React, { useEffect, useCallback } from "react";
import { Gamepad2, ChevronRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Carousel from "../features/posts/components/Carousel";
import PostCard from "../features/posts/components/PostCard";
import PostSkeleton from "../features/posts/components/PostSkeleton";
import CarouselSkeleton from "../features/posts/components/CarouselSkeleton";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { 
  useAllPosts, 
  useFeaturedPosts, 
  useMostViewedPosts, 
  useTopReviews, 
  usePostsByCategory, 
  usePosts 
} from "../features/posts/hooks/usePostsQuery";
import { usePostsFilter } from "../hooks/usePostsFilter";
import { cn, slugify, formatNumber } from "../lib/utils";
import { Post } from "../features/posts/schemas";
import { ScoreBadge } from "../components/ui/Badge";
import { BRUTAL_DESIGN } from "../constants";

const { BORDER, SHADOW_LG, ROUNDED, TRANSITION } = BRUTAL_DESIGN;

export default function HomePage() {
  const { isDark } = useThemeStore();
  const { activeCategory, searchQuery, setActiveCategory } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Reseta categoria ao voltar do arquivo (evita glitch de transição)
  useEffect(() => {
    if ((location.state as any)?.resetCategory) {
      setActiveCategory("Todos");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToCategory = useCallback((category: string) => {
    navigate("/archive", { state: { category } });
  }, [navigate]);

  // 1. Destaques (Carrossel) - Puxa no máximo 5 posts do Firestore
  const { data: featuredPosts = [], isLoading: isLoadingFeatured } = useFeaturedPosts();

  // 2. Mais Vistos - Puxa no máximo 5 posts mais lidos do Firestore
  const { data: mostViewedPosts = [], isLoading: isLoadingMostViewed } = useMostViewedPosts(5);

  // 3. Reviews (Top Scores) - Puxa no máximo 3 melhores notas
  const { data: reviewPosts = [], isLoading: isLoadingReviews } = useTopReviews(3);

  // 4. Dossiês - Puxa no máximo 3 posts da categoria
  const { data: dossiePosts = [], isLoading: isLoadingDossies } = usePostsByCategory("Dossiês", 3);

  // 5. Busca Otimizada (Híbrida) - Só faz o download completo se houver texto na busca
  const isSearching = searchQuery.trim() !== "";
  const { data: allPosts = [], isLoading: isLoadingAll } = useAllPosts(isSearching);

  // 6. Grid Principal Otimizado - Se não estiver buscando, usa a paginação nativa (leve!)
  const { posts: paginatedPosts = [], isLoading: isLoadingPaginated } = usePosts({ 
    category: activeCategory 
  });

  const posts = isSearching ? (allPosts as Post[]) : (paginatedPosts as Post[]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory, searchQuery]);

  const { filteredPosts } = usePostsFilter(
    posts,
    activeCategory,
    searchQuery
  );

  const isDefaultView = activeCategory === "Todos" && searchQuery === "";

  // Grid exibe no máximo 5 itens
  const gridPosts = isSearching ? filteredPosts.slice(0, 5) : paginatedPosts.slice(0, 5);

  const isLoadingPosts = isSearching ? isLoadingAll : (isLoadingFeatured || isLoadingPaginated);

  return (
    <div className="flex flex-col gap-12">
      {/* ── SEO ─────────────────────────────────────────── */}
      <Helmet>
        <title>BeginsProject | Portal de Games, Reviews e Cultura Pop</title>
        <link rel="canonical" href="https://lucasbegins.com.br/" />
        <meta
          name="description"
          content="Bem-vindo ao BeginsProject. Reviews, nostalgia e cultura gamer. Onde a era de ouro dos videogames vive."
        />
        <meta name="keywords" content="BeginsProject, Lucas Begins, Projeto Begins, Lucas Begins Blog, Revista Retro, Games Retro, Cultura Pop, Reviews de Jogos" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lucasbegins.com.br/" />
        <meta property="og:title" content="BeginsProject | Portal de Games e Cultura Pop" />
        <meta property="og:description" content="Reviews, nostalgia e cultura gamer. Onde a era de ouro dos videogames vive." />
        <meta property="og:image" content="https://lucasbegins.com.br/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BeginsProject | Portal de Games e Cultura Pop" />
        <meta name="twitter:description" content="Reviews, nostalgia e cultura gamer brasileira." />
        <meta name="twitter:image" content="https://lucasbegins.com.br/og-image.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "BeginsProject",
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
              <div className={cn("w-1.5 self-stretch rounded-none", isDark ? "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.7)]" : "bg-purple-600")} />
              <div>
                <h2 className={cn("font-retro text-2xl md:text-3xl font-black uppercase tracking-wide leading-none", isDark && "text-glow")}>
                  Em Destaque
                </h2>
                <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] mt-0.5", isDark ? "text-slate-500" : "text-slate-700")}>
                  Seleção Editorial
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <div className={cn("w-1.5 self-stretch rounded-none", isDark ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]" : "bg-amber-500")} />
              <div>
                <h2 className={cn("font-retro text-2xl md:text-3xl font-black uppercase tracking-wide leading-none", isDark && "text-glow-amber")}>
                  Mais Lidos
                </h2>
                <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] mt-0.5", isDark ? "text-slate-500" : "text-slate-700")}>
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
                        isDark ? "text-purple-500/50" : "text-purple-600/50"
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
                        <div className={cn("flex items-center gap-2 mt-1.5 text-[10px] font-bold uppercase tracking-wider", isDark ? "opacity-40" : "opacity-60")}>
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

      {/* ── 2. PORTAL LAYOUT: Notícias + Reviews Sidebar ─ */}
      <section>
        {/* Section headers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-0">
          {/* Left header */}
          <div className={cn(
            "lg:col-span-2 flex items-center justify-between pb-5",
            isDark ? "border-b border-white/5" : "border-b-2 border-snes-dark"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn("w-1.5 self-stretch rounded-none", isDark ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]" : "bg-blue-600")} />
              <div>
                <h2 className={cn("font-retro text-2xl md:text-3xl font-black uppercase tracking-wide leading-none", isDark && "text-glow-blue")}>
                  {isLoadingPosts
                    ? "Carregando..."
                    : searchQuery
                    ? `Resultados: "${searchQuery}"`
                    : activeCategory !== "Todos"
                    ? activeCategory
                    : "Últimas Notícias"}
                </h2>
                {!isLoadingPosts && (
                  <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] mt-0.5", isDark ? "text-slate-500" : "text-slate-700")}>
                    {searchQuery ? `${filteredPosts.length} resultado${filteredPosts.length !== 1 ? "s" : ""}` : "Mais recentes do portal"}
                  </p>
                )}
              </div>
            </div>
            {!isLoadingPosts && isDefaultView && (
              <Link
                to="/archive"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 font-retro font-black text-[11px] uppercase tracking-widest border transition-all duration-200 hover:translate-x-0.5",
                  isDark
                    ? "border-blue-500/40 text-blue-400 hover:border-blue-400 hover:text-blue-300"
                    : "border-blue-500/40 text-blue-600 hover:border-blue-600"
                )}
              >
                Ver Todos <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {/* Right header (Visible ONLY on Desktop, as part of the sidebar header row) */}
          {reviewPosts.length > 0 && isDefaultView && (
            <div className={cn(
              "hidden lg:flex items-center gap-3 pb-5",
              isDark ? "border-b border-white/5" : "border-b-2 border-snes-dark"
            )}>
              <button
                onClick={() => goToCategory("Reviews")}
                className="flex items-center gap-3 p-0 group cursor-pointer"
              >
                <div className="w-1.5 self-stretch rounded-none bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.7)] group-hover:shadow-[0_0_16px_rgba(234,179,8,0.9)] transition-all" />
                <div>
                  <h2 className={cn("font-retro text-2xl md:text-3xl font-black uppercase tracking-wide leading-none group-hover:text-yellow-400 transition-colors", isDark ? "text-white text-glow-amber" : "text-snes-accent")}>
                    Reviews
                  </h2>
                  <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] mt-0.5", isDark ? "text-yellow-500" : "text-amber-600")}>
                    Análises com Nota
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Content: list + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">

          {/* LEFT: Horizontal article list */}
          <div className="lg:col-span-2">
            {isLoadingPosts ? (
              <div className="flex flex-col gap-4">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className={cn("flex gap-4 p-4 animate-pulse", isDark ? "bg-white/[0.02]" : "bg-gray-100")}>
                    <div className={cn("w-28 h-20 shrink-0", isDark ? "bg-white/5" : "bg-gray-200")} />
                    <div className="flex-1 space-y-2">
                      <div className={cn("h-3 w-16 rounded", isDark ? "bg-white/5" : "bg-gray-200")} />
                      <div className={cn("h-4 w-full rounded", isDark ? "bg-white/5" : "bg-gray-200")} />
                      <div className={cn("h-4 w-2/3 rounded", isDark ? "bg-white/5" : "bg-gray-200")} />
                    </div>
                  </div>
                ))}
              </div>
            ) : gridPosts.length > 0 ? (
              <div className="flex flex-col divide-y divide-white/5">
                {gridPosts.map((post, i) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, type: "spring", stiffness: 90 }}
                    className="group flex gap-6 py-6 first:pt-0 last:pb-0"
                  >
                    {/* Thumbnail */}
                    <Link
                      to={`/post/${post.slug || slugify(post.title)}`}
                      className="shrink-0 w-40 h-28 overflow-hidden border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[3px_3px_0px_0px_rgba(168,85,247,0.5)] transition-shadow"
                    >
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className={cn("w-full h-full flex items-center justify-center", isDark ? "bg-gray-800" : "bg-gray-200")}>
                          <Gamepad2 className="w-8 h-8 opacity-20" />
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 border border-purple-500/30 px-2 py-0.5">
                            {post.category}
                          </span>
                          {post.score && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-yellow-500">
                              ★ {post.score}
                            </span>
                          )}
                        </div>
                        <h3 className="font-retro font-bold text-[17px] leading-snug line-clamp-2 group-hover:text-purple-400 transition-colors duration-200">
                          <Link to={`/post/${post.slug || slugify(post.title)}`}>{post.title}</Link>
                        </h3>
                        {post.excerpt && (
                          <p className={cn("text-[13px] line-clamp-2 mt-1.5 hidden sm:block", isDark ? "text-slate-500" : "text-slate-700")}>
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <div className={cn("flex items-center gap-4 mt-3 text-[10px] font-black uppercase tracking-widest", isDark ? "text-slate-400" : "text-slate-700")}>
                        <span>{post.author?.name || "Lucas"}</span>
                        <span>·</span>
                        <span>{formatNumber(post.views || 0)} views</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className={cn("p-12 text-center retro-card", isDark ? "bg-gray-800/40" : "bg-snes-surface border-2 border-snes-dark")}>
                <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-purple-500" />
                <p className="font-retro font-bold uppercase">Nenhum artigo encontrado.</p>
              </div>
            )}
          </div>

          {/* RIGHT: Full-width review mini cards (Scrolling on mobile) */}
          {reviewPosts.length > 0 && isDefaultView && (
            <aside className="block lg:col-span-1">
              {/* REVIEWS HEADER (Mobile Only - stacks here) */}
              <button
                onClick={() => goToCategory("Reviews")}
                className={cn(
                  "lg:hidden flex items-center gap-3 pb-5 mt-12 mb-6 p-0 group cursor-pointer text-left w-full",
                  isDark ? "border-b border-white/5" : "border-b-2 border-snes-dark"
                )}
              >
                <div className="w-1.5 self-stretch rounded-none bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.7)] group-hover:shadow-[0_0_16px_rgba(234,179,8,0.9)] transition-all" />
                <div>
                  <h2 className={cn("font-retro text-2xl font-black uppercase tracking-wide leading-none group-hover:text-yellow-400 transition-colors", isDark ? "text-white text-glow-amber" : "text-snes-accent")}>
                    Reviews
                  </h2>
                  <p className={cn("text-[9px] font-black uppercase tracking-[0.3em] mt-0.5", isDark ? "text-yellow-500" : "text-amber-600")}>
                    Análises com Nota
                  </p>
                </div>
              </button>

              {/* Reviews Scroll Container */}
              <div className="flex lg:flex-col gap-4 lg:gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-hide">
                {reviewPosts.map((post, i) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, type: "spring", stiffness: 90 }}
                    className="group relative min-w-[280px] lg:min-w-0 w-full h-32 bg-black overflow-hidden border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[3px_3px_0px_0px_rgba(234,179,8,0.5)] transition-shadow cursor-pointer snap-center"
                  >
                    <Link to={`/post/${post.slug || slugify(post.title)}`} className="absolute inset-0 z-20" />

                    {/* BG image */}
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                    {/* Score badge — top left */}
                    {post.score && (
                      <span className="absolute top-0 left-0 z-10 bg-yellow-400 text-black font-retro font-black text-[11px] px-2 py-1 border-b-2 border-r-2 border-black">
                        ★ {post.score}
                      </span>
                    )}

                    {/* Category — top right */}
                    <span className="absolute top-2 right-2 z-10 text-[8px] font-black uppercase tracking-widest text-yellow-400 bg-black/60 px-2 py-0.5 border border-yellow-500/30">
                      {post.category}
                    </span>

                    {/* Title — bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                      <h4 className="font-retro font-bold text-[13px] leading-snug line-clamp-2 text-white group-hover:text-yellow-300 transition-colors">
                        {post.title}
                      </h4>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* DOSSIÊS (Mobile version needs its own header here since the sidebar stacks) */}
              {dossiePosts.length > 0 && (
                <div className="mt-8 lg:mt-4">
                  <button
                    onClick={() => goToCategory("Dossiês")}
                    className="flex items-center gap-3 pt-4 pb-4 lg:pb-2 p-0 border-b lg:border-0 border-white/5 lg:border-transparent mb-4 lg:mb-0 group cursor-pointer text-left w-full"
                  >
                    <div className="w-1.5 self-stretch rounded-none bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.7)] group-hover:shadow-[0_0_14px_rgba(59,130,246,0.9)] transition-all" />
                    <div>
                      <h2 className={cn("font-retro text-xl md:text-2xl font-black uppercase tracking-wide leading-none group-hover:text-blue-400 transition-colors", isDark ? "text-white" : "text-snes-accent")}>
                        Dossiês
                      </h2>
                      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500 mt-0.5">
                        Reportagens Especiais
                      </p>
                    </div>
                  </button>
                  
                  {/* Dossies Scroll Container */}
                  <div className="flex lg:flex-col gap-4 lg:gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-hide">
                    {dossiePosts.map((post, i) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (i + reviewPosts.length) * 0.07, type: "spring", stiffness: 90 }}
                        className="group relative min-w-[280px] lg:min-w-0 w-full h-32 bg-black overflow-hidden border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[3px_3px_0px_0px_rgba(59,130,246,0.5)] transition-shadow cursor-pointer snap-center"
                      >
                        <Link to={`/post/${post.slug || slugify(post.title)}`} className="absolute inset-0 z-20" />

                        {post.imageUrl && (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                        <span className="absolute top-2 right-2 z-10 text-[8px] font-black uppercase tracking-widest text-blue-400 bg-black/60 px-2 py-0.5 border border-blue-500/30">
                          {post.category}
                        </span>

                        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                          <h4 className="font-retro font-bold text-[13px] leading-snug line-clamp-2 text-white group-hover:text-blue-300 transition-colors">
                            {post.title}
                          </h4>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>
      </section>
    </div>
  );
}
