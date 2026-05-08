import { describe, it, expect } from 'vitest';
import { PostSchema } from './schemas';

describe('PostSchema (Zod)', () => {
  const validPost = {
    id: "post-123",
    title: "The Legend of Zelda",
    content: "Content about Zelda",
    excerpt: "Short Zelda summary",
    category: "Retro",
    author: {
      name: "Lucas",
      role: "Editor"
    },
    createdAt: { seconds: 1705320000, nanoseconds: 0 },
    views: 100,
    likes: 10,
    likedBy: [],
    comments: [],
    isFeatured: false,
    isDraft: false
  };

  it('deve validar um post correto', () => {
    const result = PostSchema.safeParse(validPost);
    expect(result.success).toBe(true);
  });

  it('deve falhar se o título for vazio', () => {
    const invalidPost = { ...validPost, title: "" };
    const result = PostSchema.safeParse(invalidPost);
    expect(result.success).toBe(false);
  });

  it('deve falhar se campos obrigatórios estiverem faltando', () => {
    const { title, ...incompletePost } = validPost;
    const result = PostSchema.safeParse(incompletePost);
    expect(result.success).toBe(false);
  });

  it('deve aplicar valores default corretamente', () => {
    const { views, likes, category, author, ...postWithoutDefaults } = validPost;
    const result = PostSchema.safeParse(postWithoutDefaults);
    if (result.success) {
      expect(result.data.views).toBe(0);
      expect(result.data.likes).toBe(0);
      expect(result.data.category).toBe('Geral');
      expect(result.data.author.name).toBe('Anônimo');
    }
  });
});
