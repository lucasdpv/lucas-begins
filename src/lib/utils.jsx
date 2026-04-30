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


