import { describe, it, expect } from 'vitest';
import { slugify, calculateReadingTime, formatDate } from './utils';

describe('Utility Functions', () => {
  describe('slugify', () => {
    it('deve converter texto para minúsculas e trocar espaços por hifens', () => {
      expect(slugify('Olá Mundo')).toBe('ola-mundo');
    });

    it('deve remover acentos corretamente', () => {
      expect(slugify('Ação e Reação')).toBe('acao-e-reacao');
    });

    it('deve remover caracteres especiais', () => {
      expect(slugify('Zelda: Ocarina of Time @2024!')).toBe('zelda-ocarina-of-time-2024');
    });

    it('deve lidar com strings vazias ou nulas', () => {
      expect(slugify('')).toBe('');
      expect(slugify(null as any)).toBe('');
    });
  });

  describe('calculateReadingTime', () => {
    it('deve retornar pelo menos 1 minuto para textos curtos', () => {
      expect(calculateReadingTime('Hello')).toBe('1 min de leitura');
    });

    it('deve calcular corretamente para textos longos', () => {
      const longText = new Array(401).fill('word').join(' ');
      expect(calculateReadingTime(longText)).toBe('3 min de leitura');
    });
  });

  describe('formatDate', () => {
    it('deve formatar um objeto de data corretamente', () => {
      const date = new Date(2024, 0, 15); // 15 de Jan de 2024
      const formatted = formatDate(date);
      expect(formatted).toContain('15');
      expect(formatted).toContain('jan');
      expect(formatted).toContain('2024');
    });

    it('deve formatar um Firebase Timestamp fake', () => {
      const timestamp = {
        seconds: 1705320000, // Jan 15 2024
        nanoseconds: 0,
        toDate: () => new Date(1705320000 * 1000)
      };
      const formatted = formatDate(timestamp);
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });
  });
});
