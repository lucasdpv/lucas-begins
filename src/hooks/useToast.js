import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar as notificações temporárias (toast) do app.
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast, showToast };
}
