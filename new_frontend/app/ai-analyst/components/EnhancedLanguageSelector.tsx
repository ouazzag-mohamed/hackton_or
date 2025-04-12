'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore, Language } from '../store/languageStore';
import { useTranslation } from '../translations/useTranslation';

export const EnhancedLanguageSelector = () => {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  const getLanguageDetails = (lang: Language) => {
    switch(lang) {
      case 'en':
        return {
          name: 'English',
          nativeName: 'English',
          flag: '/images/flags/us.svg'
        };
      case 'fr':
        return {
          name: 'French',
          nativeName: 'Français',
          flag: '/images/flags/fr.svg'
        };
      case 'ar':
        return {
          name: 'Arabic',
          nativeName: 'العربية',
          flag: '/images/flags/ma.svg'
        };
    }
  };

  const currentLang = getLanguageDetails(language);

  return (
    <div className="relative inline-block text-left rtl:text-right">
      <div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rtl:flex-row-reverse"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className={language === 'ar' ? 'font-cairo' : 'font-inter'}>{currentLang.nativeName}</span>
          </div>
          <svg className="-mr-1 ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div 
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 rtl:origin-top-left rtl:right-auto rtl:left-0"
          role="menu" 
          aria-orientation="vertical" 
          aria-labelledby="language-menu"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1" role="none">
            {(['en', 'fr', 'ar'] as Language[]).map((lang) => {
              const langDetails = getLanguageDetails(lang);
              return (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`
                    ${language === lang ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} 
                    flex items-center px-4 py-3 text-sm w-full text-left hover:bg-gray-50 rtl:text-right
                  `}
                  role="menuitem"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse w-full">
                    <div>
                      <p className={`font-medium ${lang === 'ar' ? 'font-cairo' : 'font-inter'}`}>{langDetails.nativeName}</p>
                      <p className="text-xs text-gray-500">{langDetails.name}</p>
                    </div>
                    {language === lang && (
                      <svg className="w-5 h-5 text-blue-600 ml-auto rtl:ml-0 rtl:mr-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
