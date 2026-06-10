import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "@/lib/router-compat";
import {
  Edit,
  Plus,
  Pencil,
  Eye,
  Save,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { calculateReadingTime, cn, splitTitle } from "../lib/utils";
import PostDetailPage from "./PostDetailPage";
import { useAuth } from "../context/AuthProvider";
import { useThemeStore } from "../store/useThemeStore";
import { useUIStore } from "../store/useUIStore";
import { useCreatePostMutation, useUpdatePostMutation, useAllPosts } from "../features/posts/hooks/usePostsQuery";
import { useCategories } from "../features/posts/hooks/useCategoriesQuery";
import BlockEditor from "../components/editor/BlockEditor";
import ImageUpload from "../components/ui/ImageUpload";
import { Helmet } from "react-helmet-async";
import { STORAGE_KEYS } from "../constants";
import { Post } from "../features/posts/schemas";

const DRAFT_KEY = STORAGE_KEYS.DRAFT;

type EditorTab = "edit" | "preview";

/**
 * Editor de artigos com abas Editar / Preview e auto-save no localStorage.
 * Inclui controle de posicionamento da imagem de capa.
 */
export default function PostEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const { data: posts = [] } = useAllPosts(); 
  const { data: categories = [] } = useCategories();
  const { currentUser } = useAuth();
  const { isDark } = useThemeStore();

  const createPostMutation = useCreatePostMutation();
  const updatePostMutation = useUpdatePostMutation();

  const [activeTab, setActiveTab] = useState<EditorTab>("edit");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const post = id ? (posts as Post[]).find((p) => String(p.id) === String(id)) : null;

  // Inicializa com o post existente ou com o rascunho salvo
  const [formData, setFormData] = useState<Partial<Post>>(() => {
    if (post) return post;
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      return savedDraft
        ? JSON.parse(savedDraft)
        : { title: "", excerpt: "", content: "", category: (categories as string[])[0] || "", imageUrl: "", score: undefined, verdict: "", isDraft: false, showAuthorBox: false };
    } catch {
      localStorage.removeItem(DRAFT_KEY);
      return { title: "", excerpt: "", content: "", category: (categories as string[])[0] || "", imageUrl: "", score: undefined, verdict: "", isDraft: false, showAuthorBox: false };
    }
  });
  const [hasLoadedPost, setHasLoadedPost] = useState(false);

  // Sincroniza o post carregado assincronamente com o estado do form (uma única vez)
  useEffect(() => {
    if (post && !hasLoadedPost) {
      setFormData(post);
      setHasLoadedPost(true);
    }
  }, [post, hasLoadedPost]);

  // Auto-save do rascunho com debounce de 1s (só para novos posts)
  useEffect(() => {
    if (!post) {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
        setLastSaved(new Date());
      }, 1000);
      return () => {
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      };
    }
  }, [formData, post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "score" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e?: React.FormEvent, forceDraft = false) => {
    if (e) e.preventDefault();
    if (!post) localStorage.removeItem(DRAFT_KEY);
    
    const postToSave = { 
      ...formData, 
      isDraft: forceDraft,
      author: {
        id: currentUser?.id || "",
        name: currentUser?.name || "",
        avatar: currentUser?.avatar || "",
        bio: currentUser?.bio || "",
        level: currentUser?.level || 1,
        aka: currentUser?.aka || ""
      }
    } as Post;

    try {
      if (id) {
        await updatePostMutation.mutateAsync({ id, data: postToSave });
      } else {
        await createPostMutation.mutateAsync(postToSave);
      }
      navigate("/admin");
    } catch (error: any) {
      console.error("Erro ao salvar post:", error);
      showToast(`Erro ao salvar o artigo: ${error.message || 'Falha na conexão'}`, 'error');
    }
  };

  const inputClass = cn(
    "w-full p-3.5 rounded-xl outline-none border-2 font-medium transition-all focus:border-purple-500",
    isDark 
      ? "bg-gray-900 border-gray-700 text-white placeholder:text-gray-500" 
      : "bg-purple-50/50 border-snes-dark/40 text-snes-accent placeholder:text-gray-500/70 focus:bg-white focus:border-purple-600"
  );

  const previewPost = {
    ...formData,
    id: "preview-id",
    date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
    likes: 0,
    comments: [],
    author: { 
      name: currentUser?.name || "Autor", 
      avatar: currentUser?.avatar || "", 
      bio: currentUser?.bio || "",
      level: currentUser?.level || 1,
      aka: currentUser?.aka || ""
    },
    gradient: "from-purple-600 to-blue-600",
    showAuthorBox: formData.showAuthorBox !== false,
  } as Post;

  return (
    <div className="animate-in fade-in max-w-5xl mx-auto">
      <Helmet>
        <title>{post ? "Editar Fase" : "Nova Fase"} | BeginsProject</title>
      </Helmet>

      {/* Cabeçalho com abas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-10">
        <h2 className="font-retro text-xl md:text-3xl font-bold uppercase flex items-center gap-2 md:gap-3 drop-shadow-[2px_2px_0px_rgba(168,85,247,0.5)]">
          {post ? <Edit className="text-purple-500 w-8 h-8" /> : <Plus className="text-purple-500 w-8 h-8" />}
          {post ? "Editando Level" : "Nova Fase (Post)"}
        </h2>

        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <div className={cn("flex p-1 rounded-xl border-2 retro-card", isDark ? "bg-gray-800 border-purple-500" : "bg-gray-200 border-black")}>
            {[
              { key: "edit" as EditorTab, icon: <Pencil className="w-3.5 h-3.5 md:w-4 h-4" />, label: "Editar" },
              { key: "preview" as EditorTab, icon: <Eye className="w-3.5 h-3.5 md:w-4 h-4" />, label: "Preview" },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={cn(
                  "flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold uppercase font-retro transition-all",
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
              "px-4 md:px-5 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-retro uppercase font-bold transition-colors retro-button",
              isDark ? "bg-gray-800 text-white border-gray-600 hover:bg-gray-700" : "bg-snes-surface text-snes-accent border-snes-dark hover:bg-snes-mid"
            )}
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Aba: Edição */}
      {activeTab === "edit" ? (
        <form
          onSubmit={(e) => handleSubmit(e)}
          className={cn("p-8 md:p-10 rounded-2xl retro-card space-y-8", isDark ? "bg-gray-800" : "bg-snes-surface")}
        >
          <div className="flex justify-between items-center opacity-60 text-xs uppercase font-retro font-bold">
            <span>
              {post
                ? "Editando artigo existente"
                : lastSaved
                  ? `Salvo às ${lastSaved.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} 💾`
                  : "Auto-save ativo 💾"}
            </span>
            {formData.content && <span>{calculateReadingTime(formData.content)}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Título */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold uppercase font-retro opacity-80">Título da Matéria *</label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Ex: Silent Hill 2: Análise Completa..."
              />
              <p className={cn("text-[11px] font-medium tracking-normal opacity-85", isDark ? "text-slate-400" : "text-gray-650")}>
                💡 <strong>Dica Retro:</strong> Use <code>:</code> (dois pontos) para separar o título. A primeira parte será o nome do jogo/série e a segunda será a chamada da matéria.
              </p>
              {formData.title && (() => {
                const { mainTitle, subtitle } = splitTitle(formData.title);
                if (mainTitle) {
                  return (
                    <div className={cn(
                       "p-3.5 border-2 border-dashed rounded-xl flex flex-col gap-1 mt-2 text-xs",
                      isDark ? "bg-purple-950/20 border-purple-500/30" : "bg-purple-50/50 border-purple-600/20"
                    )}>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                        Prévia da Divisão de Títulos:
                      </span>
                      <div className="flex flex-col gap-0.5 font-retro">
                        <span className={cn("font-bold text-sm uppercase", isDark ? "text-white" : "text-snes-accent")}>
                          {mainTitle}
                        </span>
                        <span className="font-sans text-[10px] opacity-75 mt-0.5">
                          {subtitle}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Imagem de Capa */}
            <div className="md:col-span-2">
              <ImageUpload 
                label="Imagem ou GIF de Capa (Upload ou Link)"
                initialValue={formData.imageUrl || ""}
                originalUrl={formData.originalImageUrl || ""}
                onUploadComplete={(url, aspect, originalUrl) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    imageUrl: url,
                    imageAspect: aspect || 'original',
                    originalImageUrl: originalUrl || prev.originalImageUrl || ""
                  }));
                }}
                folder="posts"
                aspect={16 / 9}
              />
            </div>

            {/* Categoria */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase font-retro opacity-80">Categoria *</label>
              <select name="category" value={formData.category || ""} onChange={handleChange} className={inputClass}>
                {(categories as string[]).map((c) => <option key={c} value={c}>{c}</option>)}
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
                value={formData.score ?? ""}
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
                value={formData.verdict || ""}
                onChange={handleChange}
                className={inputClass}
                placeholder="Ex: Obra-prima, Fraco..."
                disabled={!formData.score}
              />
            </div>

            {/* Resumo */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold uppercase font-retro opacity-80">Resumo (Linha Fina) *</label>
              <textarea
                name="excerpt"
                value={formData.excerpt || ""}
                onChange={handleChange}
                required
                rows={2}
                className={cn(inputClass, "resize-none")}
                placeholder="Breve introdução chamativa para as capas..."
              />
            </div>

            {/* Conteúdo */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-sm font-bold uppercase font-retro opacity-80">Conteúdo Completo *</label>
              <div data-color-mode={isDark ? "dark" : "light"}>
                <BlockEditor
                  value={formData.content || ""}
                  onChange={(val) => setFormData((prev) => ({ ...prev, content: val || "" }))}
                  isDark={isDark}
                />
              </div>
            </div>
            
            {/* Toggle Destaque (Carrossel) */}
            <div className={cn(
              "md:col-span-2 flex items-center gap-4 p-6 rounded-2xl border-2 border-dashed transition-all group relative",
              formData.isFeatured 
                ? (isDark ? "bg-yellow-900/10 border-yellow-500/50" : "bg-yellow-50 border-yellow-500/30")
                : (isDark ? "bg-gray-800/50 border-gray-700/50" : "bg-gray-50 border-gray-200")
            )}>
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured || false}
                disabled={!formData.isFeatured && (posts as Post[]).filter(p => p.isFeatured && String(p.id) !== String(id)).length >= 5}
                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                className="w-6 h-6 accent-yellow-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
              />
              <label htmlFor="isFeatured" className={cn(
                "font-retro font-bold uppercase text-sm cursor-pointer select-none flex-1",
                !formData.isFeatured && (posts as Post[]).filter(p => p.isFeatured && String(p.id) !== String(id)).length >= 5 && "opacity-40 cursor-not-allowed"
              )}>
                <div className="flex items-center gap-2">
                  <Star className={cn("w-4 h-4", formData.isFeatured && "fill-yellow-500 text-yellow-500")} />
                  Destacar no Carrossel da Home
                </div>
                <span className={cn(
                  "block text-[10px] font-medium normal-case mt-1 tracking-normal",
                  isDark ? "text-slate-400" : "text-gray-600"
                )}>
                  {(posts as Post[]).filter(p => p.isFeatured && String(p.id) !== String(id)).length >= 5 && !formData.isFeatured
                    ? "Limite de 5 artigos atingido. Remova um destaque no Painel Admin para liberar esta vaga."
                    : "Este artigo será exibido com destaque no carrossel da página inicial."}
                </span>
              </label>
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
                <span className={cn(
                  "block text-[10px] font-medium normal-case mt-1 tracking-normal",
                  isDark ? "text-slate-400" : "text-gray-600"
                )}>
                  Se desativado, sua foto e bio não aparecerão nesta matéria específica.
                </span>
              </label>
            </div>
          </div>

          <div className="pt-8 border-t-2 border-gray-300 dark:border-gray-700 flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Toggle de Atalho Inferior */}
            <div className={cn("flex p-1.5 rounded-xl border-2 retro-card shrink-0", isDark ? "bg-gray-800 border-purple-500" : "bg-gray-200 border-black")}>
              {[
                { key: "edit" as EditorTab, icon: <Pencil className="w-4 h-4" />, label: "Editar" },
                { key: "preview" as EditorTab, icon: <Eye className="w-4 h-4" />, label: "Preview" },
              ].map(({ key, icon, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActiveTab(key);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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

            <div className="flex flex-col sm:flex-row justify-end gap-4 w-full lg:w-auto">
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
          </div>
        </form>
      ) : (
        /* Aba: Preview */
        <div className={cn("border-4 border-dashed pt-14 pb-4 px-4 md:p-8 rounded-3xl relative mt-8", isDark ? "border-purple-500/50 bg-gray-900/50" : "border-snes-dark/20 bg-snes-input")}>
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-xl font-retro text-xs md:text-sm font-bold uppercase retro-card border-black whitespace-nowrap z-10">
            Modo de Pré-Visualização
          </div>
          <PostDetailPage previewPost={previewPost} />
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-t-4 border-dashed border-purple-500/50 pt-10 relative">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 md:px-6 py-1.5 md:py-2 rounded-xl font-retro text-xs md:text-sm font-bold uppercase border-2 border-black z-10 whitespace-nowrap">
              Ação de Teste
            </div>

            {/* Toggle de Atalho Inferior no Preview */}
            <div className={cn("flex p-1.5 rounded-xl border-2 retro-card shrink-0", isDark ? "bg-gray-800 border-purple-500" : "bg-gray-200 border-black")}>
              {[
                { key: "edit" as EditorTab, icon: <Pencil className="w-4 h-4" />, label: "Editar" },
                { key: "preview" as EditorTab, icon: <Eye className="w-4 h-4" />, label: "Preview" },
              ].map(({ key, icon, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActiveTab(key);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
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
              onClick={(e) => handleSubmit(e, false)}
              className="flex items-center gap-3 bg-yellow-400 text-black border-2 border-black px-10 py-5 rounded-xl font-retro uppercase font-bold retro-button text-xl z-20 hover:bg-yellow-300 transition-colors w-full md:w-auto"
            >
              <Save className="w-7 h-7" /> Publicar Matéria
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
