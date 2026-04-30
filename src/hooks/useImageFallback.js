import { useState, useEffect } from "react";

/**
 * Detecta se uma URL de imagem falhou ao carregar.
 * @param {string | undefined} url
 * @returns {boolean} true se a imagem falhou
 */
export function useImageFallback(url) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!url) {
      setHasError(false);
      return;
    }
    const img = new Image();
    img.src = url;
    img.onerror = () => setHasError(true);
    img.onload = () => setHasError(false);
  }, [url]);

  return hasError;
}
