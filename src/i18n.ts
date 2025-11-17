import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

// Get language from localStorage or default to 'ar'
const getInitialLanguage = (): string => {
  try {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && ['ar', 'en', 'ku'].includes(savedLanguage)) {
      return savedLanguage;
    }
  } catch (error) {
    console.warn('Error reading language from localStorage:', error);
  }
  return 'ar'; // default language
};

// Set initial direction and language attributes
const initializeLanguageAttributes = (lang: string) => {
  const langConfig = {
    'ar': { dir: 'rtl' },
    'en': { dir: 'ltr' },
    'ku': { dir: 'rtl' }
  };
  
  const config = langConfig[lang as keyof typeof langConfig] || langConfig['ar'];
  document.documentElement.dir = config.dir;
  document.documentElement.lang = lang;
};

const initialLanguage = getInitialLanguage();
initializeLanguageAttributes(initialLanguage);

// Initialize i18n
i18n
  .use(HttpBackend) // load translations from /public/locales
  .use(initReactI18next)
  .init({
    lng: initialLanguage, // use language from localStorage or default
    fallbackLng: "ar", // if translation missing
    interpolation: {
      escapeValue: false, // react already escapes
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // translation files
    },
  });

export default i18n;
