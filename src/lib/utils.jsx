import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes utilitárias do Tailwind CSS de forma segura.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formata datas provenientes do Firestore (Timestamp) ou string retrocompatível.
 */
export const formatDate = (createdAt, oldDate) => {
  if (createdAt && typeof createdAt.toDate === 'function') {
    return createdAt.toDate().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }
  if (createdAt && typeof createdAt === 'string') {
    return new Date(createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }
  return oldDate || "Data Desconhecida";
};

/**
 * Calcula o tempo de leitura estimado de um texto.
 * @param {string} text
 * @returns {string} Ex: "3 min de leitura"
 */
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min de leitura`;
};

/**
 * Converte um título em um slug (URL amigável).
 * Ex: "A Magia dos 16-bits" -> "a-magia-dos-16-bits"
 * @param {string} text 
 * @returns {string}
 */
export const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // Decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
    .replace(/\s+/g, '-') // Troca espaços por -
    .replace(/[^\w-]+/g, '') // Remove caracteres especiais
    .replace(/--+/g, '-') // Evita múltiplos hífenes
    .replace(/^-+/, '') // Remove hífen do início
    .replace(/-+$/, ''); // Remove hífen do fim
};

/**
 * Renderiza o conteúdo de um artigo, tratando imagens no formato Markdown
 * `![alt](url)` e parágrafos de texto.
 * @param {string} content
 * @param {boolean} isDark
 * @returns {JSX.Element[]}
 */
export function renderArticleContent(content, isDark) {
  const regex = /!\[([^\]]*)\]\((.*?)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", text: content.substring(lastIndex, match.index) });
    }
    parts.push({ type: "image", alt: match[1], url: match[2], key: match.index });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push({ type: "text", text: content.substring(lastIndex) });
  }

  return parts.map((part, index) => {
    if (part.type === "text") {
      return (
        <div key={index} className={`${index === 0 ? "magazine-article" : ""} whitespace-pre-line mb-8`}>
          {part.text}
        </div>
      );
    } else {
      return (
        <figure key={part.key} className="my-16 w-full animate-in fade-in duration-700 relative group">
          <img
            src={part.url}
            alt={part.alt}
            className={`w-full rounded-2xl border-4 ${
              isDark
                ? "border-purple-500 shadow-[8px_8px_0px_rgba(168,85,247,0.4)]"
                : "border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]"
            } object-cover max-h-[600px] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1`}
          />
          {part.alt && (
            <figcaption
              className={`text-center text-sm mt-6 font-retro font-bold tracking-widest uppercase ${
                isDark ? "text-purple-400" : "text-purple-600"
              }`}
            >
              ▲ {part.alt}
            </figcaption>
          )}
        </figure>
      );
    }
  });
}
