import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "@/lib/router-compat";
import { useUIStore } from "../../../store/useUIStore";

export function useNavbar() {
  const {
    setSearchQuery,
    setActiveCategory,
  } = useUIStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const lastScrollY = useRef(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Controle de scroll otimizado com requestAnimationFrame + zona morta (evita re-renders durante a rolagem)
  useEffect(() => {
    let ticking = false;
    const controlNavbar = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const diff = currentY - lastScrollY.current;
        if (Math.abs(diff) >= 12) {
          if (diff > 0 && currentY > 110) {
            setIsVisible((prev) => (prev ? false : prev));
          } else if (diff < 0 || currentY <= 80) {
            setIsVisible((prev) => (!prev ? true : prev));
          }
          lastScrollY.current = currentY;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  // Bloqueia o scroll do corpo quando o menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (location.pathname !== "/" && query.trim() !== "") {
      if (!sessionStorage.getItem('preSearchPath')) {
        sessionStorage.setItem('preSearchPath', location.pathname);
      }
      navigate("/");
    }
  };

  const handleCancelSearch = () => {
    setSearchQuery("");
    setIsSearchExpanded(false);

    const prePath = sessionStorage.getItem('preSearchPath');
    if (prePath && prePath !== "/") {
      sessionStorage.removeItem('preSearchPath');
      navigate(prePath);
    }
  };

  const handleCategorySelect = (cat: string) => {
    setSearchQuery(""); // Limpa a busca ao trocar de categoria
    setActiveCategory(cat);
    setIsCategoryMenuOpen(false);
    setIsMobileMenuOpen(false);
    
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isCategoryMenuOpen,
    setIsCategoryMenuOpen,
    isVisible,
    isSearchExpanded,
    setIsSearchExpanded,
    isMobileCategoriesOpen,
    setIsMobileCategoriesOpen,
    handleSearch,
    handleCancelSearch,
    handleCategorySelect
  };
}
