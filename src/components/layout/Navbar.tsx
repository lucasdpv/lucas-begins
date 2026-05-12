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
          isDark ? "border-purple-600 bg-gray-900" : "border-snes-dark bg-snes-light",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4 relative">
          {/* Esquerda: Logo */}
          <div className="flex items-center gap-2 group shrink-0">
            <Link to="/" className="flex items-center gap-2" onClick={() => { handleCategorySelect("Todos"); setSearchQuery(""); }}>
              <Gamepad2 className={cn("w-8 h-8 transition-transform group-hover:rotate-12", isDark ? "text-purple-400" : "text-purple-600")} />
              <h1 className="font-retro font-bold text-xl md:text-3xl tracking-tighter uppercase">
                Lucas<span className="text-purple-500 inline-block animate-glitch">Begins</span>
              </h1>
            </Link>
          </div>

          {/* Centro: Links de Navegação (Desktop) */}
          <div className="hidden xl:flex items-center gap-1 flex-1 justify-center px-4 whitespace-nowrap">
            <NavCategoryMenu 
              categories={categories}
              activeCategory={activeCategory}
              isOpen={isCategoryMenuOpen}
              setIsOpen={setIsCategoryMenuOpen}
              onSelect={handleCategorySelect}
              isDark={isDark}
            />

            <Link to="/about" className="px-3 py-2 font-retro font-bold uppercase tracking-widest hover:text-purple-500 transition-colors text-sm whitespace-nowrap">Sobre Nós</Link>
            <Link to="/contact" className="px-3 py-2 font-retro font-bold uppercase tracking-widest hover:text-purple-500 transition-colors text-sm whitespace-nowrap">Contatos</Link>
          </div>

          {/* Direita: Ações */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop Search Bar */}
            <div className="hidden xl:block relative w-48 xl:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 opacity-50 group-focus-within:opacity-100 transition-opacity" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-10 py-2 outline-none text-sm transition-all border-2 rounded-xl",
                  isDark 
                    ? "bg-gray-800/50 border-purple-500/20 focus:border-purple-500/50 text-white" 
                    : "bg-white border-gray-200 focus:border-purple-500 text-gray-900"
                )}
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-y-0 right-2 flex items-center"
                  >
                    <button
                      onClick={handleCancelSearch}
                      className="p-1.5 hover:bg-gray-500/10 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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

            {!isSearchExpanded && (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className={cn(
                  "p-2.5 xl:hidden rounded-xl border-2 transition-all active:scale-95",
                  isDark ? "bg-gray-900 border-purple-500 text-purple-400" : "bg-purple-50 border-purple-500 text-purple-600"
                )}
              >
                <Search size={22} />
              </button>
            )}

            {!isSearchExpanded && (
              <>
                <button 
                  onClick={toggleTheme} 
                  className={cn(
                    "hidden xl:flex p-2.5 rounded-xl border-2 transition-all group",
                    isDark ? "border-purple-500/30 hover:bg-purple-500/20 text-yellow-400" : "border-purple-500/30 bg-purple-50 hover:bg-purple-100 text-purple-600"
                  )}
                  title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Social Links (Desktop) */}
                <div className="hidden sm:flex items-center gap-2">
                  <a
                    href="https://www.threads.com/@lucasbegins"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "p-2.5 rounded-xl border-2 transition-all hover:scale-105 active:scale-95",
                      isDark ? "border-purple-500/30 hover:bg-purple-500/20 text-white" : "border-purple-500/30 bg-purple-50 hover:bg-purple-100 text-black"
                    )}
                    title="Threads"
                  >
                    <ThreadsIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/lucasbegins/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "p-2.5 rounded-xl border-2 transition-all hover:scale-105 active:scale-95",
                      isDark ? "border-purple-500/30 hover:bg-purple-500/20 text-white" : "border-purple-500/30 bg-purple-50 hover:bg-purple-100 text-black"
                    )}
                    title="Instagram"
                  >
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                </div>

                <div className="hidden xl:flex items-center gap-3">
                  <NavUserMenu 
                    currentUser={currentUser}
                    profile={profile}
                    onLogout={handleLogout}
                    onLoginClick={() => setIsLoginModalOpen(true)}
                    isDark={isDark}
                  />
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className={cn(
                    "p-2.5 xl:hidden rounded-xl border-2 transition-all active:scale-95",
                    isDark ? "bg-gray-800 border-purple-500 text-purple-400" : "bg-purple-50 border-purple-500 text-purple-600"
                  )}
                >
                  <Menu size={22} />
                </button>
              </>
            )}
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
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        isCategoriesOpen={isMobileCategoriesOpen}
        setIsCategoriesOpen={setIsMobileCategoriesOpen}
      />
    </>
  );
}
