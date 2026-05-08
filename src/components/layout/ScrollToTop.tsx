import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Componente que reseta o scroll para o topo toda vez que a rota muda.
 * Essencial para SPAs (Single Page Applications).
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
