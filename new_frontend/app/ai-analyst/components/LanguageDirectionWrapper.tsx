'use client';

import React, { ReactNode, useEffect } from 'react';
import { useLanguageStore } from '../store/languageStore';

interface LanguageDirectionWrapperProps {
  children: ReactNode;
}

export const LanguageDirectionWrapper: React.FC<LanguageDirectionWrapperProps> = ({ children }) => {
  const { language } = useLanguageStore();
  
  // Set the direction attribute on the document based on the language
  useEffect(() => {
    // Set direction
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
      
      // Add RTL-specific classes to body
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', language);
      
      // Add LTR-specific classes to body
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }

    // Clean up function
    return () => {
      document.body.classList.remove('rtl', 'ltr');
    };
  }, [language]);

  // Apply language-specific font classes
  const getFontClass = () => {
    switch (language) {
      case 'ar':
        return 'font-cairo';
      case 'fr':
        return 'font-inter';
      default:
        return 'font-inter';
    }
  };

  return (
    <div className={`${getFontClass()} transition-all duration-300 lang-transition`}>
      {children}
    </div>
  );
};