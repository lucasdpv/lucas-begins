import { create } from 'zustand';

export const useUIStore = create((set) => ({
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
