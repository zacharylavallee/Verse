import { Asset } from 'expo-asset';

export interface BibleTranslation {
  language: string;
  translation: string;
  path: string;
}

export interface LanguageTranslations {
  [language: string]: string[];
}

// Translation registry with static imports
const TRANSLATION_REGISTRY = {
  'English/NKJV': () => require('../assets/bibles/English/NKJV/metadata.json'),
  'English/ESV': () => require('../assets/bibles/English/ESV/metadata.json'),
  'English/NASB1995': () => require('../assets/bibles/English/NASB1995/metadata.json'),
  // Spanish translation temporarily removed until better JSON is available
  // 'Spanish/RVR1960': () => require('../assets/bibles/Spanish/RVR1960/metadata.json'),
  // Add more translations here as needed
};

/**
 * Scans the available Bible translations from the registry
 * This approach uses static imports which are required by React Native/Expo
 */
export async function scanAvailableTranslations(): Promise<LanguageTranslations> {
  try {
    const availableTranslations: LanguageTranslations = {};
    
    // Check each registered translation
    for (const [key, loader] of Object.entries(TRANSLATION_REGISTRY)) {
      try {
        const metadata = loader();
        if (metadata && metadata.name && metadata.abbreviation) {
          const [language, translation] = key.split('/');
          
          if (!availableTranslations[language]) {
            availableTranslations[language] = [];
          }
          availableTranslations[language].push(translation);
        }
      } catch (error) {
        console.log(`Translation not available: ${key}`);
      }
    }
    
    return availableTranslations;
  } catch (error) {
    console.error('Failed to scan available translations:', error);
    // Return fallback translations if scanning fails
    return {
      English: ['NKJV', 'ESV', 'NASB1995'],
      Spanish: ['RVR1960']
    };
  }
}



/**
 * Gets the default language and translation, prioritizing NASB1995
 */
export function getDefaultSelection(translations: LanguageTranslations): { language: string; translation: string } {
  const languages = Object.keys(translations);
  if (languages.length === 0) {
    return { language: 'English', translation: 'NASB1995' }; // Fallback
  }
  
  // Prioritize English with NASB1995 if available
  if (translations['English']?.includes('NASB1995')) {
    return { language: 'English', translation: 'NASB1995' };
  }
  
  // Fallback to English with any available translation
  if (translations['English'] && translations['English'].length > 0) {
    return { language: 'English', translation: translations['English'][0] };
  }
  
  // Final fallback to first available language and translation
  const firstLanguage = languages[0];
  const firstTranslation = translations[firstLanguage][0];
  
  return { language: firstLanguage, translation: firstTranslation };
}

/**
 * Validates if a language-translation combination exists
 */
export function isValidTranslation(
  language: string, 
  translation: string, 
  availableTranslations: LanguageTranslations
): boolean {
  return availableTranslations[language]?.includes(translation) ?? false;
}
