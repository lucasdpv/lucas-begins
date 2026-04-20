import { useState, useCallback, useRef } from 'react';

/**
 * Hook para gerenciar as notificações temporárias (toast) do app.
 * Usa useRef para cancelar timers anteriores e evitar comportamento inesperado
 * quando dois toasts são disparados rapidamente.
 */
export function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    // ✅ Cancela timer anterior antes de criar um novo
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast, showToast };
}
