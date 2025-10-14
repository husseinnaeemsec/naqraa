import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

// Initialize i18n
i18n
  .use(HttpBackend) // load translations from /public/locales
  .use(initReactI18next)
  .init({
    lng: "ar", // default language
    fallbackLng: "ar", // if translation missing
    interpolation: {
      escapeValue: false, // react already escapes
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // translation files
    },
  });

export default i18n;
