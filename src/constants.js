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
