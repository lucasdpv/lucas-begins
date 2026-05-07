import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  User, 
  Mail, 
  MailOpen, 
  Inbox, 
  Reply, 
  CheckCircle2, 
  Clock,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  MessageSquare,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Helmet } from "react-helmet-async";
import { cn, formatDate } from "../lib/utils";
import { contactService } from "../services/contactService";

const POSTS_PER_PAGE = 8;

/**
 * Painel administrativo com abas: Artigos, Categorias, Perfil e Inbox.
 */
export default function AdminPage() {
  const { posts, categories, isDark, currentUser, handleDeletePost, handleToggleFeatured, handleAddCategory, handleDeleteCategory, handleUpdateProfile, showToast, fetchAllPosts } = useAppContext();
  const navigate = useNavigate();
  const [adminTab, setAdminTab] = useState("posts");

  // Força o carregamento de posts e mensagens ao entrar no admin
  useEffect(() => {
    fetchAllPosts();
    fetchMessages();
  }, [fetchAllPosts]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, type: null, title: "" });
  
  // Estados de Filtro e Paginação
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Lógica de Filtragem
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Lógica de Paginação
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Resetar página quando filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory]);
  
  const [profileData, setProfileData] = useState(() => ({
    name: currentUser?.name || "",
    avatar: currentUser?.avatar || "",
    bio: currentUser?.bio || "",
    level: currentUser?.level || 1,
    aka: currentUser?.aka || ""
  }));

  // Busca mensagens quando entra na aba inbox
  useEffect(() => {
    if (adminTab === "messages") {
      fetchMessages();
    }
  }, [adminTab]);

  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const data = await contactService.getAllMessages();
      setMessages(data);
    } catch (error) {
      showToast("Erro ao carregar mensagens.", "error");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleUpdateMessageStatus = async (id, status) => {
    try {
      await contactService.updateMessageStatus(id, status);
      setMessages(messages.map(msg => msg.id === id ? { ...msg, status } : msg));
      showToast("Status da mensagem atualizado!");
    } catch (error) {
      showToast("Erro ao atualizar status.", "error");
    }
  };

  const handleDeleteMsg = (id) => {
    setDeleteModal({ isOpen: true, id, type: 'message', title: 'Mensagem' });
  };

  const confirmDelete = async () => {
    const { id, type } = deleteModal;
    try {
      if (type === 'message') {
        await contactService.deleteMessage(id);
        setMessages(messages.filter(msg => msg.id !== id));
        showToast("Mensagem excluída.");
      } else if (type === 'post') {
        await handleDeletePost(id);
        showToast("Artigo excluído com sucesso.");
      } else if (type === 'category') {
        await handleDeleteCategory(id);
        showToast("Categoria removida.");
      }
    } catch (error) {
      showToast(`Erro ao excluir ${type}.`, "error");
    } finally {
      setDeleteModal({ isOpen: false, id: null, type: null, title: "" });
    }
  };

  const handleReply = (email, name) => {
    const subject = encodeURIComponent(`Re: Contato Lucas Begins - Olá ${name}`);
    const body = encodeURIComponent(`Olá ${name},\n\nRecebi sua mensagem através do portal Lucas Begins e gostaria de dar um retorno.\n\n---\nSua mensagem:\n[Conteúdo da mensagem]\n\nMinha resposta:\n\n`);
    
    // Abre o GMAIL diretamente no navegador em uma nova aba
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  const handleAddCat = (e) => {
    e.preventDefault();
    handleAddCategory(newCategoryName);
    setNewCategoryName("");
  };

  return (
    <div className="min-h-[80vh] py-8 px-4 md:px-8 relative overflow-hidden animate-in fade-in duration-700">
      <Helmet>
        <title>Painel de Controle | Lucas Begins</title>
      </Helmet>

      {/* Elementos de Fundo Decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Superior com Navegação e Título */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
            <button
              onClick={() => navigate("/")}
              className={cn(
                "p-3 md:p-4 rounded-2xl border-4 transition-all active:scale-95 group",
                isDark ? "bg-gray-800 border-purple-600/30 text-white hover:border-purple-500 shadow-[4px_4px_0px_rgba(147,51,234,0.2)]" : "bg-white border-snes-dark text-snes-dark hover:bg-gray-50 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
              )}
              title="Voltar para a Home"
            >
              <ArrowLeft size={20} className="md:size-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 md:mb-2">
                <div className="flex items-center gap-2 px-3 md:px-4 py-1 bg-purple-600/10 border border-purple-500/30 rounded-full">
                  <Settings size={12} className="text-purple-500 animate-spin-slow" />
                  <span className="font-retro text-[9px] md:text-[11px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-purple-500">Admin Mode Active</span>
                </div>
              </div>
              <h1 className="font-retro font-bold text-2xl md:text-6xl uppercase tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] md:drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                Painel de <span className="text-purple-500">Controle</span>
              </h1>
            </div>
          </div>

          <button
            onClick={() => navigate("/editor")}
            className="w-full md:w-auto group flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-yellow-400 border-4 border-black text-black font-retro text-sm md:text-lg font-bold uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-300" />
            Nova Publicação
          </button>
        </div>

        {/* Grade de Estatísticas Rápidas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {[
            { label: "Artigos", value: posts.length, icon: Edit, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Categorias", value: categories.length, icon: Tag, color: "text-purple-500", bg: "bg-purple-500/10" },
            { label: "Mensagens", value: messages.length, icon: Inbox, color: "text-yellow-500", bg: "bg-yellow-500/10" },
            { label: "Level", value: currentUser?.level || 1, icon: User, color: "text-green-500", bg: "bg-green-500/10" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border-4 flex flex-col sm:flex-row items-center sm:items-center gap-3 md:gap-5 transition-all group text-center sm:text-left",
                isDark ? "bg-gray-800/40 border-gray-700/50 hover:border-purple-500/50 shadow-xl shadow-purple-900/5" : "bg-white border-gray-100 hover:border-purple-200 shadow-xl shadow-black/5"
              )}
            >
              <div className={cn("p-3 md:p-4 rounded-xl md:rounded-2xl transition-transform group-hover:scale-110 duration-300", stat.bg, stat.color)}>
                <stat.icon size={20} className="md:size-[26px]" />
              </div>
              <div>
                <p className="text-[9px] md:text-xs font-retro font-bold uppercase tracking-widest opacity-50 mb-0.5 md:mb-1">{stat.label}</p>
                <p className="text-xl md:text-3xl font-bold font-retro leading-none">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navegação de Abas - Glassmorphism Style */}
        <div className={cn(
          "p-2 rounded-[1.5rem] md:rounded-[2.5rem] border-4 mb-8 md:mb-10 flex flex-wrap items-center justify-center lg:justify-start gap-1 md:gap-2 backdrop-blur-md transition-all",
          isDark ? "bg-gray-900/40 border-gray-800/50" : "bg-gray-100/60 border-gray-200"
        )}>
          {[
            { id: "posts", label: "Artigos", icon: Edit },
            { id: "categories", label: "Categorias", icon: Tag },
            { id: "messages", label: "Inbox", icon: Inbox, badge: messages.some(m => m.status === 'new') },
            { id: "profile", label: "Perfil", icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 rounded-[1rem] md:rounded-[1.8rem] font-retro text-[10px] md:text-sm font-bold uppercase tracking-widest transition-all duration-300 flex-1 min-w-[120px] md:flex-initial",
                adminTab === tab.id 
                  ? (isDark ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40" : "bg-purple-600 text-white shadow-lg shadow-purple-200")
                  : (isDark ? "text-gray-400 hover:text-white hover:bg-gray-800/50" : "text-gray-500 hover:text-purple-600 hover:bg-white")
              )}
            >
              <tab.icon size={14} className="md:size-4" />
              {tab.label}
              {tab.badge && (
                <span className="absolute top-2 right-3 md:top-3 md:right-4 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-gray-900 shadow-sm" />
              )}
            </button>
          ))}
        </div>

      {/* Aba: Artigos */}
      {adminTab === "posts" && (
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

              {/* Filtro de Categoria */}
              <div className="relative w-full md:w-auto group">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 group-focus-within:text-purple-500" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-8 py-2.5 md:py-3 rounded-xl border-2 outline-none font-bold uppercase text-[10px] md:text-xs font-retro appearance-none cursor-pointer transition-all",
                    isDark 
                      ? "bg-gray-800 border-gray-700 text-gray-300 focus:border-purple-500" 
                      : "bg-white border-gray-200 text-gray-600 focus:border-purple-500"
                  )}
                >
                  <option value="all">TODAS CATEGORIAS</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                </select>
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
                  {currentPosts.length > 0 ? (
                    currentPosts.map((post) => (
                      <tr
                        key={post.id}
                        className={cn(isDark ? "hover:bg-gray-700/50" : "hover:bg-snes-mid", "transition-colors text-xs md:text-sm")}
                      >
                        <td className="px-4 md:px-6 py-3 md:py-4 font-bold max-w-[150px] md:max-w-[250px] truncate" title={post.title}>
                          {post.title}
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
                        <td className="px-6 py-4 hidden sm:table-cell opacity-70 font-mono">{formatDate(post.createdAt, post.date)}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                          <div className="flex items-center justify-end gap-2 md:gap-3">
                            <button
                              onClick={() => handleToggleFeatured(post.id)}
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
                              onClick={() => navigate(`/editor/${post.id}`)}
                              className="p-1.5 md:p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500 rounded-lg transition-colors retro-button"
                              title="Editar"
                            >
                              <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                            <button
                                onClick={() => setDeleteModal({ isOpen: true, id: post.id, type: 'post', title: post.title })}
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
                      <td colSpan="4" className="px-6 py-12 text-center">
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
      )}

      {/* Aba: Categorias */}
      {adminTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Criar */}
          <div className={cn("p-6 md:p-8 rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-snes-surface")}>
            <h3 className="font-retro text-lg md:text-2xl font-bold uppercase mb-4 md:mb-6 flex items-center gap-2 border-b-2 border-purple-500 pb-2 inline-flex">
              <Tag className="w-5 h-5 md:w-6 md:h-6 text-purple-500" /> Criar Categoria
            </h3>
            <form onSubmit={handleAddCat} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase font-retro opacity-80">
                  Nome da Nova Categoria
                </label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className={cn(
                    "w-full p-4 rounded-xl outline-none border-2 font-medium focus:border-purple-500 transition-all",
                    isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
                  )}
                  placeholder="Ex: Curiosidades, Hardware..."
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-purple-600 text-white px-6 py-4 rounded-xl font-retro uppercase text-sm font-bold retro-button"
              >
                <Plus className="w-5 h-5" /> Adicionar
              </button>
            </form>
          </div>

          {/* Listar e excluir */}
          <div className={cn("p-6 md:p-8 rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-snes-surface")}>
            <h3 className="font-retro text-lg md:text-2xl font-bold uppercase mb-4 md:mb-6 border-b-2 border-purple-500 pb-2 inline-flex">
              Categorias Atuais
            </h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 font-retro font-bold uppercase text-sm",
                    isDark ? "bg-gray-900 border-gray-700" : "bg-snes-input border-snes-dark"
                  )}
                >
                  <span>{cat}</span>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, id: cat, type: 'category', title: cat })}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs opacity-60 mt-6 font-medium italic">
              * Atenção: Categorias em uso pelos artigos não podem ser excluídas.
            </p>
          </div>
        </div>
      )}

      {/* Aba: Perfil */}
      {adminTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Formulário */}
          <div className={cn("lg:col-span-2 p-6 md:p-8 rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-snes-surface")}>
            <h3 className="font-retro text-lg md:text-2xl font-bold uppercase mb-6 md:mb-8 flex items-center gap-2 md:gap-3 border-b-2 border-purple-500 pb-2 md:pb-3">
              <User className="w-5 h-5 md:w-6 md:h-6 text-purple-500" /> Perfil de Autor
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-sm font-bold uppercase font-retro opacity-80">Nome</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className={cn(
                      "w-full p-3 md:p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium text-sm md:text-base",
                      isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-sm font-bold uppercase font-retro opacity-80">AKA</label>
                  <input
                    type="text"
                    value={profileData.aka}
                    onChange={(e) => setProfileData(prev => ({ ...prev, aka: e.target.value }))}
                    className={cn(
                      "w-full p-3 md:p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium text-sm md:text-base",
                      isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
                    )}
                    placeholder="Ex: Luck, The Boss..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-sm font-bold uppercase font-retro opacity-80">URL Foto</label>
                  <input
                    type="url"
                    value={profileData.avatar}
                    onChange={(e) => setProfileData(prev => ({ ...prev, avatar: e.target.value }))}
                    className={cn(
                      "w-full p-3 md:p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium text-sm md:text-base",
                      isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
                    )}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-sm font-bold uppercase font-retro opacity-80">Level</label>
                  <input
                    type="number"
                    value={profileData.level}
                    onChange={(e) => setProfileData(prev => ({ ...prev, level: e.target.value }))}
                    className={cn(
                      "w-full p-3 md:p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium text-sm md:text-base",
                      isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] md:text-sm font-bold uppercase font-retro opacity-80">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  rows="4"
                  className={cn(
                    "w-full p-3 md:p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium resize-none text-sm md:text-base",
                    isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-mid text-snes-accent"
                  )}
                  placeholder="Escreva algo sobre você..."
                />
              </div>

              <button
                onClick={() => handleUpdateProfile(profileData)}
                className="w-full md:w-auto bg-purple-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-retro uppercase text-sm md:text-lg font-bold retro-button shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-purple-500 transition-all"
              >
                Salvar
              </button>
            </div>
          </div>

          {/* Preview do Author Box */}
          <div className="lg:col-span-1">
            <h4 className="font-retro text-sm font-bold uppercase mb-4 opacity-50">Preview no Post</h4>
            <div className={cn("p-6 rounded-3xl border-2 relative overflow-hidden", isDark ? "bg-gray-800/40 border-purple-500/30" : "bg-snes-input border-snes-dark/10")}>
               <div className="flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-600 shadow-[4px_4px_0px_rgba(0,0,0,1)] -rotate-3">
                      <img 
                        src={profileData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas"} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black p-1 px-2 rounded-lg border-2 border-black font-bold text-[10px] shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                       LVL {profileData.level}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-retro text-xl font-bold uppercase">
                      {profileData.name || "Seu Nome"}
                      {profileData.aka && <span className="text-xs text-purple-500 ml-2">(aka {profileData.aka})</span>}
                    </h5>
                    <p className={cn("text-xs leading-relaxed mt-2 line-clamp-3", isDark ? "text-gray-400" : "text-gray-600")}>
                      {profileData.bio || "Sua bio aparecerá aqui..."}
                    </p>
                  </div>
               </div>
            </div>
            <p className="text-[10px] uppercase font-bold mt-4 opacity-40 text-center italic">
              * O Author Box completo aparece no fim de cada post se ativado.
            </p>
          </div>
        </div>
      )}
      {/* Aba: Inbox (Mensagens) */}
      {adminTab === "messages" && (
        <div className="space-y-6">
          <div className={cn("rounded-2xl retro-card overflow-hidden", isDark ? "bg-gray-800" : "bg-snes-surface")}>
            <div className="p-4 md:p-6 border-b-2 border-purple-500/20 flex items-center justify-between">
               <h3 className="font-retro text-lg md:text-2xl font-bold uppercase flex items-center gap-2">
                 <Inbox className="w-5 h-5 md:w-6 md:h-6 text-purple-500" /> Inbox
               </h3>
               <button 
                onClick={fetchMessages}
                className="p-2 hover:bg-purple-600/10 rounded-lg transition-colors"
                title="Recarregar"
               >
                 <Clock className={cn("w-5 h-5", isLoadingMessages && "animate-spin")} />
               </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className={cn(
                  "font-retro uppercase text-[10px] md:text-xs tracking-wider border-b-2",
                  isDark ? "bg-gray-900 border-purple-500 text-purple-300" : "bg-snes-mid border-snes-dark text-snes-accent"
                )}>
                  <tr>
                    <th className="px-4 md:px-6 py-4 md:py-5">Status</th>
                    <th className="px-4 md:px-6 py-4 md:py-5">De</th>
                    <th className="px-4 md:px-6 py-4 md:py-5 hidden md:table-cell">Mensagem</th>
                    <th className="px-4 md:px-6 py-4 md:py-5">Data</th>
                    <th className="px-4 md:px-6 py-4 md:py-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className={cn("divide-y", isDark ? "divide-gray-700" : "divide-gray-200")}>
                  {isLoadingMessages ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                          <p className="font-retro uppercase text-xs opacity-50">Carregando mensagens...</p>
                        </div>
                      </td>
                    </tr>
                  ) : messages.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center">
                        <p className="font-retro uppercase text-sm opacity-30">Nenhuma mensagem encontrada.</p>
                      </td>
                    </tr>
                  ) : (
                    messages.map((msg) => (
                      <React.Fragment key={msg.id}>
                        <tr 
                          className={cn(
                            "transition-all group cursor-pointer border-l-4",
                            expandedMessageId === msg.id ? "border-purple-500 shadow-inner" : "border-transparent",
                            msg.status === 'new' 
                              ? isDark ? "bg-purple-500/5 hover:bg-purple-500/10" : "bg-purple-50 hover:bg-purple-100"
                              : isDark ? "hover:bg-gray-700/50" : "hover:bg-snes-mid"
                          )}
                          onClick={() => setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)}
                        >
                          <td className="px-6 py-5">
                            {msg.status === 'new' ? (
                              <span className="flex items-center gap-2 text-red-500 font-bold uppercase text-[10px] tracking-widest">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Nova
                              </span>
                            ) : msg.status === 'replied' ? (
                              <span className="flex items-center gap-2 text-green-500 font-bold uppercase text-[10px] tracking-widest opacity-60">
                                <CheckCircle2 size={14} /> Respondida
                              </span>
                            ) : (
                              <span className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest opacity-60">
                                <MailOpen size={14} /> Lida
                              </span>
                            )}
                          </td>
                          <td className="px-4 md:px-6 py-4 md:py-5">
                            <div className="flex flex-col">
                              <span className="font-bold text-sm md:text-base tracking-tight truncate max-w-[80px] md:max-w-none">{msg.name}</span>
                              <span className="text-[10px] opacity-50 font-mono truncate max-w-[80px] md:max-w-none">{msg.email}</span>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 md:py-5 hidden md:table-cell">
                            <p className="text-xs line-clamp-1 opacity-70 italic max-w-xs font-mono">
                              "{msg.message}"
                            </p>
                          </td>
                          <td className="px-4 md:px-6 py-4 md:py-5 opacity-40 text-[9px] md:text-[10px] font-bold font-retro uppercase tracking-tighter whitespace-nowrap">
                            {formatDate(msg.createdAt)}
                          </td>
                          <td className="px-4 md:px-6 py-4 md:py-5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5 md:gap-2">
                              <button
                                onClick={() => handleReply(msg.email, msg.name)}
                                className="p-1.5 md:p-2.5 bg-purple-600 text-white rounded-lg md:rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-purple-900/20"
                                title="Responder via E-mail"
                              >
                                <Reply className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                              
                              {msg.status === 'new' && (
                                <button
                                  onClick={() => handleUpdateMessageStatus(msg.id, 'read')}
                                  className="p-1.5 md:p-2.5 bg-blue-500/10 text-blue-500 border-2 border-blue-500/30 rounded-lg md:rounded-xl hover:bg-blue-500 hover:text-white transition-all active:scale-95"
                                  title="Marcar como lida"
                                >
                                  <MailOpen className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                              )}

                              {msg.status !== 'replied' && (
                                <button
                                  onClick={() => handleUpdateMessageStatus(msg.id, 'replied')}
                                  className="p-1.5 md:p-2.5 bg-green-500/10 text-green-500 border-2 border-green-500/30 rounded-lg md:rounded-xl hover:bg-green-500 hover:text-white transition-all active:scale-95"
                                  title="Marcar como respondida"
                                >
                                  <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteMsg(msg.id)}
                                className="p-1.5 md:p-2.5 bg-red-500/10 text-red-500 border-2 border-red-500/30 rounded-lg md:rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                                title="Excluir"
                              >
                                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Conteúdo Expandido da Mensagem */}
                        {expandedMessageId === msg.id && (
                          <tr className={cn(isDark ? "bg-gray-800/80" : "bg-purple-50/50")}>
                            <td colSpan="5" className="px-2 md:px-10 py-4 md:py-10">
                              <div className={cn(
                                "p-4 md:p-8 rounded-3xl border-4 shadow-2xl relative overflow-hidden transition-all animate-in slide-in-from-top-4 duration-300",
                                isDark ? "bg-gray-900 border-purple-600/30" : "bg-white border-purple-200"
                              )}>
                                <div className="relative z-10">
                                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 pb-4 border-b-2 border-dashed border-gray-700/30 gap-4">
                                    <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-xl md:text-2xl shadow-lg border-2 border-black/20">
                                        ✉️
                                      </div>
                                      <div>
                                        <h4 className="font-retro text-sm md:text-lg font-bold text-purple-500 leading-none mb-1">
                                          Mensagem de {msg.name}
                                        </h4>
                                        <p className="text-[10px] md:text-xs opacity-50 font-mono">{msg.email}</p>
                                      </div>
                                    </div>
                                    <div className="md:text-right">
                                      <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-40">Recebido em</p>
                                      <p className="text-[10px] md:text-xs font-mono">{formatDate(msg.createdAt)}</p>
                                    </div>
                                  </div>

                                  <div className={cn(
                                    "p-4 md:p-8 rounded-2xl border-2 font-medium text-sm md:text-lg leading-relaxed whitespace-pre-wrap",
                                    isDark ? "bg-gray-800/50 border-gray-700/50 text-gray-200" : "bg-gray-50 border-gray-100 text-gray-800"
                                  )}>
                                    {msg.message}
                                  </div>
                                  
                                  <div className="mt-8 flex justify-end gap-4">
                                    <button 
                                      onClick={() => handleReply(msg.email, msg.name)}
                                      className="px-6 py-3 bg-purple-600 text-white rounded-xl font-retro text-xs font-bold uppercase flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                                    >
                                      <Reply size={16} /> Responder Agora
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Confirmação de Exclusão */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setDeleteModal({ isOpen: false, id: null })}
          />
          <div className={cn(
            "relative w-full max-w-md p-8 rounded-[2.5rem] border-4 shadow-[12px_12px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300",
            isDark ? "bg-gray-900 border-red-500/50 shadow-red-900/20" : "bg-white border-red-500 shadow-red-200"
          )}>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-3xl border-4 border-red-500 flex items-center justify-center text-red-500 mb-6 animate-bounce">
                <Trash2 size={40} />
              </div>
              <h3 className="font-retro text-2xl font-bold uppercase tracking-tighter mb-4">
                Confirmar <span className="text-red-500">Exclusão</span>?
              </h3>
              <p className="text-sm opacity-60 mb-2 leading-relaxed">
                Você está prestes a excluir permanentemente:
              </p>
              <p className="font-bold text-red-500 mb-6 truncate max-w-full italic px-4 py-2 bg-red-500/5 rounded-xl border border-red-500/20">
                "{deleteModal.title}"
              </p>
              <p className="text-[10px] uppercase font-retro opacity-40 mb-8">
                Esta ação não poderá ser desfeita.
              </p>
              
              <div className="flex w-full gap-4">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, id: null })}
                  className={cn(
                    "flex-1 py-4 rounded-2xl font-retro text-xs font-bold uppercase tracking-widest border-4 transition-all active:scale-95",
                    isDark ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  )}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-4 bg-red-500 border-4 border-black text-white rounded-2xl font-retro text-xs font-bold uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  Sim, Deletar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
