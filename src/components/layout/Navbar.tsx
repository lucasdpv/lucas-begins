import React from "react";
import Image from "next/image";
import { Link } from "@/lib/router-compat";
import { Search, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

// Hooks
import { useAuth } from "../../context/AuthProvider";
import { useThemeStore } from "../../store/useThemeStore";
import { useUIStore } from "../../store/useUIStore";
import { SITE_CATEGORIES } from "../../features/posts/utils/categoryInfo";
import { useAllPosts } from "../../features/posts/hooks/usePostsQuery";
import { useUserProfile } from "../../hooks/useUserQuery";
import { useNavbar } from "./Navbar/useNavbar";

// Components
import NavCategoryMenu from "./Navbar/NavCategoryMenu";
import NavUserMenu from "./Navbar/NavUserMenu";
import MobileMenu from "./Navbar/MobileMenu";

export default function Navbar() {
  const { setIsLoginModalOpen, searchQuery, activeCategory, setSearchQuery } = useUIStore();

  const { isDark, toggleTheme } = useThemeStore();
  const { currentUser, handleLogout } = useAuth();
  const { data: profile } = useUserProfile(currentUser?.id);
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isCategoryMenuOpen,
    setIsCategoryMenuOpen,
    isVisible,
    isSearchExpanded,
    setIsSearchExpanded,
    isMobileCategoriesOpen,
    setIsMobileCategoriesOpen,
    handleSearch,
    handleCancelSearch,
    handleCategorySelect,
  } = useNavbar();

  const shouldLoadPosts = isSearchExpanded || searchQuery.trim() !== "" || isSearchFocused;
  const { data: allPosts = [] } = useAllPosts(shouldLoadPosts);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (window.innerWidth >= 1024) {
          searchInputRef.current?.focus();
          setIsSearchFocused(true);
        } else {
          setIsSearchExpanded(true);
        }
      } else if (e.key === "Escape") {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setIsSearchExpanded]);

  React.useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const quickResults = React.useMemo(() => {
    const published = (allPosts as any[]).filter((p) => !p.isDraft);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return published.slice(0, 5);
    return published
      .filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [allPosts, searchQuery]);


  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-transform duration-300 ease-out transform-gpu border-b",
          isDark
            ? "border-white/[0.08] bg-[#090812]/95 shadow-[0_10px_28px_-12px_rgba(0,0,0,0.85)]"
            : "border-slate-200/80 bg-white/95 shadow-sm",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        {/* Subtle Top Streaming Glow Line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent pointer-events-none" />

        <div className="layout-container h-20 flex items-center justify-between gap-4 relative">
          {/* ── ESQUERDA: Logo + Navegação Padronizada ── */}
          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/"
              className="flex items-center gap-3 group shrink-0"
              onClick={() => {
                handleCategorySelect("Todos");
                setSearchQuery("");
              }}
            >
              <div className="relative">
                <Image
                  src="/icon-bp.png"
                  alt="BeginsProject Logo"
                  width={44}
                  height={44}
                  className="w-11 h-11 object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -inset-1.5 bg-purple-500/25 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <h1
                  className={cn(
                    "font-retro font-black text-xl md:text-2xl tracking-tight uppercase transition-all notranslate leading-none",
                    isDark ? "text-white" : "text-slate-900"
                  )}
                  translate="no"
                >
                  Begins<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Project</span>
                </h1>
                <span className="text-[8px] font-mono uppercase tracking-[0.28em] text-purple-400/80 mt-0.5 hidden sm:inline">
                  GAMES · ANIMES · NOSTALGIA
                </span>
              </div>
            </Link>

            <div className={cn("hidden lg:block w-px h-6 mx-1 shrink-0", isDark ? "bg-white/10" : "bg-slate-200")} />

            <nav className="hidden lg:flex items-center gap-1 whitespace-nowrap">
              <NavCategoryMenu
                categories={SITE_CATEGORIES}
                activeCategory={activeCategory}
                isOpen={isCategoryMenuOpen}
                setIsOpen={setIsCategoryMenuOpen}
                onSelect={handleCategorySelect}
                isDark={isDark}
              />

              <Link
                to="/archive"
                className={cn(
                  "px-3.5 py-2 rounded-xl font-retro font-black text-xs uppercase tracking-widest leading-none transition-all",
                  isDark
                    ? "text-slate-200 hover:text-purple-400 hover:bg-white/[0.04]"
                    : "text-slate-700 hover:text-purple-700 hover:bg-slate-100"
                )}
              >
                Catálogo
              </Link>
            </nav>
          </div>

          {/* ── CENTRO: Barra de Busca Estável (Logado ou Deslogado) ── */}
          <div
            ref={searchContainerRef}
            className="hidden lg:flex flex-1 max-w-md xl:max-w-lg 2xl:max-w-xl mx-4 relative"
          >
            <div
              className={cn(
                "flex items-center px-4 h-11 w-full rounded-xl border transition-all duration-300 group/search relative overflow-hidden",
                isDark
                  ? "bg-white/[0.04] border-white/[0.1] focus-within:border-purple-500/70 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:border-white/20"
                  : "bg-slate-100/90 border-slate-200/90 focus-within:border-purple-500 focus-within:bg-white focus-within:shadow-md hover:bg-slate-100"
              )}
            >
              <Search
                className={cn(
                  "w-4 h-4 transition-all duration-300 mr-3 shrink-0",
                  isDark
                    ? "text-purple-400/70 group-focus-within/search:text-purple-400"
                    : "text-purple-600/70 group-focus-within/search:text-purple-600"
                )}
              />

              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar jogos, animes, dossiês ou reviews..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className={cn(
                  "w-full bg-transparent border-none font-retro font-bold text-xs uppercase tracking-wider outline-none",
                  isDark
                    ? "text-white placeholder:text-slate-500"
                    : "text-slate-900 placeholder:text-slate-400"
                )}
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  className="text-slate-400 hover:text-rose-400 p-1 shrink-0 transition-colors cursor-pointer"
                  title="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown de Resultados Instantâneos (Largura Garantida) */}
            <AnimatePresence>
              {isSearchFocused && quickResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  style={{ minWidth: "420px" }}
                  className={cn(
                    "absolute top-14 left-0 w-full rounded-2xl border z-[80] overflow-hidden backdrop-blur-2xl",
                    isDark
                      ? "bg-[#121024]/95 border-white/10 text-white shadow-[0_24px_60px_rgba(0,0,0,0.85)]"
                      : "bg-white/95 border-slate-200 text-slate-900 shadow-2xl"
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-2.5 border-b flex items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-widest whitespace-nowrap",
                      isDark
                        ? "border-white/[0.07] bg-white/[0.02] text-purple-300"
                        : "border-slate-100 bg-slate-50/80 text-purple-700"
                    )}
                  >
                    <span className="truncate">
                      {searchQuery.trim()
                        ? `Resultados para "${searchQuery.trim()}"`
                        : "Em Alta · Acesso Rápido"}
                    </span>
                    <span className="opacity-60 shrink-0">ESC para fechar</span>
                  </div>

                  <div className="divide-y divide-white/[0.05] max-h-[360px] overflow-y-auto retro-scrollbar p-1.5">
                    {quickResults.map((p: any) => (
                      <Link
                        key={p.id}
                        to={`/post/${p.slug || p.id}`}
                        onClick={() => setIsSearchFocused(false)}
                        className={cn(
                          "flex items-center gap-3.5 p-2.5 rounded-xl transition-all group",
                          isDark ? "hover:bg-white/[0.06]" : "hover:bg-purple-50/70"
                        )}
                      >
                        <div className="w-16 h-11 rounded-lg border border-white/10 shrink-0 overflow-hidden bg-purple-950/50 relative">
                          {p.imageUrl && (
                            <img
                              src={p.imageUrl}
                              alt={p.title}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-retro font-bold text-[9px] uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 whitespace-nowrap">
                              {p.category}
                            </span>
                            {p.score && (
                              <span className="font-retro font-bold text-[9px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 whitespace-nowrap">
                                ★ {p.score}
                              </span>
                            )}
                          </div>
                          <p className="font-retro font-bold text-xs uppercase truncate group-hover:text-purple-400 transition-colors">
                            {p.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div
                    className={cn(
                      "px-4 py-2.5 border-t flex items-center justify-between gap-4 whitespace-nowrap",
                      isDark ? "border-white/[0.07] bg-white/[0.02]" : "border-slate-100 bg-slate-50"
                    )}
                  >
                    <Link
                      to="/archive"
                      onClick={() => setIsSearchFocused(false)}
                      className="font-retro font-bold text-[10px] uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      → Ver catálogo completo
                    </Link>
                    <span className="font-mono text-[10px] opacity-50">
                      {quickResults.length} títulos
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── DIREITA: Ferramentas & Usuário (Tipografia Padronizada) ── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile/Tablet Search Overlay */}
            <AnimatePresence>
              {isSearchExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "absolute inset-x-0 top-0 h-20 z-[60] flex items-center px-4 gap-3",
                    isDark ? "bg-[#090812]/95 backdrop-blur-xl" : "bg-white/95 backdrop-blur-xl"
                  )}
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                    <input
                      type="text"
                      placeholder="Buscar no catálogo..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && setIsSearchExpanded(false)}
                      onFocus={() => setIsSearchFocused(true)}
                      autoFocus
                      className={cn(
                        "w-full pl-12 pr-12 py-3 rounded-xl border font-retro font-bold uppercase tracking-wider outline-none text-xs transition-all",
                        isDark
                          ? "bg-white/[0.06] border-white/15 focus:border-purple-500 text-white placeholder:text-slate-400"
                          : "bg-slate-100 border-slate-200 focus:border-purple-600 text-slate-900 placeholder:text-slate-400"
                      )}
                    />
                    <button
                      onClick={handleCancelSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Core Tools (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-2">
              <NavUserMenu
                currentUser={currentUser}
                profile={profile}
                onLogout={handleLogout}
                onLoginClick={() => setIsLoginModalOpen(true)}
                isDark={isDark}
              />
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsSearchExpanded(true)}
                className={cn(
                  "p-2.5 rounded-xl border transition-all active:scale-95",
                  isDark
                    ? "bg-white/[0.05] border-white/10 text-purple-400"
                    : "bg-slate-100 border-slate-200 text-purple-600"
                )}
              >
                <Search size={20} />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  "p-2.5 rounded-xl border transition-all active:scale-95",
                  isDark
                    ? "bg-white/[0.05] border-white/10 text-purple-400"
                    : "bg-slate-100 border-slate-200 text-purple-600"
                )}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        profile={profile}
        handleLogout={handleLogout}
        onLoginClick={() => setIsLoginModalOpen(true)}
        categories={SITE_CATEGORIES}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        isCategoriesOpen={isMobileCategoriesOpen}
        setIsCategoriesOpen={setIsMobileCategoriesOpen}
      />
    </>
  );
}
