import { z } from 'zod';

export const AuthorSchema = z.object({
  name: z.string(),
  role: z.string(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  level: z.number().optional(),
  aka: z.string().optional(),
});

export const CommentSchema = z.object({
  id: z.union([z.string(), z.number()]),
  authorId: z.string(),
  author: z.string(),
  authorAvatar: z.string().optional(),
  text: z.string().min(1),
  createdAt: z.string(),
});

export const PostSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  content: z.string(),
  excerpt: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  slug: z.string(),
  isFeatured: z.boolean().default(false),
  views: z.number().default(0),
  likes: z.number().default(0),
  likedBy: z.array(z.string()).default([]),
  comments: z.array(CommentSchema).default([]),
  author: AuthorSchema,
  createdAt: z.any(), // Firebase Timestamp
  updatedAt: z.any(),
});
