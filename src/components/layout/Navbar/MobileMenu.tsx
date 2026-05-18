import React from "react";
import { Link } from "react-router-dom";
import { 
  Gamepad2, 
  Sun, 
  Moon, 
  X, 
  User, 
  ShieldCheck, 
  Zap, 
  Star, 
  ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, getPixelAvatar } from "../../../lib/utils";
import { getCategoryIcon } from "../../../features/posts/utils/categoryIcons";
import { InstagramIcon, ThreadsIcon, XIcon } from "../../icons/SocialIcons";
import LanguageSelector from "../../ui/LanguageSelector";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  currentUser: any;
  profile: any;
  handleLogout: () => void;
  onLoginClick: () => void;
  categories: string[];
  activeCategory: string;
  onCategorySelect: (cat: string) => void;
  isCategoriesOpen: boolean;
  setIsCategoriesOpen: (isOpen: boolean) => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  isDark,
  toggleTheme,
  currentUser,
  profile,
  handleLogout,
  onLoginClick,
  categories,
  activeCategory,
  onCategorySelect,
  isCategoriesOpen,
  setIsCategoriesOpen
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] xl:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                  onClick={() => { toggleTheme(); onClose(); }}
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
                  onClick={onClose}
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
                    onClick={onClose}
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
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg font-retro font-bold uppercase text-[10px] transition-all",
                        isDark ? "bg-purple-600/20 text-purple-400 hover:bg-purple-600/30" : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                      )}
                    >
                      <ShieldCheck size={14} /> Meu Painel
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
                onClick={() => { onLoginClick(); onClose(); }}
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

            {/* 1. Categorias Section (Primary Navigation) */}
            <div className="flex flex-col">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl font-retro font-bold uppercase text-sm transition-all",
                  isDark ? "bg-gray-900" : "bg-gray-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <ChevronRight size={16} className={cn("transition-transform", isCategoriesOpen && "rotate-90")} />
                  <span>Categorias</span>
                </div>
                <span className="text-[10px] opacity-50 bg-purple-500/20 px-2 py-0.5 rounded-full">{categories.length + 1}</span>
              </button>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col gap-1 mt-2"
                  >
                    {["Todos", ...categories].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { onCategorySelect(cat); onClose(); }}
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

            {/* 2. Secondary editorial pages */}
            <nav className="flex flex-col gap-3">
              <Link
                to="/about"
                onClick={onClose}
                className={cn(
                  "flex items-center gap-5 p-5 rounded-2xl font-retro font-bold uppercase text-lg transition-all border-2 border-transparent hover:border-purple-500/30 hover:bg-purple-600/10",
                  isDark ? "text-gray-300" : "text-gray-700"
                )}
              >
                <Zap size={24} className="text-purple-500" /> Sobre Nós
              </Link>
              <Link
                to="/contact"
                onClick={onClose}
                className={cn(
                  "flex items-center gap-5 p-5 rounded-2xl font-retro font-bold uppercase text-lg transition-all border-2 border-transparent hover:border-purple-500/30 hover:bg-purple-600/10",
                  isDark ? "text-gray-300" : "text-gray-700"
                )}
              >
                <Star size={24} className="text-yellow-500" /> Contatos
              </Link>
            </nav>

            {/* 3. Idioma do Sistema (System Utilities) */}
            <div className="py-4 border-t border-b border-purple-500/10">
              <LanguageSelector isMobileLayout={true} onLanguageChange={onClose} />
            </div>

            {/* Social Links (Mobile Footer) */}
            <div className="mt-auto pt-8 border-t border-white/10">
              <p className="text-[10px] font-retro font-bold uppercase opacity-40 mb-4 tracking-[0.2em]">Siga-nos nas Redes</p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/beginsproject/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex-1 flex items-center justify-center py-4 rounded-xl border-2 transition-all active:scale-95",
                    isDark ? "bg-gray-900 border-purple-500/30 text-white" : "bg-gray-50 border-purple-500/20 text-black"
                  )}
                  title="Instagram"
                >
                  <InstagramIcon className="w-6 h-6" />
                </a>
                <a
                  href="https://www.threads.com/@beginsproject"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex-1 flex items-center justify-center py-4 rounded-xl border-2 transition-all active:scale-95",
                    isDark ? "bg-gray-900 border-purple-500/30 text-white" : "bg-gray-50 border-purple-500/20 text-black"
                  )}
                  title="Threads"
                >
                  <ThreadsIcon className="w-6 h-6" />
                </a>
                <a
                  href="https://x.com/beginsproject"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex-1 flex items-center justify-center py-4 rounded-xl border-2 transition-all active:scale-95",
                    isDark ? "bg-gray-900 border-purple-500/30 text-white" : "bg-gray-50 border-purple-500/20 text-black"
                  )}
                  title="X (Twitter)"
                >
                  <XIcon className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
