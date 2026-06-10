import React, { createContext, useContext, useState, useEffect } from "react";

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" }
];

interface TranslationContextType {
  language: string;
  changeLanguage: (langCode: string) => void;
  isLoaded: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Helper to set google cookie
const setGoogTransCookie = (lang: string) => {
  const cookieValue = lang === "pt" ? "" : `/pt/${lang}`;
  
  // Set cookie for root path
  document.cookie = `googtrans=${cookieValue}; path=/;`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;
  
  // Set for top level domain if applicable
  const hostParts = window.location.hostname.split(".");
  if (hostParts.length > 2) {
    const domain = `.${hostParts.slice(-2).join(".")}`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain};`;
  }
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>("pt");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize and load Google Translate Element API
  useEffect(() => {
    // 1. Determine initial language
    let savedLang = localStorage.getItem("begins_lang") || "pt";
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get("lang");
      if (urlLang && ["pt", "en", "es", "fr", "ja", "de"].includes(urlLang)) {
        savedLang = urlLang;
        localStorage.setItem("begins_lang", urlLang);
      }
    }
    setLanguageState(savedLang);
    setGoogTransCookie(savedLang);

    // 2. Define global callback for Google Translate
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "pt",
          includedLanguages: "pt,en,es,fr,ja,de",
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
      setIsLoaded(true);

      // Programmatically trigger translation once fully initialized if not in Portuguese
      setTimeout(() => {
        const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (selectEl && savedLang !== "pt") {
          selectEl.value = savedLang;
          selectEl.dispatchEvent(new Event("change"));
        }
      }, 800);
    };

    // 3. Inject Hidden Element to satisfy Google Translate
    if (!document.getElementById("google_translate_element")) {
      const gDiv = document.createElement("div");
      gDiv.id = "google_translate_element";
      gDiv.style.display = "none";
      document.body.appendChild(gDiv);
    }

    // 4. Inject script if not already present
    const scriptId = "google-translate-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    if (langCode === language) return;

    setGoogTransCookie(langCode);
    setLanguageState(langCode);
    localStorage.setItem("begins_lang", langCode);

    const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event("change"));

      // Force a slight delay and re-apply in case of DOM lagging
      setTimeout(() => {
        if (selectEl.value !== langCode) {
          selectEl.value = langCode;
          selectEl.dispatchEvent(new Event("change"));
        }
      }, 200);
    } else {
      // If element is not loaded, cookie-based reload is a robust fallback
      window.location.reload();
    }
  };

  return (
    <TranslationContext.Provider value={{ language, changeLanguage, isLoaded }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
