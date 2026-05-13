import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGE_KEY = "kiosk-language";
const DEFAULT_LANGUAGE = import.meta.env.VITE_DEFAULT_LANGUAGE || "en";

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      return localStorage.getItem(LANGUAGE_KEY) || DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);

    try {
      localStorage.setItem(LANGUAGE_KEY, currentLanguage);
    } catch {
      // Ignore restricted kiosk storage environments.
    }
  }, [currentLanguage, i18n]);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);

    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      // Ignore restricted kiosk storage environments.
    }

    setCurrentLanguage(language);
  };

  return {
    currentLanguage,
    changeLanguage,
    availableLanguages: ["en", "pt-BR", "es"],
  };
};
