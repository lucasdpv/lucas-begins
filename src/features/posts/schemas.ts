import { z } from 'zod';

export const AuthorSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().catch('Anônimo'),
  role: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  level: z.number().optional().nullable(),
  aka: z.string().optional().nullable(),
}).catch({ name: 'Anônimo' });

export type Author = z.infer<typeof AuthorSchema>;

export const CommentSchema = z.object({
  id: z.union([z.string(), z.number()]).catch(() => Date.now()),
  authorId: z.string().catch('unknown'),
  author: z.string().catch('Anônimo'),
  authorAvatar: z.string().optional().nullable(),
  authorLevel: z.number().optional().nullable().catch(1),
  text: z.string().catch(''),
  createdAt: z.any().optional(),
}).catch({ id: Date.now(), authorId: 'unknown', author: 'Anônimo', text: '', authorLevel: 1 });

export type Comment = z.infer<typeof CommentSchema>;

export const PostSchema = z.object({
  id: z.string(),
  title: z.string().catch('Sem Título'),
  content: z.string().catch(''),
  excerpt: z.string().optional().nullable(),
  category: z.string().catch('Geral'),
  tags: z.array(z.string()).catch([]),
  imageUrl: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  imagePosition: z.string().catch('center'),
  slug: z.string().optional().nullable(),
  isFeatured: z.boolean().catch(false),
  isDraft: z.boolean().catch(false),
  views: z.number().catch(0),
  likes: z.number().catch(0),
  likedBy: z.array(z.string()).catch([]),
  comments: z.array(CommentSchema).catch([]),
  author: AuthorSchema,
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
  score: z.union([z.string(), z.number()]).optional().nullable(),
  verdict: z.string().optional().nullable(),
  showAuthorBox: z.boolean().catch(true),
  gradient: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
});

export type Post = z.infer<typeof PostSchema>;
