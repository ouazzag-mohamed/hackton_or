import { en } from './en';
import { fr } from './fr';
import { ar } from './ar';
import { Language } from '../store/languageStore';

export const translations = {
  en,
  fr,
  ar,
};

export type TranslationKey = keyof typeof en;
export type NestedTranslationKey<T extends TranslationKey> = keyof typeof en[T];

export type TranslationsType = typeof translations.en;