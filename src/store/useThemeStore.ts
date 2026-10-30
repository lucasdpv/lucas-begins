import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../constants";

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    () => ({
      isDark: true,
      toggleTheme: () => {},
    }),
    {
      name: STORAGE_KEYS.THEME,
      merge: (_persistedState, currentState) => ({
        ...currentState,
        isDark: true,
      }),
    }
  )
);
