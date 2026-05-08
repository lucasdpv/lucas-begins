export type { Post, Comment, Author as PostAuthor } from '../features/posts/schemas';

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: any;
  status?: string;
  read?: boolean;
}

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAdmin?: boolean;
}
