import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Edit,
  Plus,
  Pencil,
  Eye,
  Save,
  Star,
  Image as ImageIcon,
  Move,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { calculateReadingTime, cn } from "../lib/utils";
import PostDetailPage from "./PostDetailPage";
import { useAppContext } from "../context/AppContext";
import BlockEditor from "../components/editor/BlockEditor";
import { Helmet } from "react-helmet-async";

const DRAFT_KEY = "retro_blog_draft";



/**
 * Editor de artigos com abas Editar / Preview e auto-save no localStorage.
 * Inclui controle de posicionamento da imagem de capa.
 */
export default function PostEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, categories, isDark, currentUser, handleSavePost } = useAppContext();

  const [activeTab, setActiveTab] = useState("edit");

  const post = id ? posts.find((p) => String(p.id) === String(id)) : null;

  // Inicializa com o post existente ou com o rascunho salvo
  const [formData, setFormData] = useState(() => {
    if (post) return post;
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      return savedDraft
        ? JSON.parse(savedDraft)
        : { title: "", excerpt: "", content: "", category: categories[0] || "", imageUrl: "", score: "", verdict: "", isDraft: false, showAuthorBox: false };
    } catch {
      localStorage.removeItem(DRAFT_KEY);
      return { title: "", excerpt: "", content: "", category: categories[0] || "", imageUrl: "", score: "", verdict: "", isDraft: false, showAuthorBox: false };
    }
  });

  // Auto-save do rascunho a cada 1 segundo (só para novos posts)
  useEffect(() => {
    if (!post) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [formData, post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "score" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e, forceDraft = false) => {
    if (e) e.preventDefault();
    if (!post) localStorage.removeItem(DRAFT_KEY);
    
    const postToSave = { 
      ...formData, 
      isDraft: forceDraft,
      author: {
        id: currentUser?.id,
        name: currentUser?.name,
        avatar: currentUser?.avatar,
        bio: currentUser?.bio,
        level: currentUser?.level || 1,
        aka: currentUser?.aka || ""
      }
    };
    const saved = await handleSavePost(postToSave);
    if (saved) navigate("/admin");
  };

  const inputClass = cn(
    "w-full p-4 rounded-xl outline-none border-2 font-medium focus:border-purple-500 transition-all",
    isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-black text-black"
  );

  const previewPost = {
    ...formData,
    id: "preview-id",
    date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
    likes: 0,
    comments: [],
    author: { 
      name: currentUser?.name || "Autor", 
      role: "Editor Chefe", 
      avatar: currentUser?.avatar, 
      bio: currentUser?.bio,
      level: currentUser?.level || 1,
      aka: currentUser?.aka
    },
    gradient: "from-purple-600 to-blue-600",
    showAuthorBox: formData.showAuthorBox !== false,
  };

  return (
    <div className="animate-in fade-in max-w-5xl mx-auto">
      <Helmet>
        <title>{post ? "Editar Fase" : "Nova Fase"} | Lucas Begins</title>
      </Helmet>

      {/* Cabeçalho com abas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <h2 className="font-retro text-3xl font-bold uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(168,85,247,0.5)]">
          {post ? <Edit className="text-purple-500 w-8 h-8" /> : <Plus className="text-purple-500 w-8 h-8" />}
          {post ? "Editando Level" : "Nova Fase (Post)"}
        </h2>

        <div className="flex items-center gap-4">
          <div className={cn("flex p-1.5 rounded-xl border-2 retro-card", isDark ? "bg-gray-800 border-purple-500" : "bg-gray-200 border-black")}>
            {[
              { key: "edit", icon: <Pencil className="w-4 h-4" />, label: "Editar" },
              { key: "preview", icon: <Eye className="w-4 h-4" />, label: "Preview" },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase font-retro transition-all",
                  activeTab === key
                    ? "bg-purple-600 text-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "text-gray-500 hover:text-purple-500"
                )}
              >
                {icon} {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate("/admin")}
            className={cn(
              "px-5 py-3 rounded-xl text-sm font-retro uppercase font-bold transition-colors retro-button",
              isDark ? "bg-gray-800 text-white border-gray-600 hover:bg-gray-700" : "bg-white text-black border-black hover:bg-gray-100"
            )}
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Aba: Edição */}
      {activeTab === "edit" ? (
        <form
          onSubmit={handleSubmit}
          className={cn("p-8 md:p-10 rounded-2xl retro-card space-y-8", isDark ? "bg-gray-800" : "bg-white")}
        >
          <div className="flex justify-between items-center opacity-60 text-xs uppercase font-retro font-bold">
            <span>{post ? "Editando artigo existente" : "Salvo automaticamente no memory card 💾"}</span>
            {formData.content && <span>{calculateReadingTime(formData.content)}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Título */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-sm font-bold uppercase font-retro opacity-80">Título da Matéria *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Ex: Análise Completa de Silent Hill 2..."
              />
            </div>



            {/* Imagem de Capa */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase font-retro opacity-80 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> URL da Imagem de Capa
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://..."
              />
            </div>

            {/* Categoria */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase font-retro opacity-80">Categoria *</label>
              <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Score */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase font-retro opacity-80 text-yellow-500 flex items-center gap-2">
                <Star className="w-4 h-4" /> Nota / Score (0 a 10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                name="score"
                value={formData.score}
                onChange={handleChange}
                className={inputClass}
                placeholder="Opcional. Ex: 9.5"
              />
            </div>

            {/* Veredito */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase font-retro opacity-80 text-yellow-500">Veredito</label>
              <input
                type="text"
                name="verdict"
                value={formData.verdict}
                onChange={handleChange}
                className={inputClass}
                placeholder="Ex: Obra-prima, Fraco..."
                disabled={!formData.score}
              />
            </div>

            {/* Resumo */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-sm font-bold uppercase font-retro opacity-80">Resumo (Linha Fina) *</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows="2"
                className={cn(inputClass, "resize-none")}
                placeholder="Breve introdução chamativa para as capas..."
              />
            </div>

            {/* Conteúdo */}
            <div className="md:col-span-2 space-y-4">
              <label className="text-sm font-bold uppercase font-retro opacity-80">Conteúdo Completo *</label>
              <div data-color-mode={isDark ? "dark" : "light"}>
                <BlockEditor
                  value={formData.content}
                  onChange={(val) => setFormData((prev) => ({ ...prev, content: val || "" }))}
                  isDark={isDark}
                />
              </div>
            </div>
            
            {/* Toggle Author Box */}
            <div className={cn(
              "md:col-span-2 flex items-center gap-4 p-6 rounded-2xl border-2 border-dashed transition-all",
              isDark ? "bg-purple-900/10 border-purple-500/30" : "bg-purple-50 border-purple-500/20"
            )}>
              <input
                type="checkbox"
                id="showAuthorBox"
                name="showAuthorBox"
                checked={formData.showAuthorBox !== false}
                onChange={(e) => setFormData(prev => ({ ...prev, showAuthorBox: e.target.checked }))}
                className="w-6 h-6 accent-purple-600 cursor-pointer"
              />
              <label htmlFor="showAuthorBox" className="font-retro font-bold uppercase text-sm cursor-pointer select-none flex-1">
                Exibir Caixa de Autor ("Sobre o Autor") no final da matéria
                <span className="block text-[10px] opacity-60 font-medium normal-case mt-1 tracking-normal">
                  Se desativado, sua foto e bio não aparecerão nesta matéria específica.
                </span>
              </label>
            </div>
          </div>

          <div className="pt-8 border-t-2 border-gray-300 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className={cn("flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-retro uppercase text-lg font-bold border-2 transition-colors", 
                isDark ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600" : "bg-gray-200 text-gray-800 border-gray-400 hover:bg-gray-300")}
            >
              💾 Salvar Rascunho
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              className="flex items-center justify-center gap-3 bg-purple-600 text-white px-10 py-4 rounded-xl font-retro uppercase text-lg font-bold retro-button border-black hover:bg-purple-500 transition-colors"
            >
              <Save className="w-6 h-6" /> Publicar Matéria
            </button>
          </div>
        </form>
      ) : (
        /* Aba: Preview */
        <div className={cn("border-4 border-dashed p-4 md:p-8 rounded-3xl relative mt-8", isDark ? "border-purple-500/50 bg-gray-900/50" : "border-black/20 bg-gray-50")}>
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-6 py-2 rounded-xl font-retro text-sm font-bold uppercase retro-card border-black">
            Modo de Pré-Visualização
          </div>
          <PostDetailPage previewPost={previewPost} />
          <div className="mt-12 flex justify-center pb-8 border-t-4 border-dashed border-purple-500/50 pt-8 relative">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-6 py-2 rounded-xl font-retro text-sm font-bold uppercase border-2 border-black z-10">
              Ação de Teste
            </div>
            <button
              onClick={(e) => handleSubmit(e, false)}
              className="flex items-center gap-3 bg-yellow-400 text-black border-2 border-black px-10 py-5 rounded-xl font-retro uppercase font-bold retro-button text-xl z-20 hover:bg-yellow-300 transition-colors"
            >
              <Save className="w-7 h-7" /> Lançar Revista (Publicar)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
