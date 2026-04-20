import React from "react";
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

/**
 * Barra de navegação principal (sticky) com suporte a menu mobile,
 * dropdown de categorias, busca e controles de usuário.
 */
export default function Navbar({
  isDark,
  currentView,
  currentUser,
  categories,
  activeCategory,
  searchQuery,
  isMobileMenuOpen,
  isCategoryMenuOpen,
  setIsCategoryMenuOpen,
  setIsMobileMenuOpen,
  setSearchQuery,
  setActiveCategory,
  onLogout,
  goHome,
  goToAbout,
  goToContact,
  goToAdmin,
  onOpenLogin,
  toggleTheme,
}) {
  return (
    <header
      className={`sticky top-0 z-50 border-b-4 ${
        isDark ? "border-purple-600 bg-gray-900/95" : "border-black bg-white/95"
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={goHome}>
          <Gamepad2
            className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"} group-hover:rotate-12 transition-transform`}
          />
          <h1 className="font-retro font-bold text-xl sm:text-3xl tracking-wider uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
            <span className={isDark ? "text-white" : "text-black"}>Lucas</span>
            <span className={isDark ? "text-purple-400" : "text-purple-600"}>Begins</span>
          </h1>
        </div>

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
                    className={`rounded-xl border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] overflow-hidden ${
                      isDark ? "bg-gray-800 border-purple-500" : "bg-white border-black"
                    }`}
                  >
                    {["Todos", ...categories].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          goHome();
                          setSearchQuery("");
                          setIsCategoryMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 font-retro font-bold text-sm transition-colors border-b last:border-0 ${
                          isDark ? "border-gray-700" : "border-gray-200"
                        } ${
                          activeCategory === cat
                            ? isDark
                              ? "bg-purple-600 text-white"
                              : "bg-purple-500 text-white"
                            : isDark
                            ? "hover:bg-gray-700 text-gray-300"
                            : "hover:bg-gray-100 text-black"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={goToAbout}
              className={`font-retro font-bold uppercase hover:text-purple-500 transition-colors text-sm ${
                currentView === "about" ? "text-purple-500" : ""
              }`}
            >
              Sobre Nós
            </button>
            <button
              onClick={goToContact}
              className={`font-retro font-bold uppercase hover:text-purple-500 transition-colors text-sm ${
                currentView === "contact" ? "text-purple-500" : ""
              }`}
            >
              Contatos
            </button>
          </div>

          {/* Barra de Pesquisa */}
          <div
            className={`hidden md:flex max-w-xs items-center rounded-lg px-4 py-2 border-2 ${
              isDark
                ? "bg-gray-800 border-purple-500/50 text-white"
                : "bg-white border-black text-black"
            } focus-within:border-purple-500 transition-colors`}
          >
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Pesquisar jogos..."
              className="bg-transparent outline-none w-full text-sm font-retro"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== "home") goHome();
              }}
            />
          </div>
        </div>

        {/* Botões Utilitários */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser?.role === "admin" && (
            <button
              onClick={goToAdmin}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-retro text-sm font-bold uppercase transition-colors retro-button ${
                currentView === "admin"
                  ? "bg-yellow-400 text-black border-black"
                  : isDark
                  ? "bg-gray-800 text-yellow-400 border-purple-500"
                  : "bg-white text-black border-black"
              }`}
            >
              <Settings className="w-4 h-4" /> Admin
            </button>
          )}

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg retro-button ${
              isDark ? "bg-gray-800 text-yellow-400 border-purple-500" : "bg-white text-black border-black"
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl drop-shadow-md" title={currentUser.name}>
                {currentUser.avatar}
              </span>
              <button
                onClick={onLogout}
                className={`p-2 rounded-lg retro-button ${
                  isDark
                    ? "bg-red-900/50 border-red-500 text-red-400"
                    : "bg-red-100 border-black text-red-600"
                }`}
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-retro text-sm font-bold uppercase retro-button ${
                isDark ? "bg-purple-600 text-white" : "bg-purple-500 text-white border-black"
              }`}
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
          className={`lg:hidden border-t-4 p-4 flex flex-col gap-4 font-retro font-bold ${
            isDark ? "border-purple-600 bg-gray-900" : "border-black bg-white"
          }`}
        >
          <div
            className={`flex items-center rounded-lg px-4 py-3 border-2 ${
              isDark ? "bg-gray-800 border-purple-500" : "bg-gray-100 border-black"
            }`}
          >
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="bg-transparent outline-none w-full text-sm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                goHome();
                setIsMobileMenuOpen(false);
              }}
            />
          </div>

          {currentUser?.role === "admin" && (
            <button
              onClick={() => { goToAdmin(); setIsMobileMenuOpen(false); }}
              className="text-left p-3 rounded-lg text-yellow-500 bg-gray-800 border-2 border-yellow-500 flex items-center gap-2"
            >
              <Settings className="w-5 h-5" /> Painel Admin
            </button>
          )}

          <button
            onClick={() => { goToAbout(); setIsMobileMenuOpen(false); }}
            className="text-left p-2 uppercase hover:text-purple-500"
          >
            Sobre Nós
          </button>
          <button
            onClick={() => { goToContact(); setIsMobileMenuOpen(false); }}
            className="text-left p-2 uppercase hover:text-purple-500"
          >
            Contatos
          </button>

          <div className="border-t-2 my-2 border-gray-300 dark:border-gray-700" />
          <p className="text-xs opacity-50 px-2 uppercase">Categorias</p>
          {["Todos", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); goHome(); setIsMobileMenuOpen(false); }}
              className={`text-left p-3 rounded-lg border-2 ${
                activeCategory === cat
                  ? isDark
                    ? "bg-purple-600 border-purple-500 text-white"
                    : "bg-purple-500 border-black text-white"
                  : isDark
                  ? "bg-gray-800 border-transparent text-gray-300"
                  : "bg-gray-50 border-transparent text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
