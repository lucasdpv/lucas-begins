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
  User,
  FileText,
  Sword,
  Newspaper,
  CheckCircle,
  History,
  Cpu,
  Gamepad,
  Music,
  Star,
  Zap,
  PlusCircle,
  ChevronRight,
  BookOpen,
  Clock,
  FileSearch
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthProvider";
import { useThemeStore } from "../../store/useThemeStore";
import { useUIStore } from "../../store/useUIStore";
import { useCategories } from "../../features/posts/hooks/useCategoriesQuery";
import { useUserProfile } from "../../hooks/useUserQuery";
import { BRUTAL_DESIGN } from "../../constants";
import { cn, getPixelAvatar } from "../../lib/utils";

export default function Navbar() {
  const {
    setIsLoginModalOpen,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
  } = useUIStore();

  const { isDark, toggleTheme } = useThemeStore();
  const { currentUser, handleLogout } = useAuth();
  const { data: profile } = useUserProfile(currentUser?.id);
  const { data: categories = [] } = useCategories();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const lastScrollY = useRef(0);

  const navigate = useNavigate();
  const location = useLocation();

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCategorySelect = (cat: string) => {
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

  // Mapeamento de Ícones por Categoria
  const getCategoryIcon = (cat: string, size?: number) => {
    const iconSize = size || 20;
    const lowerCat = cat.toLowerCase();
    
    if (lowerCat === "todos") return <LayoutGrid size={iconSize} />;
    if (lowerCat.includes("dossiê")) return <BookOpen size={iconSize} />;
    if (lowerCat.includes("tempo")) return <Clock size={iconSize} />;
    if (lowerCat.includes("análise")) return <FileSearch size={iconSize} />;
    if (lowerCat.includes("artigo")) return <FileText size={iconSize} />;
    if (lowerCat.includes("especial")) return <Star size={iconSize} />;
    if (lowerCat.includes("rpg") || lowerCat.includes("mmo")) return <Sword size={iconSize} />;
    if (lowerCat.includes("notícia")) return <Newspaper size={iconSize} />;
    if (lowerCat.includes("review")) return <CheckCircle size={iconSize} />;
    if (lowerCat.includes("nostalgia")) return <History size={iconSize} />;
    if (lowerCat.includes("tech") || lowerCat.includes("futuro")) return <Cpu size={iconSize} />;
    if (lowerCat.includes("retro") || lowerCat.includes("clássico")) return <Gamepad2 size={iconSize} />;
    if (lowerCat.includes("cultura") || lowerCat.includes("pop")) return <Music size={iconSize} />;
    
    return <Zap size={iconSize} />;
  };


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
          <div className="hidden xl:flex items-center gap-1 flex-1 justify-center px-4 whitespace-nowrap">
            {/* Dropdown de Categorias (O Estilo que você gostou) */}
            <div className="relative">
              <button
                className={cn(
                  "px-3 py-2 font-retro font-bold uppercase tracking-widest transition-all text-sm flex items-center gap-2 rounded-xl",
                  isCategoryMenuOpen
                    ? (isDark ? "text-purple-500 bg-purple-500/10" : "text-snes-dark bg-snes-input")
                    : (isDark ? "hover:text-purple-500" : "hover:text-snes-dark hover:bg-snes-surface")
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
                    className="absolute top-full left-0 mt-0 pt-4 w-[480px] z-50"
                    onMouseEnter={() => setIsCategoryMenuOpen(true)}
                    onMouseLeave={() => setIsCategoryMenuOpen(false)}
                  >
                    {/* Ponteiro (Triângulo) */}
                    <div className={cn(
                      "absolute top-2 left-8 w-4 h-4 rotate-45 border-l-4 border-t-4 z-10",
                      isDark ? "bg-gray-800 border-purple-500" : "bg-white border-purple-200"
                    )} />

                    <div className={cn(
                      "overflow-hidden p-5 grid grid-cols-2 gap-4 relative",
                      BRUTAL_DESIGN.ROUNDED, BRUTAL_DESIGN.BORDER_THICK, BRUTAL_DESIGN.SHADOW,
                      isDark ? "bg-gray-800" : "bg-white"
                    )}>
                      {["Todos", ...categories].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleCategorySelect(cat)}
                          className={cn(
                            "group flex items-center gap-3.5 p-3 rounded-2xl border-2 border-transparent transition-all text-left w-full",
                            activeCategory === cat
                              ? (isDark ? "bg-purple-600 text-white shadow-lg" : "bg-snes-dark text-white shadow-lg")
                              : isDark
                                ? "hover:bg-purple-500/10 text-gray-300"
                                : "hover:bg-snes-input text-snes-accent"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 shrink-0 flex items-center justify-center transition-all duration-300",
                            BRUTAL_DESIGN.ROUNDED_MODERN, BRUTAL_DESIGN.BORDER,
                            activeCategory === cat ? "bg-white/20 border-white/40" : isDark ? "bg-gray-700 border-white/5" : "bg-gray-100 border-black/5",
                            "group-hover:scale-110"
                          )}>
                            <div className="opacity-80 group-hover:opacity-100">
                              {getCategoryIcon(cat, 18)}
                            </div>
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-retro font-bold text-[11px] uppercase tracking-wider truncate">
                              {cat}
                            </span>
                            <span className="text-[9px] opacity-50 font-bold uppercase tracking-tight">
                              Explorar
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/about" className="px-3 py-2 font-retro font-bold uppercase tracking-widest hover:text-purple-500 transition-colors text-sm whitespace-nowrap">Sobre Nós</Link>
            <Link to="/contact" className="px-3 py-2 font-retro font-bold uppercase tracking-widest hover:text-purple-500 transition-colors text-sm whitespace-nowrap">Contatos</Link>
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
                  "w-full pl-10 pr-10 py-2 font-bold outline-none text-sm transition-all",
                  BRUTAL_DESIGN.ROUNDED_MODERN, BRUTAL_DESIGN.BORDER,
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
                      className="p-1.5 hover:bg-purple-600/20 text-purple-500 rounded-xl transition-colors"
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
                  {currentUser?.role === 'admin' && (
                    <Link to="/admin" className="p-2.5 rounded-xl border-2 border-purple-500 bg-purple-500 text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95">
                      <Settings size={20} className="animate-spin-slow" />
                    </Link>
                  )}

                  {currentUser ? (
                    <div className="flex items-center gap-2">
                      <Link 
                        to="/dashboard" 
                        className={cn(
                          "flex items-center gap-2 p-1.5 pr-3 rounded-xl border-2 transition-all group",
                          isDark ? "border-purple-500/30 hover:bg-purple-500/20" : "border-purple-500/30 bg-purple-50 hover:bg-purple-100"
                        )}
                        title="Meu QG"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={profile?.avatar || (currentUser.avatar ? currentUser.avatar : getPixelAvatar(currentUser.id))}
                            alt=""
                            className="w-8 h-8 rounded-lg border border-purple-500/50 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = getPixelAvatar(currentUser.id);
                            }}
                          />
                          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                        </div>
                        <span className="font-retro text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Meu QG</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className={cn(
                          "p-2 rounded-xl border-2 transition-all",
                          isDark 
                            ? "border-red-500/30 text-red-400 hover:bg-red-500/20" 
                            : "border-red-500/20 text-red-500 hover:bg-red-50"
                        )}
                        title="Sair"
                      >
                        <LogOut size={18} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsLoginModalOpen(true)} 
                      className={cn(
                        "px-6 py-2.5 rounded-2xl font-retro font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border-2 shadow-lg",
                        isDark 
                          ? "bg-purple-600 border-purple-400 text-white shadow-purple-500/20" 
                          : "bg-purple-600 border-purple-700 text-white shadow-purple-600/20"
                      )}
                    >
                      LOGIN
                    </button>
                  )}
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
                "absolute top-0 right-0 h-full w-[85%] max-sm:w-full shadow-2xl p-8 flex flex-col gap-8 overflow-y-auto",
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
                      isDark 
                        ? "border-purple-500/30 bg-gray-800 text-yellow-400" 
                        : "border-purple-500/20 bg-purple-50 text-purple-600"
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
                    <img 
                      src={profile?.avatar || (currentUser.avatar ? currentUser.avatar : getPixelAvatar(currentUser.id))} 
                      alt="" 
                      className="w-12 h-12 rounded-full border border-purple-500/50 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getPixelAvatar(currentUser.id);
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-retro font-bold uppercase text-sm text-purple-400 truncate">{profile?.name || currentUser.name}</h4>
                      <p className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Autor Nível {profile?.level || 1}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg font-retro font-bold uppercase text-[10px] transition-all",
                        isDark ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      )}
                    >
                      <User size={14} /> Meu QG
                    </Link>

                    {currentUser?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg font-retro font-bold uppercase text-[10px] transition-all",
                          isDark ? "bg-purple-600/20 text-purple-400 hover:bg-purple-600/30" : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                        )}
                      >
                        <Settings size={14} /> Admin
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
                  className={cn(
                    "w-full py-4 border-2 rounded-2xl font-retro font-bold uppercase text-sm transition-all active:scale-95 shadow-lg",
                    isDark 
                      ? "bg-purple-600 border-purple-400 text-white shadow-purple-500/20" 
                      : "bg-purple-600 border-purple-700 text-white shadow-purple-600/20"
                  )}
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
                  <Zap size={24} className="text-purple-500" /> Sobre Nós
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
                          <div className="opacity-70 scale-75 origin-left">
                            {getCategoryIcon(cat)}
                          </div>
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
