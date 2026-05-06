import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Gamepad2, 
  Menu, 
  X, 
  Search, 
  Moon, 
  Sun, 
  ChevronDown, 
  LogOut, 
  Settings,
  LayoutGrid,
  Hash,
  Star,
  Zap,
  PlusCircle,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

export default function Navbar() {
  const { 
    isDark, 
    toggleTheme, 
    currentUser, 
    handleLogout, 
    setIsLoginModalOpen,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    categories
  } = useAppContext();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const lastScrollY = useRef(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  // Controle de scroll para esconder/mostrar a navbar
  useEffect(() => {
    const controlNavbar = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Se não estiver na home e começar a pesquisar, anota onde estava e redireciona
    if (location.pathname !== "/" && query.trim() !== "") {
      if (!sessionStorage.getItem('preSearchPath')) {
        sessionStorage.setItem('preSearchPath', location.pathname);
      }
      navigate("/");
    }
  };

  const handleCancelSearch = () => {
    setSearchQuery("");
    setIsSearchExpanded(false);
    
    const prePath = sessionStorage.getItem('preSearchPath');
    if (prePath && prePath !== "/") {
      sessionStorage.removeItem('preSearchPath');
      navigate(prePath);
    }
  };

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setIsCategoryMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

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
          {/* Esquerda: Logo */}
          <div className="flex items-center gap-2 group shrink-0">
            <Link to="/" className="flex items-center gap-2" onClick={() => { setActiveCategory("Todos"); setSearchQuery(""); }}>
              <Gamepad2 className={cn("w-8 h-8 transition-transform group-hover:rotate-12", isDark ? "text-purple-400" : "text-purple-600")} />
              <h1 className="font-retro font-bold text-xl md:text-3xl tracking-tighter uppercase">
                Lucas<span className="text-purple-500 inline-block animate-glitch">Begins</span>
              </h1>
            </Link>
          </div>

          {/* Centro: Links de Navegação (Desktop) */}
          <div className="hidden xl:flex items-center gap-4 flex-1 justify-center px-4">
            {/* Dropdown de Categorias (O Estilo que você gostou) */}
            <div className="relative">
              <button
                className={cn(
                  "px-5 py-2 font-retro font-bold uppercase tracking-widest transition-all text-sm flex items-center gap-2 rounded-xl",
                  isCategoryMenuOpen ? "text-purple-500 bg-purple-500/10" : "hover:text-purple-500"
                )}
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                Categorias <ChevronDown className={cn("w-4 h-4 transition-transform", isCategoryMenuOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isCategoryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute top-full left-0 mt-0 pt-4 w-[420px] z-50"
                    onMouseEnter={() => setIsCategoryMenuOpen(true)}
                    onMouseLeave={() => setIsCategoryMenuOpen(false)}
                  >
                    {/* Ponteiro (Triângulo) */}
                    <div className={cn(
                      "absolute top-2 left-8 w-4 h-4 rotate-45 border-l-4 border-t-4 z-10",
                      isDark ? "bg-gray-800 border-purple-500" : "bg-white border-purple-200"
                    )} />

                    <div className={cn(
                      "rounded-[2rem] border-4 shadow-2xl overflow-hidden p-6 grid grid-cols-2 gap-3 relative",
                      isDark ? "bg-gray-800 border-purple-500 shadow-purple-900/40" : "bg-white border-purple-200 shadow-black/10"
                    )}>
                      {["Todos", ...categories].map((cat, idx) => (
                        <button
                          key={cat}
                          onClick={() => handleCategorySelect(cat)}
                          className={cn(
                            "group flex items-center gap-4 p-4 rounded-2xl transition-all text-left",
                            activeCategory === cat 
                              ? "bg-purple-600 text-white shadow-lg" 
                              : isDark 
                                ? "hover:bg-purple-500/10 text-gray-300" 
                                : "hover:bg-purple-50 text-gray-700"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            activeCategory === cat ? "bg-white/20" : isDark ? "bg-gray-700" : "bg-gray-100"
                          )}>
                            {idx === 0 ? <LayoutGrid size={20} /> : <Hash size={20} />}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-retro font-bold text-xs uppercase tracking-wider">{cat}</span>
                            <span className="text-[10px] opacity-50 font-bold uppercase">Ver artigos</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/about" className="px-5 py-2 font-retro font-bold uppercase tracking-widest hover:text-purple-500 transition-colors text-sm">Sobre Nós</Link>
            <Link to="/contact" className="px-5 py-2 font-retro font-bold uppercase tracking-widest hover:text-purple-500 transition-colors text-sm">Contatos</Link>
          </div>

          {/* Direita: Ações */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop Search Bar */}
            <div className="hidden xl:block relative w-48 xl:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 opacity-60" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={handleSearch}
                className={cn(
                  "w-full pl-10 pr-10 py-2 rounded-xl border-2 font-bold outline-none text-sm transition-all",
                  isDark ? "bg-gray-800 border-purple-500/30 focus:border-purple-500 text-white" : "bg-snes-input border-snes-dark/20 focus:border-snes-dark text-snes-accent"
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
                      className="p-1.5 hover:bg-purple-600/20 text-purple-500 rounded-lg transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 rotate-45" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile/Tablet Search Overlay (Fluído) */}
            <AnimatePresence>
              {isSearchExpanded && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "absolute inset-0 z-[60] flex items-center px-4 gap-3",
                    isDark ? "bg-gray-900" : "bg-snes-light"
                  )}
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                    <input
                      type="text"
                      placeholder="PESQUISAR NO BLOG..."
                      value={searchQuery}
                      onChange={handleSearch}
                      onKeyDown={(e) => e.key === 'Enter' && setIsSearchExpanded(false)}
                      autoFocus
                      className={cn(
                        "w-full pl-12 pr-12 py-3 rounded-2xl border-2 font-retro font-bold outline-none text-sm shadow-xl",
                        isDark ? "bg-gray-800 border-purple-500 text-white" : "bg-white border-purple-600 text-gray-900"
                      )}
                    />
                    <button 
                      onClick={handleCancelSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-xl shadow-lg active:scale-90 transition-transform"
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
                className="p-2.5 xl:hidden rounded-xl border-2 transition-all retro-button"
              >
                <Search className="w-5 h-5 text-purple-500" />
              </button>
            )}

            {!isSearchExpanded && (
              <>
                <button onClick={toggleTheme} className="hidden xl:flex p-2.5 rounded-xl border-2 transition-all retro-button">
                  {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-snes-accent" />}
                </button>
                
                <div className="hidden xl:flex items-center gap-3">
                  {currentUser?.role === 'admin' && (
                    <Link to="/admin" className="p-2.5 rounded-xl border-2 border-purple-500 bg-purple-500 text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95">
                      <Settings size={20} className="animate-spin-slow" />
                    </Link>
                  )}
                  
                  {currentUser ? (
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <img 
                          src={currentUser.avatar} 
                          alt="" 
                          className="w-10 h-10 rounded-full border-2 border-purple-500 cursor-pointer shadow-lg" 
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="p-2.5 rounded-xl border-2 border-red-500/30 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                      >
                        <LogOut size={20} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsLoginModalOpen(true)} className="px-6 py-2.5 rounded-xl font-retro font-bold text-xs bg-purple-600 text-white border-2 border-black retro-button">LOGIN</button>
                  )}
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2.5 xl:hidden rounded-xl border-2 border-purple-500 bg-purple-500/10 text-purple-500 transition-all hover:bg-purple-600 hover:text-white active:scale-95"
                >
                  <Menu size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] xl:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "absolute top-0 right-0 h-full w-[85%] max-w-sm shadow-2xl p-8 flex flex-col gap-8 overflow-y-auto",
                isDark ? "bg-gray-950 text-white border-l-4 border-purple-600" : "bg-white text-gray-900 border-l-4 border-snes-dark"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="text-purple-500" />
                  <span className="font-retro font-bold text-xl uppercase">Menu</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                    className={cn(
                      "p-2.5 rounded-xl border-2 transition-all",
                      isDark ? "bg-gray-800 border-gray-700 text-yellow-400" : "bg-gray-100 border-gray-200 text-snes-accent"
                    )}
                  >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 bg-red-500/10 text-red-500 rounded-xl"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {currentUser && (
                <div className="flex flex-col gap-1 py-2 px-1 border-b border-white/10">
                  <div className="flex items-center gap-4 mb-2">
                    <img src={currentUser.avatar} alt="" className="w-12 h-12 rounded-full border border-purple-500/50 object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-retro font-bold uppercase text-sm text-purple-400 truncate">{currentUser.name}</h4>
                      <p className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Autor Nível {currentUser.level || 1}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {currentUser?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg font-retro font-bold uppercase text-[10px] transition-all",
                          isDark ? "bg-purple-600/20 text-purple-400 hover:bg-purple-600/30" : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                        )}
                      >
                        <Settings size={14} className="animate-spin-slow" /> Painel Admin
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout} 
                      className={cn(
                        "px-3 py-1.5 rounded-lg font-retro font-bold uppercase text-[10px] transition-all",
                        isDark ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-red-50 text-red-600 hover:bg-red-100"
                      )}
                    >
                      Sair
                    </button>
                  </div>
                </div>
              )}

              {!currentUser && (
                <button 
                  onClick={() => { setIsLoginModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="w-full py-4 border-2 border-purple-600 text-purple-500 rounded-xl font-retro font-bold uppercase text-sm hover:bg-purple-600 hover:text-white transition-all"
                >
                  Login / Entrar
                </button>
              )}


              <nav className="flex flex-col gap-3">
                <Link 
                  to="/about" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={cn(
                    "flex items-center gap-5 p-5 rounded-2xl font-retro font-bold uppercase text-lg transition-all border-2 border-transparent hover:border-purple-500/30 hover:bg-purple-600/10",
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  <Zap size={24} className="text-purple-500" /> Sobre o Blog
                </Link>
                <Link 
                  to="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={cn(
                    "flex items-center gap-5 p-5 rounded-2xl font-retro font-bold uppercase text-lg transition-all border-2 border-transparent hover:border-purple-500/30 hover:bg-purple-600/10",
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  <Star size={24} className="text-yellow-500" /> Contatos
                </Link>
              </nav>

              <div className="flex flex-col">
                <button 
                  onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl font-retro font-bold uppercase text-sm transition-all",
                    isDark ? "bg-gray-900" : "bg-gray-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <ChevronRight size={16} className={cn("transition-transform", isMobileCategoriesOpen && "rotate-90")} />
                    <span>Categorias</span>
                  </div>
                  <span className="text-[10px] opacity-50 bg-purple-500/20 px-2 py-0.5 rounded-full">{categories.length + 1}</span>
                </button>
                
                <AnimatePresence>
                  {isMobileCategoriesOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col gap-1 mt-2"
                    >
                      {["Todos", ...categories].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => { handleCategorySelect(cat); setIsMobileMenuOpen(false); }}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-xl font-retro font-bold uppercase text-xs transition-all",
                            activeCategory === cat 
                              ? "bg-purple-600 text-white" 
                              : isDark ? "hover:bg-gray-900 text-gray-400" : "hover:bg-gray-50 text-gray-600"
                          )}
                        >
                          <Hash size={14} className="opacity-50" />
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
