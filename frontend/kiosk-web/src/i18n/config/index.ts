import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import namespaces
import enCommon from "../namespaces/en/common.json";
import enHome from "../namespaces/en/home.json";
import enErrors from "../namespaces/en/errors.json";
import enCheckin from "../namespaces/en/checkin.json";

import ptBrCommon from "../namespaces/pt-BR/common.json";
import ptBrHome from "../namespaces/pt-BR/home.json";
import ptBrErrors from "../namespaces/pt-BR/errors.json";
import ptBrCheckin from "../namespaces/pt-BR/checkin.json";

import esCommon from "../namespaces/es/common.json";
import esHome from "../namespaces/es/home.json";
import esErrors from "../namespaces/es/errors.json";
import esCheckin from "../namespaces/es/checkin.json";

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    errors: enErrors,
    checkin: enCheckin,
  },
  'pt-BR': {
    common: ptBrCommon,
    home: ptBrHome,
    errors: ptBrErrors,
    checkin: ptBrCheckin,
  },
  es: {
    common: esCommon,
    home: esHome,
    errors: esErrors,
    checkin: esCheckin,
  },
};

const defaultLanguage = import.meta.env.VITE_DEFAULT_LANGUAGE || "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en',
    supportedLngs: ['en', 'pt-BR', 'es'],
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
    ns: ['common', 'home', 'errors', 'checkin'],
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'kiosk-language',
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
