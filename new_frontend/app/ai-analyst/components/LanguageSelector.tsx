'use client';

import { useLanguageStore, Language } from '../store/languageStore';
import { useTranslation } from '../translations/useTranslation';
import { useQuizStore } from '../store/quizStore';
import { useEffect } from 'react';

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const { initQuiz, initialized, currentQuestion, inProfilePhase } = useQuizStore();
  
  // Set up the language change listener when the component mounts
  // and we have an active quiz
  useEffect(() => {
    if (initialized) {
      // This will make sure the language change listener is set up
      // We're using useEffect to ensure this runs on the client
      const unsubscribe = useQuizStore.getState().listenToLanguageChanges();
      
      // Clean up on unmount
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, [initialized]);
  
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <span className="text-sm text-gray-600">{t('general.switchLanguage')}:</span>
      <div className="flex space-x-2 rtl:space-x-reverse">
        <button
          onClick={() => handleLanguageChange('en')}
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            language === 'en' 
              ? 'bg-blue-600 text-white font-medium' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          aria-label="Switch to English"
          aria-pressed={language === 'en'}
        >
          English
        </button>
        <button
          onClick={() => handleLanguageChange('fr')}
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            language === 'fr' 
              ? 'bg-blue-600 text-white font-medium' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          aria-label="Switch to French"
          aria-pressed={language === 'fr'}
        >
          Français
        </button>
        <button
          onClick={() => handleLanguageChange('ar')}
          className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
            language === 'ar' 
              ? 'bg-blue-600 text-white font-medium' 
              : 'bg-gray-200 hover:bg-gray-300'
          } font-arabic`}
          aria-label="Switch to Arabic"
          aria-pressed={language === 'ar'}
        >
          العربية
        </button>
      </div>
    </div>
  );
};