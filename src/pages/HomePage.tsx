import React, { useEffect, useCallback, useRef, useState } from "react";
import { Gamepad2, ChevronRight, ChevronLeft, LayoutGrid, Map, Layers } from "lucide-react";
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
  useTopReviews, 
  usePostsByCategory, 
  usePosts,
  useLatestPosts
} from "../features/posts/hooks/usePostsQuery";
import { usePostsFilter } from "../hooks/usePostsFilter";
import { cn, slugify, formatNumber, formatDate } from "../lib/utils";
import { Post } from "../features/posts/schemas";
import { ScoreBadge } from "../components/ui/Badge";
import { BRUTAL_DESIGN } from "../constants";
import { useAuth } from "../context/AuthProvider";
import { useUserProfile } from "../hooks/useUserQuery";

const { BORDER, SHADOW_LG, ROUNDED, TRANSITION } = BRUTAL_DESIGN;

const getCategoryTheme = (category: string) => {
  const normalized = category.toLowerCase().trim();
  switch (normalized) {
    case "reviews":
      return { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" };
    case "dossiês":
    case "dossies":
      return { dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" };
    case "especial":
      return { dot: "bg-purple-500", text: "text-purple-600 dark:text-purple-400" };
    case "retrocafe":
    case "retro-café":
    case "retrocafé":
      return { dot: "bg-orange-500", text: "text-orange-600 dark:text-orange-400" };
    default:
      return { dot: "bg-purple-500", text: "text-purple-600 dark:text-purple-400" };
  }
};

export default function HomePage() {
  const { isDark } = useThemeStore();
  const { currentUser } = useAuth();
  const { data: profile } = useUserProfile(currentUser?.id);
  const playInsertSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      
      // Insertion clack: low pitch white noise click
      const bufferSize = ctx.sampleRate * 0.05; // 50ms noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(300, now);
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.15, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // Power-on chime: retro synth sine wave beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now + 0.05); // C5
      osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.05, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + 0.05);
      osc.stop(now + 0.25);
    } catch (e) {
      console.log("Audio API not supported or allowed", e);
    }
  };

  const playEjectSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      
      // Eject mechanical clack: pitch sweep down saw wave
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
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

  const [retrocafeScroll, setRetrocafeScroll] = useState({ left: false, right: true });
  const [dossieScroll, setDossieScroll] = useState({ left: false, right: true });
  const [reviewsScroll, setReviewsScroll] = useState({ left: false, right: true });

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
      const scrollAmount = ref.current.clientWidth * 0.8;
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
  const { data: mostViewedPosts = [], isLoading: isLoadingMostViewed } = useMostViewedPosts(5);

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
    }, 400);
    return () => clearTimeout(timer);
  }, [displayRetrocafe, displayDossie, displayReviews, updateScrollState]);

  useEffect(() => {
    const handleResize = () => {
      updateScrollState(retrocafeRef, setRetrocafeScroll);
      updateScrollState(dossieRef, setDossieScroll);
      updateScrollState(reviewsRef, setReviewsScroll);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateScrollState]);

  const gridPosts = isSearching 
    ? filteredPosts.slice(0, 6) 
    : isDefaultView 
    ? latestPosts.slice(0, 6) 
    : paginatedPosts.slice(0, 6);

  const isLoadingPosts = isSearching 
    ? isLoadingAll 
    : (isLoadingFeatured || isLoadingPaginated || isLoadingReviews || isLoadingDossies || isLoadingRetrocafe || isLoadingLatest);

  return (
    <div className="flex flex-col gap-12 relative z-0">
      {/* Ambient Glows */}
      {isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[20%] left-[-15%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse duration-[8000ms]" />
          <div className="absolute top-[50%] right-[-15%] w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[130px] animate-pulse duration-[10000ms]" />
          <div className="absolute top-[80%] left-[10%] w-[350px] h-[350px] bg-amber-500/3 rounded-full blur-[110px] animate-pulse duration-[12000ms]" />
        </div>
      )}
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
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CÉLULA 1: Carousel Destaque (ocupa 2 colunas) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-1.5 h-6 rounded-none", isDark ? "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.7)]" : "bg-purple-600")} />
              <div>
                <h2 className={cn("font-retro text-xl md:text-2xl font-black uppercase tracking-wide leading-none", isDark && "text-glow")}>
                  Em Destaque
                </h2>
                <span className="text-[9px] font-retro font-bold uppercase tracking-wider text-slate-500 block mt-1">
                  Seleção Editorial
                </span>
              </div>
            </div>
            <Carousel posts={carouselPosts} isDark={isDark} />
          </div>

          {/* CÉLULA 2: Mais Lidos (ocupa 1 coluna) */}
          <div className="hidden lg:flex lg:col-span-1 flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-1.5 h-6 rounded-none", isDark ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]" : "bg-amber-500")} />
              <div>
                <h2 className={cn("font-retro text-xl md:text-2xl font-black uppercase tracking-wide leading-none", isDark && "text-glow-amber")}>
                  Mais Lidos
                </h2>
                <span className="text-[9px] font-retro font-bold uppercase tracking-wider text-slate-500 block mt-1">
                  Em Alta no Portal
                </span>
              </div>
            </div>
            
            <div
              className={cn(
                "h-full lg:h-[560px] p-6 rounded-3xl flex flex-col relative overflow-hidden transition-all duration-300 glass-card border-2 border-black dark:border-purple-500/15 shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_rgba(168,85,247,0.15)]"
              )}
            >
              {isDark && (
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />
              )}
              <div className="flex flex-col justify-between h-full relative z-10 gap-3">
                {mostViewedPosts.map((post, idx) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.slug || slugify(post.title)}`}
                    className={cn(
                      "flex items-center gap-4 cursor-pointer group py-2.5 border-b last:border-0 last:pb-0 transition-all duration-300 hover:translate-x-1.5",
                      isDark ? "border-white/5" : "border-black/5"
                    )}
                  >
                    <span className={cn(
                      "text-2xl font-retro font-black trending-number min-w-[32px] select-none",
                      isDark ? "text-purple-400/85 text-glow" : "text-purple-600/60"
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

      {/* ── 2. ROW 2: RetroCafé / Dossiês / Reviews ─────────── */}
      {!isLoadingPosts && isDefaultView && (
        <section className="flex flex-col gap-0">
          {/* Divisor sutil entre seções */}
          <div className={cn("h-px mb-10", isDark ? "bg-white/5" : "bg-black/8")} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">

            {/* ── ESQUERDA (2/3): RetroCafé + Dossiês ── */}
            <div className="lg:col-span-2 flex flex-col gap-10">

              {/* ── RetroCafé ── */}
              <div className="space-y-5">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-3 cursor-pointer group/title"
                    onClick={() => goToCategory("RetroCafé")}
                  >
                    <div className="w-1 h-6 rounded-none bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)] group-hover/title:shadow-[0_0_16px_rgba(249,115,22,0.85)] transition-all" />
                    <div>
                      <h2 className={cn("font-retro text-xl font-black uppercase tracking-wide leading-none group-hover/title:text-orange-400 transition-colors", isDark ? "text-white" : "text-snes-accent")}>
                        RetroCafé
                      </h2>
                      <span className="text-[9px] font-retro font-bold uppercase tracking-wider text-slate-500 block mt-0.5">
                        Crônicas &amp; Nostalgia
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span 
                      onClick={() => goToCategory("RetroCafé")}
                      className="hidden md:flex text-[10px] font-retro font-bold uppercase text-slate-500 hover:text-orange-400 items-center gap-1 transition-colors cursor-pointer"
                    >
                      Ver mais <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Cards RetroCafé */}
                <div className="relative group/scroll-container w-full">
                  <div 
                    ref={retrocafeRef} 
                    onScroll={() => updateScrollState(retrocafeRef, setRetrocafeScroll)}
                    className="flex md:grid overflow-x-auto md:overflow-x-visible md:grid-cols-3 gap-6 pb-4 md:pb-0 scrollbar-hide snap-x snap-mandatory w-full"
                  >
                    {displayRetrocafe.length > 0 ? (
                      displayRetrocafe.map((post, i) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                          className="w-[85vw] sm:w-[320px] md:w-auto shrink-0 snap-start snap-always"
                        >
                          <PostCard post={post} />
                        </motion.div>
                      ))
                    ) : (
                      <div className={cn("col-span-3 p-8 rounded-3xl border-2 border-dashed flex items-center justify-center min-h-[120px] glass-card border-black/10 dark:border-white/10", isDark ? "text-gray-500" : "text-gray-400")}>
                        <span className="text-sm font-retro uppercase">Sem posts de RetroCafé</span>
                      </div>
                    )}
                  </div>

                  {/* Setinhas de navegação/feedback visual no Mobile */}
                  {retrocafeScroll.left && (
                    <button
                      onClick={() => scrollContainer(retrocafeRef, "left")}
                      className="absolute left-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 flex md:hidden items-center justify-center w-8 h-8 rounded-full bg-black/70 dark:bg-black/90 text-white border border-white/20 active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-black/80"
                      aria-label="Deslizar esquerda"
                    >
                      <ChevronLeft className="w-5 h-5 text-orange-400" />
                    </button>
                  )}
                  {retrocafeScroll.right && (
                    <button
                      onClick={() => scrollContainer(retrocafeRef, "right")}
                      className="absolute right-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 flex md:hidden items-center justify-center w-8 h-8 rounded-full bg-black/70 dark:bg-black/90 text-white border border-white/20 active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-black/80"
                      aria-label="Deslizar direita"
                    >
                      <ChevronRight className="w-5 h-5 text-orange-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className={cn("h-px", isDark ? "bg-white/5" : "bg-black/5")} />

              {/* ── Dossiês ── */}
              <div className="space-y-5">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-3 cursor-pointer group/title"
                    onClick={() => goToCategory("Dossiês")}
                  >
                    <div className="w-1 h-6 rounded-none bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] group-hover/title:shadow-[0_0_16px_rgba(59,130,246,0.85)] transition-all" />
                    <div>
                      <h2 className={cn("font-retro text-xl font-black uppercase tracking-wide leading-none group-hover/title:text-blue-400 transition-colors", isDark ? "text-white" : "text-snes-accent")}>
                        Dossiês
                      </h2>
                      <span className="text-[9px] font-retro font-bold uppercase tracking-wider text-slate-500 block mt-0.5">
                        Reportagens Especiais
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span 
                      onClick={() => goToCategory("Dossiês")}
                      className="hidden md:flex text-[10px] font-retro font-bold uppercase text-slate-500 hover:text-blue-400 items-center gap-1 transition-colors cursor-pointer"
                    >
                      Ver mais <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Cards Dossiês */}
                <div className="relative group/scroll-container w-full">
                  <div 
                    ref={dossieRef} 
                    onScroll={() => updateScrollState(dossieRef, setDossieScroll)}
                    className="flex md:grid overflow-x-auto md:overflow-x-visible md:grid-cols-3 gap-6 pb-4 md:pb-0 scrollbar-hide snap-x snap-mandatory w-full"
                  >
                    {displayDossie.length > 0 ? (
                      displayDossie.map((post, i) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
                          className="w-[85vw] sm:w-[320px] md:w-auto shrink-0 snap-start snap-always"
                        >
                          <PostCard post={post} />
                        </motion.div>
                      ))
                    ) : (
                      <div className={cn("col-span-3 p-8 rounded-3xl border-2 border-dashed flex items-center justify-center min-h-[120px] glass-card border-black/10 dark:border-white/10", isDark ? "text-gray-500" : "text-gray-400")}>
                        <span className="text-sm font-retro uppercase">Sem Dossiês Cadastrados</span>
                      </div>
                    )}
                  </div>

                  {/* Setinhas de navegação/feedback visual no Mobile */}
                  {dossieScroll.left && (
                    <button
                      onClick={() => scrollContainer(dossieRef, "left")}
                      className="absolute left-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 flex md:hidden items-center justify-center w-8 h-8 rounded-full bg-black/70 dark:bg-black/90 text-white border border-white/20 active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-black/80"
                      aria-label="Deslizar esquerda"
                    >
                      <ChevronLeft className="w-5 h-5 text-blue-400" />
                    </button>
                  )}
                  {dossieScroll.right && (
                    <button
                      onClick={() => scrollContainer(dossieRef, "right")}
                      className="absolute right-2 top-[calc(50%-8px)] -translate-y-1/2 z-20 flex md:hidden items-center justify-center w-8 h-8 rounded-full bg-black/70 dark:bg-black/90 text-white border border-white/20 active:scale-90 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-black/80"
                      aria-label="Deslizar direita"
                    >
                      <ChevronRight className="w-5 h-5 text-blue-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── DIREITA (1/3): Reviews ── */}
            <div className="lg:col-span-1 flex flex-col gap-5 lg:h-full">
              {/* Cabeçalho */}
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-3 cursor-pointer group/title"
                  onClick={() => goToCategory("Reviews")}
                >
                  <div className="w-1 h-6 rounded-none bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)] group-hover/title:shadow-[0_0_16px_rgba(234,179,8,0.85)] transition-all" />
                  <div>
                    <h2 className={cn("font-retro text-xl font-black uppercase tracking-wide leading-none group-hover/title:text-yellow-400 transition-colors", isDark ? "text-white" : "text-snes-accent")}>
                      Reviews
                    </h2>
                    <span className="text-[9px] font-retro font-bold uppercase tracking-wider text-slate-500 block mt-0.5">
                      Análises com Nota
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span 
                    onClick={() => goToCategory("Reviews")}
                    className="hidden lg:flex text-[10px] font-retro font-bold uppercase text-slate-500 hover:text-yellow-400 items-center gap-1 transition-colors cursor-pointer"
                  >
                    Ver mais <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Cards Reviews */}
              <div className="relative group/scroll-container w-full lg:flex-1 lg:min-h-0 lg:flex lg:flex-col">
                <div 
                  ref={reviewsRef} 
                  onScroll={() => updateScrollState(reviewsRef, setReviewsScroll)}
                  className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-4 pb-4 lg:pb-0 scrollbar-hide snap-x snap-mandatory w-full lg:h-full lg:justify-between"
                >
                  {displayReviews.length > 0 ? (
                    displayReviews.map((post) => {
                      const targetSlug = post.slug || slugify(post.title);
                      const scoreNum = parseFloat(String(post.score ?? 0));
                      const scorePercent = Math.min(100, (scoreNum / 10) * 100);
                      return (
                        <Link
                          key={post.id}
                          to={`/post/${targetSlug}`}
                          className={cn(
                            "relative h-[148px] lg:h-full lg:flex-1 lg:min-h-0 lg:max-h-[148px] rounded-3xl overflow-hidden border-2 border-black dark:border-purple-500/15 shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_rgba(168,85,247,0.15)] transition-all duration-300 group/item flex flex-col justify-end p-4 glass-card w-[85vw] sm:w-[320px] lg:w-auto shrink-0 snap-start snap-always"
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
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-700/20 to-amber-900/30" />
                          )}
                          {/* Gradiente */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                          {/* Score badge */}
                          <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded font-retro font-black text-[11px] bg-black/75 border border-yellow-400/60 text-yellow-400 backdrop-blur-sm shadow-[0_0_8px_rgba(234,179,8,0.25)] group-hover/item:bg-yellow-400 group-hover/item:text-black transition-all duration-300">
                            ★ {post.score ?? "—"}
                          </div>

                          {/* Conteúdo */}
                          <div className="relative z-10 space-y-1">
                            <h4 className="font-bold text-sm text-white group-hover/item:text-yellow-300 transition-colors leading-snug line-clamp-2">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-white/50">
                              <span>{formatNumber(post.views || 0)} views</span>
                              <span>·</span>
                              <span>{formatDate(post.createdAt, post.date ?? undefined)}</span>
                            </div>
                            {post.score && (
                              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden mt-1.5">
                                <div
                                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-300 rounded-full opacity-75 group-hover/item:opacity-100 transition-opacity"
                                  style={{ width: `${scorePercent}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <span className="text-sm font-retro uppercase text-gray-500">Sem Reviews Recentes</span>
                    </div>
                  )}
                </div>

                {/* Setinhas de navegação/feedback visual no Mobile */}
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
        </section>
      )}

      {/* ── 3. FEED DE NOTÍCIAS: Bento Grid de 3 Colunas ── */}
      <section className="flex flex-col gap-6">
        {/* Feed Header */}
        <div className={cn(
          "flex items-center justify-between pb-5",
          isDark ? "border-b border-white/5" : "border-b border-black/10"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn("w-1.5 h-6 rounded-none", isDark ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]" : "bg-blue-600")} />
            <div>
              <h2 className={cn("font-retro text-xl md:text-2xl font-black uppercase tracking-wide leading-none", isDark && "text-glow-blue")}>
                {isLoadingPosts
                  ? "Carregando..."
                  : searchQuery
                  ? `Resultados: "${searchQuery}"`
                  : activeCategory !== "Todos"
                  ? activeCategory
                  : "Últimas Notícias"}
              </h2>
              <span className="text-[9px] font-retro font-bold uppercase tracking-wider text-slate-500 block mt-1">
                Mais Recentes do Portal
              </span>
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

        {/* Feed Content: Clean 3-Column Grid */}
        {isLoadingPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PostSkeleton key={i} isDark={isDark} />
            ))}
          </div>
        ) : gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={cn("p-12 text-center rounded-3xl border-2 border-dashed border-black/10 dark:border-white/10", isDark ? "bg-gray-800/20" : "bg-snes-surface/10")}>
            <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-purple-500 animate-pulse" />
            <p className="font-retro font-bold uppercase text-sm">Nenhum artigo encontrado.</p>
          </div>
        )}
      </section>
    </div>
  );
}

