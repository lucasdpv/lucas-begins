import React from "react";
import { Link } from "react-router-dom";
import { 
  Gamepad2, 
  Search, 
  Moon, 
  Sun, 
  X, 
  PlusCircle, 
  Menu 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { BRUTAL_DESIGN } from "../../constants";
import { InstagramIcon, ThreadsIcon } from "../icons/SocialIcons";

// Hooks
import { useAuth } from "../../context/AuthProvider";
import { useThemeStore } from "../../store/useThemeStore";
import { useUIStore } from "../../store/useUIStore";
import { useCategories } from "../../features/posts/hooks/useCategoriesQuery";
import { useAllPosts } from "../../features/posts/hooks/usePostsQuery";
import { useUserProfile } from "../../hooks/useUserQuery";
import { useNavbar } from "./Navbar/useNavbar";

// Components
import NavCategoryMenu from "./Navbar/NavCategoryMenu";
import NavUserMenu from "./Navbar/NavUserMenu";
import MobileMenu from "./Navbar/MobileMenu";

export default function Navbar() {
  const {
    setIsLoginModalOpen,
    searchQuery,
    activeCategory,
    setSearchQuery
  } = useUIStore();

  const { isDark, toggleTheme } = useThemeStore();
  const { currentUser, handleLogout } = useAuth();
  const { data: profile } = useUserProfile(currentUser?.id);
  const { data: categories = [] } = useCategories();
  const { data: allPosts = [] } = useAllPosts();

  // Filtra apenas categorias que possuem pelo menos um post publicado
  const activeCategories = React.useMemo(() => {
    return categories.filter(cat => 
      allPosts.some(post => post.category === cat && !post.isDraft)
    );
  }, [categories, allPosts]);

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
    handleCategorySelect
  } = useNavbar();

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 border-b-4",
          isDark ? "border-purple-600/30 bg-gray-900/60 backdrop-blur-xl shadow-2xl" : "border-snes-dark/10 bg-white/70 backdrop-blur-md shadow-lg",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        {/* Neon Accent Bottom Line */}
        <div className="absolute -bottom-[4px] left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />

        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4 md:gap-8 relative">
          {/* Esquerda: Branding & Navegação Principal */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="flex items-center gap-2 group shrink-0 pr-4 border-r-2 border-purple-500/10">
              <Link to="/" className="flex items-center gap-3" onClick={() => { handleCategorySelect("Todos"); setSearchQuery(""); }}>
                <div className="relative">
                  <Gamepad2 className={cn("w-8 h-8 transition-transform group-hover:-rotate-12 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]", isDark ? "text-purple-400" : "text-purple-600")} />
                  <div className="absolute -inset-1 bg-purple-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h1 className={cn(
                  "font-retro font-bold text-xl md:text-2xl tracking-tighter uppercase transition-all",
                  isDark ? "text-white text-glow" : "text-gray-900"
                )}>
                  Begins<span className="text-purple-500 inline-block animate-glitch drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">Project</span>
                </h1>
              </Link>
            </div>

            <div className="hidden xl:flex items-center whitespace-nowrap">
              <NavCategoryMenu 
                categories={activeCategories}
                activeCategory={activeCategory}
                isOpen={isCategoryMenuOpen}
                setIsOpen={setIsCategoryMenuOpen}
                onSelect={handleCategorySelect}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Centro: Command Bar (The Search Centerpiece) */}
          <div className="hidden xl:flex flex-1 justify-center px-8">
            <div className={cn(
              "flex items-center px-4 h-10 w-full max-w-2xl rounded-none border-2 transition-all duration-500 group/search relative overflow-hidden",
              isDark 
                ? "bg-gray-800/40 border-purple-500/20 focus-within:border-purple-500 shadow-[4px_4px_0px_rgba(168,85,247,0.15)] hover:bg-gray-800/60" 
                : "bg-gray-50 border-snes-dark/10 focus-within:border-purple-600 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] hover:bg-gray-100"
            )}>
              {/* Scanline Effect inside Search */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
              
              <Search className={cn(
                "w-4 h-4 transition-all duration-300 mr-2",
                isDark ? "text-purple-400/50 group-focus-within/search:text-purple-400 group-focus-within/search:scale-110" : "text-purple-600/50"
              )} />
              
              <input
                type="text"
                placeholder="EXECUTAR BUSCA NO SISTEMA..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={cn(
                  "w-full bg-transparent border-none font-retro font-bold text-[10px] outline-none uppercase tracking-[0.2em]",
                  isDark ? "text-white placeholder:text-white/30" : "text-black placeholder:text-black/50"
                )}
              />
            </div>
          </div>

          {/* Direita: Utility Zone */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Mobile/Tablet Search Overlay */}
            <AnimatePresence>
              {isSearchExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "absolute inset-x-0 top-0 h-20 z-[60] flex items-center px-4 gap-3",
                    isDark ? "bg-gray-900/95 backdrop-blur-md" : "bg-white/95 backdrop-blur-md"
                  )}
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                    <input
                      type="text"
                      placeholder="PESQUISAR NO BLOG..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsSearchExpanded(false)}
                      autoFocus
                      className={cn(
                        "w-full pl-12 pr-12 py-3 rounded-none border-2 font-retro font-bold outline-none text-sm transition-all",
                        isDark 
                          ? "bg-gray-800 border-purple-500/30 focus:border-purple-500 text-white placeholder:text-white/30" 
                          : "bg-gray-50 border-gray-200 focus:border-purple-600 text-gray-900 placeholder:text-gray-900/60"
                      )}
                    />
                    <button
                      onClick={handleCancelSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={22} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social Group (Desktop Only) */}
            <div className="hidden xl:flex items-center gap-3 pr-6 border-r-2 border-purple-500/10">
                <a
                  href="https://www.threads.com/@lucasbegins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-9 h-9 flex items-center justify-center transition-all hover:-translate-y-1 rounded-none border-2 group/social",
                    isDark 
                      ? "bg-white/5 border-white/10 hover:border-white hover:bg-white/10 shadow-[2px_2px_0px_rgba(255,255,255,0.1)]" 
                      : "bg-black/5 border-black/10 hover:border-black hover:bg-black/10 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                  )}
                  title="Threads"
                >
                  <ThreadsIcon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isDark ? "text-gray-400 group-hover/social:text-white" : "text-gray-600 group-hover/social:text-black"
                  )} />
                </a>
                
                <a
                  href="https://www.instagram.com/lucasbegins/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-9 h-9 flex items-center justify-center transition-all hover:-translate-y-1 rounded-none border-2 group/social",
                    isDark 
                      ? "bg-pink-500/5 border-pink-500/20 hover:border-pink-500 hover:bg-pink-500/10 shadow-[2px_2px_0px_rgba(228,64,95,0.1)]" 
                      : "bg-pink-500/5 border-pink-500/20 hover:border-pink-500 hover:bg-pink-500/10 shadow-[2px_2px_0px_rgba(228,64,95,0.1)]"
                  )}
                  title="Instagram"
                >
                  <InstagramIcon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isDark ? "text-pink-500/40 group-hover/social:text-pink-500" : "text-pink-600/60 group-hover/social:text-pink-600"
                  )} />
                </a>
            </div>

            {/* Core Tools (Desktop Only) */}
            <div className="hidden xl:flex items-center gap-3">
              <button 
                onClick={toggleTheme} 
                className={cn(
                  "p-2 transition-all active:scale-90 hover:bg-purple-500/10 border-2 border-transparent hover:border-purple-500/20",
                  isDark ? "text-yellow-400" : "text-purple-600"
                )}
                title="Trocar Tema"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <NavUserMenu 
                currentUser={currentUser}
                profile={profile}
                onLogout={handleLogout}
                onLoginClick={() => setIsLoginModalOpen(true)}
                isDark={isDark}
              />
            </div>

            {/* Mobile Actions (Visible on Mobile/Tablet, Hidden on XL) */}
            <div className="flex items-center gap-2 xl:hidden">
              <button
                onClick={() => setIsSearchExpanded(true)}
                className={cn(
                  "p-2.5 rounded-none border-2 transition-all active:scale-95 shadow-[4px_4px_0px_rgba(168,85,247,0.1)]",
                  isDark ? "bg-gray-900 border-purple-500 text-purple-400" : "bg-purple-50 border-purple-500 text-purple-600"
                )}
              >
                <Search size={22} />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  "p-2.5 rounded-none border-2 transition-all active:scale-95 shadow-[4px_4px_0px_rgba(168,85,247,0.1)]",
                  isDark ? "bg-gray-800 border-purple-500 text-purple-400" : "bg-purple-50 border-purple-500 text-purple-600"
                )}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        profile={profile}
        handleLogout={handleLogout}
        onLoginClick={() => setIsLoginModalOpen(true)}
        categories={activeCategories}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        isCategoriesOpen={isMobileCategoriesOpen}
        setIsCategoriesOpen={setIsMobileCategoriesOpen}
      />
    </>
  );
}
