import React, { useEffect, useCallback, useRef, useState } from "react";
import { Gamepad2, ChevronRight, ChevronLeft, Coffee, FolderOpen } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
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
  usePostsByCategory, 
  usePosts,
  useLatestPosts
} from "../features/posts/hooks/usePostsQuery";
import { usePostsFilter } from "../hooks/usePostsFilter";
import { cn, slugify, formatNumber, formatDate, calculateReadingTime, splitTitle } from "../lib/utils";
import { Post } from "../features/posts/schemas";


export default function HomePage() {
  const { isDark } = useThemeStore();

  const playEjectSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      
      // Retro chime synth select tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(987.77, now + 0.04); // B5
      
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.log("Audio API not supported or allowed", e);
    }
  };


  const retrocafeRef = useRef<HTMLDivElement>(null);
  const dossieRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const mostViewedMobileRef = useRef<HTMLDivElement>(null);

  const [retrocafeScroll, setRetrocafeScroll] = useState({ left: false, right: true });
  const [dossieScroll, setDossieScroll] = useState({ left: false, right: true });
  const [reviewsScroll, setReviewsScroll] = useState({ left: false, right: true });
  const [mostViewedScroll, setMostViewedScroll] = useState({ left: false, right: true });
  const [hoveredMaisLidosIndex, setHoveredMaisLidosIndex] = useState<number>(0);
  const [hoveredRetrocafeIndex, setHoveredRetrocafeIndex] = useState<number | null>(null);
  const [hoveredDossieIndex, setHoveredDossieIndex] = useState<number | null>(null);
  const [hoveredReviewsIndex, setHoveredReviewsIndex] = useState<number | null>(null);

  const playClickSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      // Audio context block
    }
  }, []);


  const updateScrollState = useCallback((ref: React.RefObject<HTMLDivElement | null>, setScroll: React.Dispatch<React.SetStateAction<{ left: boolean; right: boolean }>>) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setScroll({
        left: scrollLeft > 5,
        right: scrollLeft < scrollWidth - clientWidth - 10
      });
    }
  }, []);

  const scrollContainer = useCallback((ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  }, []);

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
  const { data: mostViewedPosts = [] } = useMostViewedPosts(5);

  // 3. Reviews - Puxa no máximo 5 posts mais recentes da categoria Reviews
  const { data: reviewPosts = [], isLoading: isLoadingReviews } = usePostsByCategory("Reviews", 5);

  // 4. Dossiês - Puxa no máximo 3 posts mais recentes da categoria Dossiês
  const { data: dossiePosts = [], isLoading: isLoadingDossies } = usePostsByCategory("Dossiês", 3);

  // 4.5. RetroCafé - Puxa no máximo 3 posts mais recentes da categoria RetroCafé
  const { data: retrocafePosts = [], isLoading: isLoadingRetrocafe } = usePostsByCategory("RetroCafé", 3);

  // 4.7. Últimos Posts para Feed Limpo (sem repetições na Home padrão)
  const { data: latestPosts = [], isLoading: isLoadingLatest } = useLatestPosts(15);

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

  // Definição das listas diretas sem deduplicação
  const carouselPosts = featuredPosts.slice(0, 5);
  const displayRetrocafe = retrocafePosts.slice(0, 3);
  const displayDossie = dossiePosts.slice(0, 3);
  const displayReviews = reviewPosts.slice(0, 5);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateScrollState(retrocafeRef, setRetrocafeScroll);
      updateScrollState(dossieRef, setDossieScroll);
      updateScrollState(reviewsRef, setReviewsScroll);
      updateScrollState(mostViewedMobileRef, setMostViewedScroll);
    }, 400);
    return () => clearTimeout(timer);
  }, [displayRetrocafe, displayDossie, displayReviews, mostViewedPosts, updateScrollState]);

  useEffect(() => {
    const handleResize = () => {
      updateScrollState(retrocafeRef, setRetrocafeScroll);
      updateScrollState(dossieRef, setDossieScroll);
      updateScrollState(reviewsRef, setReviewsScroll);
      updateScrollState(mostViewedMobileRef, setMostViewedScroll);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateScrollState]);

  const gridPosts = isSearching 
    ? filteredPosts.slice(0, 4) 
    : isDefaultView 
    ? latestPosts.slice(0, 4) 
    : paginatedPosts.slice(0, 4);

  const activeMaisLidosPost = mostViewedPosts[hoveredMaisLidosIndex] || mostViewedPosts[0];

  const isLoadingPosts = isSearching 
    ? isLoadingAll 
    : (isLoadingFeatured || isLoadingPaginated || isLoadingReviews || isLoadingDossies || isLoadingRetrocafe || isLoadingLatest);

  return (
    <div className="flex flex-col gap-8 md:gap-12 relative">
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

      {/* ── 1. HERO BENTO GRID: Carousel + Mais Acessados ─────────── */}
      {isLoadingPosts && isDefaultView ? (
        <CarouselSkeleton isDark={isDark} />
      ) : !isLoadingPosts && isDefaultView && posts.length > 0 ? (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 xl:gap-10">
          {/* CÉLULA 1: Carousel Destaque (ocupa 2 colunas) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-1.5 self-stretch rounded-none shrink-0", isDark ? "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.7)]" : "bg-purple-600")} />
              <div>
                <h2 className={cn("font-retro text-2xl md:text-3xl font-black uppercase tracking-wide leading-none", isDark && "text-glow")}>
                  Em Destaque
                </h2>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-0.5 text-slate-500">
                  Seleção Editorial
                </p>
              </div>
            </div>
            <Carousel posts={carouselPosts} isDark={isDark} />
          </div>

          {/* CÉLULA 2: Mais Lidos (ocupa 1 coluna) */}
          <div className="hidden lg:flex lg:col-span-1 flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-1.5 self-stretch rounded-none shrink-0", isDark ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]" : "bg-amber-500")} />
              <div>
                <h2 className={cn("font-retro text-2xl md:text-3xl font-black uppercase tracking-wide leading-none", isDark && "text-glow-amber")}>
                  Mais Lidos
                </h2>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-0.5 text-slate-500">
                  Em Alta no Portal
                </p>
              </div>
            </div>
            
            <div
              className={cn(
                "h-full lg:flex-1 p-6 rounded-none flex flex-col relative overflow-hidden transition-all duration-300 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]",
                isDark ? "bg-[#1f1d35] text-gray-100" : "bg-white text-gray-900"
              )}
              onMouseLeave={() => setHoveredMaisLidosIndex(0)}
            >
              {isDark && (
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none z-0" />
              )}
              
              {/* Background Image Fade on Right Half */}
              {activeMaisLidosPost?.imageUrl && (
                <div
                  key={activeMaisLidosPost.id}
                  className={cn(
                    "absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center pointer-events-none transition-all duration-500 z-0 animate-bg-fade",
                    isDark ? "opacity-20" : "opacity-[0.12]"
                  )}
                  style={{
                    backgroundImage: `url(${activeMaisLidosPost.imageUrl})`,
                    maskImage: "linear-gradient(to right, transparent, black)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, black)",
                  }}
                />
              )}

              <div className="flex flex-col justify-between h-full relative z-10 gap-3">
                {mostViewedPosts.map((post, idx) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.slug || slugify(post.title)}`}
                    onMouseEnter={() => setHoveredMaisLidosIndex(idx)}
                    className={cn(
                      "flex items-center gap-4 cursor-pointer group py-2.5 border-b last:border-0 last:pb-0 transition-all duration-300 hover:translate-x-1.5",
                      isDark ? "border-white/5" : "border-black/5"
                    )}
                  >
                    <span className={cn(
                      "text-2xl font-retro font-black trending-number min-w-[32px] select-none",
                      isDark ? "text-amber-400/85 text-glow-amber" : "text-amber-500/70"
                    )}>
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0">
                      <h4 className={cn(
                        "font-bold text-xs md:text-sm leading-snug line-clamp-2 transition-colors duration-300",
                        isDark ? "text-white group-hover:text-purple-300" : "text-snes-accent group-hover:text-purple-700"
                      )}>
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        <span>{formatNumber(post.views || 0)} views</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── MOBILE/TABLET MAIS LIDOS ── */}
      {!isLoadingPosts && isDefaultView && mostViewedPosts.length > 0 && (
        <div className="lg:hidden flex flex-col gap-4">
          {/* Divisor sutil entre Carrossel e Mais Lidos no mobile */}
          <div className={cn("h-px mb-6 -mt-2", isDark ? "bg-white/5" : "bg-black/10")} />

          <div className="flex items-center gap-3">
            <div className={cn("w-1.5 self-stretch rounded-none shrink-0", isDark ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]" : "bg-amber-500")} />
            <div>
              <h2 className={cn("font-retro text-2xl md:text-3xl font-black uppercase tracking-wide leading-none", isDark && "text-glow-amber")}>
                Mais Lidos
              </h2>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-0.5 text-slate-500">
                Em Alta no Portal
              </p>
            </div>
          </div>

          <div className="relative group/scroll-container w-full">
            <div
              ref={mostViewedMobileRef}
              onScroll={() => updateScrollState(mostViewedMobileRef, setMostViewedScroll)}
              className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory w-full"
            >
              {mostViewedPosts.map((post, idx) => {
                const targetSlug = post.slug || slugify(post.title);
                return (
                  <Link
                    key={post.id}
                    to={`/post/${targetSlug}`}
                    className={cn(
                      "relative h-[148px] rounded-none overflow-hidden border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all duration-300 group/item flex flex-col justify-end p-4 w-[85%] sm:w-[calc(50%-8px)] shrink-0 snap-start snap-always hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_rgba(168,85,247,1)] hover:border-black focus:outline-none",
                      isDark ? "bg-[#1f1d35] text-gray-100" : "bg-white text-gray-900"
                    )}
                  >
                    {/* Imagem */}
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 dark:opacity-70 transition-all duration-500 group-hover/item:scale-105 group-hover/item:opacity-90"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-700/20 to-orange-900/30" />
                    )}
                    {/* Gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                    {/* Rank Number overlay */}
                    <div className="absolute top-3 left-3 z-20 px-2.5 py-0.5 rounded font-retro font-black text-base bg-black/75 border border-amber-400/60 text-amber-400 backdrop-blur-sm shadow-[0_0_8px_rgba(251,191,36,0.25)] group-hover/item:bg-amber-400 group-hover/item:text-black transition-all duration-300">
                      {(idx + 1).toString().padStart(2, "0")}
                    </div>

                    {/* Conteúdo */}
                    <div className="relative z-10 space-y-1">
                      <h4 className="font-bold text-sm sm:text-base text-white group-hover/item:text-amber-300 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-white/50">
                        <span>{formatNumber(post.views || 0)} views</span>
                        <span>·</span>
                        <span>{formatDate(post.createdAt, post.date ?? undefined)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Setinhas de navegação/feedback visual no Mobile */}
            {mostViewedScroll.left && (
              <button
                onClick={() => scrollContainer(mostViewedMobileRef, "left")}
                className="absolute left-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/70 dark:bg-black/90 text-white border border-white/20 active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-black/80"
                aria-label="Deslizar esquerda"
              >
                <ChevronLeft className="w-5 h-5 text-amber-400" />
              </button>
            )}
            {mostViewedScroll.right && (
              <button
                onClick={() => scrollContainer(mostViewedMobileRef, "right")}
                className="absolute right-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/70 dark:bg-black/90 text-white border border-white/20 active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-black/80"
                aria-label="Deslizar direita"
              >
                <ChevronRight className="w-5 h-5 text-amber-400" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── 3. FEED DE NOTÍCIAS: Bento Grid de 3 Colunas ── */}
      <section className="flex flex-col gap-6">
        {/* Feed Header */}
        <div className={cn(
          "flex items-center justify-between pb-5",
          isDark ? "border-b border-white/5" : "border-b border-black/10"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn("w-1.5 self-stretch rounded-none shrink-0", isDark ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]" : "bg-blue-600")} />
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
              <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-0.5 text-slate-500">
                Mais Recentes do Portal
              </p>
            </div>
          </div>
          {!isLoadingPosts && isDefaultView && (
            <Link
              to="/archive"
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 font-retro font-bold text-[10px] uppercase tracking-widest border rounded-xl transition-all duration-200 hover:translate-x-0.5",
                isDark
                  ? "border-blue-500/30 text-blue-400 hover:border-blue-400/50 hover:text-blue-300 bg-blue-500/5"
                  : "border-blue-500/20 text-blue-600 hover:border-blue-600 hover:bg-blue-50/50"
              )}
            >
              Ver Todos <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Feed Content: Clean 2-Column Grid */}
        {isLoadingPosts ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PostSkeleton key={i} isDark={isDark} variant="vintage" />
            ))}
          </div>
        ) : gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
            {gridPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
              >
                <PostCard post={post} variant="vintage" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={cn("p-12 text-center rounded-none border-2 border-dashed border-black/10 dark:border-white/10", isDark ? "bg-gray-800/20" : "bg-snes-surface/10")}>
            <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-purple-500 animate-pulse" />
            <p className="font-retro font-bold uppercase text-sm">Nenhum artigo encontrado.</p>
          </div>
        )}
      </section>

      {/* ── 2. ROW 2: RetroCafé / Dossiês / Reviews ─────────── */}
      {!isLoadingPosts && isDefaultView && (
        <section className="flex flex-col gap-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 xl:gap-10 text-left lg:items-stretch lg:grid-rows-1">

            {/* ── ESQUERDA (2/3): RetroCafé + Dossiês ── */}
            <div className="contents lg:col-span-2 lg:flex lg:flex-col lg:gap-6 xl:gap-10 lg:flex-1">

              {/* ── RetroCafé ── */}
              <div 
                className={cn(
                  "order-2 lg:order-none px-4 pb-4 pt-5 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] relative overflow-hidden transition-all duration-300 flex flex-col gap-3 rounded-none z-10",
                  isDark ? "bg-[#1f1d35] text-gray-100" : "bg-white text-gray-900"
                )}
                onMouseLeave={() => setHoveredRetrocafeIndex(null)}
              >
                {/* Background Image transition */}
                <AnimatePresence>
                  {hoveredRetrocafeIndex !== null && displayRetrocafe[hoveredRetrocafeIndex] && (
                    <motion.div
                      key={displayRetrocafe[hoveredRetrocafeIndex].id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 z-0 pointer-events-none"
                    >
                      <div 
                        className={cn(
                          "absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-500",
                          isDark ? "opacity-[0.25]" : "opacity-[0.14]"
                        )}
                        style={{
                          backgroundImage: `url(${displayRetrocafe[hoveredRetrocafeIndex].imageUrl})`,
                        }}
                      />
                      
                      {/* Tint overlay matching section theme */}
                      <div className={cn(
                        "absolute inset-0 mix-blend-color",
                        isDark ? "bg-orange-950/40" : "bg-orange-100/30"
                      )} />
                      
                      {/* CRT and Dot Matrix grid pattern overlay */}
                      <div className="absolute inset-0 scanline-overlay opacity-30" />
                      
                      <div 
                        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]"
                        style={{
                          backgroundImage: isDark
                            ? "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 0)"
                            : "radial-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 0)",
                          backgroundSize: "16px 16px"
                        }}
                      />
                      
                      {/* Radial gradient mask to focus visual center */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: isDark
                            ? "radial-gradient(circle, transparent 20%, #1f1d35 90%)"
                            : "radial-gradient(circle, transparent 20%, white 90%)"
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>



                {/* Cabeçalho */}
                <div className="flex items-center justify-between relative z-10">
                  <div
                    className="flex items-center gap-3 cursor-pointer group/title"
                    onClick={() => goToCategory("RetroCafé")}
                  >
                    <div className="w-1.5 self-stretch rounded-none shrink-0 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.7)] group-hover/title:shadow-[0_0_15px_rgba(249,115,22,0.9)] transition-all" />
                    <div>
                      <h2 className={cn("font-retro text-xl md:text-2xl font-black uppercase tracking-wide leading-none group-hover/title:text-orange-400 transition-colors", isDark ? "text-white" : "text-snes-accent")}>
                        RetroCafé
                      </h2>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-0.5 text-slate-500">
                        Crônicas
                      </p>
                    </div>
                  </div>
                  {/* Linha pontilhada conectora para preencher o espaço */}
                  <div className="hidden sm:block flex-1 mx-6 border-b-2 border-dashed border-orange-500/20 dark:border-orange-400/15 self-center" />
                  {/* Informações de Status retro no cabeçalho */}
                  <div className="hidden sm:flex flex-col items-end font-mono text-[8px] text-orange-500/80 dark:text-orange-400/80 select-none text-right">
                    <span className="font-bold tracking-wider">[ RETRO JOURNALISM SYSTEM // RC-012 ]</span>
                    <span className="opacity-60">EDITIONS INDEX: 3/3 READY</span>
                  </div>
                </div>

                {/* Cards RetroCafé */}
                <div className="relative group/scroll-container w-full z-10">
                  <div 
                    ref={retrocafeRef} 
                    onScroll={() => updateScrollState(retrocafeRef, setRetrocafeScroll)}
                    className="flex lg:grid overflow-x-auto lg:overflow-x-visible lg:grid-cols-3 gap-4 pb-4 lg:pb-0 scrollbar-hide snap-x snap-mandatory w-full"
                  >
                    {displayRetrocafe.length > 0 ? (
                      displayRetrocafe.map((post, i) => {
                        const targetSlug = post.slug || slugify(post.title);
                        return (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                            className={cn(
                              "w-[280px] sm:w-[260px] md:w-[280px] lg:w-auto shrink-0 snap-start snap-always transition-all duration-300",
                              hoveredRetrocafeIndex !== null && hoveredRetrocafeIndex !== i
                                ? "opacity-50 scale-[0.96] blur-[0.4px]"
                                : hoveredRetrocafeIndex === i
                                ? "scale-[1.03] z-10"
                                : ""
                            )}
                            onMouseEnter={() => {
                              setHoveredRetrocafeIndex(i);
                              playClickSound();
                            }}
                          >
                            <Link
                              to={`/post/${targetSlug}`}
                              className={cn(
                                "relative aspect-[3/4] border-2 border-black flex flex-col justify-between overflow-hidden cursor-pointer group rounded-none transition-all duration-300",
                                isDark
                                  ? "bg-gray-900 text-gray-100 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(249,115,22,1)]"
                                  : "bg-white text-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(249,115,22,1)]"
                              )}
                            >
                              {/* Capa background image */}
                              {post.imageUrl && (
                                <img
                                  src={post.imageUrl}
                                  alt={post.title}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                  loading="lazy"
                                />
                              )}
                              {/* Color gradient to make text readable and pop */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/75 z-10" />

                              {/* Scanline overlay */}
                              <div className="absolute inset-0 scanline-overlay opacity-25 z-10 pointer-events-none" />

                              {/* Magazine Header Bar */}
                              <div className="relative z-20 p-3 flex justify-between items-center border-b border-white/10 bg-black/60 backdrop-blur-sm">
                                <span className="text-[10px] font-bold text-orange-400">ED. #0{i + 1}</span>
                                <span className="text-[9px] font-mono text-gray-400 uppercase">MAI 2026</span>
                              </div>

                              {/* Main Headline Content */}
                              <div className="relative z-20 p-4 mt-auto flex flex-col gap-2">
                                {/* Subhead tag */}
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                                    {formatDate(post.createdAt, post.date ?? undefined)}
                                  </span>
                                </div>

                                {/* Mega Headline title */}
                                {(() => {
                                  const { mainTitle, subtitle } = splitTitle(post.title);
                                  return mainTitle ? (
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-retro font-black uppercase text-[10px] tracking-wider text-orange-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                        {mainTitle}
                                      </span>
                                      <h3 className="font-retro font-black uppercase text-sm md:text-base text-white leading-tight line-clamp-3 group-hover:text-yellow-300 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                        {subtitle}
                                      </h3>
                                    </div>
                                  ) : (
                                    <h3 className="font-retro font-black uppercase text-base md:text-lg text-white leading-tight line-clamp-3 group-hover:text-yellow-300 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                      {subtitle}
                                    </h3>
                                  );
                                })()}

                                {/* Barcode and Views at the bottom */}
                                <div className="flex items-end justify-between mt-2 pt-2 border-t border-white/10">
                                  {/* Simulado Barcode */}
                                  <div className="flex items-center gap-0.5 h-4 bg-white/90 p-0.5 border border-black select-none">
                                    {[1, 2, 1, 3, 1, 2, 4, 1, 2, 3].map((width, idx) => (
                                      <div
                                        key={idx}
                                        className="bg-black h-full"
                                        style={{ width: `${width}px` }}
                                      />
                                    ))}
                                  </div>

                                  <div className="flex flex-col items-end text-[9px] text-gray-400 font-bold uppercase">
                                    <span>READING TIME: {calculateReadingTime(post.content || "").replace(" min de leitura", " MIN")}</span>
                                    <span className="text-orange-400 font-retro tracking-wide">{formatNumber(post.views || 0)} VIEWS</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className={cn("col-span-3 p-8 rounded-none border-2 border-dashed flex flex-col items-center justify-center min-h-[140px] text-center gap-3 border-black/20 dark:border-white/20", isDark ? "bg-[#1f1d35] text-slate-400" : "bg-white text-slate-500")}>
                        <Coffee className="w-8 h-8 opacity-40 animate-pulse text-orange-500" />
                        <span className="text-xs font-retro uppercase tracking-wider font-bold">Nenhum cartucho de RetroCafé inserido no slot</span>
                      </div>
                    )}
                  </div>

                  {/* Setinhas de navegação/feedback visual no Mobile */}
                  {retrocafeScroll.left && (
                    <button
                      onClick={() => scrollContainer(retrocafeRef, "left")}
                      className="absolute left-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 flex lg:hidden items-center justify-center w-8 h-8 rounded-full bg-black/70 dark:bg-black/90 text-white border border-white/20 active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-black/80"
                      aria-label="Deslizar esquerda"
                    >
                      <ChevronLeft className="w-5 h-5 text-orange-400" />
                    </button>
                  )}
                  {retrocafeScroll.right && (
                    <button
                      onClick={() => scrollContainer(retrocafeRef, "right")}
                      className="absolute right-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 flex lg:hidden items-center justify-center w-8 h-8 rounded-full bg-black/70 dark:bg-black/90 text-white border border-white/20 active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-black/80"
                      aria-label="Deslizar direita"
                    >
                      <ChevronRight className="w-5 h-5 text-orange-400" />
                    </button>
                  )}
                </div>
              </div>



              {/* ── Dossiês ── */}
              <div 
                className={cn(
                  "order-3 lg:order-none px-4 pb-4 pt-5 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] relative overflow-hidden transition-all duration-300 flex flex-col gap-3 rounded-none z-10 lg:flex-1",
                  isDark ? "bg-[#1f1d35] text-gray-100" : "bg-white text-gray-900"
                )}
                onMouseLeave={() => setHoveredDossieIndex(null)}
              >
                {/* Background Image transition */}
                <AnimatePresence>
                  {hoveredDossieIndex !== null && displayDossie[hoveredDossieIndex] && (
                    <motion.div
                      key={displayDossie[hoveredDossieIndex].id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 z-0 pointer-events-none"
                    >
                      <div 
                        className={cn(
                          "absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-500 filter sepia brightness-[0.7] contrast-[1.2] hue-rotate-[180deg]",
                          isDark ? "opacity-[0.25]" : "opacity-[0.14]"
                        )}
                        style={{
                          backgroundImage: `url(${displayDossie[hoveredDossieIndex].imageUrl})`,
                        }}
                      />
                      
                      {/* Tint overlay matching section theme */}
                      <div className={cn(
                        "absolute inset-0 mix-blend-color",
                        isDark ? "bg-blue-950/45" : "bg-blue-100/30"
                      )} />
                      
                      {/* CRT and Blueprint line grid pattern overlay */}
                      <div className="absolute inset-0 scanline-overlay opacity-30" />
                      
                      <div 
                        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]"
                        style={{
                          backgroundImage: isDark
                            ? "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)"
                            : "linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)",
                          backgroundSize: "20px 20px"
                        }}
                      />
                      
                      {/* Radial gradient mask to focus visual center */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: isDark
                            ? "radial-gradient(circle, transparent 20%, #1f1d35 90%)"
                            : "radial-gradient(circle, transparent 20%, white 90%)"
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>



                {/* Cabeçalho */}
                <div className="flex items-center justify-between relative z-10">
                  <div
                    className="flex items-center gap-3 cursor-pointer group/title"
                    onClick={() => goToCategory("Dossiês")}
                  >
                    <div className="w-1.5 self-stretch rounded-none shrink-0 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)] group-hover/title:shadow-[0_0_15px_rgba(59,130,246,0.9)] transition-all" />
                    <div>
                      <h2 className={cn("font-retro text-xl md:text-2xl font-black uppercase tracking-wide leading-none group-hover/title:text-blue-400 transition-colors", isDark ? "text-white" : "text-snes-accent")}>
                        Dossiês
                      </h2>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-0.5 text-slate-500">
                        Reportagens Especiais
                      </p>
                    </div>
                  </div>
                  {/* Linha pontilhada conectora para preencher o espaço */}
                  <div className="hidden sm:block flex-1 mx-6 border-b-2 border-dashed border-blue-500/20 dark:border-blue-400/15 self-center" />
                  {/* Informações de Status retro no cabeçalho */}
                  <div className="hidden sm:flex flex-col items-end font-mono text-[8px] text-blue-500/80 dark:text-blue-400/80 select-none text-right">
                    <span className="font-bold tracking-wider">[ DECK CLASSIFIED SYSTEM // DE-084 ]</span>
                    <span className="opacity-60">DECODING DECK INDEX... READY</span>
                  </div>
                </div>

                {/* Cards Dossiês */}
                <div className="relative group/scroll-container w-full z-10">
                  <div 
                    ref={dossieRef} 
                    onScroll={() => updateScrollState(dossieRef, setDossieScroll)}
                    className="flex lg:grid overflow-x-auto lg:overflow-x-visible lg:grid-cols-3 gap-4 pb-4 lg:pb-0 scrollbar-hide snap-x snap-mandatory w-full pt-4 lg:items-start"
                  >
                    {displayDossie.length > 0 ? (
                      displayDossie.map((post, i) => {
                        const targetSlug = post.slug || slugify(post.title);
                        return (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                            className={cn(
                              "w-[280px] sm:w-[260px] md:w-[280px] lg:w-auto shrink-0 snap-start snap-always transition-all duration-300 relative",
                              hoveredDossieIndex !== null && hoveredDossieIndex !== i
                                ? "opacity-50 scale-[0.96] blur-[0.4px]"
                                : hoveredDossieIndex === i
                                ? "scale-[1.03] z-10"
                                : ""
                            )}
                            onMouseEnter={() => {
                              setHoveredDossieIndex(i);
                              playClickSound();
                            }}
                          >
                            {/* Salient folder tab */}
                            <div className={cn(
                              "absolute -top-4.5 left-4 px-3 py-0.5 border-t-2 border-x-2 border-black rounded-t-sm text-[9px] font-retro font-bold uppercase tracking-wider text-black select-none z-10 transition-colors duration-300",
                              hoveredDossieIndex === i
                                ? "bg-[#f1e0c5] dark:bg-[#d6be90]"
                                : "bg-[#e3cb9f] dark:bg-[#c2aa78]"
                            )}>
                              DOSSIÊ #0{i + 1}
                            </div>

                            <Link
                              to={`/post/${targetSlug}`}
                              className={cn(
                                "relative h-[370px] lg:h-[320px] xl:h-[370px] border-2 border-black flex flex-col justify-between overflow-hidden cursor-pointer group rounded-none p-4 transition-all duration-300 text-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_rgba(59,130,246,1)]",
                                hoveredDossieIndex === i
                                  ? "bg-[#ebd5ad] dark:bg-[#cbb284]"
                                  : "bg-[#e2cba0] dark:bg-[#c2aa78]"
                              )}
                            >
                              {/* Laser scan line overlay */}
                              <div className="absolute h-0.5 w-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)] top-0 left-0 animate-scanner-beam pointer-events-none opacity-0 group-hover:opacity-100 z-30" />

                              {/* Paperclip */}
                              <div className="absolute top-2.5 left-6 w-3.5 h-8 bg-slate-400 border border-slate-600 rounded-full opacity-90 z-20 shadow-[1px_1px_2px_rgba(0,0,0,0.3)] transform -rotate-12 select-none" />

                              {/* Polaroid photo frame */}
                              <div className="relative w-full aspect-[4/3] border-2 border-black bg-white p-2.5 shadow-[3px_3px_0px_rgba(0,0,0,1)] rotate-[-1.5deg] z-10 shrink-0 overflow-hidden select-none">
                                {post.imageUrl && (
                                  <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    loading="lazy"
                                  />
                                )}
                                <div className="absolute inset-0 scanline-overlay opacity-15 pointer-events-none" />
                                
                                {/* Photo tape or label */}
                                <div className="mt-1.5 text-[5.5px] font-mono text-center text-gray-500 tracking-wider leading-none">
                                  ANEXO_FOTO_REGISTRO_0{i + 1}.PNG
                                </div>
                              </div>

                              {/* Manila page details (typewriter style) */}
                              <div className="relative z-10 font-mono text-black mt-3 flex-grow flex flex-col justify-between">
                                <div className="space-y-2">
                                  {/* Confidencial stamp */}
                                  <div className="inline-block border border-red-600 text-red-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rotate-[-3deg] select-none border-dashed leading-none animate-pulse">
                                    ★ CLASSIFICADO ★
                                  </div>
                                  {(() => {
                                    const { mainTitle, subtitle } = splitTitle(post.title);
                                    return mainTitle ? (
                                      <div className="flex flex-col gap-0.5">
                                        <span className="font-mono text-[8px] uppercase tracking-wider text-blue-800 font-black">
                                          {mainTitle}
                                        </span>
                                        <h3 className="font-bold text-xs lg:text-[11px] xl:text-xs uppercase tracking-tight leading-snug line-clamp-2 text-black">
                                          {subtitle}
                                        </h3>
                                      </div>
                                    ) : (
                                      <h3 className="font-bold text-sm lg:text-xs xl:text-sm uppercase tracking-tight leading-snug line-clamp-2 text-black">
                                        {subtitle}
                                      </h3>
                                    );
                                  })()}
                                </div>

                                <div className="text-[10px] lg:text-[9px] xl:text-[10px] text-gray-800 font-bold space-y-0.5 mt-2 pt-2 border-t border-black/15">
                                  <div>DATA REGISTRO: {formatDate(post.createdAt, post.date ?? undefined)}</div>
                                  <div className="flex items-center justify-between text-blue-800 dark:text-blue-900 font-retro tracking-wider">
                                    <span>LEITURA: {calculateReadingTime(post.content || "").replace(" min de leitura", " MIN")}</span>
                                    <span>{formatNumber(post.views || 0)} VIEWS</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className={cn("col-span-3 p-8 rounded-none border-2 border-dashed flex flex-col items-center justify-center min-h-[140px] text-center gap-3 border-black/20 dark:border-white/20", isDark ? "bg-[#1f1d35] text-slate-400" : "bg-white text-slate-500")}>
                        <FolderOpen className="w-8 h-8 opacity-40 animate-pulse text-blue-500" />
                        <span className="text-xs font-retro uppercase tracking-wider font-bold">Nenhum dossiê secreto decodificado até o momento</span>
                      </div>
                    )}
                  </div>

                  {/* Setinhas de navegação/feedback visual no Mobile */}
                  {dossieScroll.left && (
                    <button
                      onClick={() => scrollContainer(dossieRef, "left")}
                      className="absolute left-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 flex lg:hidden items-center justify-center w-8 h-8 rounded-full bg-black/70 dark:bg-black/90 text-white border border-white/20 active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-black/80"
                      aria-label="Deslizar esquerda"
                    >
                      <ChevronLeft className="w-5 h-5 text-blue-400" />
                    </button>
                  )}
                  {dossieScroll.right && (
                    <button
                      onClick={() => scrollContainer(dossieRef, "right")}
                      className="absolute right-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 flex lg:hidden items-center justify-center w-8 h-8 rounded-full bg-black/70 dark:bg-black/90 text-white border border-white/20 active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-black/80"
                      aria-label="Deslizar direita"
                    >
                      <ChevronRight className="w-5 h-5 text-blue-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── DIREITA (1/3): Reviews ── */}
            <div className="order-1 lg:order-none flex flex-col gap-5 lg:contents">
              {/* Divisor sutil acima de Reviews no mobile */}
              <div className={cn("h-px lg:hidden", isDark ? "bg-white/5" : "bg-black/10")} />

              <div 
                className={cn(
                  "relative overflow-hidden transition-all duration-300 flex flex-col gap-3 rounded-none z-10 lg:col-span-1 lg:h-full",
                  "border-0 shadow-none bg-transparent px-0 pb-0 pt-0 lg:border-2 lg:border-black lg:shadow-[6px_6px_0px_rgba(0,0,0,1)] lg:px-4 lg:pb-4 lg:pt-5",
                  isDark ? "text-gray-100 lg:bg-[#1f1d35]" : "text-gray-900 lg:bg-white"
                )}
                onMouseLeave={() => setHoveredReviewsIndex(null)}
              >


                {/* Cabeçalho */}
                <div className="flex items-center justify-between relative z-10 px-4 lg:px-0">
                  <div
                    className="flex items-center gap-3 cursor-pointer group/title"
                    onClick={() => goToCategory("Reviews")}
                  >
                    <div className="w-1.5 self-stretch rounded-none shrink-0 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.7)] group-hover/title:shadow-[0_0_15px_rgba(234,179,8,0.9)] transition-all" />
                    <div>
                      <h2 className={cn("font-retro text-xl md:text-2xl font-black uppercase tracking-wide leading-none group-hover/title:text-yellow-400 transition-colors", isDark ? "text-white" : "text-snes-accent")}>
                        Reviews
                      </h2>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-0.5 text-slate-500">
                        Análises com Nota
                      </p>
                    </div>
                  </div>
                  {/* Linha pontilhada conectora para preencher o espaço */}
                  <div className="hidden sm:block flex-1 mx-6 border-b-2 border-dashed border-yellow-500/20 dark:border-yellow-400/15 self-center" />
                  {/* Informações de Status retro no cabeçalho */}
                  <div className="hidden sm:flex flex-col items-end font-mono text-[8px] text-yellow-500/80 dark:text-yellow-400/80 select-none text-right">
                    <span className="font-bold tracking-wider">[ DECK REVIEW SYSTEM // REV-005 ]</span>
                    <span className="opacity-60">DECK CONNECTED... READY</span>
                  </div>
                </div>

                {/* Cards Reviews */}
                <div className="relative group/scroll-container w-full lg:flex-1 lg:flex lg:flex-col z-10 pt-2 px-4 lg:px-0">
                  <div
                    ref={reviewsRef}
                    onScroll={() => updateScrollState(reviewsRef, setReviewsScroll)}
                    className="flex lg:flex lg:flex-col gap-4 lg:gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-hide w-full lg:flex-1"
                  >
                    {displayReviews.length > 0 ? (
                      displayReviews.map((post, i) => {
                        const targetSlug = post.slug || slugify(post.title);
                        const isHovered = hoveredReviewsIndex === i;
                        const isAnyHovered = hoveredReviewsIndex !== null;

                        const cardBgClass = isDark ? "bg-[#141226] text-white" : "bg-white text-zinc-900";

                        return (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                            className={cn(
                              "w-full sm:w-[calc(50%-8px)] lg:w-full h-[148px] lg:h-0 lg:flex-1 lg:min-h-[96px] xl:min-h-[112px] shrink-0 snap-start snap-always transition-all duration-300 relative",
                              isAnyHovered && !isHovered
                                ? "opacity-65 scale-[0.99] blur-[0.2px]"
                                : isHovered
                                ? "lg:-translate-y-0.5 lg:translate-x-0.5 z-20"
                                : ""
                            )}
                            onMouseEnter={() => {
                              setHoveredReviewsIndex(i);
                              playEjectSound();
                            }}
                          >
                            <Link
                              to={`/post/${targetSlug}`}
                              className={cn(
                                "relative w-full h-full flex items-stretch overflow-hidden cursor-pointer rounded-none transition-all duration-300 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]",
                                cardBgClass,
                                isHovered 
                                  ? "border-yellow-500 shadow-[4px_4px_0px_rgba(234,179,8,1)]" 
                                  : "border-black"
                              )}
                            >
                              {/* 1. Left Side: Content Booklet (50% width) */}
                              <div className="w-[50%] p-3 flex flex-col justify-between relative z-20 min-w-0">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-yellow-600 dark:text-yellow-400">
                                      OFFICIAL REVIEW
                                    </span>
                                    {/* Scanline dot status */}
                                    <span className={cn(
                                      "w-1 h-1 rounded-full",
                                      isHovered ? "bg-yellow-400 animate-ping" : "bg-yellow-500/60"
                                    )} />
                                  </div>

                                  {(() => {
                                    const { mainTitle, subtitle } = splitTitle(post.title);
                                    return mainTitle ? (
                                      <div className="flex flex-col gap-0.5 mt-1.5">
                                        <span className={cn(
                                          "font-retro font-black uppercase text-[8px] sm:text-[9px] tracking-wider leading-none",
                                          isHovered ? "text-yellow-600 dark:text-yellow-400" : "text-yellow-700/80 dark:text-yellow-500/80"
                                        )}>
                                          {mainTitle}
                                        </span>
                                        <h4 className="font-retro font-bold text-xs sm:text-sm lg:text-[11px] xl:text-xs leading-snug line-clamp-2 transition-colors duration-300">
                                          <span className={cn(
                                            isHovered ? "text-yellow-600 dark:text-yellow-400" : ""
                                          )}>
                                            {subtitle}
                                          </span>
                                        </h4>
                                      </div>
                                    ) : (
                                      <h4 className="font-retro font-bold text-sm sm:text-base lg:text-[13px] xl:text-sm leading-snug line-clamp-2 mt-1.5 transition-colors duration-300">
                                        <span className={cn(
                                          isHovered ? "text-yellow-600 dark:text-yellow-400" : ""
                                        )}>
                                          {subtitle}
                                        </span>
                                      </h4>
                                    );
                                  })()}
                                </div>

                                {/* Footer details (Score badge only) */}
                                <div className="pt-1.5 mt-1.5 flex justify-start">
                                  {post.score && (
                                    <div className={cn(
                                      "inline-flex items-center gap-1 text-black px-3 py-1 font-retro font-black text-[13px] sm:text-sm lg:text-xs xl:text-sm border-2 border-black shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 uppercase tracking-wider select-none leading-none transition-all duration-300",
                                      isHovered ? "from-yellow-200 via-yellow-300 to-amber-400 scale-110 -translate-y-1 shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)] border-yellow-500" : ""
                                    )}>
                                      ★ {post.score}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* 2. Right Side: Game Artwork with Fade-out (absolute inset-0) */}
                              {post.imageUrl && (
                                <div className="absolute inset-0 select-none z-10 overflow-hidden">
                                  <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    loading="lazy"
                                    className="absolute right-0 top-0 bottom-0 w-[70%] h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                  />
                                  {/* Fade gradient overlay that blends into the background */}
                                  <div 
                                    className="absolute inset-0 z-10 pointer-events-none"
                                    style={{
                                      background: isDark
                                        ? "linear-gradient(to right, #141226 0%, #141226 38%, rgba(20, 18, 38, 0.4) 70%, transparent 100%)"
                                        : "linear-gradient(to right, #ffffff 0%, #ffffff 38%, rgba(255, 255, 255, 0.4) 70%, transparent 100%)"
                                    }}
                                  />
                                  
                                  {/* Retro scanline overlay on image area */}
                                  <div className="absolute inset-0 scanline-overlay opacity-[0.18] pointer-events-none z-10" />
                                </div>
                              )}
                            </Link>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center py-12">
                        <span className="text-sm font-retro uppercase text-gray-500">Sem Reviews Recentes</span>
                      </div>
                    )}
                  </div>

                  {reviewsScroll.left && (
                    <button
                      onClick={() => scrollContainer(reviewsRef, "left")}
                      className="absolute left-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 flex lg:hidden items-center justify-center w-8 h-8 rounded-full bg-black/70 dark:bg-black/90 text-white border border-white/20 active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-black/80"
                      aria-label="Deslizar esquerda"
                    >
                      <ChevronLeft className="w-5 h-5 text-yellow-400" />
                    </button>
                  )}
                  {reviewsScroll.right && (
                    <button
                      onClick={() => scrollContainer(reviewsRef, "right")}
                      className="absolute right-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 flex lg:hidden items-center justify-center w-8 h-8 rounded-full bg-black/70 dark:bg-black/90 text-white border border-white/20 active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-black/80"
                      aria-label="Deslizar direita"
                    >
                      <ChevronRight className="w-5 h-5 text-yellow-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

