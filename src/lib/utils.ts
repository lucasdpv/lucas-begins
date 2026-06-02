import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "dompurify";

/**
 * Combina classes utilitárias do Tailwind CSS de forma segura.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata datas provenientes do Firestore (Timestamp) ou string retrocompatível.
 */
export const formatDate = (createdAt: any, oldDate?: string): string => {
  if (createdAt instanceof Date) {
    return createdAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }
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
 */
export const calculateReadingTime = (text: string): string => {
  if (!text || !text.trim()) return "1 min de leitura";
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min de leitura`;
};

/**
 * Gera o style object para background cover a partir de uma URL de imagem.
 */
export function coverBgStyle(imageUrl: string | undefined | null, imagePosition: string = "center"): React.CSSProperties {
  if (!imageUrl) return {};
  return { backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: imagePosition };
}

/**
 * Converte um título em um slug (URL amigável).
 */
export const slugify = (text: string | null | undefined): string => {
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
 * Limpa conteúdo HTML para evitar ataques XSS e remover tags indesejadas.
 */
export function sanitizeContent(content: string): string {
  if (!content) return "";
  return DOMPurify.sanitize(content, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Formata números grandes (ex: 1200 -> 1.2k).
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

/**
 * Retorna a URL de um avatar em Pixel Art gerado via DiceBear.
 */
export function getPixelAvatar(seed: string): string {
  // Usamos o estilo pixel-art do DiceBear (versão 9.x) para manter o clima retro
  // Adicionamos parâmetros para garantir que pareçam "rostos" mais definidos
  const baseUrl = "https://api.dicebear.com/9.x/pixel-art/svg";
  const params = new URLSearchParams({
    seed: seed,
    backgroundColor: "transparent",
    size: "128"
  });
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Divide um título em título principal (ex: nome do jogo/série) e subtítulo/chamada.
 * Procura por delimitadores comuns como ":", " - ", " – " ou " | ".
 */
export function splitTitle(title: string | null | undefined): { mainTitle: string; subtitle: string } {
  if (!title) return { mainTitle: "", subtitle: "" };
  
  const separators = [":", " - ", " – ", " | "];
  for (const sep of separators) {
    if (title.includes(sep)) {
      const parts = title.split(sep);
      const main = parts[0].trim();
      const sub = parts.slice(1).join(sep).trim();
      if (main && sub) {
        return { mainTitle: main, subtitle: sub };
      }
    }
  }
  return { mainTitle: "", subtitle: title.trim() };
}

