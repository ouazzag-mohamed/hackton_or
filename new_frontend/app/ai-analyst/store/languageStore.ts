import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'fr' | 'ar';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en', // Default language
      setLanguage: (lang: Language) => set({ language: lang }),
    }),
    {
      name: 'language-store', // Name for localStorage
    }
  )
);