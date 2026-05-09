import React from "react";
import {
  LayoutGrid,
  BookOpen,
  Clock,
  FileSearch,
  FileText,
  Star,
  Sword,
  Newspaper,
  CheckCircle,
  History,
  Cpu,
  Gamepad2,
  Music,
  Zap
} from "lucide-react";

/**
 * Retorna o ícone correspondente para cada categoria.
 */
export const getCategoryIcon = (cat: string, size?: number) => {
  const iconSize = size || 20;
  const lowerCat = cat.toLowerCase();
  
  if (lowerCat === "todos") return <LayoutGrid size={iconSize} />;
  if (lowerCat.includes("dossiê")) return <BookOpen size={iconSize} />;
  if (lowerCat.includes("tempo")) return <Clock size={iconSize} />;
  if (lowerCat.includes("análise")) return <FileSearch size={iconSize} />;
  if (lowerCat.includes("artigo")) return <FileText size={iconSize} />;
  if (lowerCat.includes("especial")) return <Star size={iconSize} />;
  if (lowerCat.includes("rpg") || lowerCat.includes("mmo")) return <Sword size={iconSize} />;
  if (lowerCat.includes("notícia")) return <Newspaper size={iconSize} />;
  if (lowerCat.includes("review")) return <CheckCircle size={iconSize} />;
  if (lowerCat.includes("nostalgia")) return <History size={iconSize} />;
  if (lowerCat.includes("tech") || lowerCat.includes("futuro")) return <Cpu size={iconSize} />;
  if (lowerCat.includes("retro") || lowerCat.includes("clássico")) return <Gamepad2 size={iconSize} />;
  if (lowerCat.includes("cultura") || lowerCat.includes("pop")) return <Music size={iconSize} />;
  
  return <Zap size={iconSize} />;
};
