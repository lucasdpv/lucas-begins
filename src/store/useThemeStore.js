import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants';

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: true,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: STORAGE_KEYS.THEME,
    }
  )
);
