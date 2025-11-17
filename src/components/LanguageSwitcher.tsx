import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/store';
import { HeroLanguageIcon, HeroChevronDownIcon } from './Icons';

interface Language {
  code: string;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

const languages: Language[] = [
  { code: 'ar', name: 'العربية', flag: '🇮🇶', dir: 'rtl' },
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ku', name: 'کوردی', flag: '🇮🇶', dir: 'rtl' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    const selectedLang = languages.find(lang => lang.code === langCode);
    if (selectedLang) {
      document.documentElement.dir = selectedLang.dir;
      document.documentElement.lang = langCode;
      
      // Only save to localStorage if user is not authenticated
      // Authenticated users' language preference should be managed server-side
      if (!isAuthenticated) {
        try {
          localStorage.setItem('language', langCode);
        } catch (error) {
          console.warn('Error saving language to localStorage:', error);
        }
      }
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors duration-200 border border-slate-300 hover:border-emerald-500 rounded-lg bg-white/50 backdrop-blur-sm"
        aria-label="Select Language"
      >
        <HeroLanguageIcon className="size-4" />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.name}</span>
        <HeroChevronDownIcon className={`size-4 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[160px] z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors duration-200 flex items-center gap-3 ${
                currentLanguage.code === language.code
                  ? 'bg-emerald-50 text-emerald-600 font-medium'
                  : 'text-slate-700'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
              {currentLanguage.code === language.code && (
                <span className="ml-auto text-emerald-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}