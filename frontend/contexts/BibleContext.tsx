import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { scanAvailableTranslations, getDefaultSelection, LanguageTranslations } from '@/utils/bibleScanner';

interface BibleContextType {
  selectedLanguage: string;
  selectedTranslation: string;
  languageTranslations: LanguageTranslations;
  setSelectedLanguage: (language: string) => void;
  setSelectedTranslation: (translation: string) => void;
  isLoading: boolean;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export function BibleProvider({ children }: { children: ReactNode }) {
  const [languageTranslations, setLanguageTranslations] = useState<LanguageTranslations>({});
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [selectedTranslation, setSelectedTranslation] = useState<string>('NASB1995'); // Default translation
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const availableTranslations = await scanAvailableTranslations();
        setLanguageTranslations(availableTranslations);
        
        // Set default selection if translations are available
        if (Object.keys(availableTranslations).length > 0) {
          const defaultSelection = getDefaultSelection(availableTranslations);
          setSelectedLanguage(defaultSelection.language);
          setSelectedTranslation(defaultSelection.translation);
        }
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to hardcoded values with NASB1995 as first option
        setLanguageTranslations({
          English: ['NASB1995', 'NKJV', 'ESV'],
          Spanish: ['RVR1960'],
          French: ['LSG'],
          German: ['LUT']
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTranslations();
  }, []);

  const handleLanguageChange = (language: string) => {
    // Immediately update the language to ensure UI refresh
    setSelectedLanguage(language);
    
    // Update translation to first available in the selected language
    if (languageTranslations[language] && languageTranslations[language].length > 0) {
      setSelectedTranslation(languageTranslations[language][0]);
    }
  };

  return (
    <BibleContext.Provider
      value={{
        selectedLanguage,
        selectedTranslation,
        languageTranslations,
        setSelectedLanguage: handleLanguageChange,
        setSelectedTranslation,
        isLoading,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
}

export function useBible() {
  const context = useContext(BibleContext);
  if (context === undefined) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
}
