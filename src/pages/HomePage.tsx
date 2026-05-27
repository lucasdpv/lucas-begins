import React, { useEffect, useCallback } from "react";
import { Gamepad2, ChevronRight, LayoutGrid, Map, Layers } from "lucide-react";
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
  usePosts 
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

  // 3. Reviews - Puxa no máximo 3 posts mais recentes da categoria Reviews
  const { data: reviewPosts = [], isLoading: isLoadingReviews } = usePostsByCategory("Reviews", 3);

  // 4. Dossiês - Puxa no máximo 3 posts mais recentes da categoria Dossiês
  const { data: dossiePosts = [], isLoading: isLoadingDossies } = usePostsByCategory("Dossiês", 3);

  // 4.5. RetroCafé - Puxa no máximo 3 posts mais recentes da categoria RetroCafé
  const { data: retrocafePosts = [], isLoading: isLoadingRetrocafe } = usePostsByCategory("RetroCafé", 3);

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

  // Grid exibe no máximo 6 itens para um grid de 3 colunas balanceado
  const gridPosts = isSearching ? filteredPosts.slice(0, 6) : paginatedPosts.slice(0, 6);
  const isLoadingPosts = isSearching 
    ? isLoadingAll 
    : (isLoadingFeatured || isLoadingPaginated || isLoadingReviews || isLoadingDossies || isLoadingRetrocafe);

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
              </div>
            </div>
            <Carousel posts={featuredPosts.slice(0, 5)} isDark={isDark} />
          </div>

          {/* CÉLULA 2: Mais Lidos (ocupa 1 coluna) */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-1.5 h-6 rounded-none", isDark ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]" : "bg-amber-500")} />
              <div>
                <h2 className={cn("font-retro text-xl md:text-2xl font-black uppercase tracking-wide leading-none", isDark && "text-glow-amber")}>
                  Mais Lidos
                </h2>
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

      {/* ── 2. ROW 2 BENTO GRID: Dossiês Spotlight + RetroCafé Grid + Reviews Scoreboard ─────────── */}
      {!isLoadingPosts && isDefaultView && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CÉLULA ESQUERDA (2/3 de largura): Destaques Editoriais */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Título Principal Dossiês */}
            <div className="flex items-center gap-3">
              <div className={cn("w-1.5 h-6 rounded-none", isDark ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]" : "bg-blue-600")} />
              <h2 className={cn("font-retro text-xl md:text-2xl font-black uppercase tracking-wide leading-none", isDark ? "text-blue-400 text-glow-blue" : "text-snes-accent")}>
                Dossiês & Especial
              </h2>
            </div>

            {/* Spotlight Dossiê Card */}
            {dossiePosts[0] ? (
              <div
                className={cn(
                  "w-full p-6 md:p-8 rounded-3xl relative overflow-hidden border-2 transition-all duration-300 glass-card flex flex-col md:flex-row gap-6 items-stretch",
                  isDark ? "border-purple-500/10 shadow-[6px_6px_0px_rgba(0,0,0,0.35)]" : "border-black/5 shadow-[6px_6px_0px_rgba(45,27,105,0.05)]"
                )}
              >
                {/* Scanlines overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(168,85,247,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px]" />
                
                {/* Imagem do Dossiê */}
                {dossiePosts[0].imageUrl && (
                  <div className="w-full md:w-1/2 aspect-video md:aspect-[4/3] lg:aspect-[16/10] rounded-2xl overflow-hidden shrink-0 border border-black/10 dark:border-white/5 relative group/img">
                    <img
                      src={dossiePosts[0].imageUrl}
                      alt={dossiePosts[0].title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 text-[9px] font-retro font-bold text-blue-400 uppercase tracking-widest bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded">
                      Destaque
                    </span>
                  </div>
                )}

                {/* Texto do Dossiê */}
                <div className="flex flex-col justify-between flex-grow gap-4 py-1">
                  <div className="space-y-3">
                    <Link
                      to={`/post/${dossiePosts[0].slug || slugify(dossiePosts[0].title)}`}
                      className="group/link block"
                    >
                      <h3 className={cn(
                        "font-retro font-black text-base md:text-lg lg:text-xl transition-colors leading-snug",
                        isDark ? "text-white group-hover/link:text-blue-300 text-glow-blue" : "text-gray-900 group-hover/link:text-blue-600"
                      )}>
                        {dossiePosts[0].title}
                      </h3>
                    </Link>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {dossiePosts[0].excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-[9px] md:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-t border-black/5 dark:border-white/5 pt-3">
                    <span>{formatDate(dossiePosts[0].createdAt, dossiePosts[0].date)}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 dark:bg-slate-600" />
                    <span>{formatNumber(dossiePosts[0].views || 0)} views</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={cn(
                "w-full p-8 rounded-3xl border-2 border-dashed flex items-center justify-center min-h-[200px]",
                isDark ? "border-white/10 text-gray-500" : "border-black/10 text-gray-400"
              )}>
                <span className="text-sm font-retro uppercase">Sem Dossiês Cadastrados</span>
              </div>
            )}

            {/* Subtítulo RetroCafé */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className={cn("w-1.5 h-5 rounded-none", isDark ? "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.7)]" : "bg-orange-600")} />
                <h3 className={cn("font-retro text-sm md:text-base font-black uppercase tracking-wide leading-none", isDark ? "text-orange-400 text-glow" : "text-gray-700 dark:text-gray-300")}>
                  RetroCafé
                </h3>
              </div>
              <button
                onClick={() => goToCategory("RetroCafé")}
                className="text-[9px] md:text-xs font-retro font-black uppercase text-orange-400 hover:text-orange-300 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                VER MAIS <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grid de Cards RetroCafé */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {retrocafePosts.length > 0 ? (
                retrocafePosts.slice(0, 2).map((post) => {
                  const targetSlug = post.slug || slugify(post.title);
                  return (
                    <article
                      key={post.id}
                      className={cn(
                        "p-5 rounded-3xl border-2 transition-all duration-300 glass-card flex flex-col justify-between gap-4 group hover:translate-y-[-4px]",
                        isDark 
                          ? "border-purple-500/10 shadow-[6px_6px_0px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_24px_rgba(249,115,22,0.08)]" 
                          : "border-black/5 shadow-[6px_6px_0px_rgba(45,27,105,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.05)]"
                      )}
                    >
                      {/* Thumbnail do RetroCafé */}
                      {post.imageUrl ? (
                        <div className="w-full aspect-video rounded-2xl overflow-hidden border border-black/10 dark:border-white/5 bg-gray-900 shrink-0 relative group/img">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-orange-600 to-amber-800 shrink-0 flex items-center justify-center">
                          <span className="font-retro text-xs text-white uppercase opacity-50">RetroCafé</span>
                        </div>
                      )}

                      {/* Info & Título */}
                      <div className="flex flex-col justify-between flex-grow gap-3">
                        <Link to={`/post/${targetSlug}`} className="block">
                          <h4 className={cn(
                            "font-bold text-sm md:text-base leading-snug line-clamp-2 transition-colors duration-200",
                            isDark ? "text-gray-100 group-hover:text-orange-300" : "text-gray-900 group-hover:text-orange-600"
                          )}>
                            {post.title}
                          </h4>
                        </Link>

                        <div className="flex items-center gap-3 text-[9px] md:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-auto border-t border-black/5 dark:border-white/5 pt-2">
                          <span>{formatDate(post.createdAt, post.date)}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-500" />
                          <span>{formatNumber(post.views || 0)} views</span>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className={cn(
                  "col-span-2 p-8 rounded-3xl border-2 border-dashed flex items-center justify-center min-h-[150px]",
                  isDark ? "border-white/10 text-gray-500" : "border-black/10 text-gray-400"
                )}>
                  <span className="text-sm font-retro uppercase">Sem posts de RetroCafé</span>
                </div>
              )}
            </div>
          </div>

          {/* CÉLULA DIREITA (1/3 de largura): Placar de Reviews */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => goToCategory("Reviews")}>
              <div className="w-1.5 h-6 rounded-none bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.7)] group-hover:shadow-[0_0_16px_rgba(234,179,8,0.9)] transition-all" />
              <h2 className={cn("font-retro text-xl md:text-2xl font-black uppercase tracking-wide leading-none group-hover:text-yellow-400 transition-colors", isDark ? "text-white text-glow-amber" : "text-snes-accent")}>
                Reviews
              </h2>
            </div>

            {/* Listagem em Cards de Capa Inteira */}
            <div className="flex-grow flex flex-col gap-4 h-full">
              {reviewPosts.length > 0 ? (
                reviewPosts.slice(0, 3).map((post) => {
                  const targetSlug = post.slug || slugify(post.title);
                  return (
                    <Link
                      key={post.id}
                      to={`/post/${targetSlug}`}
                      className={cn(
                        "relative h-[150px] lg:flex-1 rounded-3xl overflow-hidden border-2 transition-all duration-300 group/item flex flex-col justify-end p-5",
                        isDark 
                          ? "border-purple-500/10 shadow-[6px_6px_0px_rgba(0,0,0,0.35)] hover:border-yellow-500/40 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]" 
                          : "border-black/5 shadow-[6px_6px_0px_rgba(45,27,105,0.05)] hover:border-yellow-600/40 hover:shadow-[0_0_20px_rgba(234,179,8,0.05)]"
                      )}
                    >
                      {/* Scanlines overlay */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(168,85,247,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] z-10" />

                      {/* Imagem de Capa */}
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-85 dark:opacity-75 transition-all duration-500 group-hover/item:scale-105 group-hover/item:opacity-100"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-amber-900/20" />
                      )}

                      {/* Gradiente de Escurecimento para Legibilidade */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0" />

                      {/* Flutuante Top-Right: Neon Score Badge */}
                      {post.score ? (
                        <div className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center font-retro font-black text-[11px] border-2 bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)] z-20 group-hover/item:scale-105 group-hover/item:bg-yellow-400 group-hover/item:text-black transition-all">
                          ★{post.score}
                        </div>
                      ) : (
                        <div className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center font-retro font-black text-[11px] border-2 bg-gray-500/20 border-gray-400 text-gray-400 z-20">
                          N/A
                        </div>
                      )}

                      {/* Conteúdo do Card */}
                      <div className="relative z-10 space-y-1">
                        <h4 className="font-bold text-sm md:text-base text-white group-hover/item:text-yellow-300 transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-wider text-slate-300">
                          <span>{formatNumber(post.views || 0)} views</span>
                          <span className="w-1 h-1 rounded-full bg-slate-400" />
                          <span>{formatDate(post.createdAt, post.date)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className={cn(
                  "w-full flex-grow p-8 rounded-3xl border-2 border-dashed flex items-center justify-center min-h-[200px]",
                  isDark ? "border-white/10 text-gray-500" : "border-black/10 text-gray-400"
                )}>
                  <span className="text-sm font-retro uppercase text-gray-500">Sem Reviews Recentes</span>
                </div>
              )}
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

