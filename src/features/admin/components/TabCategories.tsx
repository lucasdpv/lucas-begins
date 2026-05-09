import React, { useState } from "react";
import { Tag, Plus, Trash2 } from "lucide-react";
import { cn } from "../../../lib/utils";

interface TabCategoriesProps {
  categories: string[];
  postsCountByCategory: (category: string) => number;
  onAddCategory: (name: string) => Promise<void>;
  onDeleteCategory: (name: string) => void;
  isDark: boolean;
  showToast: (msg: string, type?: any) => void;
}

export default function TabCategories({
  categories,
  postsCountByCategory,
  onAddCategory,
  onDeleteCategory,
  isDark,
  showToast
}: TabCategoriesProps) {
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    if (categories.includes(newCategoryName.trim())) {
      showToast("Esta categoria já existe.", "error");
      return;
    }

    await onAddCategory(newCategoryName.trim());
    setNewCategoryName("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Criar */}
      <div className={cn("p-6 md:p-8 rounded-2xl retro-card", isDark ? "bg-gray-800" : "bg-snes-surface")}>
        <h3 className="font-retro text-lg md:text-2xl font-bold uppercase mb-4 md:mb-6 flex items-center gap-2 border-b-2 border-purple-500 pb-2 inline-flex">
          <Tag className="w-5 h-5 md:w-6 md:h-6 text-purple-500" /> Criar Categoria
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex items-center gap-3">
                <span>{cat}</span>
                <span className="text-[10px] opacity-40">({postsCountByCategory(cat)})</span>
              </div>
              <button
                onClick={() => onDeleteCategory(cat)}
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
  );
}
