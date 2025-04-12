import { useMemo } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { translations, TranslationsType } from './index';

// Helper function to replace placeholders in translation strings
const replacePlaceholders = (text: string, params?: Record<string, string | number>): string => {
  if (!params) return text;
  
  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }, text);
};

export function useTranslation() {
  const { language } = useLanguageStore();
  
  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>): string => {
      // Split the key by dots to access nested objects
      const keys = key.split('.');
      let translation: any = translations[language];
      
      // Navigate through the nested objects
      for (const k of keys) {
        if (translation[k] === undefined) return key; // Return the key if translation not found
        translation = translation[k];
      }
      
      // If the translation is a string, return it with placeholders replaced
      if (typeof translation === 'string') {
        return replacePlaceholders(translation, params);
      }
      
      // If it's an array or something else, return the key
      return key;
    };
  }, [language]);

  // Return translation function and current language
  return { t, language };
}

export type TranslationFunction = ReturnType<typeof useTranslation>['t'];