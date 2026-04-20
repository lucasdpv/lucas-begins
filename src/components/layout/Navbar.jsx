import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Gamepad2,
  ChevronDown,
  Search,
  Settings,
  Sun,
  Moon,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { cn } from "../../lib/utils";

export default function Navbar() {
  const {
    isDark,
    toggleTheme,
    currentUser,
    logout,
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    navigate("/");
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
      className={cn(
        "sticky top-0 z-50 border-b-4 backdrop-blur-md",
        isDark ? "border-purple-600 bg-gray-900/95" : "border-black bg-white/95"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer group" onClick={() => { setActiveCategory("Todos"); setSearchQuery(""); }}>
          <Gamepad2
            className={cn("w-8 h-8 transition-transform group-hover:rotate-12", isDark ? "text-purple-400" : "text-purple-600")}
          />
          <h1 className="font-retro font-bold text-xl sm:text-3xl tracking-wider uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
            <span className={isDark ? "text-white" : "text-black"}>Lucas</span>
            <span className={isDark ? "text-purple-400" : "text-purple-600"}>Begins</span>
          </h1>
        </Link>

        {/* Nav Centro */}
        <div className="flex items-center gap-6 flex-1 justify-end md:justify-center">
          <div className="hidden lg:flex items-center gap-6">
            {/* Dropdown Categorias */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 font-retro font-bold uppercase tracking-wider hover:text-purple-500 transition-colors py-2 text-sm"
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                Categorias <ChevronDown className="w-4 h-4" />
              </button>
              {isCategoryMenuOpen && (
                <div
                  className="absolute top-full left-0 mt-0 pt-2 w-48 z-50"
                  onMouseEnter={() => setIsCategoryMenuOpen(true)}
                  onMouseLeave={() => setIsCategoryMenuOpen(false)}
                >
                  <div
                    className={cn(
                      "rounded-xl border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] overflow-hidden",
                      isDark ? "bg-gray-800 border-purple-500" : "bg-white border-black"
                    )}
                  >
                    {["Todos", ...categories].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={cn(
                          "w-full text-left px-4 py-3 font-retro font-bold text-sm transition-colors border-b last:border-0",
                          isDark ? "border-gray-700" : "border-gray-200",
                          activeCategory === cat
                            ? isDark
                              ? "bg-purple-600 text-white"
                              : "bg-purple-500 text-white"
                            : isDark
                            ? "hover:bg-gray-700 text-gray-300"
                            : "hover:bg-gray-100 text-black"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className="font-retro font-bold uppercase hover:text-purple-500 transition-colors text-sm"
            >
              Sobre Nós
            </Link>
            <Link
              to="/contact"
              className="font-retro font-bold uppercase hover:text-purple-500 transition-colors text-sm"
            >
              Contatos
            </Link>
          </div>

          {/* Barra de Pesquisa */}
          <div
            className={cn(
              "hidden md:flex max-w-xs items-center rounded-lg px-4 py-2 border-2 transition-colors focus-within:border-purple-500",
              isDark ? "bg-gray-800 border-purple-500/50 text-white" : "bg-white border-black text-black"
            )}
          >
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Pesquisar jogos..."
              className="bg-transparent outline-none w-full text-sm font-retro"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Botões Utilitários */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser?.role === "admin" && (
            <Link
              to="/admin"
              className={cn(
                "hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-retro text-sm font-bold uppercase transition-colors retro-button",
                isDark ? "bg-gray-800 text-yellow-400 border-purple-500" : "bg-white text-black border-black"
              )}
            >
              <Settings className="w-4 h-4" /> Admin
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-lg retro-button",
              isDark ? "bg-gray-800 text-yellow-400 border-purple-500" : "bg-white text-black border-black"
            )}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl drop-shadow-md" title={currentUser.name}>
                {currentUser.avatar}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className={cn(
                  "p-2 rounded-lg retro-button",
                  isDark ? "bg-red-900/50 border-red-500 text-red-400" : "bg-red-100 border-black text-red-600"
                )}
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-retro text-sm font-bold uppercase retro-button",
                isDark ? "bg-purple-600 text-white" : "bg-purple-500 text-white border-black"
              )}
            >
              <User className="w-4 h-4" /> Entrar
            </button>
          )}

          <button
            className="lg:hidden p-2 retro-button rounded-lg bg-white border-black text-black dark:bg-gray-800 dark:border-purple-500 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div
          className={cn(
            "lg:hidden border-t-4 p-4 flex flex-col gap-4 font-retro font-bold",
            isDark ? "border-purple-600 bg-gray-900" : "border-black bg-white"
          )}
        >
          <div
            className={cn(
              "flex items-center rounded-lg px-4 py-3 border-2",
              isDark ? "bg-gray-800 border-purple-500" : "bg-gray-100 border-black"
            )}
          >
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="bg-transparent outline-none w-full text-sm"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {currentUser?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left p-3 rounded-lg text-yellow-500 bg-gray-800 border-2 border-yellow-500 flex items-center gap-2"
            >
              <Settings className="w-5 h-5" /> Painel Admin
            </Link>
          )}

          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-left p-2 uppercase hover:text-purple-500 block"
          >
            Sobre Nós
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-left p-2 uppercase hover:text-purple-500 block"
          >
            Contatos
          </Link>

          <div className="border-t-2 my-2 border-gray-300 dark:border-gray-700" />
          <p className="text-xs opacity-50 px-2 uppercase">Categorias</p>
          {["Todos", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={cn(
                "text-left p-3 rounded-lg border-2",
                activeCategory === cat
                  ? isDark
                    ? "bg-purple-600 border-purple-500 text-white"
                    : "bg-purple-500 border-black text-white"
                  : isDark
                  ? "bg-gray-800 border-transparent text-gray-300"
                  : "bg-gray-50 border-transparent text-black"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
