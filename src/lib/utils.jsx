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
  // Firestore plain object { seconds, nanoseconds } sem o método toDate()
  if (createdAt && typeof createdAt === 'object' && typeof createdAt.seconds === 'number') {
    return new Date(createdAt.seconds * 1000).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
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
  if (!text || !text.trim()) return "1 min de leitura";
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
 * Renderiza o conteúdo de um artigo, tratando elementos Markdown linha por linha.
 * @param {string} content
 * @param {boolean} isDark
 * @returns {JSX.Element[]}
 */
export function renderArticleContent(content, isDark) {
  const lines = content.split('\n');

  // Aplica bold e italic via dangerouslySetInnerHTML (conteúdo vem apenas do editor admin, sem risco XSS externo)
  const formatInline = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Drop cap só aparece se o parágrafo for o PRIMEIRO elemento do artigo
  // (sem headings, dividers ou imagens antes dele)
  let firstElementRendered = false;
  let firstParagraphRendered = false;

  return lines.map((line, index) => {
    // Linha vazia — pular
    if (!line.trim()) return null;

    // ## Heading — estilo retro do blog
    if (line.startsWith('## ')) {
      const headingText = line.slice(3).trim();
      firstElementRendered = true;
      return (
        <h2
          key={index}
          className={`font-retro font-bold text-2xl md:text-3xl uppercase mt-12 mb-5 pb-3 border-b-2 tracking-wide ${
            isDark ? 'border-purple-500 text-purple-300' : 'border-purple-400 text-purple-700'
          }`}
        >
          {headingText}
        </h2>
      );
    }

    // --- Divider decorativo
    if (line.trim() === '---') {
      firstElementRendered = true;
      return (
        <div key={index} className="my-12 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
          <span className={`font-retro text-lg ${isDark ? 'text-purple-400' : 'text-purple-500'} opacity-50`}>
            ✦
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
        </div>
      );
    }

    // ![alt](url) — Imagem
    const imgMatch = line.match(/^!\[([^\]]*)\]\((.+?)\)$/);
    if (imgMatch) {
      firstElementRendered = true;
      return (
        <figure key={index} className="my-14 w-full animate-in fade-in duration-700 relative group">
          <img
            src={imgMatch[2]}
            alt={imgMatch[1]}
            className={`w-full rounded-2xl border-4 ${
              isDark
                ? 'border-purple-500 shadow-[8px_8px_0px_rgba(168,85,247,0.4)]'
                : 'border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]'
            } object-cover max-h-[600px]`}
          />
          {imgMatch[1] && (
            <figcaption
              className={`text-center text-sm mt-5 font-retro font-bold tracking-widest uppercase ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`}
            >
              ▲ {imgMatch[1]}
            </figcaption>
          )}
        </figure>
      );
    }

    // Parágrafo de texto
    // Drop cap apenas se este for o PRIMEIRO elemento do artigo (sem headings antes)
    const isFirst = !firstParagraphRendered && !firstElementRendered;
    firstParagraphRendered = true;
    firstElementRendered = true;

    return (
      <p
        key={index}
        className={`${isFirst ? 'magazine-article' : ''} mb-6 leading-loose text-lg md:text-xl font-medium`}
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />
    );
  }).filter(Boolean);
}
