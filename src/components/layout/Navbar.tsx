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

        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4 relative">
          {/* Esquerda: Logo */}
          <div className="flex items-center gap-2 group shrink-0">
            <Link to="/" className="flex items-center gap-2" onClick={() => { handleCategorySelect("Todos"); setSearchQuery(""); }}>
              <Gamepad2 className={cn("w-8 h-8 transition-transform group-hover:rotate-12 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]", isDark ? "text-purple-400" : "text-purple-600")} />
              <h1 className={cn(
                "font-retro font-bold text-xl md:text-3xl tracking-tighter uppercase transition-all",
                isDark ? "text-white text-glow" : "text-gray-900"
              )}>
                Lucas<span className="text-purple-500 inline-block animate-glitch drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">Begins</span>
              </h1>
            </Link>
          </div>

          {/* Centro: Links de Navegação (Desktop) */}
          <div className="hidden xl:flex items-center gap-1 flex-1 justify-center px-4 whitespace-nowrap">
            <NavCategoryMenu 
              categories={activeCategories}
              activeCategory={activeCategory}
              isOpen={isCategoryMenuOpen}
              setIsOpen={setIsCategoryMenuOpen}
              onSelect={handleCategorySelect}
              isDark={isDark}
            />

            <Link 
              to="/about" 
              className="px-3 py-2 font-retro font-black uppercase tracking-[0.15em] text-sm whitespace-nowrap relative group/link transition-colors hover:text-purple-400"
            >
              Sobre Nós
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 group-hover/link:w-full transition-all duration-300 shadow-[0_0_8px_rgba(168,85,247,1)]" />
            </Link>
            <Link 
              to="/contact" 
              className="px-3 py-2 font-retro font-black uppercase tracking-[0.15em] text-sm whitespace-nowrap relative group/link transition-colors hover:text-purple-400"
            >
              Contatos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 group-hover/link:w-full transition-all duration-300 shadow-[0_0_8px_rgba(168,85,247,1)]" />
            </Link>
          </div>

          {/* Direita: Ações */}
          <div className="flex items-center gap-2 md:gap-3">
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
                        "w-full pl-12 pr-12 py-3 rounded-2xl border-2 font-bold outline-none text-sm transition-all",
                        isDark 
                          ? "bg-gray-800 border-purple-500/30 focus:border-purple-500 text-white" 
                          : "bg-gray-50 border-gray-200 focus:border-purple-600 text-gray-900"
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

            {/* --- SEAMLESS ACTION ZONE (Desktop) --- */}
            <div className="hidden xl:flex items-center gap-6">
              {/* Minimal Search Pill */}
              <div className={cn(
                "flex items-center px-4 h-9 rounded-full transition-all duration-300 min-w-[180px] border border-transparent focus-within:border-purple-500/50 group/search",
                isDark ? "bg-white/10 hover:bg-white/15" : "bg-gray-100 hover:bg-gray-200"
              )}>
                <Search className={cn(
                  "w-4 h-4 opacity-40 group-focus-within/search:opacity-100",
                  isDark ? "text-purple-400" : "text-purple-600"
                )} />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className={cn(
                    "w-full bg-transparent border-none font-bold text-xs outline-none px-3 placeholder:opacity-30",
                    isDark ? "text-white" : "text-black"
                  )}
                />
              </div>

              {/* Individual Actions (Integrated) */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={toggleTheme} 
                  className={cn(
                    "p-2.5 rounded-xl transition-all active:scale-90 hover:bg-white/5",
                    isDark ? "text-yellow-400" : "text-purple-600"
                  )}
                  title="Trocar Tema"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <a
                  href="https://www.threads.com/@lucasbegins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 text-gray-400 hover:text-white transition-all hover:scale-110 hover:bg-white/5 rounded-xl"
                >
                  <ThreadsIcon className="w-4 h-4" />
                </a>
                
                <a
                  href="https://www.instagram.com/lucasbegins/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 text-gray-400 hover:text-white transition-all hover:scale-110 hover:bg-white/5 rounded-xl"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>

                <NavUserMenu 
                  currentUser={currentUser}
                  profile={profile}
                  onLogout={handleLogout}
                  onLoginClick={() => setIsLoginModalOpen(true)}
                  isDark={isDark}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchExpanded(true)}
                className={cn(
                  "p-2.5 xl:hidden rounded-xl border-2 transition-all active:scale-95",
                  isDark ? "bg-gray-900 border-purple-500 text-purple-400" : "bg-purple-50 border-purple-500 text-purple-600"
                )}
              >
                <Search size={22} />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  "p-2.5 xl:hidden rounded-xl border-2 transition-all active:scale-95",
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
