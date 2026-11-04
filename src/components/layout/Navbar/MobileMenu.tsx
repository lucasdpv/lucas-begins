import React from "react";
import Image from "next/image";
import { Link } from "@/lib/router-compat";
import { X, User, ShieldCheck, Zap, Star, ChevronRight, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, getPixelAvatar } from "../../../lib/utils";
import { getCategoryIcon } from "../../../features/posts/utils/categoryIcons";
import { InstagramIcon, ThreadsIcon, XIcon } from "../../icons/SocialIcons";

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
  currentUser,
  profile,
  handleLogout,
  onLoginClick,
  categories,
  activeCategory,
  onCategorySelect,
  isCategoriesOpen,
  setIsCategoriesOpen,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
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
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className={cn(
              "absolute top-0 right-0 h-full w-[85%] max-sm:w-full shadow-2xl p-6 sm:p-8 flex flex-col gap-6 overflow-y-auto border-l",
              isDark
                ? "bg-[#0d0b1a]/95 text-white border-white/10 backdrop-blur-2xl"
                : "bg-white text-slate-900 border-slate-200"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/icon-bp.png"
                  alt="BeginsProject"
                  width={42}
                  height={42}
                  className="w-10 h-10 object-contain"
                />
                <div className="flex flex-col">
                  <span className="font-retro font-black text-xl uppercase tracking-tight leading-none">
                    Begins<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Project</span>
                  </span>
                  <span className="text-[7px] font-mono uppercase tracking-[0.25em] text-purple-400/80 mt-0.5">
                    GAMES · ANIMES · NOSTALGIA
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 bg-white/[0.06] hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 rounded-xl border border-white/10 transition-colors"
                aria-label="Fechar menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* User Card */}
            {currentUser ? (
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                <div className="flex items-center gap-3.5">
                  <Image
                    src={
                      profile?.avatar ||
                      (currentUser.avatar ? currentUser.avatar : getPixelAvatar(currentUser.id))
                    }
                    alt=""
                    className="w-12 h-12 rounded-xl border border-purple-500/40 object-cover"
                    width={48}
                    height={48}
                    unoptimized={true}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-retro font-bold uppercase text-sm text-purple-300 truncate">
                      {profile?.name || currentUser.name}
                    </h4>
                    <p className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                      Nível {profile?.level || 1} · Membro Begins
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.08]">
                  <Link
                    to="/dashboard"
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-retro font-bold uppercase text-[10px] tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 transition-all"
                  >
                    <User size={13} /> Meu QG
                  </Link>

                  {currentUser?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={onClose}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-retro font-bold uppercase text-[10px] tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all"
                    >
                      <ShieldCheck size={13} /> Painel
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="ml-auto px-3 py-1.5 rounded-xl font-retro font-bold uppercase text-[10px] tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 transition-all"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onLoginClick();
                  onClose();
                }}
                className="w-full py-3.5 rounded-2xl font-retro font-black uppercase text-xs tracking-widest transition-all active:scale-95 bg-purple-600 hover:bg-purple-500 border border-purple-400/50 text-white shadow-[0_10px_25px_rgba(168,85,247,0.35)]"
              >
                Login / Entrar
              </button>
            )}

            {/* Categorias Section */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center justify-between p-4 rounded-2xl font-retro font-bold uppercase text-xs tracking-widest transition-all bg-white/[0.04] border border-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <ChevronRight
                    size={16}
                    className={cn("transition-transform text-purple-400", isCategoriesOpen && "rotate-90")}
                  />
                  <span>Categorias</span>
                </div>
                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full">
                  {categories.length}
                </span>
              </button>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col gap-1.5 mt-2"
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          onCategorySelect(cat);
                          onClose();
                        }}
                        className={cn(
                          "flex items-center gap-3.5 p-3.5 rounded-xl font-retro font-bold uppercase text-xs tracking-wider transition-all",
                          activeCategory === cat
                            ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]"
                            : "bg-white/[0.02] hover:bg-white/[0.06] text-slate-300"
                        )}
                      >
                        <div className="opacity-80 scale-90 origin-left">{getCategoryIcon(cat)}</div>
                        <span>{cat}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Secondary Editorial Pages */}
            <nav className="flex flex-col gap-2.5">
              <Link
                to="/archive"
                onClick={onClose}
                className="flex items-center gap-4 p-4 rounded-2xl font-retro font-bold uppercase text-sm tracking-wider transition-all border border-white/[0.08] bg-white/[0.03] hover:border-purple-500/40 hover:bg-purple-500/10 text-slate-200"
              >
                <Compass size={20} className="text-amber-400" /> Catálogo Completo
              </Link>
              <Link
                to="/about"
                onClick={onClose}
                className="flex items-center gap-4 p-4 rounded-2xl font-retro font-bold uppercase text-sm tracking-wider transition-all border border-white/[0.08] bg-white/[0.03] hover:border-purple-500/40 hover:bg-purple-500/10 text-slate-200"
              >
                <Zap size={20} className="text-purple-400" /> Sobre Nós
              </Link>
              <Link
                to="/contact"
                onClick={onClose}
                className="flex items-center gap-4 p-4 rounded-2xl font-retro font-bold uppercase text-sm tracking-wider transition-all border border-white/[0.08] bg-white/[0.03] hover:border-purple-500/40 hover:bg-purple-500/10 text-slate-200"
              >
                <Star size={20} className="text-amber-400" /> Contatos
              </Link>
            </nav>

            {/* Social Links */}
            <div className="mt-auto pt-4">
              <p className="text-[10px] font-retro font-bold uppercase text-slate-400 mb-3 tracking-[0.2em]">
                Siga-nos nas Redes
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/beginsproject/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center py-3.5 rounded-xl border border-white/10 bg-white/[0.04] hover:border-pink-500/50 text-white transition-all active:scale-95"
                  title="Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://www.threads.com/@beginsproject"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center py-3.5 rounded-xl border border-white/10 bg-white/[0.04] hover:border-purple-500/50 text-white transition-all active:scale-95"
                  title="Threads"
                >
                  <ThreadsIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/beginsproject"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center py-3.5 rounded-xl border border-white/10 bg-white/[0.04] hover:border-purple-500/50 text-white transition-all active:scale-95"
                  title="X (Twitter)"
                >
                  <XIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
