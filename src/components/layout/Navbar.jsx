import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  return (
    <header
      ref={mobileMenuRef}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b-4 backdrop-blur-md",
        isDark ? "border-purple-600 bg-gray-900/95" : "border-snes-dark bg-snes-light/95",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Esquerda: Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0" onClick={() => { setActiveCategory("Todos"); setSearchQuery(""); }}>
          <Gamepad2 className={cn("w-8 h-8 transition-transform group-hover:rotate-12", isDark ? "text-purple-400" : "text-purple-600")} />
          <h1 className="font-retro font-bold text-xl md:text-3xl tracking-tighter uppercase">
            Lucas<span className="text-purple-500 inline-block animate-glitch">Begins</span>
          </h1>
        </Link>

        {/* Centro: Links de Navegação e Categorias (Desktop) */}
        <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {/* Dropdown de Categorias */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 font-retro font-bold uppercase tracking-widest hover:text-purple-500 transition-colors py-2 text-sm"
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              Categorias <ChevronDown className={cn("w-4 h-4 transition-transform", isCategoryMenuOpen && "rotate-180")} />
            </button>
            {isCategoryMenuOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2 w-48 z-50"
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <div className={cn("rounded-xl border-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden", isDark ? "bg-gray-800 border-purple-500" : "bg-snes-surface border-snes-dark")}>
                  {["Todos", ...categories].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={cn(
                        "w-full text-left px-4 py-3 font-retro font-bold text-xs uppercase transition-colors border-b last:border-0",
                        isDark ? "border-gray-700 hover:bg-gray-700" : "border-snes-mid hover:bg-snes-input",
                        activeCategory === cat && "text-purple-500"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/about" className="font-retro font-bold uppercase tracking-widest hover:text-purple-500 transition-colors text-sm">
            Sobre Nós
          </Link>
          <Link to="/contact" className="font-retro font-bold uppercase tracking-widest hover:text-purple-500 transition-colors text-sm">
            Contatos
          </Link>
        </div>

        {/* Direita: Busca e Ações */}
        <div className="flex items-center gap-3">
          {/* Busca - Visibilidade Melhorada */}
          <div className="hidden md:flex relative w-48 xl:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 opacity-60" />
            <input
              type="text"
              aria-label="Pesquisar artigos"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={handleSearch}
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-xl border-2 font-bold outline-none transition-all text-sm",
                isDark 
                  ? "bg-gray-800 border-purple-500/30 focus:border-purple-500 text-white placeholder:text-gray-400" 
                  : "bg-snes-input border-snes-dark/20 focus:border-snes-dark text-snes-accent placeholder:text-snes-muted"
              )}
            />
          </div>

          <button
            onClick={toggleTheme}
            className={cn(
              "p-2.5 rounded-xl border-2 transition-all retro-button",
              isDark ? "bg-gray-800 border-purple-500 text-yellow-400" : "bg-snes-surface border-snes-dark text-snes-accent"
            )}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {/* Botão Admin: Painel de Moderação */}
          {currentUser?.role === 'admin' && (
            <Link
              to="/admin"
              className={cn(
                "hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl font-retro font-bold text-[10px] md:text-xs bg-purple-600 text-white border-2 border-black retro-button shadow-[3px_3px_0px_rgba(0,0,0,1)]",
                "hover:bg-purple-500 transition-all"
              )}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden xl:inline">PAINEL ADMIN</span>
            </Link>
          )}

          {currentUser ? (
            <div className="flex items-center gap-3">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover" />
              <button onClick={handleLogout} className="p-2.5 rounded-xl border-2 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all retro-button">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl font-retro font-bold text-xs bg-purple-600 text-white border-2 border-black retro-button"
            >
              LOGIN
            </button>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "p-2.5 rounded-xl border-2 lg:hidden retro-button",
              isDark ? "bg-gray-800 border-purple-500 text-white" : "bg-snes-surface border-snes-dark text-snes-accent"
            )}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={cn(
          "lg:hidden border-t-4 p-6 flex flex-col gap-6",
          isDark ? "bg-gray-900 border-purple-600" : "bg-snes-surface border-snes-dark"
        )}>
          <input
            type="text"
            aria-label="Pesquisar artigos"
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={handleSearch}
            className={cn(
              "w-full p-4 rounded-xl border-2 outline-none font-bold",
              isDark ? "bg-gray-800 border-purple-500 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
            )}
          />
          <div className="flex flex-col gap-4">
             <Link to="/about" className="font-retro font-bold uppercase tracking-widest text-sm">Sobre Nós</Link>
             <Link to="/contact" className="font-retro font-bold uppercase tracking-widest text-sm">Contatos</Link>
             {currentUser?.role === 'admin' && (
               <Link to="/admin" className="font-retro font-bold uppercase tracking-widest text-sm text-purple-500 flex items-center gap-2">
                 <Settings className="w-4 h-4" /> Painel Admin
               </Link>
             )}
          </div>
          <div className="border-t border-gray-500/20 pt-4">
            <p className="text-[10px] opacity-50 uppercase font-bold mb-3">Categorias</p>
            <div className="grid grid-cols-2 gap-3">
              {["Todos", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={cn(
                    "p-3 rounded-xl border-2 font-retro font-bold text-xs uppercase text-left",
                    activeCategory === cat
                      ? "bg-purple-600 border-black text-white"
                      : isDark ? "bg-gray-800 border-purple-900 text-gray-400" : "bg-snes-input border-snes-mid text-snes-muted"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
