import { z } from 'zod';

export const AuthorSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  role: z.string().optional(), // Made optional as it's missing in some places
  avatar: z.string().optional(),
  bio: z.string().optional(),
  level: z.number().optional(),
  aka: z.string().optional(),
});

export type Author = z.infer<typeof AuthorSchema>;

export const CommentSchema = z.object({
  id: z.union([z.string(), z.number()]),
  authorId: z.string(),
  author: z.string(),
  authorAvatar: z.string().optional(),
  text: z.string().min(1),
  createdAt: z.any(),
});

export type Comment = z.infer<typeof CommentSchema>;

export const PostSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  content: z.string(),
  excerpt: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  imagePosition: z.string().optional(),
  slug: z.string().optional(), // Changed to optional as it's missing in some places
  isFeatured: z.boolean().default(false),
  isDraft: z.boolean().default(false),
  views: z.number().default(0),
  likes: z.number().default(0),
  likedBy: z.array(z.string()).default([]),
  comments: z.array(CommentSchema).default([]),
  author: AuthorSchema,
  createdAt: z.any(), // Firebase Timestamp
  updatedAt: z.any().optional(),
  score: z.union([z.string(), z.number()]).optional(),
  verdict: z.string().optional(),
  showAuthorBox: z.boolean().optional(),
  gradient: z.string().optional(),
  date: z.string().optional(),
});

export type Post = z.infer<typeof PostSchema>;
