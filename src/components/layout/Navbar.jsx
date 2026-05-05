import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Search,
  Settings,
  Sun,
  Moon,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  PlusCircle
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

export default function Navbar() {
  const {
    isDark,
    toggleTheme,
    currentUser,
    handleLogout,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    setIsLoginModalOpen,
  } = useAppContext();

  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const mobileMenuRef = useRef(null);

  // Fecha menu mobile ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Esconde a Navbar ao rolar para baixo
  useEffect(() => {
    const controlNavbar = () => {
      const current = window.scrollY;
      setIsVisible(current < lastScrollYRef.current || current <= 120);
      lastScrollYRef.current = current;
    };
    window.addEventListener('scroll', controlNavbar, { passive: true });
    return () => window.removeEventListener('scroll', controlNavbar);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (window.location.pathname !== "/") navigate("/");
  };

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setSearchQuery("");
    setIsCategoryMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Bloqueia o scroll do corpo quando o menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

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
          {/* Esquerda: Logo (Oculta se busca expandida no mobile) */}
          <AnimatePresence mode="wait">
            {!isSearchExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 group shrink-0"
              >
                <Link to="/" className="flex items-center gap-2" onClick={() => { setActiveCategory("Todos"); setSearchQuery(""); }}>
                  <Gamepad2 className={cn("w-8 h-8 transition-transform group-hover:rotate-12", isDark ? "text-purple-400" : "text-purple-600")} />
                  <h1 className="font-retro font-bold text-xl md:text-3xl tracking-tighter uppercase">
                    Lucas<span className="text-purple-500 inline-block animate-glitch">Begins</span>
                  </h1>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Centro: Links de Navegação (Desktop) */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <div className="relative group">
              <button
                className="flex items-center gap-1 font-retro font-bold uppercase tracking-widest hover:text-purple-500 transition-colors py-2 text-sm"
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                Categorias <ChevronDown className={cn("w-4 h-4 transition-transform", isCategoryMenuOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {isCategoryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2 w-52 z-50"
                    onMouseEnter={() => setIsCategoryMenuOpen(true)}
                    onMouseLeave={() => setIsCategoryMenuOpen(false)}
                  >
                    <div className={cn("rounded-2xl border-2 shadow-2xl overflow-hidden p-2", isDark ? "bg-gray-800 border-purple-500" : "bg-white border-purple-200")}>
                      {["Todos", ...categories].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleCategorySelect(cat)}
                          className={cn(
                            "w-full text-left px-4 py-3 font-retro font-bold text-[11px] uppercase transition-all rounded-xl mb-1 last:mb-0",
                            isDark ? "hover:bg-purple-500/20 text-gray-300 hover:text-purple-400" : "hover:bg-purple-100 text-gray-700 hover:text-purple-700",
                            activeCategory === cat && "bg-purple-600 text-white"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/about" className="font-retro font-bold uppercase tracking-widest hover:text-purple-500 transition-colors text-sm">Sobre Nós</Link>
            <Link to="/contact" className="font-retro font-bold uppercase tracking-widest hover:text-purple-500 transition-colors text-sm">Contatos</Link>
          </div>

          {/* Direita: Ações + Busca Expansível */}
          <div className={cn("flex items-center gap-2 md:gap-3", isSearchExpanded && "flex-1 ml-4")}>
            {/* Campo de Busca (Desktop fixo, Mobile expansível) */}
            <div className={cn(
              "relative transition-all duration-300",
              isSearchExpanded ? "w-full" : "hidden md:block md:w-48 xl:w-64"
            )}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 opacity-60" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={handleSearch}
                onKeyDown={(e) => e.key === 'Enter' && setIsSearchExpanded(false)}
                autoFocus={isSearchExpanded}
                className={cn(
                  "w-full pl-10 pr-12 py-2.5 rounded-xl border-2 font-bold outline-none transition-all text-sm",
                  isDark ? "bg-gray-800 border-purple-500/30 focus:border-purple-500 text-white" : "bg-snes-input border-snes-dark/20 focus:border-snes-dark text-snes-accent"
                )}
              />
              {isSearchExpanded && (
                <button 
                  onClick={() => setIsSearchExpanded(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
                >
                  <PlusCircle className="w-4 h-4 rotate-45" />
                </button>
              )}
            </div>

            {/* Ícone de Lupa para Expandir (Mobile) */}
            {!isSearchExpanded && (
              <button 
                onClick={() => setIsSearchExpanded(true)}
                className="p-2 md:hidden rounded-xl border-2 transition-all retro-button"
              >
                <Search className="w-6 h-6 text-purple-500" />
              </button>
            )}

            {!isSearchExpanded && (
              <>
                <button onClick={toggleTheme} className="p-2 md:p-2.5 rounded-xl border-2 transition-all retro-button">
                  {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-snes-accent" />}
                </button>
                
                <div className="hidden md:flex items-center gap-3">
                  {currentUser?.role === 'admin' && (
                    <Link to="/admin" className="p-2.5 rounded-xl bg-purple-600 text-white border-2 border-black retro-button shadow-[3px_3px_0px_rgba(0,0,0,1)]"><Settings className="w-5 h-5" /></Link>
                  )}
                  {currentUser ? (
                    <div className="flex items-center gap-3">
                      <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover" />
                      <button onClick={handleLogout} className="p-2.5 rounded-xl border-2 border-red-500/50 text-red-500 retro-button"><LogOut className="w-5 h-5" /></button>
                    </div>
                  ) : (
                    <button onClick={() => setIsLoginModalOpen(true)} className="px-6 py-2.5 rounded-xl font-retro font-bold text-xs bg-purple-600 text-white border-2 border-black retro-button">LOGIN</button>
                  )}
                </div>

                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 md:p-2.5 rounded-xl border-2 lg:hidden retro-button">
                  <Menu className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={cn(
                "absolute top-0 right-0 h-[100dvh] w-[85%] max-w-sm shadow-2xl p-8 flex flex-col gap-8 overflow-y-auto border-l-4",
                isDark ? "bg-gray-900 border-purple-600 text-white" : "bg-snes-surface border-snes-dark text-snes-accent"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-6 h-6 text-purple-500" />
                  <h2 className="font-retro text-xl font-bold uppercase tracking-tighter">Menu</h2>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-xl border-2 border-red-500/30 text-red-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {currentUser && (
                <div className={cn("flex items-center gap-4 p-5 rounded-2xl border-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]", isDark ? "bg-gray-800 border-purple-500/50" : "bg-white border-snes-dark/20")}>
                  <img src={currentUser.avatar} alt="" className="w-14 h-14 rounded-full border-2 border-purple-500 object-cover" />
                  <div className="flex-1">
                    <p className="font-retro font-bold text-base uppercase tracking-tight">{currentUser.name}</p>
                    <button onClick={handleLogout} className="text-red-500 font-bold text-xs uppercase flex items-center gap-1 mt-1"><LogOut className="w-3 h-3" /> Sair</button>
                  </div>
                </div>
              )}

              {!currentUser && (
                <button onClick={() => { setIsLoginModalOpen(true); setIsMobileMenuOpen(false); }} className="w-full py-4 rounded-xl font-retro font-bold text-sm bg-purple-600 text-white border-2 border-black retro-button shadow-[4px_4px_0px_rgba(0,0,0,1)]">LOGIN / ENTRAR</button>
              )}

              <nav className="flex flex-col gap-2">
                 <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="font-retro font-bold uppercase tracking-widest text-lg py-3 px-4 rounded-xl hover:bg-purple-500/10 transition-colors border-b-2 border-transparent">Sobre Nós</Link>
                 <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="font-retro font-bold uppercase tracking-widest text-lg py-3 px-4 rounded-xl hover:bg-purple-500/10 transition-colors border-b-2 border-transparent">Contatos</Link>
                 {currentUser?.role === 'admin' && (
                   <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="font-retro font-bold uppercase tracking-widest text-lg text-purple-500 flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-purple-500/10 transition-colors">
                     <Settings className="w-5 h-5" /> Painel Admin
                   </Link>
                 )}
              </nav>

              <div className="mt-auto pt-8 border-t-2 border-dashed border-gray-500/20">
                <p className="text-[10px] opacity-50 uppercase font-bold mb-4 tracking-[0.2em] ml-4">Categorias</p>
                <div className="grid grid-cols-1 gap-2">
                  {["Todos", ...categories].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        handleCategorySelect(cat);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "p-4 rounded-xl border-2 font-retro font-bold text-xs uppercase text-left transition-all",
                        activeCategory === cat ? "bg-purple-600 border-black text-white shadow-[4px_4px_0px_rgba(0,0,0,1)]" : isDark ? "bg-gray-800 border-purple-900/50 text-gray-400" : "bg-white border-snes-mid text-snes-muted"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
