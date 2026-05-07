/**
 * Constantes globais do projeto.
 * Centraliza magic strings para evitar inconsistências e facilitar manutenção.
 */

// LocalStorage keys
export const STORAGE_KEYS = {
  THEME: "lucas_begins_theme",
  DRAFT: "retro_blog_draft",
  MIGRATION_VERSION: "retro_blog_migration_version",
};

// Versão atual das migrações de dados
export const MIGRATION_VERSION = "v1.2";

// Roles de usuário
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

// Coleções do Firestore
export const COLLECTIONS = {
  POSTS: "posts",
  CATEGORIES: "categories",
  USERS: "users",
};

// Paginação padrão
export const POSTS_PER_PAGE = 6;

// Design System: Neo-Brutalist
export const BRUTAL_DESIGN = {
  // Sombras sólidas (Brutalist style)
  SHADOW: "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
  SHADOW_LG: "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
  SHADOW_XL: "shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]",
  SHADOW_XXL: "shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]",
  SHADOW_PURPLE: "shadow-[4px_4px_0px_rgba(168,85,247,0.4)]",
  
  // Bordas e Arredondamento
  BORDER: "border-2 border-black",
  BORDER_THICK: "border-4 border-black",
  BORDER_HEAVY: "border-4 md:border-[8px] border-black",
  ROUNDED: "rounded-none",
  ROUNDED_MODERN: "rounded-xl",
  
  // Efeitos e Estados
  TRANSITION: "transition-all duration-300",
  HOVER_LIFT: "hover:-translate-y-1 active:translate-y-0",
  HOVER_GLOW: "hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]",
};
