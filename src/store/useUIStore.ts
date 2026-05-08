import { create } from 'zustand';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
}

interface UIState {
  searchQuery: string;
  activeCategory: string;
  isLoginModalOpen: boolean;
  toast: ToastState;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  showToast: (message: string, type?: ToastState['type']) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  searchQuery: "",
  activeCategory: "Todos",
  isLoginModalOpen: false,
  toast: { message: "", type: "success", visible: false },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setIsLoginModalOpen: (isOpen) => set({ isLoginModalOpen: isOpen }),
  
  showToast: (message, type = "success") => {
    set({ toast: { message, type, visible: true } });
    setTimeout(() => {
      set((state) => ({ toast: { ...state.toast, visible: false } }));
    }, 3000);
  },
  hideToast: () => set((state) => ({ toast: { ...state.toast, visible: false } })),
}));
