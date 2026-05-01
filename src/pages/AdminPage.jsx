import React, { useState } from "react";
import { ArrowLeft, Settings, Plus, Edit, Trash2, Tag, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Helmet } from "react-helmet-async";
import { cn, formatDate } from "../lib/utils";

/**
 * Painel administrativo com abas: Artigos (tabela CRUD) e Categorias (criar/excluir).
 */
export default function AdminPage() {
  const { posts, categories, isDark, currentUser, handleDeletePost, handleAddCategory, handleDeleteCategory, handleUpdateProfile } = useAppContext();
  const navigate = useNavigate();
  const [adminTab, setAdminTab] = useState("posts");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [profileData, setProfileData] = useState(() => ({
    name: currentUser?.name || "",
    avatar: currentUser?.avatar || "",
    bio: currentUser?.bio || "",
    level: currentUser?.level || 1,
    aka: currentUser?.aka || ""
  }));

  const handleAddCat = (e) => {
    e.preventDefault();
    handleAddCategory(newCategoryName);
    setNewCategoryName("");
  };

  return (
    <div className="animate-in fade-in max-w-6xl mx-auto">
      <Helmet>
        <title>Painel de Controle | Lucas Begins</title>
      </Helmet>
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className={cn("p-3 rounded-lg retro-button", isDark ? "bg-gray-800 border-purple-500 text-white" : "bg-snes-surface border-snes-dark text-snes-accent")}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="font-retro text-3xl md:text-4xl font-bold uppercase tracking-wide flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(168,85,247,0.5)]">
            <Settings className="w-8 h-8 text-purple-500" /> Painel de Controle
          </h2>
        </div>

        {/* Ações e Abas */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            {["posts", "categories", "profile"].map((tab) => (
              <button
                key={tab}
                onClick={() => setAdminTab(tab)}
                className={cn(
                  "px-6 py-3 rounded-xl font-retro text-sm uppercase font-bold retro-button",
                  adminTab === tab
                    ? "bg-purple-600 text-white border-black"
                    : isDark
                    ? "bg-gray-800 text-gray-400 border-transparent"
                    : "bg-gray-200 text-gray-600 border-transparent"
                )}
              >
                {tab === "posts" ? "Artigos" : tab === "categories" ? "Categorias" : "Meu Perfil"}
              </button>
            ))}
          </div>

          {adminTab === "posts" && (
            <button
              onClick={() => navigate("/editor")}
              className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-xl font-retro uppercase text-sm font-bold retro-button border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" /> Nova Publicação
            </button>
          )}
        </div>
      </div>

      {/* Aba: Artigos */}
      {adminTab === "posts" && (
        <div className="space-y-6">
          <div className={cn("rounded-2xl retro-card overflow-hidden", isDark ? "bg-gray-800" : "bg-snes-surface")}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-medium">
                <thead
                  className={cn(
                    "font-retro uppercase text-xs tracking-wider border-b-2",
                    isDark ? "bg-gray-900 border-purple-500 text-purple-300" : "bg-snes-mid border-snes-dark text-snes-accent"
                  )}
                >
                  <tr>
                    <th className="px-6 py-5">Título</th>
                    <th className="px-6 py-5 hidden md:table-cell">Categoria</th>
                    <th className="px-6 py-5 hidden sm:table-cell">Data</th>
                    <th className="px-6 py-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className={cn("divide-y", isDark ? "divide-gray-700" : "divide-gray-200")}>
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className={cn(isDark ? "hover:bg-gray-700/50" : "hover:bg-snes-mid", "transition-colors")}
                    >
                      <td className="px-6 py-4 font-bold max-w-[250px] truncate text-base" title={post.title}>
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
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => navigate(`/editor/${post.id}`)}
                            className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500 rounded-lg transition-colors retro-button"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Tem certeza que deseja excluir definitivamente este artigo?")) {
                                handleDeletePost(post.id);
                              }
                            }}
                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500 rounded-lg transition-colors retro-button"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Aba: Categorias */}
      {adminTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Criar */}
          <div className={cn("p-8 rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-snes-surface")}>
            <h3 className="font-retro text-2xl font-bold uppercase mb-6 flex items-center gap-2 border-b-2 border-purple-500 pb-2 inline-flex">
              <Tag className="w-6 h-6 text-purple-500" /> Criar Categoria
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
          <div className={cn("p-8 rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-snes-surface")}>
            <h3 className="font-retro text-2xl font-bold uppercase mb-6 border-b-2 border-purple-500 pb-2 inline-flex">
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
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-2 text-red-500 hover:bg-red-500 hover:text-white border border-transparent hover:border-red-500 rounded-lg transition-colors"
                    title="Excluir Categoria"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Formulário */}
          <div className={cn("lg:col-span-2 p-8 rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-snes-surface")}>
            <h3 className="font-retro text-2xl font-bold uppercase mb-8 flex items-center gap-3 border-b-2 border-purple-500 pb-3">
              <User className="w-6 h-6 text-purple-500" /> Editar Perfil de Autor
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase font-retro opacity-80">Nome de Exibição</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className={cn(
                      "w-full p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium",
                      isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase font-retro opacity-80">AKA (Apelido)</label>
                  <input
                    type="text"
                    value={profileData.aka}
                    onChange={(e) => setProfileData(prev => ({ ...prev, aka: e.target.value }))}
                    className={cn(
                      "w-full p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium",
                      isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
                    )}
                    placeholder="Ex: Luck, The Boss..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase font-retro opacity-80">URL da Foto</label>
                  <input
                    type="url"
                    value={profileData.avatar}
                    onChange={(e) => setProfileData(prev => ({ ...prev, avatar: e.target.value }))}
                    className={cn(
                      "w-full p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium",
                      isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
                    )}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase font-retro opacity-80">Seu Level (Idade)</label>
                  <input
                    type="number"
                    value={profileData.level}
                    onChange={(e) => setProfileData(prev => ({ ...prev, level: e.target.value }))}
                    className={cn(
                      "w-full p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium",
                      isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase font-retro opacity-80">Sua Bio (Descrição Gamificada)</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  rows="4"
                  className={cn(
                    "w-full p-4 rounded-xl outline-none border-2 focus:border-purple-500 transition-all font-medium resize-none",
                    isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-snes-input border-snes-dark text-snes-accent"
                  )}
                  placeholder="Escreva algo sobre você para aparecer no final dos seus posts..."
                />
              </div>

              <button
                onClick={() => handleUpdateProfile(profileData)}
                className="w-full md:w-auto bg-purple-600 text-white px-10 py-4 rounded-xl font-retro uppercase text-lg font-bold retro-button shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-purple-500 transition-all"
              >
                Salvar Alterações
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
    </div>
  );
}
