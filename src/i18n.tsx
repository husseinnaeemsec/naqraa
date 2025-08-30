import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import en from "./locales/en/translation.json";
import ar from "./locales/ar/translation.json";
import ku from './locales/ku/translation.json';

i18n
  .use(initReactI18next) // pass i18n instance to react-i18next
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      ku: { translation:ku }
    },
    fallbackLng: "ar", // default language
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
