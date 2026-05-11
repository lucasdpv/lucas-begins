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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 font-retro font-bold text-xs opacity-60 pointer-events-none">{">"}</span>
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={cn(
                  "w-full pl-8 pr-10 py-2 font-bold outline-none text-xs transition-all border-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]",
                  isDark ? "bg-gray-800 border-purple-600 focus:border-purple-500 text-white" : "bg-white border-snes-dark focus:border-purple-600 text-snes-accent"
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
                      className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
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
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "absolute inset-x-0 top-0 h-20 z-[60] flex items-center px-4 gap-3 border-b-4 border-black",
                    isDark ? "bg-gray-900 shadow-[0_10px_20px_rgba(168,85,247,0.2)]" : "bg-snes-light shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                  )}
                >
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 font-retro font-bold text-lg">{">"}</span>
                    <input
                      type="text"
                      placeholder="PESQUISAR NO BLOG..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsSearchExpanded(false)}
                      autoFocus
                      className={cn(
                        "w-full pl-10 pr-12 py-3 border-4 font-retro font-bold outline-none text-sm shadow-[4px_4px_0px_rgba(0,0,0,1)]",
                        isDark ? "bg-gray-800 border-purple-500 text-white" : "bg-white border-purple-600 text-gray-900"
                      )}
                    />
                    <button
                      onClick={handleCancelSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
                    >
                      <X size={18} />
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
