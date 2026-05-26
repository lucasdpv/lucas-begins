import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Star, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  EyeOff,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatDate } from "../../../lib/utils";
import { Post } from "../../posts/schemas";

const POSTS_PER_PAGE = 8;

interface TabPostsProps {
  posts: Post[];
  categories: string[];
  isLoading: boolean;
  isDark: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onToggleFeatured: (id: string, isFeatured: boolean) => void;
  onToggleDraft?: (id: string, isDraft: boolean) => void;
  showToast: (msg: string, type?: any) => void;
}

export default function TabPosts({
  posts,
  categories,
  isLoading,
  isDark,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleDraft,
  showToast
}: TabPostsProps) {
  // Estados de Filtro e Paginação internos
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFeatured, setFilterFeatured] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Estados de controle dos dropdowns customizados
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isFeaturedDropdownOpen, setIsFeaturedDropdownOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (featuredRef.current && !featuredRef.current.contains(event.target as Node)) {
        setIsFeaturedDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lógica de Filtragem
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || post.category === filterCategory;
    
    let matchesFeatured = true;
    if (filterFeatured === "featured") {
      matchesFeatured = post.isFeatured === true;
    } else if (filterFeatured === "not_featured") {
      matchesFeatured = !post.isFeatured;
    }
    
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  // Lógica de Paginação
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Resetar página quando filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterFeatured]);

  return (
    <div className="space-y-6">
      {/* Toolbar de Filtros */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row flex-1 w-full md:w-auto gap-3 md:gap-4 items-center">
          {/* Busca */}
          <div className="relative w-full md:flex-1 md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-xl border-2 outline-none font-medium transition-all text-sm md:text-base",
                isDark 
                  ? "bg-gray-800 border-gray-700 text-white focus:border-purple-500" 
                  : "bg-white border-gray-200 text-gray-900 focus:border-purple-500"
              )}
            />
          </div>

          {/* Filtro de Categoria Customizado */}
          <div className="relative w-full md:w-auto" ref={categoryRef}>
            <button
              type="button"
              onClick={() => {
                setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                setIsFeaturedDropdownOpen(false);
              }}
              className={cn(
                "w-full md:w-auto pl-10 pr-10 py-2.5 md:py-3 rounded-xl border-2 outline-none font-bold uppercase text-[10px] md:text-xs font-retro flex items-center justify-between gap-2 transition-all relative select-none cursor-pointer",
                isDark 
                  ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-purple-500" 
                  : "bg-white border-gray-200 text-gray-600 hover:border-purple-500",
                isCategoryDropdownOpen && "border-purple-500 ring-2 ring-purple-500/20"
              )}
            >
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
              <span>
                {filterCategory === "all" ? "TODAS CATEGORIAS" : filterCategory}
              </span>
              <ChevronDown className={cn("w-3 h-3 text-gray-500 transition-transform duration-200", isCategoryDropdownOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isCategoryDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "absolute left-0 z-[100] mt-2 w-full md:w-56 rounded-xl border-2 p-1 focus:outline-none overflow-hidden",
                    isDark 
                      ? "bg-gray-900 border-purple-500/70 shadow-[6px_6px_0px_rgba(0,0,0,0.4)]" 
                      : "bg-white border-purple-500/50 shadow-[6px_6px_0px_rgba(0,0,0,0.15)]"
                  )}
                >
                  {/* Padrão de scanlines sutil */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                  
                  <div className="max-h-60 overflow-y-auto retro-scrollbar pr-1 relative flex flex-col gap-1 py-1 font-retro">
                    <button
                      type="button"
                      onClick={() => {
                        setFilterCategory("all");
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                        filterCategory === "all"
                          ? "bg-purple-600 text-white"
                          : isDark ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                      )}
                    >
                      TODAS CATEGORIAS
                    </button>
                    {categories.map((cat) => {
                      const isSelected = filterCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setFilterCategory(cat);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                            isSelected
                              ? "bg-purple-600 text-white"
                              : isDark ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                          )}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filtro de Destaques Customizado */}
          <div className="relative w-full md:w-auto" ref={featuredRef}>
            <button
              type="button"
              onClick={() => {
                setIsFeaturedDropdownOpen(!isFeaturedDropdownOpen);
                setIsCategoryDropdownOpen(false);
              }}
              className={cn(
                "w-full md:w-auto pl-10 pr-10 py-2.5 md:py-3 rounded-xl border-2 outline-none font-bold uppercase text-[10px] md:text-xs font-retro flex items-center justify-between gap-2 transition-all relative select-none cursor-pointer",
                isDark 
                  ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-purple-500" 
                  : "bg-white border-gray-200 text-gray-600 hover:border-purple-500",
                isFeaturedDropdownOpen && "border-purple-500 ring-2 ring-purple-500/20"
              )}
            >
              <Star className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 transition-colors", filterFeatured === "featured" ? "text-yellow-500 fill-yellow-500" : "text-gray-500")} />
              <span>
                {filterFeatured === "all" && "TODOS OS ARTIGOS"}
                {filterFeatured === "featured" && "APENAS CARROSSEL"}
                {filterFeatured === "not_featured" && "FORA DO CARROSSEL"}
              </span>
              <ChevronDown className={cn("w-3 h-3 text-gray-500 transition-transform duration-200", isFeaturedDropdownOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isFeaturedDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "absolute left-0 z-[100] mt-2 w-full md:w-56 rounded-xl border-2 p-1 focus:outline-none overflow-hidden",
                    isDark 
                      ? "bg-gray-900 border-purple-500/70 shadow-[6px_6px_0px_rgba(0,0,0,0.4)]" 
                      : "bg-white border-purple-500/50 shadow-[6px_6px_0px_rgba(0,0,0,0.15)]"
                  )}
                >
                  {/* Padrão de scanlines sutil */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                  <div className="relative flex flex-col gap-1 py-1 font-retro">
                    {[
                      { value: "all", label: "TODOS OS ARTIGOS" },
                      { value: "featured", label: "APENAS CARROSSEL" },
                      { value: "not_featured", label: "FORA DO CARROSSEL" }
                    ].map((opt) => {
                      const isSelected = filterFeatured === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setFilterFeatured(opt.value);
                            setIsFeaturedDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                            isSelected
                              ? "bg-purple-600 text-white"
                              : isDark ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-purple-600"
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="text-right text-xs font-bold uppercase opacity-50 font-retro">
            {filteredPosts.length} Artigo{filteredPosts.length !== 1 ? 's' : ''} encontrado{filteredPosts.length !== 1 ? 's' : ''}
          </div>
          <div className={cn(
            "text-[10px] font-retro font-bold uppercase px-3 py-1 rounded-full border-2",
            posts.filter(p => p.isFeatured).length >= 5 
              ? "bg-yellow-500/10 border-yellow-500 text-yellow-500" 
              : "bg-purple-500/10 border-purple-500 text-purple-500"
          )}>
            Carrossel: {posts.filter(p => p.isFeatured).length} / 5
          </div>
        </div>
      </div>

      <div className={cn("rounded-2xl retro-card overflow-hidden", isDark ? "bg-gray-800" : "bg-snes-surface")}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-medium">
            <thead
              className={cn(
                "font-retro uppercase text-[10px] md:text-xs tracking-wider border-b-2",
                isDark ? "bg-gray-900 border-purple-500 text-purple-300" : "bg-snes-mid border-snes-dark text-snes-accent"
              )}
            >
              <tr>
                <th className="px-4 md:px-6 py-4 md:py-5">Título</th>
                <th className="px-4 md:px-6 py-4 md:py-5 hidden md:table-cell">Categoria</th>
                <th className="px-4 md:px-6 py-4 md:py-5 hidden sm:table-cell">Data</th>
                <th className="px-4 md:px-6 py-4 md:py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDark ? "divide-gray-700" : "divide-gray-200")}>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500" />
                  </td>
                </tr>
              ) : currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <tr
                    key={post.id}
                    className={cn(isDark ? "hover:bg-gray-700/50" : "hover:bg-snes-mid", "transition-colors text-xs md:text-sm")}
                  >
                    <td className={cn(
                      "px-4 md:px-6 py-3 md:py-4 font-bold max-w-[150px] md:max-w-[250px] truncate",
                      post.isDraft && "opacity-60"
                    )} title={post.title}>
                      <div className="flex items-center gap-2">
                        {post.isDraft && (
                          <span className={cn(
                            "px-2 py-0.5 text-[8px] font-retro font-bold uppercase border shrink-0",
                            isDark 
                              ? "bg-gray-800 border-gray-600 text-gray-400" 
                              : "bg-gray-200 border-black text-gray-600"
                          )}>
                            Oculto
                          </span>
                        )}
                        <span className="truncate">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-md text-xs uppercase font-retro font-bold border",
                          isDark
                            ? "bg-purple-900/30 border-purple-500 text-purple-300"
                            : "bg-purple-100 border-purple-500 text-purple-700"
                        )}
                      >
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell opacity-70 font-mono">{formatDate(post.createdAt, (post as any).date)}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                      <div className="flex items-center justify-end gap-2 md:gap-3">
                        <button
                            onClick={() => {
                              if (!post.isFeatured && posts.filter(p => p.isFeatured).length >= 5) {
                                showToast('Limite de 5 destaques atingido.', 'warning');
                                return;
                              }
                              onToggleFeatured(post.id, !post.isFeatured);
                            }}
                            className={cn(
                              "p-1.5 md:p-2 rounded-lg transition-all active:scale-90",
                              post.isFeatured 
                                ? "bg-yellow-400/20 text-yellow-500 border border-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.3)]" 
                                : "bg-gray-500/10 text-gray-400 border border-gray-500/30 hover:border-yellow-500/50"
                            )}
                            title={post.isFeatured ? "Remover do carrossel" : "Adicionar ao carrossel"}
                          >
                            <Star className={cn("w-3.5 h-3.5 md:w-4 md:h-4", post.isFeatured && "fill-yellow-500")} />
                          </button>
                        <button
                          onClick={() => {
                            if (onToggleDraft) {
                              onToggleDraft(post.id, !post.isDraft);
                            }
                          }}
                          className={cn(
                            "p-1.5 md:p-2 rounded-lg transition-all active:scale-90",
                            !post.isDraft
                              ? "bg-purple-500/20 text-purple-500 border border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.3)]"
                              : "bg-gray-500/10 text-gray-400 border border-gray-500/30 hover:border-purple-500/50"
                          )}
                          title={post.isDraft ? "Tornar Visível (Publicar)" : "Ocultar Artigo"}
                        >
                          {post.isDraft ? (
                            <EyeOff className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          ) : (
                            <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => onEdit(post.id)}
                          className="p-1.5 md:p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500 rounded-lg transition-colors retro-button"
                          title="Editar"
                        >
                          <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(post.id, post.title)}
                            className="p-1.5 md:p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500 rounded-lg transition-colors retro-button"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Search size={40} />
                      <p className="font-retro uppercase text-sm">Nenhum artigo encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className={cn(
            "px-6 py-4 border-t-2 flex items-center justify-between",
            isDark ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-200"
          )}>
            <div className="text-xs font-bold uppercase opacity-50 font-retro">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border-2 border-black bg-white text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              {/* Números das Páginas (Desktop) */}
              <div className="hidden sm:flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "w-10 h-10 rounded-lg border-2 border-black font-retro text-sm transition-all",
                      currentPage === i + 1
                        ? "bg-purple-600 text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border-2 border-black bg-white text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
