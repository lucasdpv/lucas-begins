import React, { useState } from "react";
import { ArrowLeft, Settings, Plus, Edit, Trash2, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Helmet } from "react-helmet-async";
import { cn } from "../lib/utils";

/**
 * Painel administrativo com abas: Artigos (tabela CRUD) e Categorias (criar/excluir).
 */
export default function AdminPage() {
  const { posts, categories, isDark, handleDeletePost, handleAddCategory, handleDeleteCategory } = useAppContext();
  const navigate = useNavigate();
  const [adminTab, setAdminTab] = useState("posts");
  const [newCategoryName, setNewCategoryName] = useState("");

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
            className={cn("p-3 rounded-lg retro-button", isDark ? "bg-gray-800 border-purple-500 text-white" : "bg-white border-black text-black")}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="font-retro text-3xl md:text-4xl font-bold uppercase tracking-wide flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(168,85,247,0.5)]">
            <Settings className="w-8 h-8 text-purple-500" /> Painel de Controle
          </h2>
        </div>

        {/* Abas */}
        <div className="flex gap-4">
          {["posts", "categories"].map((tab) => (
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
              {tab === "posts" ? "Artigos" : "Categorias"}
            </button>
          ))}
        </div>
      </div>

      {/* Aba: Artigos */}
      {adminTab === "posts" && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => navigate("/editor")}
              className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-xl font-retro uppercase text-sm font-bold retro-button border-2 border-black"
            >
              <Plus className="w-5 h-5" /> Nova Publicação
            </button>
          </div>
          <div className={cn("rounded-2xl retro-card overflow-hidden", isDark ? "bg-gray-800" : "bg-white")}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-medium">
                <thead
                  className={cn(
                    "font-retro uppercase text-xs tracking-wider border-b-2",
                    isDark ? "bg-gray-900 border-purple-500 text-purple-300" : "bg-gray-100 border-black text-black"
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
                      className={cn(isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50", "transition-colors")}
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
                      <td className="px-6 py-4 hidden sm:table-cell opacity-70 font-mono">{post.date}</td>
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
                            onClick={() => handleDeletePost(post.id)}
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
          <div className={cn("p-8 rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-white")}>
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
                    isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-50 border-black text-black"
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
          <div className={cn("p-8 rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-white")}>
            <h3 className="font-retro text-2xl font-bold uppercase mb-6 border-b-2 border-purple-500 pb-2 inline-flex">
              Categorias Atuais
            </h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 font-retro font-bold uppercase text-sm",
                    isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-black"
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
    </div>
  );
}
