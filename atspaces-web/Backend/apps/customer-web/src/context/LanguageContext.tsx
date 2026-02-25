import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { translations } from '../data/translations';

type Language = 'en' | 'ar';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('atspaces-lang');
        return (saved === 'ar' || saved === 'en') ? saved : 'en';
    });

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('atspaces-lang', lang);
    };

    const t = (key: string): string => {
        return translations[language]?.[key] || translations['en']?.[key] || key;
    };

    // Update document direction when language changes
    useEffect(() => {
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', language);
    }, [language, dir]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
